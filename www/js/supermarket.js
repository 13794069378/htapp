/* 超市类型读取 */
var supermarkettypeobj = "";

function loadSuperMarketType(name) {
	var stopget = false;
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		async: false,
		dataType: 'jsonp',
		timeout: 10000, //超时时间设置，单位毫秒
		type: 'GET',
		data: {
			userId: getSession('uid')
		},
		success: function(json) {
			if (!stopget) {
				supermarkettypeobj = json.supermarketType;
			}
		},
		Error: function() {
			alert('Error');
		},
		complete: function(response, status) {
			if (status == "timeout") {
				stopget = true;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 超市建档列表读取 */
var supermarketinfo1 = "";
var supermarketinfo2 = "";

function loadSuperMarketListData(a, name) {
	supermarketinfo1 = $('#supermarketlistpeople').val();
	supermarketinfo2 = $('#supermarketliststatus').attr('textid');
	var tarP = "page_" + a;
	$('#' + tarP).hide();
	$('#' + tarP + '_none').hide();
	$('#' + tarP + '_button').hide();
	$('#' + tarP + '_loading').show();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			keyWord: supermarketinfo1,
			type: supermarketinfo2,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_button').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#' + tarP + '_loading').hide();
				$('#' + tarP).hide();
				$('#' + tarP + '_none').show();
				$('#' + tarP + '_button').show();
			} else if (json.status == 1) {
				$('#' + tarP + '_ul').html('', true);
				$('#' + tarP).attr('first', json.list[0].rownum);
				$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content = content + "<li><a href='#supermarket' data-transition='up' onclick=\"supermarketfirst=true;setId(" + json.list[i].id + ");\">";
					content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>" + json.list[i].orderDate + " 建档记录</font></p>";
					content = content + "<p><font>类型:</font><font>" + json.list[i].type + "</font></p>";
					content = content + "<p><font>编号:</font><font>" + json.list[i].sNo + "</font></p>";
					content = content + "<p><font>名称:</font><font>" + json.list[i].sName + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></a></li>";
				}
				$('#' + tarP + '_ul').append(content);
				supermarketlistscroller.scrollToTop();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP).show();
				$('#' + tarP + '_button').show();
			}
		},
		Error: function() {
			$('#' + tarP).hide();
			$('#' + tarP + '_none').hide();
			$('#' + tarP + '_loading').hide();
			$('#' + tarP + '_button').show();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_button').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 超市建档编辑、新增 */
var supermarketpid = '';

function loadSuperMarketEdit(name) {
	$('#supermarketloading').show();
	$('#supermarketbox').hide();
	$('#supermarketdw').show();
	$('#supermarketjx').show();
	$('#supermarketsavebutton').show();
	document.getElementById('supermarketstarttime').onclick = function() {
		WdatePicker({
			dateFmt: 'yyyy-MM-dd',
			maxDate: '#F{$dp.$D(\'supermarketendtime\')}'
		});
	};
	document.getElementById('supermarketendtime').onclick = function() {
		WdatePicker({
			dateFmt: 'yyyy-MM-dd',
			minDate: '#F{$dp.$D(\'supermarketstarttime\')}'
		});
	};
	document.getElementById('supermarketduty').onclick = function() {
		WdatePicker({
			dateFmt: 'yyyy-MM-dd',
			maxDate: '#F{$dp.$D(\'supermarketdimission\')}'
		});
	};
	document.getElementById('supermarketdimission').onclick = function() {
		WdatePicker({
			dateFmt: 'yyyy-MM-dd',
			minDate: '#F{$dp.$D(\'supermarketduty\')}'
		});
	};
	for (var i = 1; i < 5; i++) {
		$("#supermarketimg" + i).attr('take', 'false');
		$("#supermarketimg" + i).attr("onclick", 'takeBuildFileImg("supermarketimg' + i + '");');
		$("#supermarketimg" + i)[0].src = "images/blank.jpg";
	}
	$('#supermarkettype').val('请选择');
	$('#supermarkettype').attr('textid', '0');
	$('#supermarkettype').attr('onclick', "showPopupFont(9, 'supermarkettype')");
	$('#supermarketstatus').val('正常');
	$('#supermarketstatus').attr('textid', '正常');
	$('#supermarketstatus').attr('onclick', "showPopupFont(7, 'supermarketstatus')");
	$('#supermarketbox').find("input").attr('disabled', false);
	$('#supermarketdealerno').removeAttr("smid");
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			pid: getSession('keyid'),
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#supermarketbox').hide();
				$('#supermarketloading').hide();
				showMessage('账号已失效');
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#supermarketbox').hide();
				$('#supermarketloading').hide();
				showErrorPopup('提示', '信息有误');
			} else if (json.status == 1) { // 编辑 
				for (var i = 1; i < 5; i++) {
					$('#supermarketimg' + i)[0].src = 'images/imgloading.gif';
				}
				if (!parten.test(json.form.u_photo1)) {
					//$('#supermarketimg1')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.u_photo1;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.u_photo1, "supermarketimg1", checkimg);
				} else {
					$('#supermarketimg1')[0].src = "images/blank.jpg";
				}
				if (!parten.test(json.form.u_photo2)) {
					//$('#supermarketimg2')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.u_photo2;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.u_photo2, "supermarketimg2", checkimg);
				} else {
					$('#supermarketimg2')[0].src = "images/blank.jpg";
				}
				if (!parten.test(json.form.u_photo3)) {
					//$('#supermarketimg3')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.u_photo3;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.u_photo3, "supermarketimg3", checkimg);
				} else {
					$('#supermarketimg3')[0].src = "images/blank.jpg";
				}
				if (!parten.test(json.form.u_photo4)) {
					//$('#supermarketimg4')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.u_photo4;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.u_photo4, "supermarketimg4", checkimg);
				} else {
					$('#supermarketimg4')[0].src = "images/blank.jpg";
				}
				supermarketpid = json.form.nID;
				for (var i = 0; i < supermarkettypeobj.length; i++) {
					if (supermarkettypeobj[i].id == json.form.nTypeID) {
						$('#supermarkettype').val(supermarkettypeobj[i].val);
						break;
					}
				}
				$('#supermarkettype').attr('textid', json.form.nTypeID);
				$("#supermarketno").html(json.form.cSMNO, true);
				$("#supermarketname").val(json.form.cSMName);
				$("#supermarketcity").val(json.form.cCity);
				$("#supermarketinput").val(json.form.nPercent);
				$("#supermarketbudget").val(json.form.nBudget);
				$("#supermarketstatus").val(json.form.cState);
				$('#supermarketstatus').attr('textid', json.form.cState);
				$("#supermarketproductnum").val(json.form.nProdNum);
				$("#supermarketshowarea").val(json.form.cTotalDisp);
				$("#supermarkethtshowarea").val(json.form.cHTDisp);
				$("#supermarketselltarget").val(json.form.nTarget);
				$("#supermarketarea").val(json.form.nArea);
				$("#supermarketstarttime").val(json.form.dBeginDisp);
				$("#supermarketendtime").val(json.form.dEndDisp);
				$("#supermarketcontact").val(json.form.cSaleser);
				$("#supermarkettel").val(json.form.cTel);
				$("#supermarketduty").val(json.form.dEntry);
				$("#supermarketdimission").val(json.form.dLeave);
				$("#supermarketux").html(json.form.u_x, true);
				$("#supermarketuy").html(json.form.u_y, true);
				$("#supermarketdealername").html(json.form.cdwmc, true);
				$("#supermarketuaddress").html(json.form.u_address, true);
				$("#supermarketdealerno").html(json.form.cDealerNO, true);
				$('#supermarketdealerno').attr("smid", json.form.cDealerNO);
				$("#supermarketdealerinfo").show();
				$('#supermarketloading').hide();
				$('#supermarketbox').show();
				if (json.form.is_ok == "1") {
					$('#supermarketsavebutton').hide();
				}
			} else if (json.status == 2) { // 新增
				$('#supermarketcode').hide();
				locationSuperMarket();
				/*$('#supermarketloading').hide();
				$('#supermarketbox').show();*/
			} else if (json.status == 3) { // 浏览 
				for (var i = 1; i < 5; i++) {
					$('#supermarketimg' + i)[0].src = 'images/imgloading.gif';
				}
				if (!parten.test(json.form.u_photo1)) {
					//$('#supermarketimg1')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.u_photo1;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.u_photo1, "supermarketimg1", checkimg);
				} else {
					$('#supermarketimg1')[0].src = "images/blank.jpg";
				}
				if (!parten.test(json.form.u_photo2)) {
					//$('#supermarketimg2')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.u_photo2;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.u_photo2, "supermarketimg2", checkimg);
				} else {
					$('#supermarketimg2')[0].src = "images/blank.jpg";
				}
				if (!parten.test(json.form.u_photo3)) {
					//$('#supermarketimg3')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.u_photo3;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.u_photo3, "supermarketimg3", checkimg);
				} else {
					$('#supermarketimg3')[0].src = "images/blank.jpg";
				}
				if (!parten.test(json.form.u_photo4)) {
					//$('#supermarketimg4')[0].src = "http://" + ipaddress + "/" + serviceName + "/htwyRes/saleApp/" + json.form.u_photo4;
					Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoPath=&photoName=" + json.form.u_photo4, "supermarketimg4", checkimg);
				} else {
					$('#supermarketimg4')[0].src = "images/blank.jpg";
				}
				for (var i = 0; i < supermarkettypeobj.length; i++) {
					if (supermarkettypeobj[i].id == json.form.nTypeID) {
						$('#supermarkettype').val(supermarkettypeobj[i].val);
						break;
					}
				}
				$('#supermarkettype').attr('textid', json.form.nTypeID);
				$("#supermarketno").html(json.form.cSMNO, true);
				$("#supermarketname").val(json.form.cSMName);
				$("#supermarketcity").val(json.form.cCity);
				$("#supermarketinput").val(json.form.nPercent);
				$("#supermarketbudget").val(json.form.nBudget);
				$("#supermarketstatus").val(json.form.cState);
				$('#supermarketstatus').attr('textid', json.form.cState);
				$("#supermarketproductnum").val(json.form.nProdNum);
				$("#supermarketshowarea").val(json.form.cTotalDisp);
				$("#supermarkethtshowarea").val(json.form.cHTDisp);
				$("#supermarketselltarget").val(json.form.nTarget);
				$("#supermarketarea").val(json.form.nArea);
				$("#supermarketstarttime").val(json.form.dBeginDisp);
				$("#supermarketendtime").val(json.form.dEndDisp);
				$("#supermarketcontact").val(json.form.cSaleser);
				$("#supermarkettel").val(json.form.cTel);
				$("#supermarketduty").val(json.form.dEntry);
				$("#supermarketdimission").val(json.form.dLeave);
				$("#supermarketux").html(json.form.u_x, true);
				$("#supermarketuy").html(json.form.u_y, true);
				$("#supermarketdealername").html(json.form.cdwmc, true);
				$("#supermarketuaddress").html(json.form.u_address, true);
				$("#supermarketdealerno").html(json.form.cDealerNO, true);
				$('#supermarketdealerno').attr("smid", json.form.cDealerNO);
				$('#supermarketbox').find("input").attr('disabled', true);
				$('#supermarketbox').find("input[type='text']").removeAttr('onclick');
				$('#supermarketdw').hide();
				$('#supermarketjx').hide();
				$('#supermarketsavebutton').hide();
				$('#supermarketcode').show();
				$("#supermarketdealerinfo").show();
				$('#supermarketloading').hide();
				$('#supermarketbox').show()
			}
		},
		Error: function() {
			$('#supermarketloading').hide();
			$('#supermarketbox').hide()
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#supermarketloading').hide();
				$('#supermarketbox').hide()
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 超市建档自动定位 */
function locationSuperMarket() {
	var success = function(p) {
		popup.hide();
		if (p.addr == undefined) {
			showLocationError(7);
		} else {
			document.getElementById("supermarketuy").innerHTML = p.lontitude;
			document.getElementById("supermarketux").innerHTML = p.latitude;
			$("#supermarketuaddress").html(p.addr, true);
		}
		$('#supermarketloading').hide();
		$('#supermarketbox').show();
	};
	var error = function(message) {
		$('#supermarketloading').hide();
		$('#supermarketbox').show();
		showErrorPopup('提示', message);
	};
	if (systemname == "iOS") {
		locationtype = 6;
		getlocationtest();
	} else {
		if (isBDlocation) {
			BaiduLocationPlugin.createEvent("定位", success, error);
		} else {
			TXLocationPlugin.createEvent("定位", success, error);
		}
	}
}

/* 超市目标值输入上限 */
function changeSuperMarketSellTarget() {
	var temptarget = $('#supermarketselltarget').val();
	if (parseFloat(temptarget) > 500) {
		$('#supermarketselltarget').css('border-color', 'red');
		$('#supermarketselltarget').focus();
	} else {
		$('#supermarketselltarget').css('border-color', '#cccccc');
	}
}

/* 超市建档点击定位 */
function superMarketLocaltion() {
	showMessage('定位中');
	var success = function(p) {
		popup.hide();
		if (p.addr == undefined) {
			showLocationError(6);
		} else {
			document.getElementById("supermarketuy").innerHTML = p.lontitude;
			document.getElementById("supermarketux").innerHTML = p.latitude;
			$("#supermarketuaddress").html(p.addr, true);
		}
	};
	var error = function(message) {
		popup.hide();
		showErrorPopup('提示', message);
	};
	if (systemname == "iOS") {
		locationtype = 6;
		getlocationtest();
	} else {
		if (isBDlocation) {
			BaiduLocationPlugin.createEvent("定位", success, error);
		} else {
			TXLocationPlugin.createEvent("定位", success, error);
		}
	}
}

/* 超市建档保存 */
var supermarketnid = "";

function superMarketSave(name) {
	var nTypeID = $("#supermarkettype").attr('textid');
	var cSMName = $('#supermarketname').val();
	var cCity = $('#supermarketcity').val();
	var nPercent = $('#supermarketinput').val();
	var cState = $('#supermarketstatus').attr('textid');
	var nProdNum = $('#supermarketproductnum').val();
	var cTotalDisp = $('#supermarketshowarea').val();
	var cHTDisp = $('#supermarkethtshowarea').val();
	var nTarget = $('#supermarketselltarget').val();
	var nArea = $('#supermarketarea').val();
	var dBeginDisp = $('#supermarketstarttime').val();
	var dEndDisp = $('#supermarketendtime').val();
	var cSaleser = $('#supermarketcontact').val();
	var cTel = $('#supermarkettel').val();
	var dEntry = $('#supermarketduty').val();
	var dLeave = $('#supermarketdimission').val();
	var nBudget = $('#supermarketbudget').val();
	var u_y = $('#supermarketuy').html();
	var u_x = $('#supermarketux').html();
	var u_address = $('#supermarketuaddress').html();
	var cDealerNO = $('#supermarketdealerno').attr("smid");
	var upphotonum = 0;
	for (var i = 1; i < 5; i++) {
		if ($('#supermarketimg' + i).attr('take') == 'true') {
			upphotonum++;
		}
	}
	var emptynum = 0;
	var tempsupermarket = $('#supermarketbox').find(".supermarketdata");
	for (var i = 0; i < tempsupermarket.length; i++) {
		if (parten.test(tempsupermarket.eq(i).val())) {
			tempsupermarket.eq(i).css("border-color", "red");
			emptynum++;
		} else {
			tempsupermarket.eq(i).css("border-color", "#cccccc");
		}
	}
	if (nTypeID == 0) {
		$("#supermarkettype").css("border-color", "red");
		emptynum++;
	} else {
		$("#supermarkettype").css("border-color", "#cccccc");
	}
	if (parten.test(dEntry) || dEntry == undefined) {
		showErrorPopup('提示', "入职时间不能为空");
		return;
	}
	if (parten.test(dLeave) || dLeave == undefined) {
		dLeave = "1900-01-01";
	}
	if (emptynum > 0) {
		showErrorPopup('提示', "'*'号必选项不能为空");
		return;
	}
	if (parten.test(cDealerNO)) {
		showErrorPopup('提示', "经销商不能为空");
		return;
	} else if (parten.test(getSession("keyid")) && upphotonum < 3) {
		showErrorPopup('提示', '至少需要3张图片!');
		return;
	} else if (parten.test(u_address)) {
		showErrorPopup('提示', "定位坐标地址不能为空");
		return;
	}
	showMessage('保存中');
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		cache: false,
		timeout: 20000, //超时时间设置，单位毫秒
		dataType: 'jsonp',
		data: {
			userId: getSession('uid'),
			nID: getSession('keyid'),
			nTypeID: nTypeID,
			cSMName: encodeURI(cSMName),
			cCity: encodeURI(cCity),
			nPercent: nPercent,
			cState: encodeURI(cState),
			nProdNum: nProdNum,
			cTotalDisp: encodeURI(cTotalDisp),
			cHTDisp: encodeURI(cHTDisp),
			nTarget: nTarget,
			nBudget: nBudget,
			nArea: nArea,
			dBeginDisp: dBeginDisp + " 00:00:00",
			dEndDisp: dEndDisp + " 00:00:00",
			cSaleser: encodeURI(cSaleser),
			cTel: cTel,
			userName: htuserid,
			dEntry: dEntry + " 00:00:00",
			dLeave: dLeave + " 00:00:00",
			u_y: u_y,
			u_x: u_x,
			u_address: encodeURI(u_address),
			cDealerNO: cDealerNO
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
				supermarketnid = json.pid;
				setSession("keyid", json.pid);
				upSuperMarketImg();
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

/* 超市建档记录上下拉更新 */
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var supermarketlistscroller = '';

function updateSuperMarketList(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	supermarketlistscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	supermarketlistscroller.addInfinite();
	/* 下拉更新 */
	supermarketlistscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(supermarketlistscroller, "refresh-release", function() {
		//console.log("refresh-release");
		var that = this;
		clearTimeout(hideClose);
		hideClose = setTimeout(function() {
			//console.log("hiding manually refresh");
			//$("#infinite").remove();
			var ajaxdata = $.ajax({
				url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
				dataType: 'jsonp',
				type: 'post',
				timeout: 10000, //超时时间设置，单位毫秒
				data: {
					id: $("#" + tarP).attr('first'),
					keyWord: supermarketinfo1,
					type: supermarketinfo2,
					num: 10,
					mark: 1,
					userId: getSession('uid')
				},
				success: function(json) {
					if (json.status == -1) {
						showMessage('账号已失效');
						/* 1秒后隐藏提示 */
						window.setTimeout(function() {
							popup.hide();
							$.ui.loadContent("#main", true, true, "up");
						}, 1500);
					} else if (json.status == 0) {
						Toast("没有更多", 2000);
					} else if (json.status == 1) {
						$('#' + tarP).attr('first', json.list[0].rownum);
						var content = '';
						for (var i = 0; i < json.list.length; i++) {
							content = content + "<li><a href='#supermarket' data-transition='up' onclick=\"supermarketfirst=true;setId(" + json.list[i].id + ");\">";
							content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>" + json.list[i].orderDate + " 建档记录</font></p>";
							content = content + "<p><font>类型:</font><font>" + json.list[i].type + "</font></p>";
							content = content + "<p><font>编号:</font><font>" + json.list[i].sNo + "</font></p>";
							content = content + "<p><font>名称:</font><font>" + json.list[i].sName + "</font></p></div>";
							content = content + "<div style='clear: both;'></div></a></li>";
						}
						$('#' + tarP + '_ul').prepend(content);
					}
					that.hideRefresh();
				},
				Error: function() {
					that.hideRefresh();
					alert('Error');
				},
				complete: function(response) {
					if (response.status == 200) {} else {
						ajaxdata.abort();
						that.hideRefresh();
						showErrorPopup('提示', '服务器连接失败!');
					}
				}
			});
		}, 1000);
		return false; //tells it to not auto-cancel the refresh
	});

	$.bind(supermarketlistscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	supermarketlistscroller.enable();
	var isLoading = false;
	$.bind(supermarketlistscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(supermarketlistscroller, "infinite-scroll-end", function() {
			$.unbind(supermarketlistscroller, "infinite-scroll-end");
			//$(self.el).find("#infinite").remove();
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				/*setTimeout(function () {*/
				/*if ($(self.el).find("#infinite").length == 0) {
				    $(this.el).append("<div id='infinite' class='buttons'><img src='images/loading.gif' style='width: 30px;'>加载中</div>");
				}*/
				var ajaxdata = $.ajax({
					url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
					dataType: 'jsonp',
					type: 'post',
					timeout: 10000, //超时时间设置，单位毫秒
					data: {
						id: $("#" + tarP).attr('last'),
						keyWord: supermarketinfo1,
						type: supermarketinfo2,
						num: 10,
						mark: 0,
						userId: getSession('uid')
					},
					success: function(json) {
						if (json.status == -1) {
							showMessage('账号已失效');
							/* 1秒后隐藏提示 */
							window.setTimeout(function() {
								popup.hide();
								$.ui.loadContent("#main", true, true, "up");
							}, 1500);
						} else if (json.status == 0) {
							Toast("没有更多", 2000);
						} else if (json.status == 1) {

							$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);

							var content = '';
							for (var i = 0; i < json.list.length; i++) {
								content = content + "<li><a href='#supermarket' data-transition='up' onclick=\"supermarketfirst=true;setId(" + json.list[i].id + ");\">";
								content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>" + json.list[i].orderDate + " 建档记录</font></p>";
								content = content + "<p><font>类型:</font><font>" + json.list[i].type + "</font></p>";
								content = content + "<p><font>编号:</font><font>" + json.list[i].sNo + "</font></p>";
								content = content + "<p><font>名称:</font><font>" + json.list[i].sName + "</font></p></div>";
								content = content + "<div style='clear: both;'></div></a></li>";
							}
							$('#' + tarP + '_ul').append(content);
						}
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
					},
					Error: function() {
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
						alert('Error');
					},
					complete: function(response) {
						if (response.status == 200) {} else {
							ajaxdata.abort();
							$(self.el).find("#infinite").remove();
							self.clearInfinite();
							isLoading = false;
							showErrorPopup('提示', '服务器连接失败!');
						}
					}
				});
				//self.scrollToBottom();
				/*}, 1000);*/
			}
		});
	});
}

/* 数据初始化 */
function createSuperMarketData(a) {
	$("#" + a).find("input[type='text']").val('');
	$("#" + a).find("input[type='tel']").val('');
	$("#" + a).find("input[type='number']").val('');
	$("#" + a).find("textarea").val('');
	$("#" + a).find("span").empty();
	$("#" + a).removeClass("textid");
	//$("#" + a).find("input").css("border-color", "#cccccc");
}

/* 订单删除 */
function orderDel(a) {
	$(a).closest("li").remove();
	countOrderAllPriceAndNum();
}

/* 订单输入空判断 */
function orderInputNull(a) {
	var templi = $(a).closest('li');
	var tempinput = templi.find('input');
	var tempid = templi.find(".ordernum").html();
	if (!parten.test(tempinput.eq(0).val()) && !parten.test(tempinput.eq(1).val())) {
		//信息写入缓存列
		var tempallprice = ""
		var tempinputprice = parseFloat(tempinput.eq(0).val());
		var tempinputnum = parseFloat(tempinput.eq(1).val());
		var temporderallprice = (tempinputprice * tempinputnum).toFixed(2);
		if (!isNaN(temporderallprice)) {
			tempallprice = temporderallprice;
		} else {
			tempallprice = 0;
		}
		var tempname = templi.find(".ordername").html();
		$('#page_ddcp_tempul').find("#" + tempid).remove();
		var tempinfo = '<li id="' + tempid + '" proname="' + tempname + '" proprice="' + tempinputprice.toFixed(2) + '" pronum="' + tempinputnum + '" proallprice="' + tempallprice + '"></li>';
		$('#page_ddcp_tempul').append(tempinfo);
	} else {
		$('#page_ddcp_tempul').find("#" + tempid).remove();
	}
}

/* 订单产品添加 */
function addOrderProduct() {
	var templi = $('#page_ddcp_tempul').find("li");
	templi.each(function() {
		var templidata = '<li onclick="inputCheckText(this, 1)" style="border-bottom: 1px solid #D9D9D9;">' +
			'<table class="tablemess" style="margin-top: -7px;">' +
			'<tr>' +
			'<td rowspan="3" style="width: 10%; padding-right: 5px; padding-left: 0px;">' +
			'<img src="images/manicon.png" style="width: 100%;" />' +
			'</td>' +
			'<td style="width: 80%;">' +
			'(<font class="orderproductid">' + $(this).attr("id") + '</font>)<font class="orderproductname">' + $(this).attr("proname") + '</font>' +
			'</td>' +
			'<td class="deltest orderdel" rowspan="3" style="width: 10%; padding-left: 5px; padding-right: 0px;" onclick="showPopupDelProduct(this);event.stopPropagation();">' +
			'<img src="images/del.jpg" style="width: 20px;" />' +
			'</td>' +
			'</tr>' +
			'<tr>' +
			'<td>' +
			'实价:<font class="orderproductprice">' + $(this).attr("proprice") + '</font> ' +
			'数量:<font class="orderproductnum">' + $(this).attr("pronum") + '</font>' +
			'</td>' +
			'</tr>' +
			'<tr>' +
			'<td>' +
			'总价:<font class="orderproductallprice">' + $(this).attr("proallprice") + '</font>' +
			'</td>' +
			'</tr>' +
			'</table>' +
			'</li>';
		$('#orderproductlistul').append(templidata);
	});
	countOrderAllPriceAndNum();
	$.ui.goBack();
}

/* 登录日志读取 */
var loginloginfo1 = "";
var loginloginfo2 = "";

function loadLoginLogData(a, name) {
	loginloginfo1 = $('#loginlogpeople').val();
	loginloginfo2 = $('#logintime').val();
	var tarP = "page_" + a;
	$('#' + tarP).hide();
	$('#' + tarP + '_none').hide();
	$('#' + tarP + '_button').hide();
	$('#' + tarP + '_loading').show();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			keyWord: loginloginfo2,
			type: loginloginfo1,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_button').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#' + tarP + '_loading').hide();
				$('#' + tarP).hide();
				$('#' + tarP + '_none').show();
				$('#' + tarP + '_button').show();
			} else if (json.status == 1) {
				$('#' + tarP + '_ul').html('', true);
				$('#' + tarP).attr('first', json.list[0].rownum);
				$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content = content + "<li>";
					content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 25px;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>" + json.list[i].name + " " + json.list[i].remark + "</font></p>";
					content = content + "<p><font>" + json.list[i].createDate + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></li>";
				}
				$('#' + tarP + '_ul').append(content);
				loginlogscroller.scrollToTop();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP).show();
				$('#' + tarP + '_button').show();
			}
		},
		Error: function() {
			$('#' + tarP).hide();
			$('#' + tarP + '_none').hide();
			$('#' + tarP + '_loading').hide();
			$('#' + tarP + '_button').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_button').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 登录日志记录上下拉更新 */
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var loginlogscroller = '';

function updateLoginLog(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	loginlogscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	loginlogscroller.addInfinite();
	/* 下拉更新 */
	loginlogscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(loginlogscroller, "refresh-release", function() {
		//console.log("refresh-release");
		var that = this;
		clearTimeout(hideClose);
		hideClose = setTimeout(function() {
			//console.log("hiding manually refresh");
			//$("#infinite").remove();
			var ajaxdata = $.ajax({
				url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
				dataType: 'jsonp',
				type: 'post',
				timeout: 10000, //超时时间设置，单位毫秒
				data: {
					id: $("#" + tarP).attr('first'),
					keyWord: loginloginfo2,
					type: loginloginfo1,
					num: 10,
					mark: 1,
					userId: getSession('uid')
				},
				success: function(json) {
					if (json.status == -1) {
						showMessage('账号已失效');
						/* 1秒后隐藏提示 */
						window.setTimeout(function() {
							popup.hide();
							$.ui.loadContent("#main", true, true, "up");
						}, 1500);
					} else if (json.status == 0) {
						Toast("没有更多", 2000);
					} else if (json.status == 1) {

						$('#' + tarP).attr('first', json.list[0].rownum);

						var content = '';
						for (var i = 0; i < json.list.length; i++) {
							content = content + "<li>";
							content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 25px;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>" + json.list[i].name + " " + json.list[i].remark + "</font></p>";
							content = content + "<p><font>" + json.list[i].createDate + "</font></p></div>";
							content = content + "<div style='clear: both;'></div></li>";
						}
						$('#' + tarP + '_ul').prepend(content);
					}
					that.hideRefresh();
				},
				Error: function() {
					that.hideRefresh();
					alert('Error');
				},
				complete: function(response) {
					if (response.status == 200) {} else {
						ajaxdata.abort();
						that.hideRefresh();
						showErrorPopup('提示', '服务器连接失败!');
					}
				}
			});
		}, 1000);
		return false; //tells it to not auto-cancel the refresh
	});

	$.bind(loginlogscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	loginlogscroller.enable();
	var isLoading = false;
	$.bind(loginlogscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(loginlogscroller, "infinite-scroll-end", function() {
			$.unbind(loginlogscroller, "infinite-scroll-end");
			//$(self.el).find("#infinite").remove();
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				/*setTimeout(function () {*/
				/*if ($(self.el).find("#infinite").length == 0) {
				    $(this.el).append("<div id='infinite' class='buttons'><img src='images/loading.gif' style='width: 30px;'>加载中</div>");
				}*/
				var ajaxdata = $.ajax({
					url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
					dataType: 'jsonp',
					type: 'post',
					timeout: 10000, //超时时间设置，单位毫秒
					data: {
						id: $("#" + tarP).attr('last'),
						keyWord: loginloginfo2,
						type: loginloginfo1,
						num: 10,
						mark: 0,
						userId: getSession('uid')
					},
					success: function(json) {
						if (json.status == -1) {
							showMessage('账号已失效');
							/* 1秒后隐藏提示 */
							window.setTimeout(function() {
								popup.hide();
								$.ui.loadContent("#main", true, true, "up");
							}, 1500);
						} else if (json.status == 0) {
							Toast("没有更多", 2000);
						} else if (json.status == 1) {

							$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);

							var content = '';
							for (var i = 0; i < json.list.length; i++) {
								content = content + "<li>";
								content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 25px;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>" + json.list[i].name + " " + json.list[i].remark + "</font></p>";
								content = content + "<p><font>" + json.list[i].createDate + "</font></p></div>";
								content = content + "<div style='clear: both;'></div></li>";
							}
							$('#' + tarP + '_ul').append(content);
						}
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
					},
					Error: function() {
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
						alert('Error');
					},
					complete: function(response) {
						if (response.status == 200) {} else {
							ajaxdata.abort();
							$(self.el).find("#infinite").remove();
							self.clearInfinite();
							isLoading = false;
							showErrorPopup('提示', '服务器连接失败!');
						}
					}
				});
				//self.scrollToBottom();
				/*}, 1000);*/
			}
		});
	});
}

