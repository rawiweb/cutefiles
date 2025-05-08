<?php
$editorBase = "/files"; //set the relative Doc_Root files Directory

session_start();
if (!isset($_SESSION['admin']) || $_SESSION['admin']!=1){ 
    header('HTTP/1.0 401 Unauthorized');
    die('Add a login mechanism or remove that line for public access');
}
// there is all there was for configuration
$path = isset($_GET['path']) && $_GET['path']!="" ? $_GET['path'] : $editorBase;
$requestedPath = $path =="/" ? $editorBase : $path;
$safeBaseDirAbs = $_SERVER["DOCUMENT_ROOT"];

// Determine the actual directory to scan
$pathToScan = $safeBaseDirAbs . $requestedPath;
$regularRequest = true;

if (strpos($requestedPath, '..') !== false) {
    $pathToScan = $safeBaseDirAbs.$editorBase;
    $regularRequest = false;
}
// Security check 2: Ensure the requested path starts with the allowed base
if (strpos($requestedPath, $editorBase) !== 0) {
    $pathToScan = $safeBaseDirAbs.$editorBase;
    $regularRequest = false;
}

$base = explode("/",$pathToScan);
unset($base[count($base)-1]);
$parentDirAbs = implode("/",$base);
$base = explode("/",$requestedPath);
unset($base[count($base)-1]);
$parentDir = implode("/",$base);


if(!$regularRequest){
    error_log("Filemanager request path: $requestedPath Supposed to be $pathToScan");
    
}
require __DIR__."/assets/upload.class2.php";

$sec_check = new \Verot\Upload\Upload($pathToScan);
$unsave = $sec_check->dangerous;
$forbidden = $sec_check->forbidden;
$unsave = array_merge($unsave,$forbidden);
$sec_check = null;
