/** 
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 */

cordova.define("cordova/plugins/barcodescanner",
	function(require, exports, module) {
		var exec = require("cordova/exec");
		var BarcodeScanner = function() {
			/**
			 * Barcode format constants, defined in ZXing library.
			 *
			 * @type Object
			 */
			this.format = {
				"all_1D": 61918,
				"aztec": 1,
				"codabar": 2,
				"code_128": 16,
				"code_39": 4,
				"code_93": 8,
				"data_MATRIX": 32,
				"ean_13": 128,
				"ean_8": 64,
				"itf": 256,
				"maxicode": 512,
				"msi": 131072,
				"pdf_417": 1024,
				"plessey": 262144,
				"qr_CODE": 2048,
				"rss_14": 4096,
				"rss_EXPANDED": 8192,
				"upc_A": 16384,
				"upc_E": 32768,
				"upc_EAN_EXTENSION": 65536
			};

		};

		//-------------------------------------------------------------------  
		BarcodeScanner.prototype.scan = function(successCallback, errorCallback) {
			if (errorCallback == null) {
				errorCallback = function() {}
			}

			if (typeof errorCallback != "function") {
				console.log("BarcodeScanner.scan failure: failure parameter not a function");
				return
			}

			if (typeof successCallback != "function") {
				console.log("BarcodeScanner.scan failure: success callback parameter must be a function");
				return
			}

			exec(successCallback, errorCallback, 'BarcodeScanner', 'scan', []);
		};

		//-------------------------------------------------------------------  
		BarcodeScanner.prototype.encode = function(type, data, successCallback, errorCallback, options) {
			if (errorCallback == null) {
				errorCallback = function() {}
			}

			if (typeof errorCallback != "function") {
				console.log("BarcodeScanner.scan failure: failure parameter not a function");
				return
			}

			if (typeof successCallback != "function") {
				console.log("BarcodeScanner.scan failure: success callback parameter must be a function");
				return
			}

			exec(successCallback, errorCallback, 'BarcodeScanner', 'encode', [{
				"type": type,
				"data": data,
				"options": options
			}]);
		};

		var barcodeScanner = new BarcodeScanner();
		module.exports = barcodeScanner;

	});

cordova.define("cordova/plugin/BarcodeConstants",
	function(require, exports, module) {
		module.exports = {
			Encode: {
				TEXT_TYPE: "TEXT_TYPE",
				EMAIL_TYPE: "EMAIL_TYPE",
				PHONE_TYPE: "PHONE_TYPE",
				SMS_TYPE: "SMS_TYPE",
			}
		};
	});
//-------------------------------------------------------------------  
var BarcodeScanner = cordova.require('cordova/plugin/BarcodeConstants');

if (!window.plugins) {
	window.plugins = {};
}
if (!window.plugins.barcodeScanner) {
	window.plugins.barcodeScanner = cordova.require("cordova/plugins/barcodescanner");
}


//------------------------------------------------------------------- 
var scanCode = function() {
	window.plugins.barcodeScanner.scan(
		function(result) {
			sendRQCode(result.text);
			$.ui.loadContent("#arrived", false, false, "up");
		}, function(error) {
			alert("Scan failed: " + error);
		});
}
var encodeText = function() {

	window.plugins.barcodeScanner.encode(
		BarcodeScanner.Encode.TEXT_TYPE,
		"http://www.mobiledevelopersolutions.com",
		function(success) {
			alert("Encode success: " + success);
		}, function(fail) {
			alert("Encoding failed: " + fail);
		});
}
var encodeEmail = function() {

	window.plugins.barcodeScanner.encode(
		BarcodeScanner.Encode.EMAIL_TYPE,
		"a.name@gmail.com", function(success) {
			alert("Encode success: " + success);
		}, function(fail) {
			alert("Encoding failed: " + fail);
		});
}
var encodePhone = function() {

	window.plugins.barcodeScanner.encode(
		BarcodeScanner.Encode.PHONE_TYPE,
		"555-227-5283", function(success) {
			alert("Encode success: " + success);
		}, function(fail) {
			alert("Encoding failed: " + fail);
		});
}
var encodeSMS = function() {

	window.plugins.barcodeScanner.encode(
		BarcodeScanner.Encode.SMS_TYPE,
		"An important message for someone.", function(success) {
			alert("Encode success: " + success);
		}, function(fail) {
			alert("Encoding failed: " + fail);
		});
}

function checkQRcode() {
	$("#rqa").removeAttr("onclick");
	/*sendRQCode("80969182");
	$.ui.loadContent("#arrived", false, false, "up");*/
	scanCode();
}

function checkGoodsLists() {
    $("#cgl").removeAttr("onclick");
	window.plugins.barcodeScanner.scan(
		function(result) {
            $("#cgl").attr("onclick", "checkGoodsLists();");
			if (!parten.test(result.text)) {
				checkgoodshistory = false;
				setId(result.text);
				$.ui.loadContent('#goodsinfo', false, false, 'up');
			}
		}, function(error) {
            $("#cgl").attr("onclick", "checkGoodsLists();");
			alert("Scan failed: " + error);
		});
}