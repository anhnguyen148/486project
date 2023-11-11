<?php

require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;  

function input_sanitized($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function enable_cors() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); 
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Username'); 
    header('Content-Type: application/json');
    header('Access-Control-Allow-Credentials: true');
}

function submit_time() {
    date_default_timezone_set("America/Chicago");
    return date("m/d/Y H:i:s");
}

// Function to retrieve the token from the request headers
function getBearerToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        $token = str_replace('Bearer ', '', $authHeader);
        return $token;
    } else {
        return null;
    }
}

function validateToken($token, $uname) {
    if (($token === null) || ($token === "")) {
        $response = array(
            'status' => 'NOT OK',
            'message' => 'Token is missing'
        );
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    } else {
        try {
            $decoded = JWT::decode(
                $token, 
                new Key('savoryjourney', 'HS512'));
    
            if ($decoded->exp < time()) {
                $response = array(
                    'status' => 'NOT OK',
                    'message' => 'Token is expired. Please login again.'
                );
                header('Content-Type: application/json');
                echo json_encode($response);
                exit;
            }
            if ($decoded->username !== $uname) {
                $response = array(
                    'status' => 'NOT OK',
                    'message' => 'You are not authorized. Please login.'
                );
                header('Content-Type: application/json');
                echo json_encode($response);
                exit;
            }
            return true;
        } catch (Exception $e) {
            $response = array(
                'status' => 'NOT OK',
                'message' => $e->getMessage()
            );
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }
    }
}
