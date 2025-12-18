<?php
// pic/garcomPedido.php
// Gerencia pedidos do garçom (criar pedido, adicionar itens, ver pedido atual, finalizar)
session_start();

header('Content-Type: application/json; charset=utf-8');

// CORS flexível para dev
$allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Permitir garçom e admin também:
if (!isset($_SESSION['role']) || !in_array($_SESSION['role'], ['G', 'A'])) {
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
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Para POST/DELETE, também aceitamos 'action' no body JSON
$input = [];
if (in_array($method, ['POST', 'DELETE'])) {
    $rawInput = file_get_contents('php://input');
    if (!empty($rawInput)) {
        $input = json_decode($rawInput, true) ?? [];
        if (isset($input['action']) && $input['action']) {
            $action = $input['action'];
        }
    }
}

switch ($action) {
    case 'create_order':
        createOrder($conexao, $input);
        break;

    case 'get_current_order':
        getCurrentOrder($conexao, $input);
        break;

    case 'add_item':
        addItemToOrder($conexao, $input);
        break;

    case 'remove_item':
        removeItemFromOrder($conexao, $input);
        break;

    case 'finalize_order':
        finalizeOrder($conexao, $input);
        break;

    default:
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Action inválida. Use: create_order, get_current_order, add_item, remove_item, finalize_order"
        ]);
        break;
}

$conexao->close();


// ========== FUNÇÕES ==========

function createOrder($conexao, $input) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método não permitido. Use POST."]);
        return;
    }

    $tableName = isset($input['table_name']) ? trim($input['table_name']) : '';

    if ($tableName === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Nome da mesa é obrigatório."]);
        return;
    }

    // Cria o pedido com status 'open'
    $stmt = $conexao->prepare(
        "INSERT INTO Orders (table_or_client, status, created_at) VALUES (?, 'open', NOW())"
    );
    $stmt->bind_param("s", $tableName);

    if ($stmt->execute()) {
        $orderId = $stmt->insert_id;
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Pedido criado com sucesso.",
            "order" => [
                "id" => (int)$orderId,
                "table_name" => $tableName,
                "status" => "open"
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erro ao criar pedido: " . $conexao->error
        ]);
    }

    $stmt->close();
}

function getCurrentOrder($conexao, $input) {
    $orderId = isset($input['order_id']) ? (int)$input['order_id'] : 0;

    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID do pedido inválido."]);
        return;
    }

    // Busca o pedido
    $stmtOrder = $conexao->prepare(
        "SELECT id, table_or_client, status, created_at FROM Orders WHERE id = ?"
    );
    $stmtOrder->bind_param("i", $orderId);
    $stmtOrder->execute();
    $resultOrder = $stmtOrder->get_result();
    $order = $resultOrder->fetch_assoc();
    $stmtOrder->close();

    if (!$order) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Pedido não encontrado."]);
        return;
    }

    // Busca os itens do pedido
    $stmtItems = $conexao->prepare(
        "SELECT oi.id, oi.itemId, i.name, oi.quantity, oi.price, oi.observations
         FROM OrderItems oi
         JOIN Items i ON oi.itemId = i.id
         WHERE oi.orderId = ?"
    );
    $stmtItems->bind_param("i", $orderId);
    $stmtItems->execute();
    $resultItems = $stmtItems->get_result();

    $items = [];
    $total = 0;
    while ($row = $resultItems->fetch_assoc()) {
        $subtotal = $row['quantity'] * $row['price'];
        $total += $subtotal;
        $items[] = [
            "id" => (int)$row['id'],
            "itemId" => (int)$row['itemId'],
            "name" => $row['name'],
            "quantity" => (int)$row['quantity'],
            "price" => (float)$row['price'],
            "subtotal" => (float)$subtotal,
            "observations" => $row['observations']
        ];
    }
    $stmtItems->close();

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "order" => [
            "id" => (int)$order['id'],
            "table_name" => $order['table_or_client'],
            "status" => $order['status'],
            "created_at" => $order['created_at'],
            "items" => $items,
            "total" => (float)$total
        ]
    ]);
}

function addItemToOrder($conexao, $input) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método não permitido. Use POST."]);
        return;
    }

    $orderId = isset($input['order_id']) ? (int)$input['order_id'] : 0;
    $itemId = isset($input['item_id']) ? (int)$input['item_id'] : 0;
    $quantity = isset($input['quantity']) ? (int)$input['quantity'] : 1;
    $observations = isset($input['observations']) ? trim($input['observations']) : '';

    if ($orderId <= 0 || $itemId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID do pedido e item são obrigatórios."]);
        return;
    }

    // Busca o preço do item
    $stmtPrice = $conexao->prepare("SELECT price FROM Items WHERE id = ?");
    $stmtPrice->bind_param("i", $itemId);
    $stmtPrice->execute();
    $resultPrice = $stmtPrice->get_result();
    $itemData = $resultPrice->fetch_assoc();
    $stmtPrice->close();

    if (!$itemData) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Item não encontrado."]);
        return;
    }

    $price = $itemData['price'];

    // Adiciona o item ao pedido
    $stmt = $conexao->prepare(
        "INSERT INTO OrderItems (orderId, itemId, quantity, price, observations) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("iiids", $orderId, $itemId, $quantity, $price, $observations);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Item adicionado ao pedido.",
            "orderItemId" => (int)$stmt->insert_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erro ao adicionar item: " . $conexao->error
        ]);
    }

    $stmt->close();
}

function removeItemFromOrder($conexao, $input) {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método não permitido. Use DELETE."]);
        return;
    }

    $orderItemId = isset($input['order_item_id']) ? (int)$input['order_item_id'] : 0;

    if ($orderItemId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID do item do pedido inválido."]);
        return;
    }

    $stmt = $conexao->prepare("DELETE FROM OrderItems WHERE id = ?");
    $stmt->bind_param("i", $orderItemId);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Item removido do pedido."
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Item não encontrado."
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erro ao remover item: " . $conexao->error
        ]);
    }

    $stmt->close();
}

function finalizeOrder($conexao, $input) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método não permitido. Use POST."]);
        return;
    }

    $orderId = isset($input['order_id']) ? (int)$input['order_id'] : 0;

    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID do pedido inválido."]);
        return;
    }

    // Atualiza o status para 'closed'
    $stmt = $conexao->prepare("UPDATE Orders SET status = 'closed' WHERE id = ?");
    $stmt->bind_param("i", $orderId);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Pedido finalizado com sucesso."
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Pedido não encontrado ou já finalizado."
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erro ao finalizar pedido: " . $conexao->error
        ]);
    }

    $stmt->close();
}
