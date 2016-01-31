/**
 * 信息保存和获取
 **/

/* 设置新闻ID */
/**
 * id: 新闻ID
 **/
function setId(id, type) {
	setSession("keyid", id);
}

function styp(type) {
	setSession("keytype", type);
}

/* 设置本地存储 */
/**
 * name: 保存的名称
 * value: 保存的信息
 **/
function setLocal(name, value) {
	localStorage.setItem(name, value);
}

/* 获取本地存储 */
/**
 * name: 提取的名称
 **/
function getLocal(name) {
	return localStorage.getItem(name);
}

/* 删除本地存储 */
/**
 * name: 删除的名称
 **/
function delLocal(name) {
	localStorage.removeItem(name);
}

/* 设置sessionStorage */
/**
 * name: 保存的名称
 * id: 保存的信息
 **/
function setSession(name, id) {
	sessionStorage.setItem(name, id);
}

/* 获取sessionStorage */
/**
 * name: 提取的名称
 **/
function getSession(name) {
	return sessionStorage.getItem(name);
}

/* 删除sessionStorage */
/**
 * name: 删除的名称
 **/
function delSession(name) {
	sessionStorage.removeItem(name);
}

/* 写cookies */
/**
 * name: 保存的名称
 * value: 保存的信息
 * date: 保存的天数
 **/
function setCookie(name, value, date) {
	var Days = date;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/* 读取cookies */
/**
 * name: 提取的名称
 **/
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]); /* 进行中文转换 */
	} else {
		return null;
	}
}

/* 删除cookies */
/**
 * name: 删除的名称
 **/
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null) {
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}

//当前日期加时间(如:2009-06-12 12:00:00) kwb
function CurentTime() {
	var now = new Date();

	var year = now.getFullYear(); //年
	var month = now.getMonth() + 1; //月
	var day = now.getDate(); //日

	var hh = now.getHours(); //时
	var mm = now.getMinutes(); //分
	var ss = now.getSeconds(); //秒

	var clock = year + "-";

	if (month < 10)
		clock += "0";

	clock += month + "-";

	if (day < 10)
		clock += "0";

	clock += day + " ";

	if (hh < 10)
		clock += "0";

	clock += hh + ":";
	if (mm < 10) clock += '0';
	clock += mm + ":";
	if (ss < 10) clock += '0';
	clock += ss;
	return (clock);
}


//新增时候清除session kwb
function clearId() {
	setSession("keyid", "");
}

/* 所有为空格或空正则式 */
var parten = /^\s*$/;

