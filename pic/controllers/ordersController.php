<?php

require_once __DIR__ . '/../models/Orders.php';
require_once __DIR__ . '/../config/database.php';

class OrderController
{
    private $conn;
    private $order;

    public function __construct($db)
    {
        $this->conn = $db;
        $this->order = new Order($db);
    }

    // GET /orders
    public function getAll()
    {
        $stmt = $this->order->getAll();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    }

    // GET /orders/{id}
    public function getById($id)
    {
        $this->order->id = $id;
        $order = $this->order->getById();

        if ($order) {
            echo json_encode($order);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Order not found"]);
        }
    }

    // POST /orders/create
    public function create()
{
    $data = json_decode(file_get_contents("php://input"));

    // Validar table_or_client
    if (!isset($data->table_or_client) || empty($data->table_or_client)) {
        http_response_code(400);
        echo json_encode(["message" => "table_or_client is required"]);
        return;
    }

    // Preencher dados do pedido
    $this->order->table_or_client = $data->table_or_client; // <- alterado
    $this->order->status = "open";

    if ($this->order->create()) {
        echo json_encode(["message" => "Order created successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to create order"]);
    }
}

    // PATCH /orders/{id}/status
    public function updateStatus($id)
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->status)) {
            http_response_code(400);
            echo json_encode(["message" => "status is required"]);
            return;
        }

        if (!in_array($data->status, ['open','closed','finished'])) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid status"]);
            return;
        }

        $this->order->id = $id;
        $this->order->status = $data->status;

        if ($this->order->updateStatus()) {
            echo json_encode(["message" => "Status updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update status"]);
        }
    }

    // DELETE /orders/{id}
    public function delete($id)
    {
        $this->order->id = $id;

        if ($this->order->delete()) {
            echo json_encode(["message" => "Order deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete order"]);
        }
    }
}
