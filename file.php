<?php
require __DIR__."/conf.php";
if (isset($_GET["get"])){
    $what = $requestedPath;
    $filename = $pathToScan;

 switch($_GET["get"]){
     case "rotate":
     
     $myimage = $filename;
     if(file_exists($myimage)){
     
     $handle = new \Verot\Upload\Upload($myimage);
     $handle->file_overwrite = false;
     $handle->image_rotate = 90;
     $handle->file_dst_path =$parentDirAbs."/";
     $handle->file_dst_name = time();
     $handle->process($handle->file_dst_path);
     if ($handle->processed){
        $handle->clean();
        echo $parentDir."/".$handle->file_dst_name;
     return;
     }
     echo $myimage;
     } else echo $myimage;
   break;
 case "crop":
     
     $trbl = explode(",",$_GET["coords"]);
     $myimage = $filename;
     if(file_exists($myimage)){

     $handle = new \Verot\Upload\Upload($myimage);
     $handle->file_dst_path =$parentDirAbs."/";
     $handle->file_overwrite = false;
     $handle->image_crop = $trbl;
     $handle->process($handle->file_dst_path);
     if ($handle->processed){
      //  $handle->clean();
        echo $parentDir."/".$handle->file_dst_name;
        
     return;
      }
      echo "<p class=\"err\">$handle->error.$handle->log</p><img id=\"uimg\">";
     }else echo "<p class=\"err\">file not found</p><img src=\"$myimage\" id=\"uimg\">";
    break;
     case "create": if(!is_dir($filename)) echo mkdir ($filename); break;
     case "rename":$newname = isset($_GET["newname"]) && $_GET["newname"]!="" ? $_GET["newname"] : "";
        $newnameabs = $parentDirAbs."/$newname";
        echo rename($filename,$newnameabs); break;
     case "delete": if(is_file($filename)) echo unlink($filename) == true ? 1 : 0;
         if(is_dir($filename)){
            $cont = delDirRec($filename);
            echo rmdir($filename) == true ? 1 : 0;
         }break;
     case "move":if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'move') {
    $itemPath = $safeBaseDirAbs.$_POST['itemPath'];
    $targetPath = $filename;

    if (isset($itemPath) && isset($targetPath)) {
        $newPath = $targetPath . '/' . basename($itemPath); // Construct the new path

        if (rename($itemPath, $newPath)) {
            echo json_encode(['status' => 'success', 'message' => 'Item moved successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to move item.'.$itemPath .'to '.$newPath.'']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing itemPath or targetPath.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
} break;
 }
 die();
}
$upload_dir = $pathToScan;
if(strtolower($_SERVER['REQUEST_METHOD']) != 'post'){
	exit_status(0,'Error! Wrong HTTP method!');
}
$path = isset($_POST["uPath"]) ? $_POST["uPath"] : $editorBase;
if(isset($_FILES)){
    $pic = isset($_FILES['myFile']) ? $_FILES['myFile'] : exit_status(0,'Error! file too big');
    $a = false;
for($i = 0 ;$i<=count($pic["name"])-1;$i++){
    $handle = new \Verot\Upload\Upload($pic['tmp_name'][$i]);
 //   $handle->allowed = "image/*";
  if ($handle->uploaded) {
      $a_pic = explode(".",$pic['name'][$i]);
      array_pop($a_pic);
      $pname=implode(".",$a_pic);
      $handle->file_new_name_body   = $pname;
      if(str_contains($handle->file_src_mime,"image")){
      $handle->preserve_transparency = TRUE;
    //  $handle->image_convert = "webp";	
    //  $handle->file_src_mime = "image/webp";
    //  $handle->file_src_name_ext = "webp";
      $handle->image_auto_rotate = true;
    //  $handle->image_resize         = true;
    //  $handle->image_x              = $handle->image_src_x > 500 ? 500 : $handle->image_src_x ;
    //  $handle->image_ratio_y        = true;
      }
      
      $handle->process($upload_dir);
  }
      if ($handle->processed) { 
           $a= true;
           $handle->clean();
      }else{exit_status(0,$handle->error); $handle->clean();}
    //for($i = 0 ;$i<=count($pic["name"])-1;$i++){
	//if(move_uploaded_file($pic['tmp_name'][$i], $upload_dir.'/'.$pic['name'][$i])){
       //    $a = true;
	}
    //}


    if($a) exit_status($i,'Ok');
        else {exit_status(0,$handle->error);
        error_log($handle->error);
        }
}

// Helper functions
function exit_status($code,$str){
  global $path,$pic;
    echo json_encode(array('success'=>$code,'message'=>$str,'path'=>$path."/",'pics'=>$pic["name"]));
        exit;
}

function get_extension($file_name){
	$ext = explode('.', $file_name);
	$ext = array_pop($ext);
	return strtolower($ext);
}

function delDirRec($path){
      try{
        $iterator = new DirectoryIterator($path);
        foreach ( $iterator as $fileinfo ) {
          if($fileinfo->isDot())continue;
          if($fileinfo->isDir()){
            if(delDirRec($fileinfo->getPathname()))
              @rmdir($fileinfo->getPathname());
          }
          if($fileinfo->isFile()){
            @unlink($fileinfo->getPathname());
          }
        }
      } catch ( Exception $e ){
         // write log
         return false;
      }
      return true;
    }

?>