/* 新增或编辑考勤目标 kwb*/
function loadWorkPlaceCollectEdit(name) {
	$('#workbox').hide();
	$('#workPlaceCollectloading').show();
	panelInputCSS("workbox");
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'GET',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			pid: getSession('keyid'),
			userId: getSession('uid')
		},
		success: function(json) {
			if (parseInt(json.lockCount) > 0) {
				$('#workPlaceCollectbutton').hide();
			} else {
				$('#workPlaceCollectbutton').show();
			}
			if (json.status == -1) {
				$('#workbox').hide();
				$('#workPlaceCollectloading').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#workbox').hide();
				$('#workPlaceCollectloading').hide();
				showErrorPopup('提示', '信息有误');
			} else if (json.status == 1) { /* 编辑 */
				document.getElementById("workPlaceCollectUser").innerHTML = json.form.userName;
				document.getElementById("workPlaceCollectX").innerHTML = json.form.targetX;
				document.getElementById("workPlaceCollectY").innerHTML = json.form.targetY;
				document.getElementById("workPlaceCollectAddress").innerHTML = json.form.targetAddress;
				$('#workPlaceCollectName').val(json.form.targetName);
				//$("#workPlaceCollectName").attr('disabled', true);
				$('#workPlaceCollectloading').hide();
				$('#workbox').show();
			} else if (json.status == 2) { /* 新增 */
				document.getElementById("workPlaceCollectUser").innerHTML = json.form.userName;
				$('#workPlaceCollectName').val("");
				//$("#workPlaceCollectName").attr('disabled', false);
				//document.getElementById("workPlaceCollectX").innerHTML = "33";
				//document.getElementById("workPlaceCollectY").innerHTML = "45";
				//document.getElementById("workPlaceCollectAddress").innerHTML = "定位地址";
				if (systemname == "iOS") {
					locationtype = 2;
					getlocationtest();
				} else {
					locationWorkPlaceCollect();
				}
			}
		},
		Error: function() {
			$('#workPlaceCollectloading').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#workPlaceCollectloading').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 考勤目标定位 */
function locationWorkPlaceCollect() {
	var success = function(p) {
		popup.hide();
		if (p.addr == undefined) {
			showLocationError(1);
		} else {
			$('#workPlaceCollectY').html(p.lontitude, true);
			$('#workPlaceCollectX').html(p.latitude, true);
			$('#workPlaceCollectAddress').html(p.addr, true);
		}
		$('#workPlaceCollectloading').hide();
		$('#workbox').show();
	};
	var error = function(message) {
		$('#workPlaceCollectloading').hide();
		$('#workbox').show();
		alert(message);
	};
	if (isBDlocation) {
		BaiduLocationPlugin.createEvent("定位", success, error);
	} else {
		TXLocationPlugin.createEvent("定位", success, error);
	}
}

//考勤目标保存方法 kwb

function workPlaceCollectSave(name) {
	var workPlaceCollectName = $('#workPlaceCollectName').val();
	if (parten.test(workPlaceCollectName)) {
		showErrorPopup('提示', '请先填写目标名称!');
	} else if (parten.test($('#workPlaceCollectX').html()) || parten.test($('#workPlaceCollectY').html()) || parten.test($('#workPlaceCollectAddress').html())) {
		showErrorPopup('提示', '定位失败!');
	} else {
		showMessage('保存中');
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
			cache: false,
			timeout: 20000, //超时时间设置，单位毫秒
			dataType: 'jsonp',
			data: {
				pid: getSession('keyid'),
				userId: getSession('uid'),
				targetAddress: encodeURI($('#workPlaceCollectAddress').html()),
				targetX: $('#workPlaceCollectX').html(),
				targetY: $('#workPlaceCollectY').html(),
				targetName: encodeURI(workPlaceCollectName),
				remark: ""
			},
			success: function(json) {
				popup.hide();
				if (json.status == -1) {
					showMessage('账号已失效');
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				} else if (json.status == 0) {
					Toast("保存失败", 2000);
				} else if (json.status == 1) {
					Toast("保存成功", 2000);
					$.ui.goBack();
				}
			},
			complete: function(response, status) {
				if (status == "timeout") {
					ajaxdata.abort();
					popup.hide();
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
	}
}


//考勤目标审核方法 kwb
function workPlaceCollectApprove(name) {
	showMessage('提交中');
	$.jsonP({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do?userId=" + getSession('uid') + "&callback=?",
		success: function(json) {
			popup.hide();
			if (json.status == -1) {
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#workplacecheckok').show();
				$('#workplacedjbutton').show();
				$('#workPlaceCollectbutton').show();
				$('#workplacecheckcancel').hide();
				Toast("审核失败", 2000);
			} else if (json.status == 1) {
				$('#workplacecheckok').hide();
				$('#workplacedjbutton').hide();
				$('#workPlaceCollectbutton').hide();
				$('#workplacecheckcancel').show();
				Toast("审核成功", 2000);
				//$.ui.goBack();
				//$.ui.loadContent("#gongneng", false, false, "up");
			}
		},
		Error: function() {
			popup.hide();
			alert('Error');
		}
	});

}

//考勤目标取消审核方法 kwb
function workPlaceCollectCancelApprove(name) {
	showMessage('提交中');
	$.jsonP({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do?userId=" + getSession('uid') + "&callback=?",
		success: function(json) {
			popup.hide();
			if (json.status == -1) {
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#workplacecheckok').hide();
				$('#workplacedjbutton').hide();
				$('#workPlaceCollectbutton').hide();
				$('#workplacecheckcancel').show();
				Toast("取消审核失败", 2000);
			} else if (json.status == 1) {
				$('#workplacecheckok').show();
				$('#workplacedjbutton').show();
				$('#workPlaceCollectbutton').show();
				$('#workplacecheckcancel').hide();
				Toast("取消审核成功", 2000);
				//$.ui.goBack();
				//$.ui.loadContent("#gongneng", false, false, "up");
			}
		},
		Error: function() {
			popup.hide();
			alert('Error');
		}
	});
}

/* 新增或编辑考勤记录 kwb*/
var scoreaddressobj = '';

function loadWorkLoginEdit(name) {
	$('#workloginbox').hide();
	$('#workLoginloading').show();
	panelInputCSS("workloginbox");
	changeTragetLocation = "0";
	seriveChange = "1";
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'GET',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			pid: getSession('keyid'),
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.targetList != undefined) {
				scoreaddressobj = json.targetList;
			}
			if (json.status == -1) {
				$('#workloginbox').hide();
				$('#workLoginloading').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#workloginbox').hide();
				$('#workLoginloading').hide();
				showErrorPopup('提示', '信息有误');
			} else if (json.status == 1) { /* 浏览 */
				panelCheckCSS("workloginbox");
				document.getElementById("workLoginUserName").innerHTML = json.form.userName;
				document.getElementById("workLoginTime").innerHTML = json.form.attenceTime;
				var obj = $("#workLoginType");
				if (json.form.attenceType) {
					obj.val('下班');
					obj.attr('textid', 2);
				} else {
					obj.val('上班');
					obj.attr('textid', 1);
				}
				//结果是否匹配
				var ispipei;
				if (json.form.attenceReslut == false) {
					ispipei = "否";
				} else {
					ispipei = "是";
				}
				//document.getElementById("workLoginScoreAddress").innerHTML = json.form.targetAddress;
				document.getElementById("workLoginX").innerHTML = json.form.attenceX;
				document.getElementById("workLoginY").innerHTML = json.form.attenceY;
				document.getElementById("workLoginAddress").innerHTML = json.form.attenceAddress;
				document.getElementById("workLoginResult").innerHTML = ispipei;
				//document.getElementById("workLoginScoreAddress").innerHTML = ""; //清空旧考勤目标列表
				for (var i = 0; i < json.targetList.length; i++) {
					if (json.form.attenceTargetId == json.targetList[i].id) {
						$('#workLoginScoreAddress').attr('textid', json.form.attenceTargetId);
						$('#workLoginScoreAddress').attr('targetX', json.targetList[i].targetX);
						$('#workLoginScoreAddress').attr('targetY', json.targetList[i].targetY);
						$('#workLoginScoreAddress').attr('targetAddress', json.targetList[i].targetAddress);
						$('#workLoginScoreAddress').attr('isCheck', json.targetList[i].isCheck);
						$('#workLoginScoreAddress').val(json.targetList[i].targetName);
					}
				}
				$('#workLoginScoreAddress').removeAttr('onclick');
				//加载新考勤目标列表
				/*var content = '<option>请选择</option>';
                var shopstatus = '';
                for (var i = 0; i < json.targetList.length; i++) {
                    if (json.form.attenceTargetId == json.targetList[i].id) {
                        shopstatus = 'selected';
                    } else {
                        shopstatus = '';
                    }
                    content += '<option value="' + json.targetList[i].id + '" ' + shopstatus + '>' + json.targetList[i].targetName + '</option>';
                }
                $('#workLoginScoreAddress').append(content);
				$('#workLoginScoreAddress').attr("disabled", "true"); //将目标考勤地点设为只读*/
				document.getElementById("workLoginCanSave").style.display = "none"; //隐藏提交按钮
				$('#workLoginType').removeAttr("onclick"); //将考勤类型设为只读
				$('#workLoginloading').hide();
				$('#workloginbox').show();
			} else if (json.status == 2) { /* 新增 */
				document.getElementById("workLoginUserName").innerHTML = json.form.userName;
				document.getElementById("workLoginTime").innerHTML = json.form.loginTime;
				//document.getElementById("workLoginType").options[0].selected = true;
				$('#workLoginType').val('上班');
				$('#workLoginType').attr('textid', 1);
				$('#workLoginType').attr('onclick', "showPopupFont(3, 'workLoginType')");
				//document.getElementById("workLoginScoreAddress").innerHTML = "";
				//document.getElementById("workLoginX").innerHTML = "33";
				//document.getElementById("workLoginY").innerHTML = "44";
				//document.getElementById("workLoginAddress").innerHTML = "定位地址2";
				//document.getElementById("workLoginResult").innerHTML = "";
				//var distance = getFlatternDistance(23.018125, 113.106185, 23.018073, 113.1061).toFixed(2);
				//alert(distance);
				//document.getElementById("workLoginResult").innerHTML = distance; //清空旧考勤目标列表
				document.getElementById("workLoginResult").innerHTML = ""; //清空旧考勤目标列表
				//加载新考勤目标列表
				if (json.targetList.length != 0) {
					$('#workLoginScoreAddress').attr('textid', json.targetList[0].id);
					$('#workLoginScoreAddress').attr('targetX', json.targetList[0].targetX);
					$('#workLoginScoreAddress').attr('targetY', json.targetList[0].targetY);
					$('#workLoginScoreAddress').attr('targetAddress', json.targetList[0].targetAddress);
					$('#workLoginScoreAddress').attr('isCheck', json.targetList[0].isCheck);
					$('#workLoginScoreAddress').val(json.targetList[0].targetName);
					$('#workLoginScoreAddress').attr('onclick', "showPopupWorkLogin(1, 'workLoginScoreAddress')");
				} else {
					showErrorPopup("提示", "请先登记一个考勤目标地点");
					$.ui.goBack();
					return false;
				}
				/*var content = '<option value="">请选择</option>';
				var shopstatus = '';
				for (var i = 0; i < json.targetList.length; i++) {
				    if (json.form.attenceTargetId == json.targetList[i].id) {
				        shopstatus = 'selected';
				    } else {
				        shopstatus = '';
				    }
				    //content += '<option value="' + json.targetList[i].id + '" ' + shopstatus + ' x=' + json.targetList.targetX + ' y=' + json.targetList.targetY + '>' + json.targetList[i].targetName + '</option>';
				    content += "<option value=\"${value}\"  x=\"${x}\" y=\"${y}\">${text}</option>"
				        .replace("${value}", json.targetList[i].id)
				        .replace("${x}", json.targetList[i].targetX)
				        .replace("${y}", json.targetList[i].targetY)
				        .replace("${text}", json.targetList[i].targetName);
				}
				$('#workLoginScoreAddress').append(content);*/
				document.getElementById("workLoginCanSave").style.display = "block"; //显示提交按钮
				//$('#workLoginScoreAddress').removeAttr("disabled"); //取消目标考勤地点设为只读
				//$('#workLoginType').removeAttr("disabled"); //取消考勤类型设为只读
				if (systemname == 'iOS') {
					// ios gps定位和转换
					locationtype = 1;
					getlocationtest();
				} else {
					// 安卓百度定位
					locationWorkLogin();
				}
			}
		},
		Error: function() {
			$('#workloginbox').hide();
			$('#workLoginloading').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#workloginbox').hide();
				$('#workLoginloading').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 考勤记录定位 */
function locationWorkLogin() {
	var success = function(p) {
		popup.hide();
		if (p.addr == undefined) {
			showLocationError(2);
		} else {
			document.getElementById("workLoginY").innerHTML = p.lontitude;
			document.getElementById("workLoginX").innerHTML = p.latitude;
			document.getElementById("workLoginAddress").innerHTML = p.addr;
			workLoginChangeXY();
		}
		$('#workLoginloading').hide();
		$('#workloginbox').show();
	};
	var error = function(message) {
		$('#workLoginloading').hide();
		$('#workloginbox').show();
		alert(message);
	};
	if (isBDlocation) {
		BaiduLocationPlugin.createEvent("定位", success, error);
	} else {
		TXLocationPlugin.createEvent("定位", success, error);
	}
}

//考勤记录保存方法 kwb
function workLoginSave(name) {
	var workLoginScoreAddress = $('#workLoginScoreAddress').attr('textid');
	var workLoginAddress = $('#workLoginAddress').html();
	if (parten.test(workLoginScoreAddress) || parten.test(workLoginAddress)) {
		showErrorPopup('提示', '目标考勤地点和坐标地址不能为空!');
	} else {
		showMessage('保存中');
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
			cache: false,
			timeout: 20000, //超时时间设置，单位毫秒
			dataType: 'jsonp',
			data: {
				userId: getSession('uid'),
				attenceTime: $('#workLoginTime').html(),
				attenceType: $('#workLoginType').attr('textid'),
				attenceTargetId: workLoginScoreAddress,
				attenceX: $('#workLoginX').html(),
				attenceY: $('#workLoginY').html(),
				attenceAddress: encodeURI(workLoginAddress),
				attenceReslut: encodeURI($('#workLoginResult').html()),
				isUpdate: changeTragetLocation,
				remark: ""
			},
			success: function(json) {
				popup.hide();
				if (json.status == -1) {
					showMessage('账号已失效');
					/* 1秒后隐藏提示 */
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				} else if (json.status == 0) {
					Toast("保存失败", 2000);
				} else if (json.status == 1) {
					Toast("保存成功", 2000);
					$.ui.goBack();
				}
			},
			complete: function(response, status) {
				if (status == "timeout") {
					ajaxdata.abort();
					popup.hide();
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
	}
}

var buildfiletrue = '';
var buildfilemaxupnum = '';
var buildfilepk = '';
var buildfileQDTypeobj = '';
var buildfileSpecialTypeobj = '';

/* 新增或编辑U1U4建档记录 kwb*/
function loadBuildFileEdit(name) {
	if (buildfiletrue) {
		$('#buildfilebox').hide();
		$('#buildfiledw').hide();
		$('#buildfileloading').show();
		panelInputCSS("buildfilebox");
		$('#buildFileSellTarget').css('border-color', '#ccc');
		/*document.getElementById('buildFileStartTime').onclick = function () {
		    WdatePicker({
		        dateFmt: 'yyyy-MM-dd',
		        maxDate: '#F{$dp.$D(\'buildFileEndTime\')}'
		    });
		};
		document.getElementById('buildFileEndTime').onclick = function () {
		    WdatePicker({
		        dateFmt: 'yyyy-MM-dd',
		        minDate: '#F{$dp.$D(\'buildFileStartTime\')}'
		    });
		};*/
		for (var i = 1; i < 5; i++) {
			$("#buildFileImg" + i).attr('take', 'false');
			$("#buildFileImg" + i)[0].src = "images/blank.jpg";
			$("#buildFileImg" + i).attr("onclick", 'takeBuildFileImg("buildFileImg' + i + '");');
		}
		createProvince('buildFileProvince', 'buildFileCity', 'buildFileArea');
		$('#buildfilesavebutton').show();
		$('#buildFileType').val('U1');
		$('#buildFileType').attr('textid', 'U1');
		$('#buildFileType').attr('onclick', "showPopupFont(4, 'buildFileType')");
		$("#buildFileQDType").removeAttr('textid');
		$("#buildFileSpecialType").removeAttr('textid');
		$('#buildFileTypeNum').val("");
		$('#buildFileQDType').val("");
		$('#buildFileSpecialType').val("");
		$('.starttime').html('&nbsp;', true);
		$('#buildFileName').attr('disabled', false);
		$('#buildFileSellTarget').attr('disabled', false);
		/*$('#buildFileStartTime').attr('disabled', false);
		$('#buildFileEndTime').attr('disabled', false);*/
		$('#buildFileContact').attr('disabled', false);
		$('#buildFileTel').attr('disabled', false);
		$('#buildFileAddress').attr('disabled', false);
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
			dataType: 'jsonp',
			type: 'GET',
			timeout: 10000, //超时时间设置，单位毫秒
			data: {
				type: getSession('keytype'),
				pid: getSession('keyid'),
				userId: getSession('uid')
			},
			success: function(json) {
				if (json.status == -1) {
					$('#buildfilebox').hide();
					$('#buildfileloading').hide();
					showMessage('账号已失效');
					/* 1秒后隐藏提示 */
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				} else if (json.status == 0) {
					$('#buildfilebox').hide();
					$('#buildfileloading').hide();
					showErrorPopup('提示', '信息有误');
				} else if (json.status == 1) { /* 编辑 */
					$("#buildFileType").css("border-color", "transparent");
					$("#buildFileType").css("color", "black");
					buildfileQDTypeobj = json.channelType;
					buildfileSpecialTypeobj = json.displayType;
					for (var j = 0; j < json.channelType.length; j++) {
						if (json.channelType[j].id == json.form.channelId) {
							$("#buildFileQDType").val(json.channelType[j].val);
							$("#buildFileQDType").attr("textid", json.channelType[j].id);
							break;
						}
					}
					for (var j = 0; j < json.displayType.length; j++) {
						if (json.displayType[j].id == json.form.displayId) {
							$("#buildFileSpecialType").val(json.displayType[j].val);
							$("#buildFileSpecialType").attr("textid", json.displayType[j].id);
							break;
						}
					}
					$("#buildFileTypeNum").val(json.form.displayNum);
					for (var i = 1; i < 5; i++) {
						$('#buildFileImg' + i)[0].src = 'images/imgloading.gif';
					}
					if (json.form.uPhoto1FileName != "") {
						//$('#buildFileImg1')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.uPhoto1FileName;
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.uPhoto1FileName, "buildFileImg1", checkimg);
					} else {
						$('#buildFileImg1')[0].src = "images/blank.jpg";
					}
					if (json.form.uPhoto2FileName != "") {
						//$('#buildFileImg2')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.uPhoto2FileName;
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.uPhoto2FileName, "buildFileImg2", checkimg);
					} else {
						$('#buildFileImg2')[0].src = "images/blank.jpg";
					}
					if (json.form.uPhoto3FileName != "") {
						//$('#buildFileImg3')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.uPhoto3FileName;
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.uPhoto3FileName, "buildFileImg3", checkimg);
					} else {
						$('#buildFileImg3')[0].src = "images/blank.jpg";
					}
					if (json.form.uPhoto4FileName != "") {
						//$('#buildFileImg4')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.uPhoto4FileName;
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.uPhoto4FileName, "buildFileImg4", checkimg);
					} else {
						$('#buildFileImg4')[0].src = "images/blank.jpg";
					}
					filepid = json.form.pid;
					buildfilemaxupnum = 1;
					$('#buildfiledw').show();
					document.getElementById("workLoginUserName").innerHTML = json.form.userName;
					document.getElementById("workLoginTime").innerHTML = json.form.attenceTime;
					//U1U4类型判断----begin---
					$('#buildFileType').val((json.form.type).replace(/\s+/g, ""));
					$('#buildFileType').attr('textid', (json.form.type).replace(/\s+/g, ""));
					$('#buildFileType').removeAttr('onclick');
					if ($('#buildFileType').val() == 'U1' || $('#buildFileType').val() == 'U2') {
						$('.starttime').html('&nbsp;', true);
					} else {
						$('.starttime').html('*', true);
					}
					/*var selectvalue = json.form.type;
					var obj = document.getElementById('buildFileType');
					for (var i = 0; i < obj.length; i++) {
					    alert(obj.options[i].value+"'"+selectvalue);
					    if (obj.options[i].value == selectvalue) {
					        obj.options[i].selected = true;
					        break;
					    }
					}*/
					//U1U4类型判断----end---
					$('#buildfilejx').show();
					$('#buildfilepf').show();
					$('#buildfilenm').show();
					$('#bianhao').show();
					$('#buildfileimgt').show();
					$('#upbuildfilebutton').hide();
					filetyle = $('#buildFileType').attr('textid');
					document.getElementById("buildFileNo").innerHTML = json.form.sNo;
					document.getElementById("buildFileName").value = json.form.sName;
					document.getElementById("buildFileSellTarget").value = json.form.saleTarget;
					/*document.getElementById("buildFileStartTime").value = json.form.startDate;
					document.getElementById("buildFileEndTime").value = json.form.endDate;*/
					document.getElementById("buildFileContact").value = json.form.contact;
					document.getElementById("buildFileTel").value = json.form.tel;
					document.getElementById("buildFileAddress").value = json.form.address;
					document.getElementById("buildFileUAddress").innerHTML = json.form.uAddress;
					document.getElementById("buildFileUX").innerHTML = json.form.uX;
					document.getElementById("buildFileUY").innerHTML = json.form.uY;
					document.getElementById("buildFileDealerNo").value = json.form.dealerNo;
					document.getElementById("buildFileDealerName").innerHTML = json.form.dealerName;
					document.getElementById("buildFilexsdq").innerHTML = json.form.xsdq;
					document.getElementById("buildFilexsb").innerHTML = json.form.xsb;
					document.getElementById("buildFilexsz").innerHTML = json.form.xsz;
					document.getElementById("buildFileStructPid").value = json.form.structNo;
					buildfilepk = json.form.structPid;
					document.getElementById("buildFileStructName").innerHTML = json.form.structName;
					if (!parten.test(json.form.province) && json.form.province != undefined) {
						if (!parten.test(json.form.province)) {
							$("#buildFileProvince").val(json.form.province);
							$("#buildFileProvince").attr('textid', searchProvinceNum(1, null, null, json.form.province));
						}
						if (!parten.test(json.form.city)) {
							$("#buildFileCity").val(json.form.city);
							$("#buildFileCity").attr('textid', searchProvinceNum(2, 'buildFileProvince', null, json.form.city));
							$("#buildFileCity").show();
						} else {
							$("#buildFileCity").val('');
							$("#buildFileCity").attr('textid', '');
							$("#buildFileCity").hide();
						}
						if (!parten.test(json.form.area)) {
							$("#buildFileArea").val(json.form.area);
							$("#buildFileArea").attr('textid', searchProvinceNum(3, 'buildFileProvince', 'buildFileCity', json.form.area));
							$("#buildFileArea").show();
						} else {
							$("#buildFileArea").val('');
							$("#buildFileArea").attr('textid', '');
							$("#buildFileArea").hide();
						}
					}

					/*document.getElementById("buildFileFarmPid").value = json.form.farmPid;
					document.getElementById("buildFileFarmName").innerHTML = json.form.farmName;*/
					$('.buildFileDealerinfo').show();
					$('.buildFileotherinfo').show();
					$('#buildfileloading').hide();
					$('#buildfilebox').show();
				} else if (json.status == 2) { // 新增
					buildfilemaxupnum = 3;
					buildfileQDTypeobj = json.channelType;
					buildfileSpecialTypeobj = json.displayType;
					$('.buildFileDealerinfo').hide();
					$('.buildFileotherinfo').hide();
					$("#buildFileType").css("border-color", "#ccc");
					$("#buildFileType").css("color", "black");
					$('#buildFileType').val('U1');
					$('#buildFileType').attr('textid', 'U1');
					//document.getElementById("buildFileType").options[0].selected = true;
					document.getElementById("buildFileNo").innerHTML = "";
					document.getElementById("buildFileName").value = "";
					document.getElementById("buildFileSellTarget").value = "";
					/*document.getElementById("buildFileStartTime").value = "";
					document.getElementById("buildFileEndTime").value = "";*/
					document.getElementById("buildFileContact").value = "";
					document.getElementById("buildFileTel").value = "";
					document.getElementById("buildFileAddress").value = "";
					document.getElementById("buildFileDealerNo").value = "";
					document.getElementById("buildFileDealerName").innerHTML = "";
					document.getElementById("buildFilexsdq").innerHTML = "";
					document.getElementById("buildFilexsb").innerHTML = "";
					document.getElementById("buildFilexsz").innerHTML = "";
					document.getElementById("buildFileStructPid").value = "";
					document.getElementById("buildFileStructName").innerHTML = "";
					buildfilepk = '';
					/*document.getElementById("buildFileFarmPid").value = "";
					document.getElementById("buildFileFarmName").innerHTML = "";*/
					$('#bianhao').hide();
					$('#buildfileimgt').show();
					$('#upbuildfilebutton').hide();
					//document.getElementById("buildFileUAddress").innerHTML = "定位地址";
					//document.getElementById("buildFileUX").innerHTML = "34";
					//document.getElementById("buildFileUY").innerHTML = "45";
					$('#buildfilejx').show();
					$('#buildfilepf').show();
					$('#buildfilenm').show();
					if (systemname == "iOS") {
						locationtype = 3;
						getlocationtest();
					} else {
						locationBuildFile();
					}
					/*$('#buildfileloading').hide();
                    $('#buildfilebox').show();*/
				} else if (json.status == 3) { /* 浏览 */
					panelCheckCSS("buildfilebox");
					for (var i = 1; i < 5; i++) {
						$('#buildFileImg' + i)[0].src = 'images/imgloading.gif';
					}
					if (json.form.uPhoto1FileName != "") {
						//$('#buildFileImg1')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.uPhoto1FileName;
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.uPhoto1FileName, "buildFileImg1", checkimg);
					} else {
						$('#buildFileImg1')[0].src = "images/blank.jpg";
					}
					if (json.form.uPhoto2FileName != "") {
						//$('#buildFileImg2')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.uPhoto2FileName;
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.uPhoto2FileName, "buildFileImg2", checkimg);
					} else {
						$('#buildFileImg2')[0].src = "images/blank.jpg";
					}
					if (json.form.uPhoto3FileName != "") {
						//$('#buildFileImg3')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.uPhoto3FileName;
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.uPhoto3FileName, "buildFileImg3", checkimg);
					} else {
						$('#buildFileImg3')[0].src = "images/blank.jpg";
					}
					if (json.form.uPhoto4FileName != "") {
						//$('#buildFileImg4')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.uPhoto4FileName;
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.uPhoto4FileName, "buildFileImg4", checkimg);
					} else {
						$('#buildFileImg4')[0].src = "images/blank.jpg";
					}
					/*for (var i = 1; i < 5; i ++) {
						document.getElementById('buildFileImg' + i).onclick = function () {};
					}*/
					for (var j = 0; j < json.channelType.length; j++) {
						if (json.channelType[j].id == json.form.channelId) {
							$("#buildFileQDType").val(json.channelType[j].val);
							$("#buildFileQDType").attr("textid", json.channelType[j].id);
							break;
						}
					}
					for (var j = 0; j < json.displayType.length; j++) {
						if (json.displayType[j].id == json.form.displayId) {
							$("#buildFileSpecialType").val(json.displayType[j].val);
							$("#buildFileSpecialType").attr("textid", json.displayType[j].id);
							break;
						}
					}
					$("#buildFileTypeNum").val(json.form.displayNum);
					$('#buildfiledw').show();
					document.getElementById("workLoginUserName").innerHTML = json.form.userName;
					document.getElementById("workLoginTime").innerHTML = json.form.attenceTime;
					//U1U4类型判断----begin---
					$('#buildFileType').val((json.form.type).replace(/\s+/g, ""));
					$('#buildFileType').attr('textid', (json.form.type).replace(/\s+/g, ""));
					if ($('#buildFileType').val() == 'U1' || $('#buildFileType').val() == 'U2') {
						$('.starttime').html('&nbsp;', true);
					} else {
						$('.starttime').html('*', true);
					}
					$('#buildFileType').removeAttr('onclick');
					//document.getElementById('buildFileType').value = (json.form.type).replace(/\s+/g, "");
					//$('#buildFileType').attr('disabled', true);
					$('#buildFileName').attr('disabled', true);
					$('#buildFileSellTarget').attr('disabled', true);
					/*$('#buildFileStartTime').attr('disabled', true);
					$('#buildFileEndTime').attr('disabled', true);*/
					$('#buildFileContact').attr('disabled', true);
					$('#buildFileTel').attr('disabled', true);
					$('#buildFileAddress').attr('disabled', true);
					//U1U4类型判断----end---
					$('#buildfilejx').hide();
					$('#buildfilepf').hide();
					$('#buildfilesavebutton').show();
					$('#buildfilenm').show();
					$('#bianhao').show();
					$('#buildfileimgt').show();
					$('#upbuildfilebutton').hide();
					document.getElementById("buildFileNo").innerHTML = json.form.sNo;
					document.getElementById("buildFileName").value = json.form.sName;
					document.getElementById("buildFileSellTarget").value = json.form.saleTarget;
					/*document.getElementById("buildFileStartTime").value = json.form.startDate;
					document.getElementById("buildFileEndTime").value = json.form.endDate;*/
					document.getElementById("buildFileContact").value = json.form.contact;
					document.getElementById("buildFileTel").value = json.form.tel;
					document.getElementById("buildFileAddress").value = json.form.address;
					document.getElementById("buildFileUAddress").innerHTML = json.form.uAddress;
					document.getElementById("buildFileUX").innerHTML = json.form.uX;
					document.getElementById("buildFileUY").innerHTML = json.form.uY;
					document.getElementById("buildFileDealerNo").value = json.form.dealerNo;
					document.getElementById("buildFileDealerName").innerHTML = json.form.dealerName;
					document.getElementById("buildFilexsdq").innerHTML = json.form.xsdq;
					document.getElementById("buildFilexsb").innerHTML = json.form.xsb;
					document.getElementById("buildFilexsz").innerHTML = json.form.xsz;
					document.getElementById("buildFileStructPid").value = json.form.structNo;
					document.getElementById("buildFileStructName").innerHTML = json.form.structName;
					if (!parten.test(json.form.province) && json.form.province != undefined) {
						if (!parten.test(json.form.province)) {
							$("#buildFileProvince").val(json.form.province);
							$("#buildFileProvince").attr('textid', searchProvinceNum(1, null, null, json.form.province));
						}
						if (!parten.test(json.form.city)) {
							$("#buildFileCity").val(json.form.city);
							$("#buildFileCity").attr('textid', searchProvinceNum(2, 'buildFileProvince', null, json.form.city));
							$("#buildFileCity").show();
						} else {
							$("#buildFileCity").val('');
							$("#buildFileCity").attr('textid', '');
							$("#buildFileCity").hide();
						}
						if (!parten.test(json.form.area)) {
							$("#buildFileArea").val(json.form.area);
							$("#buildFileArea").attr('textid', searchProvinceNum(3, 'buildFileProvince', 'buildFileCity', json.form.area));
							$("#buildFileArea").show();
						} else {
							$("#buildFileArea").val('');
							$("#buildFileArea").attr('textid', '');
							$("#buildFileArea").hide();
						}
					}
					$('.buildFileDealerinfo').show();
					$('.buildFileotherinfo').show();
					$('#buildfileloading').hide();
					$('#buildfilebox').show();
				}
			},
			Error: function() {
				$('#buildfileloading').hide();
				$('#buildfilebox').hide();
				alert('Error');
			},
			complete: function(response) {
				if (response.status == 200) {} else {
					ajaxdata.abort();
					$('#buildfileloading').hide();
					$('#buildfilebox').hide();
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
		buildfiletrue = false;
	}
}

