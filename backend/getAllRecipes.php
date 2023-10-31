<?php

include 'function.inc.php';

enable_cors();

$host = "";
$username = "";
$password = "";
$database = "";

// Create a connection to the database
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// SQL query to retrieve all recipes
$sql = "SELECT * FROM recipes";

// Execute the query
$result = $conn->query($sql);

// Check if there are any results
if ($result->num_rows > 0) {
    $recipes = array();
    while ($row = $result->fetch_assoc()) {
        $recipes[] = $row;
    }
    $response = array(
        'status' => 'OK',
        'message' => 'Recipes successfully retrieved',
        'data' => $recipes 
    );
    // Return the recipes as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    $response = array(
        'status' => 'NOT OK',
        'message' => 'No recipes found in the database'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
}

$conn->close();



