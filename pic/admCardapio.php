<?php
// pic/admCardapio.php
// Gerencia todas as operações de cardápio (categorias e itens)
session_start();

header('Content-Type: application/json; charset=utf-8');

// CORS flexível para dev
$allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Verifica se está logado como ADMIN
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
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once __DIR__ . '/config.php';

// Determina a action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Se for POST/PUT/DELETE, pode vir action no body também
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
  $input = json_decode(file_get_contents('php://input'), true);
  if (isset($input['action'])) {
    $action = $input['action'];
  }
} else {
  $input = [];
}

// Roteamento
switch ($action) {
  case 'list_menu':
    listMenu($conexao);
    break;

  case 'create_category':
    createCategory($conexao, $input);
    break;

  case 'delete_category':
    deleteCategory($conexao, $input);
    break;

  case 'create_item':
    createItem($conexao, $input);
    break;

  case 'update_item':
    updateItem($conexao, $input);
    break;

  case 'delete_item':
    deleteItem($conexao, $input);
    break;

  default:
    http_response_code(400);
    echo json_encode([
      "success" => false,
      "message" => "Action inválida ou não especificada. Use: list_menu, create_category, delete_category, create_item, update_item, delete_item"
    ]);
    break;
}

$conexao->close();

// ========== FUNÇÕES ==========

function listMenu($conexao)
{
  // Busca categorias
  $catStmt = $conexao->prepare("SELECT id, name FROM Category ORDER BY id ASC");
  $catStmt->execute();
  $catResult = $catStmt->get_result();

  $categories = [];
  while ($row = $catResult->fetch_assoc()) {
    $categories[$row['id']] = [
      "id"    => (int)$row['id'],
      "name"  => $row['name'],
      "items" => [],
      "adds"  => []
    ];
  }
  $catStmt->close();

  // Busca itens
  $itemStmt = $conexao->prepare("
        SELECT id, categoryId, name, price
        FROM CategoryItem
        ORDER BY id ASC
    ");
  $itemStmt->execute();
  $itemResult = $itemStmt->get_result();

  while ($row = $itemResult->fetch_assoc()) {
    $catId = (int)$row['categoryId'];
    if (!isset($categories[$catId])) continue;

    $categories[$catId]['items'][] = [
      "id"         => (int)$row['id'],
      "categoryId" => $catId,
      "name"       => $row['name'],
      "price"      => (float)$row['price']
    ];
  }
  $itemStmt->close();

  // Busca adicionais
  $addStmt = $conexao->prepare("
        SELECT id, categoryId, name, price
        FROM CategoryAdds
        ORDER BY id ASC
    ");
  $addStmt->execute();
  $addResult = $addStmt->get_result();

  while ($row = $addResult->fetch_assoc()) {
    $catId = (int)$row['categoryId'];
    if (!isset($categories[$catId])) continue;

    $categories[$catId]['adds'][] = [
      "id"    => (int)$row['id'],
      "name"  => $row['name'],
      "price" => (float)$row['price']
    ];
  }
  $addStmt->close();

  http_response_code(200);
  echo json_encode(array_values($categories));
}

function createCategory($conexao, $input)
{
  $name = isset($input['name']) ? trim($input['name']) : '';

  if ($name === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Nome da categoria é obrigatório."]);
    return;
  }

  // Verifica se já existe
  $checkStmt = $conexao->prepare("SELECT id FROM Category WHERE name = ? LIMIT 1");
  $checkStmt->bind_param("s", $name);
  $checkStmt->execute();
  $checkResult = $checkStmt->get_result();

  if ($checkResult->fetch_assoc()) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Já existe uma categoria com esse nome."]);
    $checkStmt->close();
    return;
  }
  $checkStmt->close();

  // Cria categoria
  $stmt = $conexao->prepare("INSERT INTO Category (name) VALUES (?)");
  $stmt->bind_param("s", $name);

  if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
      "success" => true,
      "message" => "Categoria criada com sucesso.",
      "category" => [
        "id"   => (int)$stmt->insert_id,
        "name" => $name
      ]
    ]);
  } else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro ao criar categoria: " . $conexao->error]);
  }

  $stmt->close();
}

