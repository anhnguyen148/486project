<?php
session_start();

include 'function.inc.php';
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

enable_cors();

$host = "qanguyen.net";
$username = "qnguyen3";
$password = "";
$database = "savoryjourney";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $fname = input_sanitized($_POST["fname"]);
    $lname = input_sanitized($_POST["lname"]);
    $email = input_sanitized($_POST["email"]);
    $uname = input_sanitized($_POST["username"]);
    $pwd = input_sanitized($_POST["password"]);
    $timestamp = submit_time();

    if (($fname === null) || ($fname === "") ||
        ($lname === null) || ($lname === "") || 
        ($email === null) || ($email === "") || 
        ($uname === null) || ($uname === "") || 
        ($pwd === null) || ($pwd === "")) {
        $response = array(
            'status' => 'NOT OK',
            'message' => 'Missing required fields'
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

    // check if username already exists
    $findUser = "SELECT * FROM users WHERE uname = '$uname'";
    $result1 = $conn->query($findUser);
    if ($result1->num_rows > 0) {
        $response = array(
            "status" => "NOT OK",
            "message" => "Username already exists"
        );
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

    // check if email already exists
    $findEmail = "SELECT * FROM users WHERE email = '$email'";
    $result2 = $conn->query($findEmail);
    if ($result2->num_rows > 0) {
        $response = array(
            "status" => "NOT OK",
            "message" => "Email already exists"
        );
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

    // grant code to verify
    // code includes 6 digits
    $code = strval(mt_rand(100000, 999999));

    // Send a password reset email
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->Username = 'anh195001@gmail.com';
    $mail->Password = 'pnaqhvtttqjoksvk';
    $mail->SMTPSecure = 'PHPMailer::ENCRYPTION_STARTTLS';

    $mail->setFrom('savoryjourney@gmail.com', 'NO-REPLY Savor Journey');
    $mail->addAddress($email);
    $mail->Subject = 'Savor Journey - Verify Email';
    $mail->Body = "Your verification code is: $code";

    try {
        if ($mail->send()) {

            // Create a connection to the database
            $conn = new mysqli($host, $username, $password, $database);

            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            // hash password to insert new user
            $hashedPwd = password_hash($pwd, PASSWORD_DEFAULT);
            $hashedCode = password_hash($code, PASSWORD_DEFAULT);
            $sql = "INSERT INTO users (fname, lname, email, uname, pwd, create_at, signupToken, userStatus) 
                    VALUES ('$fname', '$lname', '$email', '$uname', '$hashedPwd', '$timestamp', '$hashedCode', 0)";

            $result = $conn->query($sql);
            if ($result === true) {
                $response = array(
                    "status" => "OK",
                    "message" => "User created successfully (haven't verified)"
                );
                header("Content-Type: application/json");
                echo json_encode($response);
                exit;
            } else {
                $response = array(
                    "status" => "NOT OK",
                    "message" => "Server: Error creating user"
                );
                header("Content-Type: application/json");
                echo json_encode($response);
                exit;
            }
        } else {
            $response = array(
                "status" => "NOT OK",
                "message" => $mail->ErrorInfo
            );
            header("Content-Type: application/json");
            echo json_encode($response);
            exit;
        }

    } catch (Exception $e) {
        $response = array(
            "status" => "NOT OK",
            "message" => $e->getMessage()
        );
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }
    $conn->close();
} 