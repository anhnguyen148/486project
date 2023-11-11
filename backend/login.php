<?php

include 'function.inc.php';
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;

enable_cors();

$host = "qanguyen.net";
$username = "qnguyen3";
$password = "";
$database = "savoryjourney";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $uname = isset($_POST["username"]) ? input_sanitized($_POST["username"]) : null;
    $pwd = isset($_POST["password"]) ? input_sanitized($_POST["password"]) : null;

    if (($username === null) || ($username === "") || ($password === null) || ($password === "")) {
        $response = array(
            'status' => 'NOT OK',
            'message' => 'Username or password is missing'
        );
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }

    // Create a connection to the database
    $conn = new mysqli($host, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * 
            FROM users 
            WHERE uname = '$uname'";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        if (!password_verify($pwd, $row['pwd'])) {
            $response = array(
                "status" => "NOT OK",
                "message" => "Wrong password"
            );
            header("Content-Type: application/json");
            echo json_encode($response);
            exit;
        }

        if ($row['userStatus'] !== 'active') {
            $response = array(
                "status" => "NOT OK",
                "message" => "You email is not verified. Please check your email to verify your account"
            );
            header("Content-Type: application/json");
            echo json_encode($response);
            exit;
        }
        
        $fname = $row['fname'];
        $lname = $row['lname'];
        $userId = $row['userId'];

        $tokenId = md5(uniqid(rand(), true));
        $issuedAt = time(); // Current timestamp
        $expiration = $issuedAt + 3600; // Token expires in 1 hour

        $token_data = [
            'jti' => $tokenId,
            'iat' => $issuedAt,
            'exp' => $expiration,
            'username' => $uname
        ];

        $token = JWT::encode(
            $token_data, // Data to be encoded in the JWT
            'savoryjourney', // The signing key
            'HS512' // Algorithm used to sign the token
        );

        $response = array(
            "status" => "OK",
            "message" => "Token generated",
            "data" => array(
                "username" => $uname,
                "userId" => $userId,
                "first_name" => $fname,
                "last_name" => $lname,
                "token" => $token
            )
        );
        header("Content-Type: application/json");
        echo json_encode($response);
    } else {
        $response = array(
            "status" => "NOT OK",
            "message" => "Wrong username",
        );
        header("Content-Type: application/json");
        echo json_encode($response);
    }
    $conn->close();
} else {
    $response = array(
        "status" => "NOT OK",
        "message" => "Invalid request method"
    );
    header("Content-Type: application/json");
    echo json_encode($response);
    exit;
}