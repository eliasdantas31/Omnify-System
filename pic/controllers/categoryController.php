<?php

require_once __DIR__ . '/../models/category.php';
require_once __DIR__ . '/../config/database.php';

class CategoryController
{
    private $db;
    private $category;

    public function __construct($db)
    {
        $this->db = $db;
        $this->category = new Category($db);
    }

    // Listar todas as categorias (simples)
    public function index()
    {
        $stmt = $this->category->getAll();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($categories);
    }

    // Mostrar uma categoria específica
    public function show($id)
    {
        $this->category->id = $id;
        $category = $this->category->getById();

        if ($category) {
            echo json_encode($category);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Categoria não encontrada"]);
        }
    }

    // Criar nova categoria
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->name) || empty(trim($data->name))) {
            http_response_code(400);
            echo json_encode(["message" => "Nome da categoria é obrigatório"]);
            return;
        }

        $this->category->name = $data->name;

        if ($this->category->create()) {
            http_response_code(201);
            echo json_encode(["message" => "Categoria criada com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao criar categoria"]);
        }
    }

    // Atualizar categoria
    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->name) || empty(trim($data->name))) {
            http_response_code(400);
            echo json_encode(["message" => "Campo 'name' é obrigatório"]);
            return;
        }

        $this->category->id = $id;
        $this->category->name = $data->name;

        if ($this->category->update()) {
            echo json_encode(["message" => "Categoria atualizada com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao atualizar categoria"]);
        }
    }

    // Deletar categoria
    public function delete($id)
    {
        $this->category->id = $id;

        if ($this->category->delete()) {
            echo json_encode(["message" => "Categoria removida com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao remover categoria"]);
        }
    }

    // Listar menu completo (categorias + itens + adicionais)
    public function menu()
{
    $stmt = $this->category->getAll();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];

    foreach ($categories as $cat) {
        $this->category->id = $cat['id'];

        $itemsStmt = $this->category->getItems();
        $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

        $addsStmt = $this->category->getAdds();
        $adds = $addsStmt->fetchAll(PDO::FETCH_ASSOC);

        $result[] = [
            'id' => $cat['id'],
            'name' => $cat['name'],
            'items' => $items ?? [], // garante array vazio se não houver itens
            'adds' => $adds ?? []    // garante array vazio se não houver adicionais
        ];
    }

    echo json_encode($result);
}
}