/* 订单列表读取 */
var orderinfo1 = "";
var orderinfo2 = "";
var orderinfo3 = "";

function loadOrderListData(a, name) {
	orderinfo1 = $('#orderlistpeople').val();
	orderinfo2 = $('#orderlistbegintime').val();
	orderinfo3 = $('#orderlistendtime').val();
	var tarP = "page_" + a;
	$('#' + tarP).hide();
	$('#' + tarP + '_none').hide();
	$('#' + tarP + '_button').hide();
	$('#' + tarP + '_loading').show();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			keyWord: orderinfo1,
			date1: orderinfo2,
			date2: orderinfo3,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_button').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#' + tarP + '_loading').hide();
				$('#' + tarP).hide();
				$('#' + tarP + '_none').show();
				$('#' + tarP + '_button').show();
			} else if (json.status == 1) {
				$('#' + tarP + '_ul').html('', true);
				$('#' + tarP).attr('first', json.list[0].rownum);
				$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					/*content = content + "<li><a href='#order' data-transition='up' onclick=\"orderfirst=true;setId(" + json.list[i].nid + ");\">";
                    content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
                    content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>订单编号:</font><font>" + json.list[i].OrderID + "</font></p>";
                    content = content + "<p><font>订单类型:</font><font>" + json.list[i].cType + "</font></p>";
                    content = content + "<p><font>经销商编号:</font><font>" + json.list[i].cDwbh + "</font></p>";
                    content = content + "<p><font>联盟商编号:</font><font>" + json.list[i].ALID + "</font></p>";
					content = content + "<p><font>联盟商名称:</font><font>" + json.list[i].AllianceName + "</font></p>";
					content = content + "<p><font>创建时间:</font><font>" + json.list[i].CreateTime + "</font></p></div>";
                    content = content + "<div style='clear: both;'></div></a></li>";*/
					content += "<li onclick=\"orderfirst=true;setId(" + json.list[i].nid + ");$.ui.loadContent('#order', false, false, 'up');\" style='border-bottom: 1px solid #D9D9D9;'>" +
						'<table class="tablemess">' +
						'<tr>' +
						'<td rowspan="6" style="width: 10%; padding-right: 5px; padding-left: 0px;">' +
						'<img src="images/messageicon.png" style="width: 100%;" />' +
						'</td>' +
						'<td style="width: 80%;">' +
						"<font>订单编号: </font><font class='orderlistid'>" + json.list[i].OrderID + "</font>" +
						'</td>' +
						'<td class="deltest" rowspan="6" style="width: 10%; padding-left: 5px; padding-right: 0px;" onclick="showPopup8(this);event.stopPropagation();">' +
						'<img src="images/del.jpg" style="width: 20px;" />' +
						'</td>' +
						'</tr>' +
						"<tr>" +
						"<td>" +
						"<font>订单类型: </font><font>" + json.list[i].cType + "</font>" +
						"</td>" +
						"</tr>" +
						"<tr>" +
						"<td>" +
						"<font>经销商编号: </font><font>" + json.list[i].cDwbh + "</font>" +
						"</td>" +
						"</tr>" +
						"<tr>" +
						"<td>" +
						"<font>联盟商编号: </font><font>" + json.list[i].ALID + "</font>" +
						"</td>" +
						"</tr>" +
						"<tr>" +
						"<td>" +
						"<font>联盟商名称: </font><font>" + json.list[i].AllianceName + "</font>" +
						"</td>" +
						"</tr>" +
						"<tr>" +
						"<td>" +
						"<font>创建时间: </font><font>" + json.list[i].CreateTime + "</font>" +
						"</td>" +
						"</tr>" +
						'</table>' +
						'</li>';
				}
				$('#' + tarP + '_ul').append(content);
				orderlistscroller.scrollToTop();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP).show();
				$('#' + tarP + '_button').show();
			}
		},
		Error: function() {
			$('#' + tarP).hide();
			$('#' + tarP + '_none').hide();
			$('#' + tarP + '_loading').hide();
			$('#' + tarP + '_button').show();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_button').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 订单记录上下拉更新 */
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var orderlistscroller = '';

function updateOrderList(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	orderlistscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	orderlistscroller.addInfinite();
	/* 下拉更新 */
	orderlistscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(orderlistscroller, "refresh-release", function() {
		//console.log("refresh-release");
		var that = this;
		clearTimeout(hideClose);
		hideClose = setTimeout(function() {
			//console.log("hiding manually refresh");
			//$("#infinite").remove();
			var ajaxdata = $.ajax({
				url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
				dataType: 'jsonp',
				type: 'post',
				timeout: 10000, //超时时间设置，单位毫秒
				data: {
					id: $("#" + tarP).attr('first'),
					keyWord: orderinfo1,
					date1: orderinfo2,
					date2: orderinfo3,
					num: 10,
					mark: 1,
					userId: getSession('uid')
				},
				success: function(json) {
					if (json.status == -1) {
						showMessage('账号已失效');
						/* 1秒后隐藏提示 */
						window.setTimeout(function() {
							popup.hide();
							$.ui.loadContent("#main", true, true, "up");
						}, 1500);
					} else if (json.status == 0) {
						Toast("没有更多", 2000);
					} else if (json.status == 1) {

						$('#' + tarP).attr('first', json.list[0].rownum);

						var content = '';
						for (var i = 0; i < json.list.length; i++) {
							/*content = content + "<li><a href='#order' data-transition='up' onclick=\"orderfirst=true;setId(" + json.list[i].nid + ");\">";
							content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>订单编号:</font><font>" + json.list[i].OrderID + "</font></p>";
							content = content + "<p><font>订单类型:</font><font>" + json.list[i].cType + "</font></p>";
							content = content + "<p><font>经销商编号:</font><font>" + json.list[i].cDwbh + "</font></p>";
							content = content + "<p><font>联盟商编号:</font><font>" + json.list[i].ALID + "</font></p>";
							content = content + "<p><font>联盟商名称:</font><font>" + json.list[i].AllianceName + "</font></p>";
							content = content + "<p><font>创建时间:</font><font>" + json.list[i].CreateTime + "</font></p></div>";
							content = content + "<div style='clear: both;'></div></a></li>";*/
							content += "<li onclick=\"orderfirst=true;setId(" + json.list[i].nid + ");$.ui.loadContent('#order', false, false, 'up');\" style='border-bottom: 1px solid #D9D9D9;'>" +
								'<table class="tablemess">' +
								'<tr>' +
								'<td rowspan="6" style="width: 10%; padding-right: 5px; padding-left: 0px;">' +
								'<img src="images/messageicon.png" style="width: 100%;" />' +
								'</td>' +
								'<td style="width: 80%;">' +
								"<font>订单编号: </font><font class='orderlistid'>" + json.list[i].OrderID + "</font>" +
								'</td>' +
								'<td class="deltest" rowspan="6" style="width: 10%; padding-left: 5px; padding-right: 0px;" onclick="showPopup8(this);event.stopPropagation();">' +
								'<img src="images/del.jpg" style="width: 20px;" />' +
								'</td>' +
								'</tr>' +
								"<tr>" +
								"<td>" +
								"<font>订单类型: </font><font>" + json.list[i].cType + "</font>" +
								"</td>" +
								"</tr>" +
								"<tr>" +
								"<td>" +
								"<font>经销商编号: </font><font>" + json.list[i].cDwbh + "</font>" +
								"</td>" +
								"</tr>" +
								"<tr>" +
								"<td>" +
								"<font>联盟商编号: </font><font>" + json.list[i].ALID + "</font>" +
								"</td>" +
								"</tr>" +
								"<tr>" +
								"<td>" +
								"<font>联盟商名称: </font><font>" + json.list[i].AllianceName + "</font>" +
								"</td>" +
								"</tr>" +
								"<tr>" +
								"<td>" +
								"<font>创建时间: </font><font>" + json.list[i].CreateTime + "</font>" +
								"</td>" +
								"</tr>" +
								'</table>' +
								'</li>';
						}
						$('#' + tarP + '_ul').prepend(content);
					}
					that.hideRefresh();
				},
				Error: function() {
					that.hideRefresh();
					alert('Error');
				},
				complete: function(response) {
					if (response.status == 200) {} else {
						ajaxdata.abort();
						that.hideRefresh();
						showErrorPopup('提示', '服务器连接失败!');
					}
				}
			});
		}, 1000);
		return false; //tells it to not auto-cancel the refresh
	});

	$.bind(orderlistscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	orderlistscroller.enable();
	var isLoading = false;
	$.bind(orderlistscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(orderlistscroller, "infinite-scroll-end", function() {
			$.unbind(orderlistscroller, "infinite-scroll-end");
			//$(self.el).find("#infinite").remove();
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				/*setTimeout(function () {*/
				/*if ($(self.el).find("#infinite").length == 0) {
				    $(this.el).append("<div id='infinite' class='buttons'><img src='images/loading.gif' style='width: 30px;'>加载中</div>");
				}*/
				var ajaxdata = $.ajax({
					url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
					dataType: 'jsonp',
					type: 'post',
					timeout: 10000, //超时时间设置，单位毫秒
					data: {
						id: $("#" + tarP).attr('last'),
						keyWord: orderinfo1,
						date1: orderinfo2,
						date2: orderinfo3,
						num: 10,
						mark: 0,
						userId: getSession('uid')
					},
					success: function(json) {
						if (json.status == -1) {
							showMessage('账号已失效');
							/* 1秒后隐藏提示 */
							window.setTimeout(function() {
								popup.hide();
								$.ui.loadContent("#main", true, true, "up");
							}, 1500);
						} else if (json.status == 0) {
							Toast("没有更多", 2000);
						} else if (json.status == 1) {

							$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);

							var content = '';
							for (var i = 0; i < json.list.length; i++) {
								/*content = content + "<li><a href='#order' data-transition='up' onclick=\"orderfirst=true;setId(" + json.list[i].nid + ");\">";
								content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>订单编号:</font><font>" + json.list[i].OrderID + "</font></p>";
								content = content + "<p><font>订单类型:</font><font>" + json.list[i].cType + "</font></p>";
								content = content + "<p><font>经销商编号:</font><font>" + json.list[i].cDwbh + "</font></p>";
								content = content + "<p><font>联盟商编号:</font><font>" + json.list[i].ALID + "</font></p>";
								content = content + "<p><font>联盟商名称:</font><font>" + json.list[i].AllianceName + "</font></p>";
								content = content + "<p><font>创建时间:</font><font>" + json.list[i].CreateTime + "</font></p></div>";
								content = content + "<div style='clear: both;'></div></a></li>";*/
								content += "<li onclick=\"orderfirst=true;setId(" + json.list[i].nid + ");$.ui.loadContent('#order', false, false, 'up');\" style='border-bottom: 1px solid #D9D9D9;'>" +
									'<table class="tablemess">' +
									'<tr>' +
									'<td rowspan="6" style="width: 10%; padding-right: 5px; padding-left: 0px;">' +
									'<img src="images/messageicon.png" style="width: 100%;" />' +
									'</td>' +
									'<td style="width: 80%;">' +
									"<font>订单编号: </font><font class='orderlistid'>" + json.list[i].OrderID + "</font>" +
									'</td>' +
									'<td class="deltest" rowspan="6" style="width: 10%; padding-left: 5px; padding-right: 0px;" onclick="showPopup8(this);event.stopPropagation();">' +
									'<img src="images/del.jpg" style="width: 20px;" />' +
									'</td>' +
									'</tr>' +
									"<tr>" +
									"<td>" +
									"<font>订单类型: </font><font>" + json.list[i].cType + "</font>" +
									"</td>" +
									"</tr>" +
									"<tr>" +
									"<td>" +
									"<font>经销商编号: </font><font>" + json.list[i].cDwbh + "</font>" +
									"</td>" +
									"</tr>" +
									"<tr>" +
									"<td>" +
									"<font>联盟商编号: </font><font>" + json.list[i].ALID + "</font>" +
									"</td>" +
									"</tr>" +
									"<tr>" +
									"<td>" +
									"<font>联盟商名称: </font><font>" + json.list[i].AllianceName + "</font>" +
									"</td>" +
									"</tr>" +
									"<tr>" +
									"<td>" +
									"<font>创建时间: </font><font>" + json.list[i].CreateTime + "</font>" +
									"</td>" +
									"</tr>" +
									'</table>' +
									'</li>';
							}
							$('#' + tarP + '_ul').append(content);
						}
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
					},
					Error: function() {
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
						alert('Error');
					},
					complete: function(response) {
						if (response.status == 200) {} else {
							ajaxdata.abort();
							$(self.el).find("#infinite").remove();
							self.clearInfinite();
							isLoading = false;
							showErrorPopup('提示', '服务器连接失败!');
						}
					}
				});
			}
		});
	});
}

