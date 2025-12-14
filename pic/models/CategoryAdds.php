<?php

class CategoryAdds
{
    private $conn;
    private $table = "CategoryAdds";

    public $id;
    public $categoryId;
    public $name;
    public $price;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll()
    {
        $sql = "SELECT ca.*, c.name AS categoryName
                FROM $this->table ca
                JOIN Category c ON c.id = ca.categoryId
                ORDER BY ca.name ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt;
    }

    public function getById()
    {
        $sql = "SELECT ca.*, c.name AS categoryName
                FROM $this->table ca
                JOIN Category c ON c.id = ca.categoryId
                WHERE ca.id = :id
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

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

    public function delete()
    {
        $sql = "DELETE FROM $this->table WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }
}
