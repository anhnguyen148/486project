<?php

session_start();
include 'function.inc.php';

enable_cors();

$host = "qanguyen.net";
$username = "qnguyen3";
$password = "";
$database = "savoryjourney";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $userCode = input_sanitized($_POST["userCode"]);
    $email = input_sanitized($_POST["email"]);

    // Create a connection to the database
    $conn = new mysqli($host, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT email, signupToken FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $verified = password_verify($userCode, $row['signupToken']);
        if ($verified) {
            $sql = "UPDATE users SET userStatus = 'active' WHERE email = '$email'";
            $result = $conn->query($sql);
            if ($result) {
                $response = array(
                    "status" => "OK",
                    "message" => "Email verified"
                );
                header("Content-Type: application/json");
                echo json_encode($response);
                exit;
            } else {
                $response = array(
                    "status" => "NOT OK",
                    "message" => "Email not verified"
                );
                header("Content-Type: application/json");
                echo json_encode($response);
                exit;
            }
        } else {
            $response = array(
                "status" => "NOT OK",
                "message" => "Code not matched"
            );
            header("Content-Type: application/json");
            echo json_encode($response);
            exit;
        }
        
    } else {
        $response = array(
            "status" => "NOT OK",
            "message" => "Email not verified"
        );
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

    
    // $conn->close();
}