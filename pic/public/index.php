<?php
// public/index.php

// ==== CORS ====
// Em dev: React em http://localhost:3000
$allowedOrigin = 'http://localhost:3000';

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowedOrigin) {
  header("Access-Control-Allow-Origin: {$allowedOrigin}");
  header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

// ==== DB ====
$database = new Database();
$db = $database->getConnection();

// ==== ROTEAMENTO SIMPLES ====
$method     = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = $_SERVER['SCRIPT_NAME']; // ex.: /pic/public/index.php

$route = $requestUri;

// Remove o path base (script / pasta)
if (strpos($route, $scriptName) === 0) {
  $route = substr($route, strlen($scriptName));
} else {
  $dir = rtrim(dirname($scriptName), '/');
  if ($dir !== '' && strpos($route, $dir) === 0) {
    $route = substr($route, strlen($dir));
  }
}

$route = '/' . ltrim($route, '/');

// Instancia controller
$authController = new AuthController($db);

// POST /auth/login
if ($route === '/auth/login' && $method === 'POST') {
  $authController->login();
  exit;
}

// Se chegou aqui, rota não encontrada
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
  "success" => false,
  "message" => "Rota não encontrada",
  "route"   => $route
]);
