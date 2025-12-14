<?php

class Database
{
    private $host = "127.0.0.1";
    private $db_name = "picdb";   // Nome DO SEU BANCO
    private $username = "root";   // Usuário padrão do XAMPP
    private $password = "";       // Senha vazia no XAMPP
    public $conn;

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );

            // Opções recomendadas
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch (PDOException $exception) {
            echo json_encode([
                "message" => "Erro de conexão: " . $exception->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
