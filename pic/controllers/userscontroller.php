<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/database.php';

class UserController
{
    private $db;
    private $user;

    public function __construct($db)
    {
        $this->db = $db;
        $this->user = new User($db);
    }

 
    public function index()
    {
        $stmt = $this->user->getAll();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($users);
    }


    public function show($id)
    {
        $this->user->id = $id;
        $user = $this->user->getById();

        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Usuário não encontrado"]);
        }
    }

 
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(["message" => "Campos 'email' e 'password' são obrigatórios"]);
            return;
        }

        $this->user->email = $data->email;


        $this->user->password = password_hash($data->password, PASSWORD_DEFAULT);

 
        $this->user->admin = isset($data->admin) ? $data->admin : "0";

        if ($this->user->create()) {
            http_response_code(201);
            $id = $this->db->lastInsertId();
            $this->user->id = $id;

            echo json_encode([
                "message" => "Usuario criado com sucesso!",
                "id" => $id,
                "email" => $this->user->email,
                "password" => $this->user->password
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao criar usuário"]);
        }
    }


    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(["message" => "Campos 'email' e 'password' são obrigatórios"]);
            return;
        }

        $this->user->id = $id;
        $this->user->email = $data->email;


        $this->user->password = password_hash($data->password, PASSWORD_DEFAULT);


        $this->user->admin = isset($data->admin) ? $data->admin : "0";

        if ($this->user->update()) {
            echo json_encode(["message" => "Usuário atualizado com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao atualizar usuário"]);
        }
    }


    public function delete($id)
    {
        $this->user->id = $id;

        if ($this->user->delete()) {
            echo json_encode(["message" => "Usuário removido com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao remover usuário"]);
        }
    }

    public function login()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(["message" => "Campos 'email' e 'password' são obrigatórios"]);
            return;
        }

        $this->user->email = $data->email;
        $user = $this->user->getByEmail();

        if (!$user) {
            http_response_code(401);
            echo json_encode(["message" => "E-mail ou senha inválidos"]);
            return;
        }

        if (!password_verify($data->password, $user["password"])) {
            http_response_code(401);
            echo json_encode(["message" => "E-mail ou senha inválidos"]);
            return;
        }

        ob_clean();

        echo json_encode([
            "message" => "Login realizado com sucesso",
            "user" => [
                "id" => $user["id"],
                "email" => $user["email"],
                "admin" => $user["admin"]
            ]
        ]);

        exit;
    }
}
