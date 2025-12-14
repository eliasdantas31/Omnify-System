<?php
// pic/login.php

header('Content-Type: application/json; charset=utf-8');

// CORS flexível para dev (aceita porta 3000 ou 5173)
$allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

// Lê JSON do corpo da requisição
$input = json_decode(file_get_contents('php://input'), true);

$email    = isset($input['email']) ? trim($input['email']) : '';
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email e senha são obrigatórios."
    ]);
    exit;
}

// Prepara query com mysqli (evita SQL injection)
$stmt = $conexao->prepare("SELECT id, email, password, role FROM Users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Usuário ou senha incorretos"
    ]);
    exit;
}

// Verifica senha com password_verify (hash salvo no banco)
if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Usuário ou senha incorretos"
    ]);
    exit;
}

// Sucesso
http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Login realizado com sucesso.",
    "user" => [
        "id"    => (int)$user['id'],
        "email" => $user['email'],
        "role"  => $user['role']  // 'A', 'G', 'U'
    ]
]);

$stmt->close();
$conexao->close();
