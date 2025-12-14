<?php

class Order
{
    private $conn;
    private $table = "Orders";

    public $id;
    public $table_or_client; // <- alterado
    public $created_at;
    public $status;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll()
    {
        $sql = "SELECT * FROM $this->table ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt;
    }

    public function getById()
    {
        $sql = "SELECT * FROM $this->table WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create()
    {
        $sql = "INSERT INTO $this->table (table_or_client, status)
                VALUES (:table_or_client, :status)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":table_or_client", $this->table_or_client);
        $stmt->bindParam(":status", $this->status);

        return $stmt->execute();
    }

    public function update()
    {
        $sql = "UPDATE $this->table 
                SET table_or_client = :table_or_client, status = :status
                WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":table_or_client", $this->table_or_client);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function updateStatus()
    {
        $sql = "UPDATE $this->table 
                SET status = :status
                WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function delete()
    {
        $sql = "DELETE FROM $this->table WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }
}
