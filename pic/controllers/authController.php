<?php
// controllers/AuthController.php

require_once __DIR__ . '/../models/User.php';

class AuthController
{
    private User $userModel;

    public function __construct(PDO $db)
    {
        $this->userModel = new User($db);
    }

    public function login(): void
    {
        // Garante JSON na resposta
        header('Content-Type: application/json; charset=utf-8');

        // Lê corpo da requisição (JSON)
        $input = json_decode(file_get_contents('php://input'), true);

        $email    = isset($input['email']) ? trim($input['email']) : '';
        $password = $input['password'] ?? '';

        if ($email === '' || $password === '') {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Email e senha são obrigatórios."
            ]);
            return;
        }

        $user = $this->userModel->login($email, $password);

        if (!$user) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Credenciais inválidas."
            ]);
            return;
        }

        // Aqui você pode montar as infos que o front precisa
        // Ex.: decidir rota de redirecionamento com base na role
        $redirectTo = null;
        switch ($user['role']) {
            case 'A': // Admin
                $redirectTo = '/admin';   // ajuste conforme suas rotas do React
                break;
            case 'G': // Garçom (ou 'g')
            case 'g':
                $redirectTo = '/garcom';
                break;
            case 'U': // Usuário comum
            default:
                $redirectTo = '/usuario';
                break;
        }

        http_response_code(200);
        echo json_encode([
            "success"    => true,
            "message"    => "Login realizado com sucesso.",
            "user"       => $user,
            "redirectTo" => $redirectTo
        ]);
    }
}