/* 订单列表删除 */
function delOrderList(a) {
	showMessage('删除中');
	var templi = $(a).closest("li");
	var tempdelid = templi.find(".orderlistid").eq(0).html();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/AppOrder/orderDel.do",
		cache: false,
		timeout: 20000, //超时时间设置，单位毫秒
		dataType: 'jsonp',
		data: {
			userId: getSession('uid'),
			pid: tempdelid
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
				showErrorPopup("提示", "删除失败");
			} else if (json.status == 1) {
				templi.remove();
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

/* 订单编辑、新增 */
function loadOrderEdit(name) {
	$('#orderloading').show();
	$('#orderbox').hide();
	$(".unionselectinfo").show();
	$("#ordersavebutton").show();
	document.getElementById('orderdeliverytime').onclick = function() {
		WdatePicker({
			dateFmt: 'yyyy-MM-dd',
			maxDate: '%y-%M-%d',
			minDate: '%y-%M-01'
		});
	};
	$("#ordertype").attr("textid", "");
	$("#ordertype").attr("onclick", "showPopupFont(10, 'ordertype')");
	$("#ordertype").attr("disabled", false);
	$("#orderjx").show();
	$("#orderlms").show();
	$("#ordercode").hide();
	$("#ordercreatetimeinfo").hide();
	$("#orderconfirmtimeinfo").hide();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			pid: getSession('keyid'),
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#orderbox').hide();
				$('#orderloading').hide();
				showMessage('账号已失效');
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#orderbox').hide();
				$('#orderloading').hide();
				showErrorPopup('提示', '信息有误');
			} else if (json.status == 1) { // 编辑
				$("#ordertype").attr("textid", json.form.orderType);
				if (json.form.orderType == 1) {
					$("#ordertype").val("联盟商");
				} else if (json.form.orderType == 2) {
					$("#ordertype").val("超市");
				}
				$("#ordercode").show();
				$("#ordercreatetimeinfo").show();
				$("#orderconfirmtimeinfo").show();
				$("#orderno").html(json.form.orderId, true);
				$("#ordercreatename").html(json.form.createName, true);
				$("#ordercreatetime").html(json.form.createTime, true);
				$("#orderconfirmtime").html(json.form.conFirmTime, true);
				$("#orderallnum").html(json.form.qty, true);
				$("#orderallmoney").html(json.form.amount, true);
				$("#orderremark").val(json.form.remark);
				$("#orderdeliverytime").val(json.form.planDate);
				$("#orderdealerno").html(json.KHList.khNo, true);
				$("#orderdealername").html(json.KHList.khName, true);
				$("#orderunionno").html(json.KHList.alNo, true);
				$("#orderunionname").html(json.KHList.alName, true);
				for (var i = 0; i < json.productList.length; i++) {
					var tempinputprice = parseFloat(json.productList[i].price);
					var tempinputnum = parseFloat(json.productList[i].qty);
					var temporderallprice = (tempinputprice * tempinputnum).toFixed(2);
					var content = '<li onclick="inputCheckText(this, 1)" style="border-bottom: 1px solid #D9D9D9;">' +
						'<table class="tablemess" style="margin-top: -7px;">' +
						'<tr>' +
						'<td rowspan="3" style="width: 10%; padding-right: 5px; padding-left: 0px;">' +
						'<img src="images/manicon.png" style="width: 100%;" />' +
						'</td>' +
						'<td style="width: 80%;">' +
						'(<font class="orderproductid">' + json.productList[i].productId + '</font>)<font class="orderproductname">' + json.productList[i].productName + '</font>' +
						'</td>' +
						'<td class="deltest orderdel" rowspan="3" style="width: 10%; padding-left: 5px; padding-right: 0px;" onclick="showPopupDelProduct(this);event.stopPropagation();">' +
						'<img src="images/del.jpg" style="width: 20px;" />' +
						'</td>' +
						'</tr>' +
						'<tr>' +
						'<td>' +
						'实价:<font class="orderproductprice">' + json.productList[i].price + '</font> ' +
						'数量:<font class="orderproductnum">' + json.productList[i].qty + '</font>' +
						'</td>' +
						'</tr>' +
						'<tr>' +
						'<td>' +
						'总价:<font class="orderproductallprice">' + temporderallprice + '</font>' +
						'</td>' +
						'</tr>' +
						'</table>' +
						'</li>';
					$("#orderproductlistul").append(content);
				}
				if (json.form.isConfirm == 1) { //已确认
					$("#ordercheckbutton").attr("checktrue", 'false');
					checkOrderOK("ordercheckbutton");
					$("#ordercheckbutton").attr("onclick", 'sendCheckOrder("Cancel")');
				} else {
					$("#ordercheckbutton").attr("checktrue", 'true');
					checkOrderOK("ordercheckbutton");
					$("#ordercheckbutton").attr("onclick", 'sendCheckOrder("")');
				}
				$("#ordertype").removeAttr("onclick");
				$("#ordertype").attr("disabled", true);
				$("#ordertype").removeClass("panelinput").addClass("panelcheck");
				$("#orderjx").hide();
				$("#orderlms").hide();
				$("#ordercheckbutton").show();
				$('#orderloading').hide();
				$('#orderbox').show();
			} else if (json.status == 2) { // 新增
				$("#ordercreatename").html(json.form.userName, true);
				$("#ordercheckbutton").attr("checktrue", 'true');
				$("#ordercheckbutton").hide();
				checkOrderOK("ordercheckbutton");
				$('#orderloading').hide();
				$(".unionselectinfo").hide();
				$('#orderbox').show();
			}
		},
		Error: function() {
			$('#orderloading').hide();
			$('#orderbox').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#orderloading').hide();
				$('#orderbox').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/** 订单确认
 * a 按钮id
 **/
function checkOrderOK(a) {
	if ($("#" + a).attr("checktrue") == 'false') { //确认
		document.getElementById('ordertype').onclick = function() {};
		document.getElementById('orderdeliverytime').onclick = function() {};
		$("#orderproductlistul").find("li").removeAttr("onclick");
		$("#orderproductlistul").find(".orderdel").hide();
		$("#ordertype").attr('disabled', true);
		$("#orderdeliverytime").attr('disabled', true);
		$("#orderremark").attr('disabled', true);
		$("#orderjx").hide();
		$("#orderlms").hide();
		$("#gonext").hide();
		$("#ordersavebutton").hide();
		$("#" + a).attr("checktrue", 'true');
		$("#" + a).html("取消确认", true);
		panelCheckCSS("orderbox");
	} else { //未确认
		document.getElementById('ordertype').onclick = function() {
			showPopupFont(10, 'ordertype');
		};
		document.getElementById('orderdeliverytime').onclick = function() {
			WdatePicker({
				dateFmt: 'yyyy-MM-dd',
				maxDate: '%y-%M-%d',
				minDate: '%y-%M-01'
			});
		};
		$("#orderproductlistul").find("li").attr("onclick", "inputCheckText(this, 1)");
		$("#orderproductlistul").find(".orderdel").show();
		$("#ordertype").attr('disabled', false);
		$("#orderdeliverytime").attr('disabled', false);
		$("#orderremark").attr('disabled', false);
		$("#orderjx").show();
		$("#orderlms").show();
		$("#gonext").show();
		$("#ordersavebutton").show();
		$("#" + a).attr("checktrue", 'false');
		$("#" + a).html("订单确认", true);
		panelInputCSS("orderbox");
	}
}

/* 订单提交确认或取消 */
function sendCheckOrder(a) {
	var temporder = $("#orderproductlistul").find("li");
	var orderdeliverytime = $("#orderdeliverytime").val();
	if (temporder.length == 0) {
		showErrorPopup('提示', '请先选择产品');
	} else if (parten.test(orderdeliverytime)) {
		showErrorPopup('提示', '请先选择出货日期');
	} else {
		showMessage('提交中');
		var priceList = [];
		var qtyList = [];
		var productList = [];
		temporder.each(function() {
			var tempid = $(this).find(".orderproductid").eq(0).html();
			var tempprice = $(this).find(".orderproductprice").eq(0).html();
			var tempnum = $(this).find(".orderproductnum").eq(0).html();
			productList.push(tempid);
			priceList.push(tempprice);
			qtyList.push(tempnum);
		});
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/AppOrder/orderSave.do",
			dataType: "jsonp",
			timeout: 20000, //超时时间设置，单位毫秒
			type: "post",
			data: {
				nID: getSession('keyid'),
				userId: getSession('uid'),
				AlID: $("#orderunionno").html(),
				khId: $("#orderdealerno").html(),
				createName: encodeURI($("#ordercreatename").html()),
				remark: encodeURI($("#orderremark").val()),
				planDate: orderdeliverytime,
				nTypeID: $("#ordertype").attr("textid"),
				productList: productList.join(","),
				qtyList: qtyList.join(","),
				priceList: priceList.join(",")
			},
			success: function(json) {
				if (json.status == 1) {
					sendCheckOrder1(a);
				} else if (json.status == 0) {
					showErrorPopup('提示', json.error);
					return false;
				} else if (json.status == -1) {
					showMessage('账号已失效');
					/* 1秒后隐藏提示 */
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
						return false;
					}, 1500);
				}
			},
			Error: function() {
				popup.hide();
				alert('Error');
				return false;
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

function sendCheckOrder1(a) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/AppOrder/order" + a + "Confirm.do",
		cache: false,
		timeout: 20000, //超时时间设置，单位毫秒
		dataType: 'jsonp',
		data: {
			pid: getSession('keyid')
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
				showErrorPopup("提示", "提交失败");
			} else if (json.status == 1) {
				if (parten.test(a)) {
					$("#ordercheckbutton").attr("checktrue", 'false');
					$("#ordercheckbutton").attr("onclick", 'sendCheckOrder("Cancel")');
					checkOrderOK("ordercheckbutton");
					Toast("提交成功", 1500);
				} else {
					$("#ordercheckbutton").attr("checktrue", 'true');
					$("#ordercheckbutton").attr("onclick", 'sendCheckOrder("")');
					checkOrderOK("ordercheckbutton");
					Toast("提交成功", 1500);
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

/* 订单产品读取 */
var orderunionpid = '';
var orderType = '';
var selectProduct = '';
var orderprokeyword = '';
var showprice = false;

function loadOrderProductListData(a, name) {
	var tarP = "page_" + a;
	$('#' + tarP + '_none').hide();
	$('#' + tarP + '_box').hide();
	$('#' + tarP + '_loading').show();
	$('#' + tarP + '_ul').empty();
	$("#page_ddcp_button").show();
	orderprokeyword = $("#orderproductpeople").val();
	orderunionpid = $("#orderunionno").html();
	orderType = $("#ordertype").attr("textid");
	var temporid = $("#orderproductlistul").find(".orderproductid");
	var tempiddata = [];
	temporid.each(function() {
		tempiddata.push($(this).html());
	});
	selectProduct = "'" + tempiddata.join("','") + "'";
	var stopget = false;
	$.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		cache: false,
		async: false,
		timeout: 10000, //超时时间设置，单位毫秒
		dataType: 'jsonp',
		data: {
			userId: getSession('uid'),
			keyWord: orderprokeyword,
			pid: orderunionpid,
			orderType: orderType,
			selectProduct: selectProduct
		},
		success: function(json) {
			if (!stopget) {
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
					$('#orderproduct').attr('last', json.productList[json.productList.length - 1].rownum);
					var temppage_ddcp_tempul = $("#page_ddcp_tempul").find("li");
					var content = '';
					for (var i = 0; i < json.productList.length; i++) {
						var tempproprice = '';
						var temppronum = '';
						for (var j = 0; j < temppage_ddcp_tempul.length; j++) {
							if (temppage_ddcp_tempul.eq(j).attr("id") == json.productList[i].productID) {
								tempproprice = temppage_ddcp_tempul.eq(j).attr("proprice");
								temppronum = temppage_ddcp_tempul.eq(j).attr("pronum");
							}
						}
						content += '<li>' +
							'<table class="tablemess">' +
							'<tr>' +
							'<td rowspan="3" style="width: 25px;padding-right: 5px;">' +
							'<img src="images/seticon.png" style="width: 100%;" />' +
							'</td>' +
							'<td colspan="2">' +
							'(<font class="ordernum">' + json.productList[i].productID + '</font>)<font class="ordername">' + json.productList[i].prodName + '</font>' +
							'</td>' +
							'</tr>' +
							'<tr>' +
							'<td class="standardPrice">' +
							'标准价格:' + json.productList[i].standardPrice +
							'</td>' +
							'<td>' +
							'单位:' + json.productList[i].unit +
							'</td>' +
							'</tr>' +
							'<tr>' +
							'<td>' +
							'<div style="float: right;width: 90%;padding: 0px 3px;">' +
							'<input type="number" onkeypress="clearNoNum(this)" onchange="orderInputNull(this)" value="' + tempproprice + '" style="margin-bottom: 0px;" />' +
							'</div>' +
							'<font style="float: right;width: 10%;">价格</font>' +
							'</td>' +
							'<td>' +
							'<div style="float: right;width: 90%;padding: 0px 3px;">' +
							'<input type="number" onkeypress="clearNoNum(this)" onchange="orderInputNull(this)" value="' + temppronum + '" style="margin-bottom: 0px;" />' +
							'</div>' +
							'<font style="float: right;width: 10%;">数量</font>' +
							'</td>' +
							'</tr>' +
							'</table>' +
							'</li>';
					}
					$('#' + tarP + '_ul').empty();
					$('#' + tarP + '_ul').append(content);
					if (showprice) {
						$('#' + tarP + '_ul').find(".standardPrice").show();
					} else {
						$('#' + tarP + '_ul').find(".standardPrice").hide();
					}
//					if ($(".sales_app_ddcpbutton").attr("qx") || $(".sales_app_ddcpbutton").attr("qx") == "true") {
					if (checkQX("sales_app_ddcpbutton")) {
						$("#page_ddcp_button").show();
					} else {
						$("#page_ddcp_button").hide();
					}
					orderproductlistscroller.scrollToTop();
					$('#' + tarP + '_none').hide();
					$('#' + tarP + '_loading').hide();
					$('#' + tarP + '_box').show();
				}
			}
		},
		Error: function() {
			$('#' + tarP + '_none').hide();
			$('#' + tarP + '_loading').hide();
			$('#' + tarP + '_box').hide();
			alert('Error');
		},
		complete: function(response, status) {
			if (status == "timeout") {
				stopget = true;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 订单产品上下拉更新 */
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var orderproductlistscroller = '';

function updateOrderProductList(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	orderproductlistscroller = $("#" + tarP + "_box").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	orderproductlistscroller.addInfinite();

	/* 上拉更新 */
	orderproductlistscroller.enable();
	var isLoading = false;
	$.bind(orderproductlistscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(orderproductlistscroller, "infinite-scroll-end", function() {
			$.unbind(orderproductlistscroller, "infinite-scroll-end");
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				var ajaxdata = $.ajax({
					url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
					type: "post",
					timeout: 10000, //超时时间设置，单位毫秒
					dataType: 'jsonp',
					data: {
						userId: getSession('uid'),
						id: $("#orderproduct").attr("last"),
						keyWord: encodeURI(orderprokeyword),
						pid: orderunionpid,
						orderType: orderType,
						selectProduct: selectProduct,
						num: 10,
						mark: 0
					},
					success: function(json) {
						if (json.status == -1) {
							showMessage('账号已失效');
							window.setTimeout(function() {
								popup.hide();
								$.ui.loadContent("#main", true, true, "up");
							}, 1500);
						} else if (json.status == 0) {
							Toast("没有更多", 2000);
						} else if (json.status == 1) {
							$('#orderproduct').attr('last', json.productList[json.productList.length - 1].rownum);
							var temppage_ddcp_tempul = $("#page_ddcp_tempul").find("li");
							var content = '';
							for (var i = 0; i < json.productList.length; i++) {
								var tempproprice = '';
								var temppronum = '';
								for (var j = 0; j < temppage_ddcp_tempul.length; j++) {
									if (temppage_ddcp_tempul.eq(j).attr("id") == json.productList[i].productID) {
										tempproprice = temppage_ddcp_tempul.eq(j).attr("proprice");
										temppronum = temppage_ddcp_tempul.eq(j).attr("pronum");
									}
								}
								content += '<li>' +
									'<table class="tablemess">' +
									'<tr>' +
									'<td rowspan="3" style="width: 25px;padding-right: 5px;">' +
									'<img src="images/seticon.png" style="width: 100%;" />' +
									'</td>' +
									'<td colspan="2">' +
									'(<font class="ordernum">' + json.productList[i].productID + '</font>)<font class="ordername">' + json.productList[i].prodName + '</font>' +
									'</td>' +
									'</tr>' +
									'<tr>' +
									'<td class="standardPrice">' +
									'标准价格:' + json.productList[i].standardPrice +
									'</td>' +
									'<td>' +
									'单位:' + json.productList[i].unit +
									'</td>' +
									'</tr>' +
									'<tr>' +
									'<td>' +
									'<div style="float: right;width: 90%;padding: 0px 3px;">' +
									'<input type="number" onkeypress="clearNoNum(this)" onchange="orderInputNull(this)" value="' + tempproprice + '" style="margin-bottom: 0px;" />' +
									'</div>' +
									'<font style="float: right;width: 10%;">价格</font>' +
									'</td>' +
									'<td>' +
									'<div style="float: right;width: 90%;padding: 0px 3px;">' +
									'<input type="number" onkeypress="clearNoNum(this)" onchange="orderInputNull(this)" value="' + temppronum + '" style="margin-bottom: 0px;" />' +
									'</div>' +
									'<font style="float: right;width: 10%;">数量</font>' +
									'</td>' +
									'</tr>' +
									'</table>' +
									'</li>';
							}
							$('#' + tarP + '_ul').append(content);
							if (showprice) {
								$('#' + tarP + '_ul').find(".standardPrice").show();
							} else {
								$('#' + tarP + '_ul').find(".standardPrice").hide();
							}
						}
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
					},
					Error: function() {
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
						alert('Error');
					},
					complete: function(response) {
						if (response.status == 200) {} else {
							ajaxdata.abort();
							$(self.el).find("#infinite").remove();
							self.clearInfinite();
							isLoading = false;
							showErrorPopup('提示', '服务器连接失败!');
						}
					}
				});
			}
		});
	});
}

/* 标准价格显示 */
function showOrderStandardPrice(a) {
	if ($(a).attr("hid") == "hide") {
		$("#page_ddcp_ul").find(".standardPrice").show();
		showprice = true;
		$(a).attr("hid", "show");
		$(a).html("隐藏标准价格", true);
	} else if ($(a).attr("hid") == "show") {
		$("#page_ddcp_ul").find(".standardPrice").hide();
		showprice = false;
		$(a).attr("hid", "hide");
		$(a).html("显示标准价格", true);
	}
}

/* 订单保存 */
function saveOrderProduct() {
	var temporder = $("#orderproductlistul").find("li");
	var orderdeliverytime = $("#orderdeliverytime").val();
	if (temporder.length == 0) {
		showErrorPopup('提示', '请先选择产品');
	} else if (parten.test(orderdeliverytime)) {
		showErrorPopup('提示', '请先选择出货日期');
	} else {
		showMessage('提交中');
		var priceList = [];
		var qtyList = [];
		var productList = [];
		temporder.each(function() {
			var tempid = $(this).find(".orderproductid").eq(0).html();
			var tempprice = $(this).find(".orderproductprice").eq(0).html();
			var tempnum = $(this).find(".orderproductnum").eq(0).html();
			productList.push(tempid);
			priceList.push(tempprice);
			qtyList.push(tempnum);
		});
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/AppOrder/orderSave.do",
			dataType: "jsonp",
			timeout: 20000, //超时时间设置，单位毫秒
			cache: false,
			type: "post",
			data: {
				nID: getSession('keyid'),
				userId: getSession('uid'),
				AlID: $("#orderunionno").html(),
				createName: encodeURI($("#ordercreatename").html()),
				remark: encodeURI($("#orderremark").val()),
				planDate: orderdeliverytime,
				nTypeID: $("#ordertype").attr("textid"),
				productList: productList.join(","),
				qtyList: qtyList.join(","),
				priceList: priceList.join(",")
			},
			success: function(json) {
				popup.hide();
				if (json.status == 1) {
					setSession('keyid', json.pid);
					Toast('保存成功', 1500);
				} else if (json.status == 0) {
					showErrorPopup('提示', json.error);
				} else if (json.status == -1) {
					showMessage('账号已失效');
					/* 1秒后隐藏提示 */
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				}
			},
			Error: function() {
				popup.hide();
				alert('Error');
				return false;
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

/* 登出日志登记 */
function logoutLog() {
	var type = 0;
	if (systemname == 'iOS') {
		type = 2;
	} else {
		type = 1;
	}
	$.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appMember/logoutLog.do",
		dataType: "jsonp",
		type: "post",
		data: {
			userId: getSession('uid'),
			imei: imei,
			type: type
		},
		success: function(json) {
			if (json.status == -1) {
				showMessage('账号已失效');
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			popup.hide();
			alert('Error');
		}
	});
}

/* 到货信息自动定位 */
var arrivedsend = -1;

function locationArrived(targetX, targetY) {
	var success = function(p) {
		/*if (parten.test(p.lontitude) || parten.test(p.latitude)) {
			showLocationError(8);
		} else {
			var addr = "";
			var point = new BMap.Point(p.lontitude, p.latitude);
			var geoc = new BMap.Geocoder();
			geoc.getLocation(point, function(rs) {
				var addComp = rs.addressComponents;
				addr = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
				$("#arrivedlng").html(p.lontitude, true);
				$("#arrivedlat").html(p.latitude, true);
				$("#arrivedaddress").html(addr, true);
				var getX = targetX;
				var getY = targetY;
				var thisX = p.latitude;
				var thisY = p.lontitude;
				if (getX == thisX && getY == thisY) {
					$('#arrivedresult').html('是', true);
				} else {
					var distance = getFlatternDistance(getX, getY, thisX, thisY).toFixed(2);
					targetRQNum = distance;
					if (parseFloat(distance) > 3000.00) {
						$('#arrivedresult').html('否', true);
						arrivedsend = 0;
					} else if (parseFloat(distance) <= 3000.00) {
						$('#arrivedresult').html('是', true);
						arrivedsend = 1;
					} else {
						arrivedsend = 0;
						$('#arrivedresult').html('否', true);
					}
				}
				$("#arrivedloading").hide();
				$("#arrivedbox").show();
			});

		}*/

		if (p.addr == 'Unknown' || p.addr == undefined || parten.test(p.addr) || parten.test(p.lontitude) || parten.test(p.latitude)) {
			showLocationError(8);
		} else {
			$("#arrivedlng").html(p.lontitude, true);
			$("#arrivedlat").html(p.latitude, true);
			$("#arrivedaddress").html(p.addr, true);

			var getX = targetX;
			var getY = targetY;
			var thisX = p.latitude;
			var thisY = p.lontitude;
			if (getX == thisX && getY == thisY) {
				arrivedsend = 1;
				$('#arrivedresult').html('是', true);
			} else {
				var distance = getFlatternDistance(getX, getY, thisX, thisY).toFixed(2);
				targetRQNum = distance;
				if (parseFloat(distance) > 3000.00) {
					$('#arrivedresult').html('否', true);
					arrivedsend = 0;
				} else if (parseFloat(distance) <= 3000.00) {
					$('#arrivedresult').html('是', true);
					arrivedsend = 1;
				} else {
					arrivedsend = 0;
					$('#arrivedresult').html('否', true);
				}
			}

			$("#arrivedloading").hide();
			$("#arrivedbox").show();
		}
	};
	var error = function(message) {
		$("#arrivedloading").hide();
		$("#arrivedbox").show();
		$.ui.goBack();
		//showErrorPopup('提示', message);
	};

	var success1 = function(p) {
		$("#arrivedlng").html(p.lontitude, true);
		$("#arrivedlat").html(p.latitude, true);
		changeBDLocation(p.latitude, p.lontitude);
	};
	if (systemname == "iOS") {
		locationtype = 7;
		getlocationtest();
	} else {
		if (!isBDlocation) {
			BaiduLocationPlugin.createEvent("定位", success, error);
		} else {
			TXLocationPlugin.createEvent("定位", success, error);
		}
	}
}

/* 二维码扫描提交 */
var RQcodeobj = '';
var targetRQX = '';
var targetRQY = '';
var targetRQNum = '';

function sendRQCode(a) {
	$("#arrivedDNnum").html(a, true);
	$("#arrivednone").hide();
	$("#arrivedbox").hide();
	$("#arrivedloading").show();
	$("#arrivedbox").find("span").html('', true);
	$("#arrivedres").attr("textid", '0');
	$("#arrivedres").val('无');
	$("#arrivedphone").val('');
	$("#simnum").val('');
	var RQCodeAjax = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/AppScanCargo/getDelayReason.do",
		dataType: "jsonp",
		timeout: 10000, //超时时间设置，单位毫秒
		type: "post",
		data: {
			pid: a
		},
		success: function(json) {
			if (json.status == 0) {
				$("#arrivederrer").html("对不起，匹配不到扫描到的单号" + a, true);
				$("#arrivedloading").hide();
				$("#arrivednone").show();
			} else if (json.status == 2) {
				$("#arrivederrer").html("编号获取异常", true);
				$("#arrivedloading").hide();
				$("#arrivednone").show();
			} else if (json.status == 1) {
				RQcodeobj = json.reasonList;
				$("#arriveddate").html(json.reasonList[0].plandate, true);
				$("#simnum").val(device.phonenum);
				$("#arrivednowdate").html(json.nowDate, true);
				targetRQX = json.ux;
				targetRQY = json.uy;
				locationArrived(json.ux, json.uy);
			} else if (json.status == 3) {
				showErrorPopup("提示", a + "到货信息已提交");
				$.ui.goBack();
			}
		},
		Error: function() {
			$("#arrivednone").hide();
			$("#arrivedbox").hide();
			$("#arrivedloading").hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				RQCodeAjax.abort();
				$('#arrivedloading').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 到货信息保存 */
function saveArrived() {
	var phoneNum = $("#arrivedphone").val();
	var simNum = $("#simnum").val();
	var pid = $("#arrivedDNnum").html();
	var address = $("#arrivedaddress").html();
	var reason = $("#arrivedres").attr("textid");
	var u_y = $("#arrivedlng").html();
	var u_x = $("#arrivedlat").html();
	var recDate = $("#arrivednowdate").html();
	if (parten.test(u_y) || parten.test(u_x) || u_x == undefined || u_y == undefined || isNaN(u_x) || isNaN(u_y) || parten.test(address) || address == undefined) {
		showErrorPopup("提示", "定位坐标地址不能为空");
		return;
	} else if (parten.test(targetRQNum)) {
		showErrorPopup("提示", "距离计算有误");
		return;
	}
	/*if (parten.test(reason) || reason == undefined) {
		popup.hide();
		showErrorPopup("提示", "请选择延误原因");
	} else if ($("#arriveddate").html() < recDate && reason == '0') {
		popup.hide();
		showErrorPopup("提示", "请选择正确延误原因");
	} else {*/
	showMessage("提交中");
	if (reason == undefined) {
		reason = "";
	}
	if (simNum == undefined || simNum == "undefined") {
		simNum = "";
	}
	if (parten.test(phoneNum)) {
		phoneNum = 0;
	}
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/AppScanCargo/saveDelayReason.do",
		dataType: "jsonp",
		timeout: 20000, //超时时间设置，单位毫秒
		type: "post",
		data: {
			pid: pid,
			phoneNum: phoneNum,
			simNum: simNum,
			address: encodeURI(address),
			reason: reason,
			isMatch: arrivedsend,
			u_y: u_y,
			u_x: u_x,
			target_ux: targetRQX,
			target_uy: targetRQY,
			distance: targetRQNum,
			recDate: recDate,
			appVer: version
		},
		success: function(json) {
			popup.hide();
			if (json.status == 0) {
				showErrorPopup("提示", "提交失败");
			} else if (json.status == 2) {
				showErrorPopup("提示", "扫描编码异常");
			} else if (json.status == 1) {
				Toast("保存成功", 2000);
				$.ui.goBack();
			} else if (json.status == 3) {
				showErrorPopup("提示", "已经扫描过");
			} else if (json.status == 4) {
				$("#arrivederrer").html("距离计算有误", true);
				$("#arrivedloading").hide();
				$("#arrivednone").show();
			}
		},
		Error: function() {
			popup.hide();
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
	/*}*/
}