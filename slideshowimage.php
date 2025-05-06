<?php
require __DIR__."/conf.php";
$image = $pathToScan;
$maxsize = 100;
$maxwidth = isset($_GET["w"]) && is_numeric($_GET["w"]) ? $_GET["w"] : 100;
$maxheight = isset($_GET["h"]) && is_numeric($_GET["h"]) ? $_GET["h"] : 100;

function get_size($image){
  $ratio=(imagesx($image)/imagesy($image));
   $res=array('x'=>imagesx($image),'y'=>imagesy($image),'rat'=>$ratio);
   return $res;
}
$img = null;
if(is_file($image)){
$image_type = mime_content_type($image);
$img=@imagecreatefromstring(file_get_contents($image));
}
if(!$img) {
    header('Content-Type: image/avif');
   echo base64_decode('AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAPBtZXRhAAAAAAAAAChoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAbGliYXZpZgAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAEUAAAAFQAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABoaXBycAAAAElpcGNvAAAAFGlzcGUAAAAAAAAAAQAAAAEAAAAOcGl4aQAAAAABCAAAAAxhdjFDgQAcAAAAABNjb2xybmNseAABAAEAAQAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB1tZGF0EgAKBxgADlgICAkyCB/xgAAghQm0');
   exit();
}
if($image_type!="" && !is_null($image_type )){
  $a_xy=get_size($img);
  if($a_xy['rat']>1){ //landscape
	 $nx=$maxwidth;
         $ny=(int) $nx/$a_xy['rat'] ;
         while($ny>$maxheight){$ny= --$nx/$a_xy['rat'] ;}
  }else{
    $ny=$maxheight;
  	$nx=(int) $maxheight * $a_xy['rat'];
  }

// if ($image_type=="image/gif" || $image_type=="image/x-png" || $image_type=="image/png" || $image_type=="image/aviv"){
//	$colorTransparent = imagecolortransparent($img);
//	$nimg = imagecreate($nx, $ny);
//	imagefill($nimg, 0, 0, $colorTransparent);
//	imagepalettecopy($nimg, $img);
//	imagecolortransparent($nimg, $colorTransparent);
//}
//else 
    $nimg = ImageCreateTrueColor($nx,$ny);
  imagecopyresized($nimg,$img,0, 0, 0, 0, $nx, $ny, $a_xy['x'], $a_xy['y']);
 // $line_color = ImageColorAllocate ($nimg, 0, 0, 0);
 // imagerectangle ( $nimg, 0, 0, $nx-1, $ny-1, $line_color );
  header ("Content-type: $image_type");

  switch ($image_type){
   case "image/gif": {imagegif($nimg);break;}
   case "image/jpeg": {imagejpeg($nimg);break;}
   case "image/pjpeg": {imagejpeg($nimg);break;}
   case "image/png": {imagepng($nimg);break;}
   case "image/x-png": {imagepng($nimg);break;}
   case "image/webp": {imagewebp($nimg);break;}
   case "image/avif": {imageavif($nimg);break;}
  }

}?>