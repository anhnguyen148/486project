<?php
include 'function.inc.php';

enable_cors();

$host = "";
$username = "";
$password = "";
$database = "";

$recipeId = isset($_GET['Id']) ? $_GET['Id'] : null;

if ($recipeId === null) {
    $response = array(
        'status' => 'NOT OK',
        'message' => 'Recipe ID is missing'
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

$sql = "SELECT 
            r.*, d.directionDetail, d.directionId, i.ingredientId, i.ingredientDetail 
        FROM 
            recipes r 
        LEFT JOIN 
            directions d ON r.recipeId = d.recipeId 
        LEFT JOIN 
            ingredients i ON r.recipeId = i.recipeId 
        WHERE 
            r.recipeId =  $recipeId";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $recipe = $result->fetch_assoc();

    $ingredientIds = array();
    $directionIds = array();

    while ($row = $result->fetch_assoc()) {
        if (!in_array($row['ingredientId'], $ingredientIds)) {
            $ingredientIds[] = $row['ingredientId'];
            $recipe['ingredientList'][] = array(
                'ingredientId' => $row['ingredientId'],
                'ingredientDetail' => $row['ingredientDetail']
            );
        }
        if (!in_array($row['directionId'], $directionIds)) {
            $directionIds[] = $row['directionId'];
            $recipe['directionList'][] = array(
                'directionId' => $row['directionId'],
                'directionDetail' => $row['directionDetail']
            );
        }
    }
    $response = array(
        'status' => 'OK',
        'message' => 'Recipe successfully retrieved',
        'data' => $recipe
    );
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    $response = array(
        'status' => 'NOT OK',
        'message' => 'Recipe not found'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
}

$conn->close();