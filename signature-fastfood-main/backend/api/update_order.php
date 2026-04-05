<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["error" => "ID and status required"]);
    exit();
}

$query = "UPDATE orders SET status = :status WHERE id = :id";
$stmt = $conn->prepare($query);

$stmt->bindParam(":status", $data['status']);
$stmt->bindParam(":id", $data['id']);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Could not update order"]);
}
?>
