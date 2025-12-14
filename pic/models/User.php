<?php
// models/User.php

class User
{
    private PDO $conn;
    private string $table = "Users";

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function findByEmail(string $email): ?array
    {
        $sql = "SELECT id, email, password, role FROM {$this->table} WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch();
        return $user ?: null;
    }

    /**
     * Tenta logar com email e senha.
     * Retorna o usuário (sem o hash) se ok, ou null se inválido.
     */
    public function login(string $email, string $password): ?array
    {
        $user = $this->findByEmail($email);

        if (!$user) {
            return null;
        }

        // password_verify compara a senha enviada com o hash salvo
        if (!password_verify($password, $user['password'])) {
            return null;
        }

        // Sanitiza o retorno (não expor hash)
        return [
            'id'    => (int)$user['id'],
            'email' => $user['email'],
            'role'  => $user['role'], // 'A', 'G', 'U' (ou 'g')
        ];
    }
}
