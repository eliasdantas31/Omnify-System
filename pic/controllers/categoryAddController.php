<?php

require_once __DIR__ . '/../models/categoryAdds.php';
require_once __DIR__ . '/../config/database.php';

class CategoryAddsController
{
    private $db;
    private $categoryAdds;

    public function __construct($db)
    {
        $this->db = $db;
        $this->categoryAdds = new CategoryAdds($db);
    }

    public function index()
    {
        $stmt = $this->categoryAdds->getAll();
        $adds = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($adds);
    }

    public function show($id)
    {
        $this->categoryAdds->id = $id;
        $add = $this->categoryAdds->getById();

        if ($add) {
            echo json_encode($add);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Registro não encontrado"]);
        }
    }


    public function create()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (
            !isset($data->categoryId) ||
            !isset($data->name) ||
            !isset($data->price)
        ) {
            http_response_code(400);
            echo json_encode([
                "message" => "Campos 'categoryId', 'name' e 'price' são obrigatórios"
            ]);
            return;
        }

        $this->categoryAdds->categoryId = $data->categoryId;
        $this->categoryAdds->name = $data->name;
        $this->categoryAdds->price = $data->price;

        if ($this->categoryAdds->create()) {
            http_response_code(201);
            echo json_encode(["message" => "Adicional criado com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao criar adicional"]);
        }
    }


    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"));

        if (
            !isset($data->categoryId) ||
            !isset($data->name) ||
            !isset($data->price)
        ) {
            http_response_code(400);
            echo json_encode([
                "message" => "Campos 'categoryId', 'name' e 'price' são obrigatórios"
            ]);
            return;
        }

        $this->categoryAdds->id = $id;
        $this->categoryAdds->categoryId = $data->categoryId;
        $this->categoryAdds->name = $data->name;
        $this->categoryAdds->price = $data->price;

        if ($this->categoryAdds->update()) {
            echo json_encode(["message" => "Adicional atualizado com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao atualizar adicional"]);
        }
    }


    public function delete($id)
    {
        $this->categoryAdds->id = $id;

        if ($this->categoryAdds->delete()) {
            echo json_encode(["message" => "Adicional removido com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao remover adicional"]);
        }
    }
}
