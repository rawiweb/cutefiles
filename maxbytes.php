<?php
//sets some javascript variables needed for Uploads 
$num1 = return_bytes(ini_get("post_max_size"));
$numV = getsize(ini_get("post_max_size"));
$num2 = return_bytes(ini_get("upload_max_filesize"));
$min = ($num1 <=> $num2) < 0 ? $num1 : $num2;
echo "const maxBytes = $min;". PHP_EOL;
echo "const verodMaxBytes = $numV;". PHP_EOL;
echo "const fileUploads = ".ini_get("file_uploads"). PHP_EOL;
echo "const maxFileUploads = ".ini_get("max_file_uploads"). PHP_EOL;


function return_bytes($val) {
    if (empty($val)) {
        $val = 0;
    }
    $val = trim($val);
    $last = strtolower($val[strlen($val)-1]);
    $val = floatval($val);
    switch($last) {
        case 'g':
            $val *= (1024 * 1024 * 1024); //1073741824
            break;
        case 'm':
            $val *= (1024 * 1024); //1048576
            break;
        case 'k':
            $val *= 1024;
            break;
    }
    return $val;
}
    function getsize($size) {
        if ($size === null) return null;
        $last = is_string($size) ? strtolower(substr($size, -1)) : null;
        $size = (int) $size;
        switch($last) {
            case 'g':
                $size *= 1024;
            case 'm':
                $size *= 1024;
            case 'k':
                $size *= 1024;
        }
        return $size;
    }
