<?php
// gerar_hash.php

$senha = '';
$hash = '';
$mensagemVerificacao = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['senha'])) {
    $senha = $_POST['senha'];
    $hash = password_hash($senha, PASSWORD_DEFAULT);

    // Teste de verificação (pra você ter certeza que funciona)
    if (password_verify($senha, $hash)) {
        $mensagemVerificacao = "<p style='color:green;'>✓ Verificação OK: a senha '{$senha}' bate com o hash gerado.</p>";
    } else {
        $mensagemVerificacao = "<p style='color:red;'>✗ Erro na verificação.</p>";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Gerador de Hash de Senha</title>
</head>
<body>
    <h2>Gerador de Hash de Senha</h2>

    <form method="post">
        <input type="text" name="senha" placeholder="Digite a senha" style="width:300px;" required>
        <button type="submit">Gerar hash</button>
    </form>

    <?php if ($hash): ?>
        <p><strong>Senha escrita:</strong> <?php echo htmlspecialchars($senha, ENT_QUOTES, 'UTF-8'); ?></p>
        <p><strong>Hash gerado:</strong></p>
        <textarea style="width:100%; height:80px; font-family:monospace;" readonly><?php echo $hash; ?></textarea>
        <br><br>
        <p>Copie o hash acima e use no banco de dados.</p>
        <?php echo $mensagemVerificacao; ?>
    <?php endif; ?>
</body>
</html>
