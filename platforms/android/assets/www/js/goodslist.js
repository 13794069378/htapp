/** 到货云跟踪
 * @author 邵剑泳
 * @date 2015-04-24
 **/

/* 到货云列表数据加载 */
var goodscode = "";

function loadGoodsListData(name) {
	$("#goodslist_box").hide();
	$("#goodslist_none").hide();
	$("#goodslist_loading").show();
	goodscode = $('#goodslistsearchinfo').val();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			cartonNo: goodscode
		},
		success: function(json) {
			if (json.status == -1) {
				$("#goodslist_loading").hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$("#goodslist_none").show();
				$("#goodslist_loading").hide();
			} else if (json.status == 1) {
				$('#goodslist_ul').html('', true);
				$('#goodslist').attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += '<li onclick="checkgoodshistory=false;setId(\'' + json.list[i].cartonNo + '\');$.ui.loadContent(\'#goodsinfo\', false, false, \'up\');">' +
						'<table class="tablemess">' +
						'<tr>' +
						'<td rowspan=4 style="width: 25px;padding-right: 5px;">' +
						'<img src="images/seticon.png" style="width: 100%;" />' +
						'</td>' +
						'<td>产品箱码: ' + json.list[i].cartonNo + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>产品名称: ' + json.list[i].productName + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>产品数量: ' + json.list[i].amount + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>出库日期: ' + json.list[i].sendDate + '</td>' +
						'</tr>' +
						'</table>' +
						'</li>';
				}
				$('#goodslist_ul').append(content);
				goodslistscroller.scrollToTop();
				$("#goodslist_loading").hide();
				$("#goodslist_box").show();
			} else if (json.status == 2) {
				Toast("请输入箱码", 2000);
				$("#goodslist_loading").hide();
			}
		},
		Error: function() {
			$("#goodslist_loading").hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$("#goodslist_loading").hide();
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
var goodslistscroller = '';

function updateGoodsList(a, name) {
	/* 上下拉更新 */
	var tarP = a;
	/* 开启页面滚动 */
	goodslistscroller = $("#" + tarP + "_box").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	goodslistscroller.addInfinite();

	/* 上拉更新 */
	goodslistscroller.enable();
	var isLoading = false;
	$.bind(goodslistscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(goodslistscroller, "infinite-scroll-end", function() {
			$.unbind(goodslistscroller, "infinite-scroll-end");
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				var ajaxdata = $.ajax({
					url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
					dataType: 'jsonp',
					type: 'post',
					timeout: 10000, //超时时间设置，单位毫秒
					data: {
						id: $('#goodslist').attr('last'),
						num: 10,
						mark: 0,
						cartonNo: goodscode
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
							$('#goodslist').attr('last', json.list[json.list.length - 1].rownum);
							var content = '';
							for (var i = 0; i < json.list.length; i++) {
								content += '<li onclick="checkgoodshistory=false;setId(\'' + json.list[i].cartonNo + '\');$.ui.loadContent(\'#goodsinfo\', false, false, \'up\');">' +
									'<table class="tablemess">' +
									'<tr>' +
									'<td rowspan=4 style="width: 25px;padding-right: 5px;">' +
									'<img src="images/seticon.png" style="width: 100%;" />' +
									'</td>' +
									'<td>产品箱码: ' + json.list[i].cartonNo + '</td>' +
									'</tr>' +
									'<tr>' +
									'<td>产品名称: ' + json.list[i].productName + '</td>' +
									'</tr>' +
									'<tr>' +
									'<td>产品数量: ' + json.list[i].amount + '</td>' +
									'</tr>' +
									'<tr>' +
									'<td>出库日期: ' + json.list[i].sendDate + '</td>' +
									'</tr>' +
									'</table>' +
									'</li>';
							}
							$('#goodslist_ul').append(content);
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

var checkgoodshistory = false;

function checkGoodsInfoData(nID) {
	checkgoodshistory = true;
	$("#goodsinfobox").hide();
	$("#goodsinfonone").hide();
	$("#goodsinfoloading").show();
	$("#goodsinfobox").find("span").empty();
	$("#goodsinfobutton").hide();
	for (var i = 1; i < 5; i++) {
		$("#goodsinfoimg" + i).attr('take', 'false');
		$("#goodsinfoimg" + i).removeAttr("onclick");
		$("#goodsinfoimg" + i)[0].src = "images/loading.gif";
	}
	$("#goodsinfocode").html(getSession("keyid"), true);
	$.ui.loadContent("#goodsinfo", false, false, "up");
	loadGoodsInfoData(nID);
}

/** 到货明细
 **/
function loadGoodsInfoData(nID) {
	var tempAction = "";
	if (nID == undefined) {
		nID = '';
		tempAction = "salesTrackingDetail";
	} else {
		tempAction = "salesTrackingHistoryDetail";
	}
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/AppSalesTrackingAction/" + tempAction + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			nID: nID,
			cartonNo: getSession("keyid"),
			userName: encodeURI(htusername),
			userId: getSession("uid"),
			selectType: goodsinfotype,
			u_x: goodsinfolocalx,
			u_y: goodsinfolocaly,
			address: encodeURI(goodsinfolocaladdress),
		},
		success: function(json) {
			if (json.status == -1) {
				$("#goodsinfoloading").hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$("#goodsinfoerror").html("信息不存在", true);
				$("#goodsinfoloading").hide();
				$("#goodsinfonone").show();
			} else if (json.status == 2) {
				$("#goodsinfoerror").html("获取箱号失败", true);
				$("#goodsinfoloading").hide();
				$("#goodsinfonone").show();
			} else if (json.status == 1) {
				if (!parten.test(nID)) {
					if (!parten.test(json.photo.photo1)) {
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoName=" + json.photo.photo1 + "&photoPath=" + json.photo.path, "goodsinfoimg1", checkimg);
					} else {
						$("#goodsinfoimg1")[0].src = "images/blank.jpg";
					}
					if (!parten.test(json.photo.photo2)) {
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoName=" + json.photo.photo2 + "&photoPath=" + json.photo.path, "goodsinfoimg2", checkimg);
					} else {
						$("#goodsinfoimg2")[0].src = "images/blank.jpg";
					}
					if (!parten.test(json.photo.photo3)) {
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoName=" + json.photo.photo3 + "&photoPath=" + json.photo.path, "goodsinfoimg3", checkimg);
					} else {
						$("#goodsinfoimg3")[0].src = "images/blank.jpg";
					}
					if (!parten.test(json.photo.photo4)) {
						Imagess("http://" + ipaddress + "/" + serviceName + "/htwyRes/saleAppApk/photo.jsp?photoName=" + json.photo.photo4 + "&photoPath=" + json.photo.path, "goodsinfoimg4", checkimg);
					} else {
						$("#goodsinfoimg4")[0].src = "images/blank.jpg";
					}
					$("#goodsinfolog").html(json.photo.u_x, true);
					$("#goodsinfolat").html(json.photo.u_y, true);
					$("#goodsinfoaddress").html(json.photo.address, true);
				}
				if (!parten.test(nID)) {
					if (json.form.sendState == "0") {
						$("#goodsinfostatus").html("未出库", true);
					} else if (json.form.sendState == "1") {
						$("#goodsinfostatus").html("已出库", true);
					} else {
						$("#goodsinfostatus").html("没有此箱码", true);
					}
				} else {
					if (parten.test(json.form.pid)) {
						$("#goodsinfostatus").html("未出库", true);
					} else {
						$("#goodsinfostatus").html("已出库", true);
					}
				}
				$("#goodsinfoTGcode").html(json.form.sTrayCode,true);
				$("#goodsinfocusnum").html(json.form.khId, true);
				$("#goodsinfocusname").html(json.form.khName, true);
				$("#goodsinfoname").html(json.form.productName, true);
				$("#goodsinfonum").html(json.form.amount, true);
				$("#goodsinfopc").html(json.form.batch, true);
				$("#goodsinfooutdate").html(json.form.sendDate, true);
				$("#goodsinfopronum").html(json.form.productNo, true);
				$("#goodsinfogoodsnum").html(json.form.deliverNo, true);
				$("#goodsinfocheckman").html(htusername, true);
				if (parten.test(json.form.searchTime)) {
					$("#goodsinfocheckdate").html(json.form.date, true);
				} else {
					$("#goodsinfocheckdate").html(json.form.searchTime, true);
				}
				var msg = JSON.parse(json.msg);
				goodsinfoproid = msg.pid;
				$("#goodsinfoloading").hide();
				$("#goodsinfobox").show();
			}
		},
		Error: function() {
			$("#goodsinfoloading").hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$("#goodsinfoloading").hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/** 到货云历史
 **/
var goodsinfohistorycartonNo = "";
var goodsinfohistorystTime = "";
var goodsinfohistoryedTime = "";

function loadGoodsInfoHistoryData() {
	$("#goodshistoryloading").show();
	$("#goodshistorynone").hide();
	$("#goodshistory_box").hide();
	goodsinfohistorycartonNo = $("#goodshistorypeople").val();
	goodsinfohistorystTime = $("#goodshistorysearchbegin").val();
	goodsinfohistoryedTime = $("#goodshistorysearchend").val();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/AppSalesTrackingAction/salesTrackingHistory.do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			cartonNo: goodsinfohistorycartonNo,
			date1: goodsinfohistorystTime,
			date2: goodsinfohistoryedTime,
			userId: getSession("uid")
		},
		success: function(json) {
			if (json.status == -1) {
				$("#goodshistoryloading").hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$("#goodshistoryloading").hide();
				$("#goodshistorynone").show();
			} else if (json.status == 1) {
				$('#goodshistory_ul').html('', true);
				$('#goodshistory').attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li onclick='setId(\"" + json.list[i].order_no + "\");checkGoodsInfoData(\"" + json.list[i].id + "\");'>" +
						'<table class="tablemess">' +
						'<tr>' +
						'<td rowspan=4 style="width: 25px;padding-right: 5px;">' +
						'<img src="images/seticon.png" style="width: 100%;" />' +
						'</td>' +
						'<td>箱<font style="margin-left: 28px;">码:<font> ' + json.list[i].order_no + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>查询时间: ' + json.list[i].search_date + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>查询地点: ' + json.list[i].address + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>客户名称: ' + json.list[i].kh_name + '</td>' +
						'</tr>' +
						'</table>' +
						'</li>';
				}
				$('#goodshistory_ul').append(content);
				goodshistorycroller.scrollToTop();
				$("#goodshistoryloading").hide();
				$("#goodshistory_box").show();
			}
		},
		Error: function() {
			$("#goodshistoryloading").hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$("#goodshistoryloading").hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/**到货明细自动定位
 **/
var goodsinfotype = "";
var goodsinfolocalx = "";
var goodsinfolocaly = "";
var goodsinfolocaladdress = "";
var goodsinfoproid = "";

function locationGoodsInfo() {
	$("#goodsinfobox").hide();
	$("#goodsinfonone").hide();
	$("#goodsinfoloading").show();
	$("#goodsinfobox").find("span").empty();
	$("#goodsinfobutton").show();
	goodsinfoproid = null;
	for (var i = 1; i < 5; i++) {
		$("#goodsinfoimg" + i).attr('take', 'false');
		$("#goodsinfoimg" + i).attr("onclick", 'takeBuildFileImg("goodsinfoimg' + i + '");');
		$("#goodsinfoimg" + i)[0].src = "images/blank.jpg";
	}
	$("#goodsinfocode").html(getSession("keyid"), true);
	var success = function(p) {
		if (p.addr == undefined) {
			$("#goodsinfoloading").hide();
			showLocationError(9);
		} else {
			goodsinfolocalx = p.lontitude;
			goodsinfolocaly = p.latitude;
			goodsinfolocaladdress = p.addr;
			$("#goodsinfolog").html(p.lontitude, true);
			$("#goodsinfolat").html(p.latitude, true);
			$("#goodsinfoaddress").html(p.addr, true);
			loadGoodsInfoData();
		}
	};
	var error = function(message) {
		$('#goodsinfoloading').hide();
		showErrorPopup('提示', message);
	};
	if (systemname == "iOS") {
		goodsinfotype = 3;
		locationtype = 7;
		getlocationtest();
	} else {
		goodsinfotype = 2;
		if (isBDlocation) {
			BaiduLocationPlugin.createEvent("定位", success, error);
		} else {
			TXLocationPlugin.createEvent("定位", success, error);
		}
	}
}

/* 到货明细保存 */
function savaGoodsInfo() {
	$("#goodsinfobutton").find(".button").removeAttr("onclick");
	var upgoodstrue = false;
	for (var i = 1; i < 5; i++) {
		if ($('#goodsinfoimg' + i).attr('take') == 'true') {
			upgoodstrue = true;
			break;
		}
	}
	if (upgoodstrue) {
		showMessage('上传中');
		upGoodsListImg();
	} else {
		$("#goodsinfobutton").find(".button").attr("onclick", "savaGoodsInfo()");
		Toast("没有照片需要上传", 1500);
	}
}

/* 到货历史上下拉更新 */
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var goodshistorycroller = '';

function updateGoodsHistory(a, name) {
	/* 上下拉更新 */
	var tarP = a;
	/* 开启页面滚动 */
	goodshistorycroller = $("#" + tarP + "_box").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	goodshistorycroller.addInfinite();

	/* 上拉更新 */
	goodshistorycroller.enable();
	var isLoading = false;
	$.bind(goodshistorycroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(goodshistorycroller, "infinite-scroll-end", function() {
			$.unbind(goodshistorycroller, "infinite-scroll-end");
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				var ajaxdata = $.ajax({
					url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
					type: "post",
					dataType: 'jsonp',
					timeout: 10000, //超时时间设置，单位毫秒
					data: {
						cartonNo: goodsinfohistorycartonNo,
						date1: goodsinfohistorystTime,
						date2: goodsinfohistoryedTime,
						userId: getSession("uid"),
						id: $('#' + tarP).attr('last'),
						num: 10,
						mark: 0,
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
							$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);
							var content = '';
							for (var i = 0; i < json.list.length; i++) {
								content += "<li onclick='setId(\"" + json.list[i].order_no + "\");checkGoodsInfoData(\"" + json.list[i].id + "\");'>" +
									'<table class="tablemess">' +
									'<tr>' +
									'<td rowspan=4 style="width: 25px;padding-right: 5px;">' +
									'<img src="images/seticon.png" style="width: 100%;" />' +
									'</td>' +
									'<td>箱<font style="margin-left: 28px;">码:<font> ' + json.list[i].order_no + '</td>' +
									'</tr>' +
									'<tr>' +
									'<td>查询时间: ' + json.list[i].search_date + '</td>' +
									'</tr>' +
									'<tr>' +
									'<td>查询地点: ' + json.list[i].address + '</td>' +
									'</tr>' +
									'<tr>' +
									'<td>客户名称: ' + json.list[i].kh_name + '</td>' +
									'</tr>' +
									'</table>' +
									'</li>';
							}
							$('#goodshistory_ul').append(content);
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