<?php
// Copie este arquivo para enviar.php e preencha as configurações SMTP
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit;
}

$nome     = htmlspecialchars(trim($_POST['nome']     ?? ''), ENT_QUOTES, 'UTF-8');
$email    = trim($_POST['email']    ?? '');
$empresa  = htmlspecialchars(trim($_POST['empresa']  ?? ''), ENT_QUOTES, 'UTF-8');
$servico  = htmlspecialchars(trim($_POST['servico']  ?? ''), ENT_QUOTES, 'UTF-8');
$mensagem = htmlspecialchars(trim($_POST['mensagem'] ?? ''), ENT_QUOTES, 'UTF-8');

if (!$nome || !$email || !$mensagem) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos obrigatórios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'E-mail inválido.']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'SEU_SERVIDOR_SMTP';         // ex: zcs.infoshoptecnologia.com.br
    $mail->SMTPAuth   = true;
    $mail->Username   = 'SEU_EMAIL@dominio.com.br';  // ex: contato@alitecnologia.inf.br
    $mail->Password   = 'SUA_SENHA';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom('SEU_EMAIL@dominio.com.br', 'Site Ali Tecnologia');
    $mail->addAddress('SEU_EMAIL@dominio.com.br', 'Ali Tecnologia');
    $mail->addReplyTo($email, $nome);

    $mail->isHTML(true);
    $mail->Subject = "Novo contato: {$nome}";
    $mail->Body    = "<p><strong>Nome:</strong> {$nome}</p>
                      <p><strong>E-mail:</strong> {$email}</p>
                      <p><strong>Empresa:</strong> {$empresa}</p>
                      <p><strong>Serviço:</strong> {$servico}</p>
                      <p><strong>Mensagem:</strong> {$mensagem}</p>";
    $mail->AltBody = "Nome: {$nome}\nE-mail: {$email}\nEmpresa: {$empresa}\nServiço: {$servico}\nMensagem: {$mensagem}";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Mensagem enviada com sucesso!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao enviar a mensagem. Tente novamente.']);
}
