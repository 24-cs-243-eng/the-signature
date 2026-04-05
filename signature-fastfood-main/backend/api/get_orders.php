<?php
header('Content-Type: application/json');
require_once 'db.php';

$query = "SELECT * FROM orders ORDER BY created_at DESC";
$stmt = $conn->prepare($query);
$stmt->execute();

$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Decode items JSON string back to array for each order
foreach ($orders as &$order) {
    if (isset($order['items'])) {
        $order['items'] = json_decode($order['items'], true);
    }
}

echo json_encode($orders);
?>
