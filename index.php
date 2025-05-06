<?php
session_start();
if (!isset($_SESSION['admin']) || $_SESSION['admin']!=1) die('');
?>
<!--use js/script.js-->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>Cute file browser</title>
<link href="assets/css/styles.css" rel="stylesheet">
<link href="assets/css/slideshow.css" rel="stylesheet">
<link href="assets/css/croptool.css" rel="stylesheet">
</head>
<body>
<div class="filemanager">
	<div class="search">
	<input type="search" placeholder="Find a file, hit enter" />
	</div>
   <ul id="upl">
       <li><a title="Home of the files" href="./"><svg width="80" height="80" fill="#a0d4e4" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 547.596 547.596" xml:space="preserve" stroke="#a0d4e4"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M540.76,254.788L294.506,38.216c-11.475-10.098-30.064-10.098-41.386,0L6.943,254.788 c-11.475,10.098-8.415,18.284,6.885,18.284h75.964v221.773c0,12.087,9.945,22.108,22.108,22.108h92.947V371.067 c0-12.087,9.945-22.108,22.109-22.108h93.865c12.239,0,22.108,9.792,22.108,22.108v145.886h92.947 c12.24,0,22.108-9.945,22.108-22.108v-221.85h75.965C549.021,272.995,552.081,264.886,540.76,254.788z"></path> </g> </g></svg>
            </a>
       </li>
        <li>
          <div class="container" role="main">
             <form title="upload new files" method="post" action="" enctype="multipart/form-data" novalidate class="box" id="upload">
               <div class="box__input">
               <input type="file" name="myFile[]" id="file" class="box__file" data-multiple-caption="{count} files selected" multiple />
               <input type="hidden" name="uPath" id="uPath" class="box__path" value ="">
               <label for="file" ><span class="box__dragndrop"></span></label>
               <div class="box__uploading"><div id="prog"><span id="progress"></span><div style="width:1%"></div><br><span class="name cancel">cancel</span></div></div>
               <button type="submit" class="box__button">Upload</button>
               <div class="box__success"><a href="#" class="box__restart" role="button"><span class="name">Upload more?</span></a></div>
               <div class="box__error"><span></span><br><a href="#" class="box__restart" role="button"><span class="name">Try again!</span></a></div>
               </div>
             </form>
              <svg width="80" height="80" fill="#a0d4e4" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113.79 122.88"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><title>upload files click to choose or drop files here</title><path class="cls-1" d="M65.59,67.32h38.82a9.41,9.41,0,0,1,9.38,9.38v36.79a9.41,9.41,0,0,1-9.38,9.39H65.59a9.41,9.41,0,0,1-9.38-9.39V76.7a9.41,9.41,0,0,1,9.38-9.38ZM60,11.56,79.73,30.07H60V11.56ZM20.87,54a2.14,2.14,0,0,0-2,2.23,2.12,2.12,0,0,0,2,2.23H59.65a2.14,2.14,0,0,0,2-2.23,2.1,2.1,0,0,0-2-2.23Zm0,16a2.14,2.14,0,0,0-2,2.23,2.1,2.1,0,0,0,2,2.22H45.67V70Zm0,16a2.14,2.14,0,0,0-2,2.23,2.1,2.1,0,0,0,2,2.23H45.67V85.91Zm0-47.89a2.14,2.14,0,0,0-2,2.23,2.11,2.11,0,0,0,2,2.23H43.81a2.14,2.14,0,0,0,2-2.23,2.11,2.11,0,0,0-2-2.23Zm0-16a2.14,2.14,0,0,0-2,2.23,2.1,2.1,0,0,0,2,2.23h12.6a2.14,2.14,0,0,0,2-2.23,2.11,2.11,0,0,0-2-2.23ZM90.72,32.72a3.28,3.28,0,0,0-2.39-3.17L59.23,1.21A3.27,3.27,0,0,0,56.69,0H5.91A5.91,5.91,0,0,0,0,5.91V107.12A5.91,5.91,0,0,0,5.91,113H45.76v-6.6H6.61V6.57H53.37V33.36a3.32,3.32,0,0,0,3.32,3.31H84.12V58.29h6.6V32.72Zm6.45,65.1a2.4,2.4,0,0,0,2.06-1c1.08-1.62-.4-3.22-1.42-4.35-2.91-3.19-9.49-9-10.92-10.66a2.37,2.37,0,0,0-3.72,0c-1.49,1.73-8.43,7.86-11.19,11-1,1.08-2.15,2.56-1.15,4a2.42,2.42,0,0,0,2.07,1h5.17v9.27A2.92,2.92,0,0,0,81,110H89.1A2.92,2.92,0,0,0,92,107.09V97.82Z"/></svg>
         </div>
        </li>
        <li><a id="create" href="#" title="new folder"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" width="80px" height="80px" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="SVGCleanerId_0" style="fill:#a0d4e4;" d="M183.295,123.586H55.05c-6.687,0-12.801-3.778-15.791-9.76l-12.776-25.55 l12.776-25.55c2.99-5.982,9.103-9.76,15.791-9.76h128.246c6.687,0,12.801,3.778,15.791,9.76l12.775,25.55l-12.776,25.55 C196.096,119.808,189.983,123.586,183.295,123.586z"></path> <g> <path id="SVGCleanerId_0_1_" style="fill:#a0d4e4;" d="M183.295,123.586H55.05c-6.687,0-12.801-3.778-15.791-9.76l-12.776-25.55 l12.776-25.55c2.99-5.982,9.103-9.76,15.791-9.76h128.246c6.687,0,12.801,3.778,15.791,9.76l12.775,25.55l-12.776,25.55 C196.096,119.808,189.983,123.586,183.295,123.586z"></path> </g> <path style="fill:#EFF2FA;" d="M485.517,70.621H26.483c-4.875,0-8.828,3.953-8.828,8.828v44.138h476.69V79.448 C494.345,74.573,490.392,70.621,485.517,70.621z"></path> <rect x="17.655" y="105.931" style="fill:#E1E6F2;" width="476.69" height="17.655"></rect> <path style="fill:#a0d4e4;" d="M494.345,88.276H217.318c-3.343,0-6.4,1.889-7.895,4.879l-10.336,20.671 c-2.99,5.982-9.105,9.76-15.791,9.76H55.05c-6.687,0-12.801-3.778-15.791-9.76L28.922,93.155c-1.495-2.99-4.552-4.879-7.895-4.879 h-3.372C7.904,88.276,0,96.18,0,105.931v335.448c0,9.751,7.904,17.655,17.655,17.655h476.69c9.751,0,17.655-7.904,17.655-17.655 V105.931C512,96.18,504.096,88.276,494.345,88.276z"></path> <path style="fill:#a0d4e4;" d="M485.517,441.379H26.483c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828 h459.034c4.875,0,8.828,3.953,8.828,8.828l0,0C494.345,437.427,490.392,441.379,485.517,441.379z"></path> <path style="fill:#EFF2FA;" d="M326.621,220.69h132.414c4.875,0,8.828-3.953,8.828-8.828v-70.621c0-4.875-3.953-8.828-8.828-8.828 H326.621c-4.875,0-8.828,3.953-8.828,8.828v70.621C317.793,216.737,321.746,220.69,326.621,220.69z"></path> <path style="fill:#C7CFE2;" d="M441.379,167.724h-97.103c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828 h97.103c4.875,0,8.828,3.953,8.828,8.828l0,0C450.207,163.772,446.254,167.724,441.379,167.724z"></path> <path style="fill:#D7DEED;" d="M441.379,203.034h-97.103c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828 h97.103c4.875,0,8.828,3.953,8.828,8.828l0,0C450.207,199.082,446.254,203.034,441.379,203.034z"></path> </g></svg></a></li>
       <li><a id="slideShow" title="start slideshow" href="#"><svg version="1.1" id="slideShowIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" width="80px" height="80px" fill="#EEEEEE" stroke="#EEEEEE"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#EEEEE" stroke-width="2.2399999999999998"> <style type="text/css"> .st0{fill:none;stroke:#a0d4e4;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> <polyline class="st0" points="25,11 27,13 25,15 "></polyline> <polyline class="st0" points="7,11 5,13 7,15 "></polyline> <path class="st0" d="M29,23H3c-1.1,0-2-0.9-2-2V5c0-1.1,0.9-2,2-2h26c1.1,0,2,0.9,2,2v16C31,22.1,30.1,23,29,23z"></path> <circle class="st0" cx="16" cy="28" r="1"></circle> <circle class="st0" cx="10" cy="28" r="1"></circle> <circle class="st0" cx="22" cy="28" r="1"></circle> </g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:none;stroke:#a0d4e4;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> <polyline class="st0" points="25,11 27,13 25,15 "></polyline> <polyline class="st0" points="7,11 5,13 7,15 "></polyline> <path class="st0" d="M29,23H3c-1.1,0-2-0.9-2-2V5c0-1.1,0.9-2,2-2h26c1.1,0,2,0.9,2,2v16C31,22.1,30.1,23,29,23z"></path> <circle class="st0" cx="16" cy="28" r="1"></circle> <circle class="st0" cx="10" cy="28" r="1"></circle> <circle class="st0" cx="22" cy="28" r="1"></circle> </g></svg>
           </a></li>
           
   </ul><div id="uploadstats" onclick="this.style.display='none'"></div>
        <div class="breadcrumbs"></div>
        <div class="stats"></div>
	<div class="dataContainer"></div>
	</div>
       <!--<script src="assets/js/ckedit.js"></script> CKEditor 5 plugin-->
       <script src="assets/js/script.js?v=1"></script>
       <script src="assets/js/upload.js"></script>
<script>(function(e,t,n){var r=e.querySelectorAll("html")[0];r.className=r.className.replace(/(^|\s)no-js(\s|$)/,"$1js$2")})(document,window,0);</script>
<script>
(function(document, window, index) {
  'use strict';
<?php require __DIR__."/maxbytes.php";?>
if(!fileUploads){
   maxBytes = 0;
   maxFiles=0;
}
const max = document.createElement('input');
max.type = "hidden";
max.id = "maxBytes";
max.value = maxBytes;
document.forms.upload.appendChild(max);
const maxFiles = document.createElement('input');
maxFiles.type = "hidden";
maxFiles.id = "maxFiles";
maxFiles.value = maxFileUploads;
document.forms.upload.appendChild(maxFiles);

}(document, window, 0));
</script>
<footer><span>©2025 rawiweb</span></footer>
</body>
</html>
