<?php

class Table
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function index()
    {
        $sql = "SELECT * FROM tables ORDER BY id DESC";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($tableNumber)
    {
        $sql = "INSERT INTO tables (table_number) VALUES (:table_number)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':table_number', $tableNumber);
        return $stmt->execute();
    }

    public function delete($id)
    {
        $sql = "DELETE FROM tables WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function show($id)
    {
        $sql = "SELECT * FROM tables WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
