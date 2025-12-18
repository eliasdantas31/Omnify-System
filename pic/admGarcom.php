<?php
// pic/admGarcom.php
// Gerencia todas as operações de garçom (listar, criar, deletar)
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
  case 'list_users':
    listUsers($conexao);
    break;

  case 'create_garcom':
    createGarcom($conexao, $input);
    break;

  case 'delete_user':
    deleteUser($conexao, $input);
    break;

  default:
    http_response_code(400);
    echo json_encode([
      "success" => false,
      "message" => "Action inválida ou não especificada. Use: list_users, create_garcom, delete_user"
    ]);
    break;
}

$conexao->close();


// ========== FUNÇÕES ==========

function listUsers($conexao)
{
  // Lista apenas garçons (role = 'G')
  $stmt = $conexao->prepare("SELECT id, email, role FROM Users WHERE role = 'G' ORDER BY id ASC");
  $stmt->execute();
  $result = $stmt->get_result();

  $users = [];
  while ($row = $result->fetch_assoc()) {
    $users[] = [
      "id"    => (int)$row['id'],
      "email" => $row['email'],
      "role"  => $row['role']
    ];
  }
  $stmt->close();

  http_response_code(200);
  echo json_encode([
    "success" => true,
    "users" => $users
  ]);
}

function createGarcom($conexao, $input)
{
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido. Use POST."]);
    return;
  }

  $email    = isset($input['email']) ? trim($input['email']) : '';
  $password = $input['password'] ?? '';

  if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email e senha são obrigatórios."]);
    return;
  }

  // Verifica se já existe usuário com esse email
  $checkStmt = $conexao->prepare("SELECT id FROM Users WHERE email = ? LIMIT 1");
  $checkStmt->bind_param("s", $email);
  $checkStmt->execute();
  $checkResult = $checkStmt->get_result();

  if ($checkResult->fetch_assoc()) {
    http_response_code(409);
    echo json_encode([
      "success" => false,
      "message" => "Já existe um usuário com esse email."
    ]);
    $checkStmt->close();
    return;
  }
  $checkStmt->close();

  // Gera hash da senha
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Insere o garçom
  $insertStmt = $conexao->prepare(
    "INSERT INTO Users (email, password, role) VALUES (?, ?, 'G')"
  );
  $insertStmt->bind_param("ss", $email, $hashedPassword);

  if ($insertStmt->execute()) {
    http_response_code(201);
    echo json_encode([
      "success" => true,
      "message" => "Garçom criado com sucesso.",
      "user" => [
        "id"    => (int)$insertStmt->insert_id,
        "email" => $email,
        "role"  => 'G'
      ]
    ]);
  } else {
    http_response_code(500);
    echo json_encode([
      "success" => false,
      "message" => "Erro ao criar garçom: " . $conexao->error
    ]);
  }

  $insertStmt->close();
}

function deleteUser($conexao, $input)
{
  if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido. Use DELETE."]);
    return;
  }

  $userId = isset($input['id']) ? (int)$input['id'] : 0;

  if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID inválido."]);
    return;
  }

  $stmt = $conexao->prepare("DELETE FROM Users WHERE id = ? LIMIT 1");
  $stmt->bind_param("i", $userId);

  if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
      http_response_code(200);
      echo json_encode([
        "success" => true,
        "message" => "Usuário deletado com sucesso."
      ]);
    } else {
      http_response_code(404);
      echo json_encode([
        "success" => false,
        "message" => "Usuário não encontrado."
      ]);
    }
  } else {
    http_response_code(500);
    echo json_encode([
      "success" => false,
      "message" => "Erro ao deletar usuário: " . $conexao->error
    ]);
  }

  $stmt->close();
}
