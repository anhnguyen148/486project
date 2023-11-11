<?php

include 'function.inc.php';

enable_cors();

$host = "qanguyen.net";
$username = "qnguyen3";
$password = "";
$database = "savoryjourney";

$userId = isset($_GET['Id']) ? $_GET['Id'] : null;

if ($userId === null) {
    $response = array(
        'status' => 'NOT OK',
        'message' => 'User ID is missing'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Connect to the database
$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT recipeId FROM userfavrecipe WHERE userId = $userId";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $recipeIds = array();
    while ($row = $result->fetch_assoc()) {
        $recipeIds[] = $row['recipeId'];
    }
    $response = array(
        'status' => 'OK',
        'message' => 'Recipe IDs retrieved',
        'data' => $recipeIds
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
} else {
    $response = array(
        'status' => 'NOT OK',
        'message' => 'No recipe IDs found'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

$conn->close();