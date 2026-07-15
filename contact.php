<?php
/**
 * Basel Buddhist Vihara — Contact form handler
 * Plain PHP mail(), no external dependencies — ready to drop onto Cyon shared hosting.
 *
 * Update $recipient / $fromAddress below to the live mailbox and domain before going live.
 */

declare(strict_types=1);

$recipient   = 'ariyaseela@gmail.com';
$fromAddress = 'noreply@baselbuddhistvihara.ch';
$redirectTo  = 'index.html';

function redirect(string $redirectTo, string $status): void
{
    header('Location: ' . $redirectTo . '?status=' . $status . '#contact');
    exit;
}

function stripHeaderInjection(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect($redirectTo, 'error');
}

// Honeypot: humans never fill this hidden field in, most bots do.
if (!empty($_POST['website'])) {
    redirect($redirectTo, 'sent');
}

$name    = stripHeaderInjection((string) ($_POST['name'] ?? ''));
$email   = stripHeaderInjection((string) ($_POST['email'] ?? ''));
$subject = stripHeaderInjection((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    redirect($redirectTo, 'error');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirect($redirectTo, 'error');
}

$subjectLabels = [
    'general'   => 'Allgemeine Anfrage',
    'programs'  => 'Programm-Info',
    'donations' => 'Spenden',
    'other'     => 'Sonstiges',
];
$subjectLabel = $subjectLabels[$subject] ?? 'Sonstiges';

$mailSubject = 'Kontaktformular: ' . $subjectLabel;
$mailBody = "Name: {$name}\n"
    . "E-Mail: {$email}\n"
    . "Betreff: {$subjectLabel}\n\n"
    . "Nachricht:\n{$message}\n";

$headers = [
    'From: Basel Buddhist Vihara Website <' . $fromAddress . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($recipient, $mailSubject, $mailBody, implode("\r\n", $headers));

redirect($redirectTo, $sent ? 'sent' : 'error');
