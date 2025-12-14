<?php

class CategoryItem
{
    private $conn;
    private $table = "CategoryItem";

    public $id;
    public $categoryId;
    public $name;
    public $price;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Retorna todos os itens, incluindo o nome da categoria
    public function getAll()
    {
        $sql = "SELECT ci.*, c.name AS categoryName
                FROM $this->table ci
                JOIN Category c ON c.id = ci.categoryId
                ORDER BY ci.name ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt;
    }

    // Retorna um item pelo ID
    public function getById()
    {
        $sql = "SELECT ci.*, c.name AS categoryName
                FROM $this->table ci
                JOIN Category c ON c.id = ci.categoryId
                WHERE ci.id = :id
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Cria um novo item
    public function create()
    {
        $sql = "INSERT INTO $this->table (categoryId, name, price)
                VALUES (:categoryId, :name, :price)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":categoryId", $this->categoryId);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        return $stmt->execute();
    }

    // Atualiza um item existente
    public function update()
    {
        $sql = "UPDATE $this->table 
                SET categoryId = :categoryId,
                    name = :name,
                    price = :price
                WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":categoryId", $this->categoryId);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }

    // Deleta um item
    public function delete()
    {
        $sql = "DELETE FROM $this->table WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }

    // Retorna itens de uma categoria específica
    public function getItemsByCategory()
    {
        $sql = "SELECT id, name, price FROM $this->table WHERE categoryId = :categoryId ORDER BY name ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":categoryId", $this->categoryId);
        $stmt->execute();
        return $stmt;
    }
}
