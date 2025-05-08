# Cutefiles HTML filebrowser with CKEditor 4 integration and can stand alone 
is a HTML filebrowser written with use of HTML, css, Php, and Vanilla Javascript.

![Screenshot From 2025-05-07 12-25-47](https://github.com/user-attachments/assets/fb0a364e-d6a3-414a-92b6-bd3291544722)


It can be used to Upload Files in batches, delete files and folders as well as create folders.
It has multiselect drag and drop support to move items from one place to another.

Supports almost all image formats webp and avif included.
HTML5 Video and Audio tags will be applied as well if valid sources are found.

It comes with a basic slideshow to view images and it has basic image manipulation capabilities such as
rotation of images and cropping of images. More to be added.

I wrote this a few Years ago when KFM Fileeditor didn't work anymore, therefore
it has CKEditor 4 support and will integrate there as filemanager and image selector.
Don't laught, I still have a few projects which uses CKEditor 4.

Requirements:
Well a linux webserver (tested on Nginx with php 8.4)
Not sure it'll work on windows though, probably there are path issues.

For Image manipulation and upload it uses the verod upload.class

Getting started:
Download the code or clone this repo
Look into config.php to set the /ROOT_OF_THE_FILES directory
and make sure you have a login mechanism that your files are your files unless you want them public.