function deleteCategory($conexao, $input)
{
  $categoryId = isset($input['id']) ? (int)$input['id'] : 0;

  if ($categoryId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID de categoria inválido."]);
    return;
  }

  $stmt = $conexao->prepare("DELETE FROM Category WHERE id = ? LIMIT 1");
  $stmt->bind_param("i", $categoryId);

  if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
      http_response_code(200);
      echo json_encode(["success" => true, "message" => "Categoria deletada com sucesso."]);
    } else {
      http_response_code(404);
      echo json_encode(["success" => false, "message" => "Categoria não encontrada."]);
    }
  } else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro ao deletar categoria: " . $conexao->error]);
  }

  $stmt->close();
}

function createItem($conexao, $input)
{
  $categoryId = isset($input['categoryId']) ? (int)$input['categoryId'] : 0;
  $name       = isset($input['name']) ? trim($input['name']) : '';
  $price      = isset($input['price']) ? (float)$input['price'] : 0;

  if ($categoryId <= 0 || $name === '' || $price <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Categoria, nome e preço são obrigatórios e válidos."]);
    return;
  }

  // Confere se categoria existe
  $catStmt = $conexao->prepare("SELECT id FROM Category WHERE id = ? LIMIT 1");
  $catStmt->bind_param("i", $categoryId);
  $catStmt->execute();
  $catRes = $catStmt->get_result();
  if (!$catRes->fetch_assoc()) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Categoria não encontrada."]);
    $catStmt->close();
    return;
  }
  $catStmt->close();

  // Cria item
  $stmt = $conexao->prepare("
        INSERT INTO CategoryItem (categoryId, name, price)
        VALUES (?, ?, ?)
    ");
  $stmt->bind_param("isd", $categoryId, $name, $price);

  if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
      "success" => true,
      "message" => "Item criado com sucesso.",
      "item" => [
        "id"         => (int)$stmt->insert_id,
        "categoryId" => $categoryId,
        "name"       => $name,
        "price"      => $price
      ]
    ]);
  } else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro ao criar item: " . $conexao->error]);
  }

  $stmt->close();
}

function updateItem($conexao, $input)
{
  $itemId     = isset($input['id']) ? (int)$input['id'] : 0;
  $categoryId = isset($input['categoryId']) ? (int)$input['categoryId'] : 0;
  $name       = isset($input['name']) ? trim($input['name']) : '';
  $price      = isset($input['price']) ? (float)$input['price'] : 0;

  if ($itemId <= 0 || $categoryId <= 0 || $name === '' || $price <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID, categoria, nome e preço são obrigatórios e válidos."]);
    return;
  }

  $stmt = $conexao->prepare("
        UPDATE CategoryItem
        SET categoryId = ?, name = ?, price = ?
        WHERE id = ?
    ");
  $stmt->bind_param("isdi", $categoryId, $name, $price, $itemId);

  if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode([
      "success" => true,
      "message" => "Item atualizado com sucesso."
    ]);
  } else {
    http_response_code(500);
    echo json_encode([
      "success" => false,
      "message" => "Erro ao atualizar item: " . $conexao->error
    ]);
  }

  $stmt->close();
}

function deleteItem($conexao, $input)
{
  $itemId = isset($input['id']) ? (int)$input['id'] : 0;

  if ($itemId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID de item inválido."]);
    return;
  }

  $stmt = $conexao->prepare("DELETE FROM CategoryItem WHERE id = ? LIMIT 1");
  $stmt->bind_param("i", $itemId);

  if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
      http_response_code(200);
      echo json_encode(["success" => true, "message" => "Item deletado com sucesso."]);
    } else {
      http_response_code(404);
      echo json_encode(["success" => false, "message" => "Item não encontrado."]);
    }
  } else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro ao deletar item: " . $conexao->error]);
  }

  $stmt->close();
}
