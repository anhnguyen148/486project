<?php

include 'function.inc.php';
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;  

enable_cors();

$token = getBearerToken();
$uname = $_SERVER["HTTP_USERNAME"];

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
                'message' => 'Token is expired. Please login again'
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
        $response = array(
            'status' => 'OK',
            'message' => 'Token is valid'
        );
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
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