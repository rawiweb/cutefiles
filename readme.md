Cutefiles is a HTML filebrowser written with use of HTML, css, Php, and Vanilla Javascript.

It can be used to Upload Files in batches, delete files and folders as well as create folders.
It has drag and drop support to move items from one place to another.

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

