<?php
// config.php

$servername = "localhost";   // no servidor (Hostinger)
$username   = "root";        // usuário do banco no servidor
$password   = "";            // senha do banco
$dbname     = "PICDB";       // nome do banco

$conexao = new mysqli($servername, $username, $password, $dbname);

if ($conexao->connect_error) {
  die("Conexao falhou: " . $conexao->connect_error);
}
