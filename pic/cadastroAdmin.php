<?php
// pic/cadastroAdmin.php
session_start();

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

// ===========================
// 1. Verificar se está logado como MANAGER
// ===========================
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'M') {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Acesso negado. Somente o Manager pode cadastrar administradores."
    ]);
    exit;
}

// ===========================
// 2. Validar método
// ===========================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido"]);
    exit;
}

// ===========================
// 3. Ler JSON de entrada
// ===========================
$input = json_decode(file_get_contents('php://input'), true) ?? [];

$email            = trim($input['email'] ?? '');
$password         = $input['password'] ?? '';
$confirmPassword  = $input['confirmPassword'] ?? '';

// ===========================
// 4. Validações simples
// ===========================
if ($email === '' || $password === '' || $confirmPassword === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email, senha e confirmação são obrigatórios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email inválido."]);
    exit;
}

if ($password !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "As senhas não conferem."]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "A senha deve ter pelo menos 6 caracteres."]);
    exit;
}

// ===========================
// 5. Verificar se email já existe
// ===========================
$stmt = $conexao->prepare("SELECT id FROM Users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$existing = $result->fetch_assoc();
$stmt->close();

if ($existing) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Já existe um usuário com esse email."]);
    exit;
}

// ===========================
// 6. Inserir novo usuário ADMIN (role = 'A')
// ===========================
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conexao->prepare("INSERT INTO Users (email, password, role) VALUES (?, ?, 'A')");
$stmt->bind_param("ss", $email, $hash);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;
    $stmt->close();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Administrador cadastrado com sucesso.",
        "user" => [
            "id"    => (int)$newId,
            "email" => $email,
            "role"  => "A"
        ]
    ]);
    exit;
} else {
    $stmt->close();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro ao cadastrar administrador."]);
    exit;
}