/* 建档定位 */
function locationBuildFile() {
	var success = function(p) {
		popup.hide();
		if (p.addr == undefined) {
			showLocationError(3);
		} else {
			document.getElementById("buildFileUY").innerHTML = p.lontitude;
			document.getElementById("buildFileUX").innerHTML = p.latitude;
			document.getElementById("buildFileUAddress").innerHTML = p.addr;
		}
		$('#buildfileloading').hide();
		$('#buildfilebox').show();
	};
	var error = function(message) {
		$('#buildfileloading').hide();
		$('#buildfilebox').show();
		alert(message);
	};
	if (isBDlocation) {
		BaiduLocationPlugin.createEvent("定位", success, error);
	} else {
		TXLocationPlugin.createEvent("定位", success, error);
	}
}

/* U1-U4目标值输入上限 */
function changeBuildFileSellTarget() {
	var temptarget = $('#buildFileSellTarget').val();
	if (parseFloat(temptarget) > 500) {
		$('#buildFileSellTarget').css('border-color', 'red');
		$('#buildFileSellTarget').focus();
	} else {
		$('#buildFileSellTarget').css('border-color', '#cccccc');
	}
}

/* U1-U4建档定位 */
function buildFileLocaltion() {
	showMessage('定位中');
	var success = function(p) {
		popup.hide();
		if (p.addr == undefined) {
			showLocationError(4);
		} else {
			document.getElementById("buildFileUY").innerHTML = p.lontitude;
			document.getElementById("buildFileUX").innerHTML = p.latitude;
			document.getElementById("buildFileUAddress").innerHTML = p.addr;
		}
	};
	var error = function(message) {
		popup.hide();
		alert(message);
	};
	if (systemname == "iOS") {
		locationtype = 4;
		getlocationtest();
	} else {
		if (isBDlocation) {
			BaiduLocationPlugin.createEvent("定位", success, error);
		} else {
			TXLocationPlugin.createEvent("定位", success, error);
		}
	}
}

