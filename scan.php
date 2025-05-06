<?php
require __DIR__."/conf.php";
function scanDirectory($directory,$localPath) {
    $items = [];
    if (!is_dir($directory)) {
        return $items;
    }
    $scan = scandir($directory);
    foreach ($scan as $folder => $file) {
        if ($file === '.' || $file === '..') continue;
        $absoluteItemPath = $directory . '/' . $file;
        $relativePathForItem = ltrim(str_replace($directory, '', $absoluteItemPath), '/');
        $itemPathForJson = $localPath.'/' . $relativePathForItem;
        if (is_dir($absoluteItemPath)) {
            $items[] = [
                'name' => $file,
                'type' => 'folder',
                'path' => $itemPathForJson,
                'items' => scanSubDirectory($absoluteItemPath, $itemPathForJson)
            ];
        } else {
            $items[] = [
                'name' => $file,
                'type' => 'file',
                'path' => $itemPathForJson,
                'size' => filesize($absoluteItemPath)
            ];
        }
    }
    return $items;
}
function scanSubDirectory($absolutePath, $parentPathForJson) {
    $subItems = [];
    $scan = scandir($absolutePath);
    foreach ($scan as $file) {
        if ($file === '.' || $file === '..') continue;
        $absoluteFilePath = $absolutePath . '/' . $file;
        $relativePathForItem = ltrim(str_replace($_SERVER['DOCUMENT_ROOT'] . '/files', '', $absoluteFilePath), '/');
        $itemPathForJson = $parentPathForJson . '/' . $file;
        if (is_dir($absoluteFilePath)) {
            $subItems[] = [
                'name' => $file,
                'type' => 'folder',
                'path' => $itemPathForJson,
                'items' => []
            ];
        } else {
            $subItems[] = [
                'name' => $file,
                'type' => 'file',
                'path' => $itemPathForJson,
                'size' => filesize($absoluteFilePath)
            ];
        }
    }
    return $subItems;
}

function findMyFiles(string $pathToScan, string $requestedPath, string $search): array
{
    $results = [];
    $fullPath = $pathToScan ;
    if ($fullPath === false || !is_dir($fullPath)) {
        return $results; // Return empty array if the path is invalid
    }
    $iterator = new RecursiveDirectoryIterator($fullPath);
    $recursiveIterator = new RecursiveIteratorIterator($iterator);
    
    foreach ($recursiveIterator as $item) {
    $pathSegments = explode('/', $item->getPathname());
    $baseName = end($pathSegments); // Default to the last segment (filename)

    if ($item->isDir() && count($pathSegments) > 1 ) {
        $baseName = $pathSegments[count($pathSegments) - 2];
    }
    $parentDirectory = $item->getPathInfo();
    $parentName = $parentDirectory->getFilename();
    $parentPath = $parentDirectory->getPathname();

    if ($item->getFilename() !== ".." && strpos(strtolower($baseName), $search) !== false) {
        $type = $item->isDir() ? 'folder' : 'file';
        $localPath = $requestedPath.str_replace($fullPath, '', $parentPath);
        if($type == "file") $localPath .= '/'.$baseName;
        $results[] = [
            'name' => $baseName,
            'type' => $type,
            'path' => $localPath,
            'size' => $item->isDir() ? null : $item->getSize(),
            'items'=> $type == "folder" ? scanSubDirectory($parentPath, $localPath) : [],
            'modified' => date('Y-m-d H:i:s', $item->getMTime()),
        ];
       
    }
  }

    return $results;
}

$searchTerm = isset($_GET["search"]) && $_GET["search"] !="" ? strtolower($_GET["search"]) : "";
if($searchTerm != ""){
    $currentPathData = [
    'name' => $searchTerm,
    'type' => 'search',
    'path' =>  $requestedPath,
    'items' => findMyFiles($pathToScan, $requestedPath, $searchTerm),
];
}else{

$currentPathData = [
    'name' => basename($requestedPath),
    'type' => 'folder',
    'path' => $requestedPath,
    'items' => scanDirectory($pathToScan,$requestedPath)
];
}


header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1
header("Pragma: no-cache");                                   // HTTP 1.0
header("Expires: 0"); 
header('Content-Type: application/json');
echo json_encode($currentPathData);