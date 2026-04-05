<?php
// backend/api/db.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost'; // Usually localhost on Hostinger
$db_name = 'YOUR_HOSTINGER_DB_NAME';
$username = 'YOUR_HOSTINGER_DB_USER';
$password = 'YOUR_HOSTINGER_DB_PASSWORD';

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection Error: " . $exception->getMessage()]);
    exit();
}
?>
