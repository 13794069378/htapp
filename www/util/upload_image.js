/**
 * �ϴ�ͼƬ
 * author:�¹���
 * date:2019-09-15
 * @param {Object} _url ��������ַ
 * @param {Object} _parmas ����
 */
function Upload(_url, _parmas) {
	this.url = _url;
	this.parmas = _parmas;
	
	this.uploadImage = function(imageURI) {
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + ".jpg";
		//�����ͼƬ��ʽ������image/jpeg�������ļ���ʽ�Ϲ�����API
		options.mimeType = "image/jpeg";
		options.chunkedMode = false;
		options.params = this.parmas;
		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(_url), win, fail, options);
	}
}

//function win(r) {
	//console.log("Code = " + r.responseCode);
	//console.log("Response = " + r.response);
	//console.log("Sent = " + r.bytesSent);
	//alert("Code:"+r.responseCode+"����"+r.response+"sent:"+r.bytesSent);
	//alert("Success");
//}

//function fail(error) {
    //alert("Fail");
	//alert("An error has occurred: Code = " + error.code);
	//console.log("upload error source " + error.source);
	//console.log("upload error target " + error.target);
//}