function createProvince(a, b, c) {
	$("#" + a).removeAttr("textid");
	$("#" + a).val("请选择");
	$("#" + b).hide();
	$("#" + c).hide();
}

var filepid = '';
var filetyle = '';
//U1-U4建档保存方法 kwb
function buildFileSave(name) {
	var buildFileName = $('#buildFileName').val();
	var buildFileSellTarget = $('#buildFileSellTarget').val();
	/*var buildFileStartTime = $('#buildFileStartTime').val();
	var buildFileEndTime = $('#buildFileEndTime').val();*/
	var buildFileContact = $('#buildFileContact').val();
	var buildFileTel = $('#buildFileTel').val();
	var buildFileDealerNo = $('#buildFileDealerNo').val();

	var buildFileProvince = $('#buildFileProvince').val();
	var buildFileCity = '';
	var buildFileArea = '';
	if (buildFileProvince == "请选择") {
		showErrorPopup("提示", "请选择省市区");
		return;
	}
	if (!$("#buildFileCity").is(":hidden")) {
		buildFileCity = $('#buildFileCity').val();
	}
	if (!$("#buildFileArea").is(":hidden")) {
		buildFileArea = $('#buildFileArea').val();
	}

	var buildFileAddress = $('#buildFileAddress').val();
	var buildFileUAddress = $('#buildFileUAddress').html();
	var buildFiledisplayNum = $('#buildFileTypeNum').val();
	var upphotonum = 0;
	var buildFileType = $("#buildFileType").attr('textid');
	var buildFilechannelType = $("#buildFileQDType").attr('textid');
	var buildFiledisplayType = $("#buildFileSpecialType").attr('textid');
	for (var i = 1; i < 5; i++) {
		if ($('#buildFileImg' + i).attr('take') == 'true') {
			upphotonum++;
		}
	}
	if (parten.test(buildFileUAddress) || parten.test(buildFileAddress) || parten.test(buildFileName) || parten.test(buildFileSellTarget) || parten.test(buildFileContact) || parten.test(buildFileTel) || parten.test(buildFileDealerNo) || parten.test(buildFiledisplayNum)) {
		showErrorPopup('提示', "'*'号必选项或定位坐标地址不能为空");
	} else if (parseFloat(buildFileSellTarget) > 500) {
		showErrorPopup('提示', "目标值超出上限!");
	} else if (parten.test(buildFilechannelType) || parten.test(buildFiledisplayType) || buildFilechannelType == undefined || buildFiledisplayType == undefined) {
		showErrorPopup('提示', "特殊陈列类型和渠道类型不能为空!");
	} else {
		if (buildfilemaxupnum == 3) {
			if (upphotonum < 1) {
				showErrorPopup('提示', "至少拍照1张才能建档");
				return;
			}
		}
		/*if ((buildFileType == 'U1' || buildFileType == 'U2') && parten.test(buildFileEndTime)) {
			buildFileEndTime = '1900-01-01';
		}
		if ((buildFileType == 'U1' || buildFileType == 'U2') && parten.test(buildFileStartTime)) {
			buildFileStartTime = '1900-01-01';
		}*/
		showMessage('保存中');
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
			cache: false,
			timeout: 20000, //超时时间设置，单位毫秒
			dataType: 'jsonp',
			data: {
				userId: getSession('uid'),
				type: $("#buildFileType").attr('textid'),
				sNo: $('#buildFileNo').html(),
				sName: encodeURI(buildFileName),
				saleTarget: buildFileSellTarget,
				/*startDate: buildFileStartTime,
				endDate: buildFileEndTime,*/
				contact: encodeURI(buildFileContact),
				tel: buildFileTel,
				province: encodeURI(buildFileProvince),
				city: encodeURI(buildFileCity),
				area: encodeURI(buildFileArea),
				address: encodeURI(buildFileAddress),
				uAddress: encodeURI(buildFileUAddress),
				channelId: buildFilechannelType,
				displayId: buildFiledisplayType,
				displayNum: parseInt(buildFiledisplayNum),
				uX: $('#buildFileUX').html(),
				uY: $('#buildFileUY').html(),
				dealerNo: buildFileDealerNo,
				structPid: buildfilepk
			},
			success: function(json) {
				if (json.status == -1) {
					popup.hide();
					showMessage('账号已失效');
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				} else if (json.status == 0) {
					popup.hide();
					Toast("保存失败", 2000);
				} else if (json.status == 1) {
					filetyle = $("#buildFileType").attr('textid');
					filepid = json.pid;
					if (buildfilemaxupnum == 3) {
						$('#buildFileNo').html(json.bianhao, true);
						$('#bianhao').show();
					}
					upBuildFileImg('buildFileImg');
					/*$('#buildfileimgt').show();
					$('#upbuildfilebutton').show();*/
				}
			},
			complete: function(response, status) {
				if (status == "timeout") {
					ajaxdata.abort();
					popup.hide();
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
	}
}

/* 新增或编辑拜访记录 kwb*/
function loadVisitLoginEdit(name) {
	$('#visitbox').hide();
	$('#visitLoginloading').show();
	for (var i = 1; i < 5; i++) {
		$('#visitLogin' + i)[0].src = 'images/blank.jpg';
		$('#visitLogin' + i).attr('take', 'false');
	}
	panelInputCSS("visitbox");
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'GET',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			pid: getSession('keyid'),
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#visitbox').hide();
				$('#visitLoginloading').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#visitbox').hide();
				$('#visitLoginloading').hide();
				showErrorPopup('提示', '信息有误');
			} else if (json.status == 1) { // 浏览
				panelCheckCSS("visitbox");
				for (var i = 1; i < 5; i++) {
					$('#visitLogin' + i)[0].src = 'images/imgloading.gif';
				}
				if (json.form.visit_photo1 != "") {
					//$('#visitLogin1')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.visit_photo1;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName="+ json.form.visit_photo1, "visitLogin1", checkimg);
				} else {
					$('#visitLogin1')[0].src = "images/blank.jpg";
				}
				if (json.form.visit_photo2 != "") {
					//$('#visitLogin2')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.visit_photo2;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.visit_photo2, "visitLogin2", checkimg);
				} else {
					$('#visitLogin2')[0].src = "images/blank.jpg";
				}
				if (json.form.visit_photo3 != "") {
					//$('#visitLogin3')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.visit_photo3;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.visit_photo3, "visitLogin3", checkimg);
				} else {
					$('#visitLogin3')[0].src = "images/blank.jpg";
				}
				if (json.form.visit_photo4 != "") {
					//$('#visitLogin4')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.visit_photo4;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.visit_photo4, "visitLogin4", checkimg);
				} else {
					$('#visitLogin4')[0].src = "images/blank.jpg";
				}
				$("#visitLogin1").unbind("click");
				$("#visitLogin2").unbind("click");
				$("#visitLogin3").unbind("click");
				$("#visitLogin4").unbind("click");
				var temp = "";
				if (json.form.match_result == false) {
					temp = "否";
				} else {
					temp = "是";
				}
				visitimgpid = json.form.pid;
				$('#buildfileimgbox').show();
				/*$('#visitloginupbutton').hide();*/
				$('#visitloginsavebutton').hide();
				document.getElementById("visitLoginNo").value = json.form.sno;
				document.getElementById("visitLoginName").innerHTML = json.form.sname;
				if (json.form.type1 == 1) {
					document.getElementById("visitLoginType1").innerHTML = '联盟商';
				} else {
					document.getElementById("visitLoginType1").innerHTML = '超市';
				}
				document.getElementById("visitLoginType").innerHTML = json.form.type;
				document.getElementById("visitLoginDealerNo").innerHTML = json.form.dealerNo;
				document.getElementById("visitLoginDealerName").innerHTML = json.form.cDwmc;
				document.getElementById("visitLoginX").innerHTML = json.form.visit_x;
				document.getElementById("visitLoginY").innerHTML = json.form.visit_y;
				document.getElementById("visitLoginAddress").innerHTML = json.form.visit_address;
				document.getElementById("visitLoginStartTIme").innerHTML = json.form.visit_start_time;
				document.getElementById("visitLoginContent").value = json.form.visit_content;
				document.getElementById("visitLoginResult").innerHTML = temp;
				$('#visitLoginzd').hide();
				$("#visitStartButton").hide();
				$('#visitLoginContent').attr("disabled", "true"); //将拜访心得设为只读
				$('#visitLoginNo').attr("disabled", "true"); //将终端编号设为只读
				$('#visitLoginloading').hide();
				$('#visitbox').show();
			} else if (json.status == 2) { //新增
				visitimgpid = '';
				$("#visitLogin1").click(function() {
					takeBuildFileImg('visitLogin1');
				});
				$("#visitLogin2").click(function() {
					takeBuildFileImg('visitLogin2');
				});
				$("#visitLogin3").click(function() {
					takeBuildFileImg('visitLogin3');
				});
				$("#visitLogin4").click(function() {
					takeBuildFileImg('visitLogin4');
				});
				changeTragetLocation = "0";
				seriveChange = "1";
				$('#buildfileimgbox').show();
				/*$('#visitloginupbutton').hide();*/
				$('#visitloginsavebutton').show();
				document.getElementById("visitLoginNo").value = "";
				document.getElementById("visitLoginName").innerHTML = "";
				document.getElementById("visitLoginType1").innerHTML = "";
				document.getElementById("visitLoginType").innerHTML = "";
				document.getElementById("visitLoginDealerNo").innerHTML = "";
				document.getElementById("visitLoginDealerName").innerHTML = "";
				document.getElementById("visitLoginX").innerHTML = "";
				document.getElementById("visitLoginY").innerHTML = "";
				document.getElementById("visitLoginAddress").innerHTML = "";
				document.getElementById("visitLoginStartTIme").innerHTML = "";
				document.getElementById("visitLoginResult").innerHTML = "";
				document.getElementById("visitLoginContent").value = "";
				$('#visitLoginzd').show();
				$("#visitStartButton").show();
				$('#visitLoginContent').removeAttr("disabled"); //取消拜访心得设为只读
				//$('#visitLoginNo').removeAttr("disabled"); //取消终端编号设为只读
				$('#visitLoginloading').hide();
				$('#visitbox').show();
			}
		},
		Error: function() {
			$('#visitLoginloading').hide();
			$('#visitbox').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#visitLoginloading').hide();
				$('#visitbox').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 清除开始拜访 */
function cleanStartVisit() {
	document.getElementById("visitLoginX").innerHTML = "";
	document.getElementById("visitLoginY").innerHTML = "";
	document.getElementById("visitLoginAddress").innerHTML = "";
	document.getElementById("visitLoginStartTIme").innerHTML = "";
	document.getElementById("visitLoginResult").innerHTML = "";
}

// 提交开始拜访地址
function sendStartLocation() {
	var getX = $('#visitLoginu_x').val();
	var getY = $('#visitLoginu_y').val();
	var thisX = $('#visitLoginX').html();
	var thisY = $('#visitLoginY').html();
	var distance = getFlatternDistance(getX, getY, thisX, thisY).toFixed(2);
	if (getX != '' && getY != '') {
		if (parseFloat(distance) > 200.00) {
			$('#visitLoginResult').html("否", true);
		} else if (parseFloat(distance) <= 200.00) {
			$('#visitLoginResult').html("是", true);
		} else if (getX == thisX && getY == thisY) {
			$('#visitLoginResult').html("是", true);
		}
	} else {
		$('#visitLoginResult').html("否", true);
	}
	if ($('#visitLoginResult').html() == "否" && seriveChange == "0") {
		showTargetLocationPopup();
	}
	var times = "";
	$.jsonP({
		url: "http://" + ipaddress + "/" + serviceName + "/appVisit/editVisitTime.do?callback=?",
		success: function(json) {
			times = json.time;
			document.getElementById("visitLoginStartTIme").innerHTML = times;
			popup.hide();
		},
		Error: function() {
			popup.hide();
			alert('Error');
		}
	});
}

//新建拜访时 点击开始拜访获取值
function clickStartButton() {
	//document.getElementById("visitLoginX").innerHTML = "55";
	//document.getElementById("visitLoginY").innerHTML = "66";
	//document.getElementById("visitLoginAddress").innerHTML = "定点位置地址";
	if ($('#visitLoginNo').val() != '') {
		showMessage('获取中');
		var success = function(p) {
			if (p.addr == undefined) {
				popup.hide();
				showLocationError(5);
			} else {
				document.getElementById("visitLoginY").innerHTML = p.lontitude;
				document.getElementById("visitLoginX").innerHTML = p.latitude;
				document.getElementById("visitLoginAddress").innerHTML = p.addr;
				sendStartLocation();
			}
		};
		var error = function(message) {
			popup.hide();
			alert(message);
		};
		if (systemname == "iOS") {
			locationtype = 5;
			getlocationtest();
		} else {
			if (isBDlocation) {
				BaiduLocationPlugin.createEvent("定位", success, error);
			} else {
				TXLocationPlugin.createEvent("定位", success, error);
			}
		}
	} else {
		showErrorPopup('提示', '请先选取终端!');
	}
}

var visitimgpid = '';
//拜访记录 保存方法 kwb
function visitLoginSave(name) {
	var visitLoginNo = $('#visitLoginNo').val();
	var visitLoginContent = $('#visitLoginContent').val();
	var visitLoginStartTIme = $('#visitLoginStartTIme').html();
	var k = 0;
	for (var i = 1; i < 5; i++) {
		if ($('#visitLogin' + i).attr('take') == 'true') {
			k++;
		}
	}
	if (visitLoginNo == "") {
		showErrorPopup('提示', '终端编号不能为空!');
	} else if (visitLoginStartTIme == "") {
		showErrorPopup('提示', '请先点击开始拜访再进行保存!');
	} else if (k < 3) {
		showErrorPopup('提示', '至少需要三张图片才可以保存!');
	} else {
		showPopup6(name);
	}
}

/* 进行拜访登记保存 */
function doSaveVisitLogin(name) {
	showMessage('保存中');
	var result = $('#visitLoginResult').html();
	var matchResult = '';
	if (result == '是') {
		matchResult = 1;
	} else if (result == '否') {
		matchResult = 0;
	}
	var type1 = 0;
	if ($("#visitLoginType1").html() == '联盟商') {
		type1 = 1;
	} else {
		type1 = 2;
	}
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		cache: false,
		timeout: 20000, //超时时间设置，单位毫秒
		dataType: 'jsonp',
		data: {
			pid: visitimgpid,
			userId: getSession('uid'),
			visitTerminalId: $('#visitLoginNo').val(),
			visitAddress: encodeURI($('#visitLoginAddress').html()),
			visitX: $('#visitLoginX').html(),
			visitY: $('#visitLoginY').html(),
			visitStartTime: $('#visitLoginStartTIme').html(),
			visitContent: encodeURI($('#visitLoginContent').val()),
			type: type1,
			matchResult: matchResult,
			isUpdate: changeTragetLocation,
			remark: ""
		},
		success: function(json) {
			if (json.status == -1) {
				popup.hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				popup.hide();
				Toast("保存失败", 2000);
			} else if (json.status == 1) {
				visitimgpid = json.pid;
				/*$('#buildfileimgbox').show();
				    $('#visitloginupbutton').show();*/
				if (visitimgpid != "") {
					upVisitImg();
				} else {
					Toast("保存失败", 2000);
				}
				/*popup.hide();
				    Toast("保存成功", 2000);*/
				//$.ui.loadContent("#visitnote", false, false, "up");
			}
		},
		complete: function(response, status) {
			if (status == "timeout") {
				ajaxdata.abort();
				popup.hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 新增或编辑消息发送记录 kwb*/
function loadCreateMessageEdit(name) {
	$('#createmessagebox').hide();
	$('#createMessgeButton').hide();
	$('#createmessageloading').show();
	panelInputCSS("createmessagebox");
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'GET',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			pid: getSession('keyid'),
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#createmessagebox').hide();
				$('#createmessageloading').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#createmessagebox').hide();
				$('#createmessageloading').hide();
				showErrorPopup('提示', '信息有误');
			} else if (json.status == 1) { /* 编辑浏览 */
				$("#messagepeoplelist").empty();
				$('#messageimg')[0].src = "images/imgloading.gif";
				if (json.form.mes_photo != "") {
					//$('#messageimg')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.mes_photo;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.mes_photo, "messageimg", checkimg);
					$('#messageimg').show();
				} else {
					$('#messageimg')[0].src = '';
					$('#messageimg').hide();
				}
				if (json.selectMemberList != undefined) {
					for (var i = 0; i < json.selectMemberList.length; i++) {
						var centent = '';
						if (i < 20) {
							centent = "<font userId='" + json.selectMemberList[i].userId + "'>" + json.selectMemberList[i].userName + "</font> ";
						} else if (i == 20) {
							centent = "<font userId='" + json.selectMemberList[i].userId + "'>...</font>";
						} else {
							centent = "<font userId='" + json.selectMemberList[i].userId + "'></font>";
						}
						$("#messagepeoplelist").append(centent);
					}
				}
				if (json.form.publish_state == true) { /* 已发送 */
					document.getElementById("createMessgeButton").style.display = "none";
					$('#createMessageTitle').attr("disabled", "true"); //标题为只读
					$('#createMessageContent').attr("disabled", "true"); //内容设为只读
					$('#createMessgeup').hide();
					$("#messagepeopleadd").hide();
					$("#messagepeoplelist").removeAttr("onclick");
					panelCheckCSS("createmessagebox");
				} else { /* 未发送 */
					document.getElementById("createMessgeButton").style.display = "block";
					/*$('#createMessgeSaveButton').show();
					$('#createMessgeSendButton').show();*/
					/*$('#messageimg').attr('upphoto', false);*/
					$('#createMessgeup').show();
					$("#messagepeopleadd").show();
					$("#messagepeoplelist").attr("onclick", "showPopupDelMessagePeople(this)");
					$('#createMessageTitle').removeAttr("disabled"); //取消标题为只读
					$('#createMessageContent').removeAttr("disabled"); //取内容设为只读
				}
				document.getElementById("createMessageTitle").value = json.form.title;
				document.getElementById("createMessageContent").value = json.form.content;
				document.getElementById("createMessageTime").innerHTML = json.form.publish_time;
				document.getElementById("createMessageName").innerHTML = json.form.name;
				$('#createmessageloading').hide();
				$('#createmessagebox').show();
				checkMessageLength(document.getElementById('createMessageContent'));
			} else if (json.status == 2) { /* 新增 */
				document.getElementById("createMessageTitle").value = "";
				document.getElementById("createMessageContent").value = "";
				document.getElementById("createMessageTime").innerHTML = "";
				document.getElementById("createMessageName").innerHTML = json.form.userName;
				$('#createMessageTitle').removeAttr("disabled"); //取消标题为只读
				$('#createMessageContent').removeAttr("disabled"); //取内容设为只读
				document.getElementById("createMessgeButton").style.display = "block";
				$("#messagepeoplelist").empty();
				$("#messagepeopleadd").show();
				$("#messagepeoplelist").attr("onclick", "showPopupDelMessagePeople(this)");
				/*$('#createMessgeSaveButton').show();
				$('#createMessgeSendButton').show();*/
				/*$('#messageimg').attr('upphoto', false);*/
				$('#messageimg')[0].src = '';
				$('#messageimg').hide();
				$('#createMessgeup').show();
				$('#createmessageloading').hide();
				$('#createmessagebox').show();
			}
		},
		Error: function() {
			$('#createmessageloading').hide();
			$('#createmessagebox').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#createmessageloading').hide();
				$('#createmessagebox').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 文本框高度自增 */
/**
 * a: 输入框元素
 **/
function checkMessageLength(a) {
	a.style.height = a.scrollHeight + 'px';
}


//消息发送记录 保存方法 kwb
var messagetype = '';
/**
 * name  方法名
 * type  保存/发送
 */
function createMessageSave(name, type) {
	messagetype = type;
	var createMessageTitle = $('#createMessageTitle').val();
	var createMessageContent = $('#createMessageContent').val();
	var messagepeoplechecklist = $("#messagepeoplelist").find("font");
	var proarray = [];
	messagepeoplechecklist.each(function() {
		proarray.push($(this).attr("userId"));
	});
	if (!parten.test(createMessageTitle) && !parten.test(createMessageContent)) {
		if (messagetype == 1) {
			showMessage('保存中');
		} else {
			showMessage('发送中');
		}
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
			type: "post",
			dataType: 'jsonp',
			timeout: 20000, //超时时间设置，单位毫秒
			data: {
				pid: getSession('keyid'),
				userId: getSession('uid'),
				title: encodeURI(createMessageTitle),
				content: encodeURI(createMessageContent),
				selectMember: proarray.join(',')
					//publishTime: encodeURI($('#createMessageTime').html()),
			},
			success: function(json) {
				if (json.status == -1) {
					popup.hide();
					showMessage('账号已失效');
					/* 1秒后隐藏提示 */
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				} else if (json.status == 0) {
					popup.hide();
					Toast("保存失败", 2000);
				} else if (json.status == 1) {
					setId(json.pid);
					if ($('#messageimg').attr('upphoto') == 'true') {
						messageimgpid = json.pid;
						upMessageImg();
					} else {
						if (messagetype == 1) {
							popup.hide();
							Toast("保存成功!", 1500);
						} else {
							createMessageSend('appMessage/sendMessage');
						}
					}
					//$('#messageimg').attr('upphoto', false);
					//$.ui.loadContent("#sendinfo", false, false, "up");
				} else if (json.status == 2) {
					popup.hide();
					showErrorPopup('提示', '相同的消息已存在!');
				}
			},
			Error: function() {
				alert('Error');
			},
			complete: function(response, status) {
				if (status == "timeout") {
					ajaxdata.abort();
					popup.hide();
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
	} else {
		showErrorPopup('提示', '消息标题和内容不能为空!');
	}
}

//消息发送记录 发送方法 kwb
function createMessageSend(name) {
	var tempmessul = $("#messagepeoplelist").find("font");
	if (tempmessul.length == 0) {
		popup.hide();
		showErrorPopup("提示", "请添加接收人");
	} else if (getSession('keyid') != '') {
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
			dataType: 'jsonp',
			timeout: 20000, //超时时间设置，单位毫秒
			type: "post",
			data: {
				pid: getSession('keyid')
			},
			success: function(json) {
				if (json.status == -1) {
					popup.hide();
					showMessage('账号已失效');
					/* 1秒后隐藏提示 */
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				} else if (json.status == 0) {
					popup.hide();
					Toast("发送失败", 1500);
				} else if (json.status == 1) {
					popup.hide();
					/*if ($('#messageimg').attr('upphoto') == 'true') {
					    messageimgpid = json.pid;
					    upMessageImg();
					}
					$('#messageimg').attr('upphoto', false);*/
					Toast("发送成功", 1500);
					$.ui.goBack();
					//$.ui.loadContent("#sendinfo", false, false, "up");
				}
			},
			complete: function(response, status) {
				if (status == "timeout") {
					ajaxdata.abort();
					popup.hide();
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
	} else {
		popup.hide();
		showErrorPopup('提示', '发送错误!');
	}
}

/* 消息接收人列表读取 */
var messagesendkeyword = '';
var messagesendselect = '';

function loadMessagePepeleData(a, name) {
	var tarP = "page_" + a;
	$('#' + tarP + '_none').hide();
	$('#' + tarP + '_box').hide();
	$('#' + tarP + '_loading').show();
	$('#' + tarP + '_ul').empty();
	messagesendkeyword = $("#messagepepelename").val();
	var temporid = $("#messagepeoplelist").find("font");
	var tempiddata = [];
	temporid.each(function() {
		tempiddata.push($(this).attr("userId"));
	});
	messagesendselect = "'" + tempiddata.join("','") + "'";
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		cache: false,
		timeout: 10000, //超时时间设置，单位毫秒
		dataType: 'jsonp',
		data: {
			userId: getSession('uid'),
			keyWord: encodeURI(messagesendkeyword),
			selectMember: messagesendselect
		},
		success: function(json) {
			if (json.status == -1) {
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_box').hide();
				showMessage('账号已失效');
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_box').hide();
				$('#' + tarP + '_none').show();
			} else if (json.status == 1) {
				var content = '';
				$('#messagepepele').attr('last', json.memberList[json.memberList.length - 1].rownum);
				var templi = $('#' + tarP + '_tempul').find("li");
				for (var i = 0; i < json.memberList.length; i++) {
					var tempcheck = '';
					templi.each(function() {
						if ($(this).attr("userId") == json.memberList[i].userId) {
							tempcheck = 'checked';
							return false;
						}
					});
					content += "<li style='padding-bottom: 15px;'>" +
						"<input id='" + json.memberList[i].userId + "' value='" + json.memberList[i].NAME + "' type='checkbox' onclick='checkMessagePeople(this)' " + tempcheck + ">" +
						"<label class='sendlist' for='" + json.memberList[i].userId + "'>" + json.memberList[i].cDeptName + " " + json.memberList[i].userType + "<br/>" + json.memberList[i].NAME + " (" + json.memberList[i].LOGIN_NAME + ")</label>" +
						"<div style='clear: both;'></div>" +
						"</li>";
				}
				$('#' + tarP + '_ul').empty();
				$('#' + tarP + '_ul').append(content);
				messagepeoplescroller.scrollToTop();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_box').show();
			}
		},
		Error: function() {
			$('#' + tarP + '_none').hide();
			$('#' + tarP + '_loading').hide();
			$('#' + tarP + '_box').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_box').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 接收人选取 */
function checkMessagePeople(a) {
	if ($(a).prop('checked')) {
		var concent = '<li userId="' + $(a).attr("id") + '" userName="' + $(a).val() + '"></li>';
		$("#page_xxjsr_tempul").append(concent);
	} else {
		var templi = $("#page_xxjsr_tempul").find("li");
		templi.each(function() {
			if ($(this).attr("userId") == $(a).attr("id")) {
				$(this).remove();
				return false;
			}
		});
	}
}

/* 接收人确定 */
function insertMessagePeople() {
	var selectedli = $("#messagepeoplelist").find("font");
	var templi = $("#page_xxjsr_tempul").find("li");
	templi.each(function() {
		var centent = "";
		if ($(this).index() + selectedli.length < 20) {
			centent = "<font userId='" + $(this).attr("userId") + "'>" + $(this).attr("userName") + "</font> ";
		} else if ($(this).index() + selectedli.length == 20) {
			centent = "<font userId='" + $(this).attr("userId") + "'>...</font>";
		} else {
			centent = "<font userId='" + $(this).attr("userId") + "'></font>";
		}
		$("#messagepeoplelist").append(centent);
	});
}

/* 未读信息统计 */
function countMessage() {
	$("#xx").find('.af-badge').html(0, true);
	$.jsonP({
		url: "http://" + ipaddress + "/" + serviceName + "/appMessage/countMessage.do?userId=" + getSession('uid') + "&callback=?",
		success: function(json) {
			if (json.status == -1) {
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) { /* 无未读信息 */
				$("#xx").find('.af-badge').html(0, true);
			} else if (json.status == 1) { /* 有未读信息 */
				$("#xx").find('.af-badge').html(json.countMessage, true);
			}
		},
		Error: function() {
			$("#xx").find('.af-badge').html(0, true);
			alert('Error');
		}
	});
}

//考勤登记 目标列表改变时触发事件
function workLoginChangeXY() {
	var text = "";
	var getX = "";
	var getY = "";
	var obj = $("#workLoginScoreAddress");
	getX = obj.attr("targetX");
	getY = obj.attr("targetY");
	changeTragetLocation = "0";
	seriveChange = obj.attr("isCheck");
	/*for (var i = 0; i < obj.length; i++) { //下拉框的长度就是他的选项数
	    if (obj[i].selected == true) {
	        getX = $(obj[i]).attr("x");
	        getY = $(obj[i]).attr("y");
	        //text = obj[i].value; //获取文本
	        //alert("x:" + $(obj[i]).attr("x") + '| Y:' + $(obj[i]).attr("y"));
	    }
	}*/
	var thisX = $('#workLoginX').html();
	var thisY = $('#workLoginY').html();
	if (getX == thisX && getY == thisY) {
		$('#workLoginResult').html('是', true);
	} else {
		var distance = getFlatternDistance(getX, getY, thisX, thisY).toFixed(2);
		if (parseFloat(distance) > 1000.00) {
			$('#workLoginResult').html('否', true);
		} else if (parseFloat(distance) <= 1000.00) {
			$('#workLoginResult').html('是', true);
		} else {
			$('#workLoginResult').html('', true);
		}
		if (($('#workLoginResult').html() == "否" || $('#workLoginResult').html() == "") && seriveChange == "0") {
			showTargetLocationPopup();
		}
	}
}

/* 删除消息 */
function delMessage(id, name) {
	showMessage('删除中');
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		timeout: 20000, //超时时间设置，单位毫秒
		data: {
			pid: "'" + id + "'"
		},
		success: function(json) {
			if (json.status == -1) {
				popup.hide();
				showMessage('账号已失效');
				/* 1.5秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				popup.hide();
				showErrorPopup('提示', '删除失败');
			} else if (json.status == 1) {
				$('#' + id).remove();
				popup.hide();
				showMessage('删除成功');
				/* 1.5秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
				}, 1500);
			} else if (json.status == 2) {
				popup.hide();
				if (name == 'appMessage/delMessage') {
					showErrorPopup('提示', '消息已发送,不能进行删除!');
				} else if (name == 'appLeave/delLeaveRecord') {
					showErrorPopup('提示', '请假已审批,不能进行删除!');
				} else if (name == 'appSaleLog/delSaleLog') {
					showErrorPopup('提示', '销售日志已审批,不能进行删除!');
				}
			}
		},
		complete: function(response, status) {
			if (status == "timeout") {
				ajaxdata.abort();
				popup.hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}