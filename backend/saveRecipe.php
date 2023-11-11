<?php

include 'function.inc.php';
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key; 

enable_cors();

$host = "qanguyen.net";
$username = "qnguyen3";
$password = "";
$database = "savoryjourney";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $token = getBearerToken();
    $uname = $_SERVER["HTTP_USERNAME"];
    
    $tokenValidate = validateToken($token, $uname);
    if ($tokenValidate === true) {
        $recipeId = isset($_POST['recipeId']) ? (int)input_sanitized($_POST['recipeId']) : null;
        $userId = isset($_POST['userId']) ? (int)input_sanitized($_POST['userId']) : null;

        if (($recipeId === "") || ($recipeId === null) || ($recipeId === 0)) {
            $response = array(
                'status' => 'NOT OK',
                'message' => 'Recipe ID is missing'
            );
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }
        
        if (($userId === "") || ($userId === null) || ($userId === 0)) {
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

        $sql = "INSERT INTO userfavrecipe (userId, recipeId) VALUES ('$userId', '$recipeId')";

        $result = $conn->query($sql);

        if ($result === TRUE) {
            $response = array(
                'status' => 'OK',
                'message' => 'Recipe added to favorite'
            );
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        } else {
            $response = array(
                'status' => 'NOT OK',
                'message' => 'Error when adding recipe to favorite'
            );
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }
        
        $conn->close();
    }
    
} else {
    $response = array(
        'status' => 'NOT OK',
        'message' => 'Invalid request method'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
