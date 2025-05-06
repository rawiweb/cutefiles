          	//ckeditor integration
     var getUrlParam = function( paramName ) {
            var reParam = new RegExp( '(?:[\?&]|&)' + paramName + '=([^&]+)', 'i' );
            var match = window.location.search.match( reParam );

            return ( match && match.length > 1 ) ? match[1] : null;
        }
        // Simulate user action of selecting a file to be returned to CKEditor.
    var returnFileUrl = function () {

            var funcNum = getUrlParam( 'CKEditorFuncNum' );
            var fileUrl = arguments[0];
            if(funcNum){
            window.opener.CKEDITOR.tools.callFunction( funcNum, fileUrl );
            window.close();
           }
        }

