function camera(_imgid){
	this.imgid=_imgid;
	this.destinationType= navigator.camera.DestinationType;
	 //����
       this.takepicture=function() {
            navigator.camera.getPicture(this.onPhotoDataSuccess, onFail, {
                quality: 30,
				targetWidth : 1024,
				targetHeight : 1024,
                destinationType: this.destinationType.FILE_URI
            });
        }
        this.onPhotoDataSuccess=function (imageData) {
            // Uncomment to view the base64-encoded image data
            // console.log(imageData);
            // Get image handle
            //
            var smallImage = document.getElementById(_imgid);
            // Unhide image elements
            //
            smallImage.style.display = 'block';
            // Show the captured photo
            // The inline CSS rules are used to resize the image
            //
			$('#' + _imgid).attr('take', 'true');
            smallImage.src = imageData;
        }

       
}

 function onFail(message) {
 	alert(message);
			//alert('����ʧ��!����������!');
            //alert('Failed because: ' + message);
        }