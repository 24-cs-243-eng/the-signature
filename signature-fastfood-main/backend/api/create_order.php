<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit();
}

$query = "INSERT INTO orders 
          (order_id, user_id, customer_name, phone, address, items, total, payment_method, transaction_id, status) 
          VALUES 
          (:order_id, :user_id, :customer_name, :phone, :address, :items, :total, :payment_method, :transaction_id, :status)";

$stmt = $conn->prepare($query);

// Bind values securely to prevent SQL injection
$stmt->bindParam(":order_id", $data['order_id']);
$stmt->bindParam(":user_id", $data['user_id']);
$stmt->bindParam(":customer_name", $data['customer_name']);
$stmt->bindParam(":phone", $data['phone']);
$stmt->bindParam(":address", $data['address']);
$stmt->bindParam(":items", $data['items']);
$stmt->bindParam(":total", $data['total']);
$stmt->bindParam(":payment_method", $data['payment_method']);
$stmt->bindParam(":transaction_id", $data['transaction_id']);
$status = "pending";
$stmt->bindParam(":status", $status);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Order added"]);
} else {
    echo json_encode(["status" => "error", "message" => "Could not add order"]);
}
?>
