<?php

class User
{
  private $conn;
  private $table = "Users";

  public $id;
  public $email;
  public $password;
  public $admin;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function getAll()
  {
    $sql = "SELECT id, email, admin FROM $this->table ORDER BY email ASC";

    $stmt = $this->conn->prepare($sql);
    $stmt->execute();

    return $stmt;
  }

  public function getById()
  {
    $sql = "SELECT id, email, admin
                FROM $this->table
                WHERE id = :id
                LIMIT 1";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(":id", $this->id);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create()
  {
    $sql = "INSERT INTO $this->table (email, password, admin)
                VALUES (:email, :password, :admin)";

    $stmt = $this->conn->prepare($sql);

    $stmt->bindParam(":email", $this->email);
    $stmt->bindParam(":password", $this->password);
    $stmt->bindParam(":admin", $this->admin);

    return $stmt->execute();
  }

  public function update()
  {
    $sql = "UPDATE $this->table
                SET email = :email,
                    password = :password,
                    admin = :admin
                WHERE id = :id";

    $stmt = $this->conn->prepare($sql);

    $stmt->bindParam(":email", $this->email);
    $stmt->bindParam(":password", $this->password);
    $stmt->bindParam(":admin", $this->admin);
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

  public function getByEmail()
  {
    $sql = "SELECT * FROM $this->table WHERE email = :email LIMIT 1";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(":email", $this->email);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
}
