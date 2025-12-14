<?php

require_once __DIR__ . '/../models/categoryItem.php';
require_once __DIR__ . '/../config/database.php';

class CategoryItemController
{
    private $db;
    private $categoryItem;

    public function __construct($db)
    {
        $this->db = $db;
        $this->categoryItem = new CategoryItem($db);
    }

    // Retorna todos os itens de todas as categorias
    public function index()
    {
        $stmt = $this->categoryItem->getAll();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($items);
    }

    // Retorna um item específico pelo ID
    public function show($id)
    {
        $this->categoryItem->id = $id;
        $item = $this->categoryItem->getById();

        if ($item) {
            echo json_encode($item);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Item não encontrado"]);
        }
    }

    // Cria um novo item
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->categoryId) || !isset($data->name) || !isset($data->price)) {
            http_response_code(400);
            echo json_encode(["message" => "categoryId, name e price são obrigatórios"]);
            return;
        }

        $this->categoryItem->categoryId = $data->categoryId;
        $this->categoryItem->name = $data->name;
        $this->categoryItem->price = $data->price;

        if ($this->categoryItem->create()) {
            http_response_code(201);
            echo json_encode(["message" => "Item criado com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao criar item"]);
        }
    }

    // Atualiza um item existente
    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->categoryId) || !isset($data->name) || !isset($data->price)) {
            http_response_code(400);
            echo json_encode(["message" => "categoryId, name e price são obrigatórios"]);
            return;
        }

        $this->categoryItem->id = $id;
        $this->categoryItem->categoryId = $data->categoryId;
        $this->categoryItem->name = $data->name;
        $this->categoryItem->price = $data->price;

        if ($this->categoryItem->update()) {
            echo json_encode(["message" => "Item atualizado com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao atualizar item"]);
        }
    }

    // Deleta um item
    public function delete($id)
    {
        $this->categoryItem->id = $id;

        if ($this->categoryItem->delete()) {
            echo json_encode(["message" => "Item removido com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao remover item"]);
        }
    }
}
