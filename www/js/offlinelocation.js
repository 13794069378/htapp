/** 获取定位地址
* lat 纬度
* lng 经度
**/
function changeBDLocation(lat, lng) {
	$.jsonP({
        url: "http://api.map.baidu.com/geocoder/v2/?ak=sKj7KY1QupB5xLhT1hl3zkkI&location=" + lat + "," + lng + "&output=json&pois=0",
        success: function (json) {
			if (json.status == 0) {
				$("#arrivedaddress").html(json.result.formatted_address, true);
				$("#arrivedloading").hide();
				$("#arrivedbox").show();
			} else {
				showErrorPopup("提示", "定位失效");
				$("#arrivedloading").hide();
			}
        },
        Error: function () {
            alert('Error');
        }
    });
}