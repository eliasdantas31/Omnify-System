<?php

class TablesController
{
    private $tableModel;

    public function __construct($tableModel)
    {
        $this->tableModel = $tableModel;
    }

    public function index()
    {
        echo json_encode($this->tableModel->index());
    }

    public function create()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input['table_number']) || empty(trim($input['table_number']))) {
            http_response_code(400);
            echo json_encode(["error" => "table_number é obrigatório"]);
            return;
        }

        $result = $this->tableModel->create($input['table_number']);

        echo json_encode([
            "success" => $result,
            "message" => $result ? "Mesa criada" : "Erro ao criar mesa"
        ]);
    }

    public function delete($id)
    {
        $result = $this->tableModel->delete($id);

        echo json_encode([
            "success" => $result,
            "message" => $result ? "Mesa deletada" : "Erro ao deletar mesa"
        ]);
    }

    public function show($id)
    {
        echo json_encode($this->tableModel->show($id));
    }
}
