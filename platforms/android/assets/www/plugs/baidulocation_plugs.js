//, location, notes, startDate, endDate
var BaiduLocationPlugin = {
	createEvent: function(title,successCallback, errorCallback) {
		var type = null;
	    if (title == "定位") {
			type = "getCurrentPosition";
		} else {
			type = "stop";
		}
        cordova.exec(
            successCallback, // success callback function
            errorCallback, // error callback function
            'BaiduLocation', // mapped to our native Java class called "CalendarPlugin"
            type, // with this action name                
			[{
				"title":title
			}]
        );
    }
}