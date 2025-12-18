<?php
// pic/login.php
session_start(); // <-- IMPORTANTE, ANTES DE QUALQUER OUTPUT

header('Content-Type: application/json; charset=utf-8');

// CORS (ajuste as origins que você usa)
$allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
  header("Access-Control-Allow-Origin: {$origin}");
  header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["success" => false, "message" => "Método não permitido"]);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Email e senha são obrigatórios."]);
  exit;
}

$stmt = $conexao->prepare("SELECT id, email, password, role FROM Users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password'])) {
  http_response_code(401);
  echo json_encode(["success" => false, "message" => "Credenciais inválidas."]);
  exit;
}

// ========= LOGIN OK: SALVA NA SESSÃO =========
$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['email']   = $user['email'];
$_SESSION['role']    = $user['role']; // 'A', 'G', 'U', 'M'

// ========= DECIDE ROTA DE REDIRECIONAMENTO =========
$redirectTo = '/';
switch ($user['role']) {
  case 'A':
    $redirectTo = '/adm';
    break;
  case 'G':
    $redirectTo = '/garcom';
    break;
  case 'U':
    $redirectTo = '/usuario';
    break;
  case 'M':
    $redirectTo = '/cadastroGeral';
    break;
  default:
    $redirectTo = '/';
}

http_response_code(200);
echo json_encode([
  "success" => true,
  "message" => "Login realizado com sucesso.",
  "user" => [
    "id"    => (int)$user['id'],
    "email" => $user['email'],
    "role"  => $user['role']
  ],
  "redirectTo" => $redirectTo
]);
