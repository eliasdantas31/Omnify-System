<?php
// pic/admPedidos.php
// Gerencia todas as operações de pedidos (listar, atualizar status, deletar)
session_start();

header('Content-Type: application/json; charset=utf-8');

// CORS flexível para dev
$allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'A') {
    http_response_code(403);
    echo json_encode([
        "success" => false
    ]);
    exit;
}

if (in_array($origin, $allowedOrigins)) {
  header("Access-Control-Allow-Origin: {$origin}");
  header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Para POST/PATCH/DELETE, também aceitamos 'action' no body JSON
$input = [];
if (in_array($method, ['POST', 'PATCH', 'DELETE'])) {
  $rawInput = file_get_contents('php://input');
  if (!empty($rawInput)) {
    $input = json_decode($rawInput, true) ?? [];
    if (isset($input['action']) && $input['action']) {
      $action = $input['action'];
    }
  }
}

switch ($action) {
  case 'list_orders':
    listOrders($conexao);
    break;

  case 'update_status':
    updateStatus($conexao, $input);
    break;

  case 'delete_order':
    deleteOrder($conexao, $input);
    break;

  default:
    http_response_code(400);
    echo json_encode([
      "success" => false,
      "message" => "Action inválida ou não especificada. Use: list_orders, update_status, delete_order"
    ]);
    break;
}

$conexao->close();


// ========== FUNÇÕES ==========

function listOrders($conexao)
{
  // Lista todos os pedidos com valor total calculado
  $stmt = $conexao->prepare("
        SELECT
            o.id,
            o.table_or_client,
            o.created_at,
            o.status,
            COALESCE(SUM(oi.quantity * oi.price), 0) as total
        FROM Orders o
        LEFT JOIN OrderItems oi ON o.id = oi.orderId
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ");
  $stmt->execute();
  $result = $stmt->get_result();

  $orders = [];
  while ($row = $result->fetch_assoc()) {
    $orders[] = [
      "id"              => (int)$row['id'],
      "table_or_client" => $row['table_or_client'],
      "created_at"      => $row['created_at'],
      "status"          => $row['status'],
      "total"           => (float)$row['total']
    ];
  }
  $stmt->close();

  http_response_code(200);
  echo json_encode([
    "success" => true,
    "orders" => $orders
  ]);
}

function updateStatus($conexao, $input)
{
  if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido. Use PATCH."]);
    return;
  }

  $orderId = isset($input['id']) ? (int)$input['id'] : 0;
  $status  = isset($input['status']) ? trim($input['status']) : '';

  if ($orderId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID do pedido inválido."]);
    return;
  }

  if (!in_array($status, ['open', 'closed', 'finished'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Status inválido. Use: open, closed, finished"]);
    return;
  }

  $stmt = $conexao->prepare("UPDATE Orders SET status = ? WHERE id = ?");
  $stmt->bind_param("si", $status, $orderId);

  if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
      http_response_code(200);
      echo json_encode([
        "success" => true,
        "message" => "Status atualizado com sucesso."
      ]);
    } else {
      http_response_code(404);
      echo json_encode([
        "success" => false,
        "message" => "Pedido não encontrado ou status já era o mesmo."
      ]);
    }
  } else {
    http_response_code(500);
    echo json_encode([
      "success" => false,
      "message" => "Erro ao atualizar status: " . $conexao->error
    ]);
  }

  $stmt->close();
}

function deleteOrder($conexao, $input)
{
  if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido. Use DELETE."]);
    return;
  }

  $orderId = isset($input['id']) ? (int)$input['id'] : 0;

  if ($orderId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID do pedido inválido."]);
    return;
  }

  // Deleta itens do pedido primeiro (se houver FK constraint)
  $stmtItems = $conexao->prepare("DELETE FROM OrderItems WHERE orderId = ?");
  $stmtItems->bind_param("i", $orderId);
  $stmtItems->execute();
  $stmtItems->close();

  // Deleta o pedido
  $stmt = $conexao->prepare("DELETE FROM Orders WHERE id = ?");
  $stmt->bind_param("i", $orderId);

  if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
      http_response_code(200);
      echo json_encode([
        "success" => true,
        "message" => "Pedido deletado com sucesso."
      ]);
    } else {
      http_response_code(404);
      echo json_encode([
        "success" => false,
        "message" => "Pedido não encontrado."
      ]);
    }
  } else {
    http_response_code(500);
    echo json_encode([
      "success" => false,
      "message" => "Erro ao deletar pedido: " . $conexao->error
    ]);
  }

  $stmt->close();
}
