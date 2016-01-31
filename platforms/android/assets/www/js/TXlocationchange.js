function changeTXLocation(lat, lng) {
	qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 3, function(res) {
		wd = res[0];
		jd = res[1];
		getAddress(jd, wd);
	});
}

function getAddress(jd, wd) {
	$.jsonP({
		url: "http://apis.map.qq.com/ws/geocoder/v1/?location=" + wd + "," + jd + "&key=BC2BZ-XMLR3-A4V3Z-3CT7G-GMAYE-X4FBX&get_poi=0",
		success: function(json) {
			if (json.status == 0) {
				changeDone(json.result.location.lng, json.result.location.lat, json.result.address);
			} else {
				changeErrer();
			}
		},
		Error: function(json) {
			popup.hide();
			alert('Error');
		}
	});
}