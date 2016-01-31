/**
 * 信息提示
 **/

/* 更新判断 */
function showPopupVersion(isUpdateinfo, url) {
	$("#afui").popup({
		title: '提示',
		message: '有新版本，需要更新吗?',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {
			if (isUpdateinfo == "0") {
				isUpdata = true;
			}
		},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			window.open('itms-services:///?action=download-manifest&url=' + url, '_self');
		},
		cancelOnly: false
	});
}

/* 弹出消息窗口 */
/**
 * value: 提示的内容
 **/
var popup = '';

function showMessage(value) {
	popup = $("#afui").popup({
		title: ' ',
		addCssClass: 'bodycss',
		cancelText: ' ',
		message: '<div style="text-align:center;font-size:16px;"><img src="images/loading.gif" style="width: 30%;margin-top: -10px;" /><br/>' + value + '</div>',
		cancelClass: "cancelbutton",
		supressTitle: true,
		cancelOnly: true
	});
}

/* 定位目标不准确 */
var changeTragetLocation = "0"; //不改变服务器目标地址
var seriveChange = "1"; //本地判断是否改变目标地址
function showTargetLocationPopup() {
	$("#afui").popup({
		title: "提示",
		message: "匹配结果为否,如果确定当前定位地址正确正确,请点击'确定'",
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			changeTragetLocation = "1";
		},
		cancelOnly: false
	});
}
/* 提交请假申请判断 */
function showPopup(title, message) {
	$("#afui").popup({
		title: title,
		message: message,
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			leaveAddSaveDo();
		},
		cancelOnly: false
	});
}

/* 提交请假审批判断 */
function showPopup1(title, message) {
	$("#afui").popup({
		title: title,
		message: message,
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			changeLeaveOk();
		},
		cancelOnly: false
	});
}

/* 提交OA公文判断 */
function showPopup2(title, message) {
	$("#afui").popup({
		title: title,
		message: message,
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			changeLeaveOkOA();
		},
		cancelOnly: false
	});
}

/* 销售日志保存判断 */
function showPopup3() {
	$("#afui").popup({
		title: '提示',
		message: '确定保存销售日志吗?',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			saveSellNote();
		},
		cancelOnly: false
	});
}

/* 销售日志审批保存判断 */
function showPopup4() {
	/*$("#afui").popup({
	    title: '提示',
	    message: '确定保存销售日志审批吗?',
	    cancelText: "取消",
	    cancelCallback: function () {},
	    doneText: "确定",
	    doneCallback: function () {
	        saveSellOk();
	    },
	    cancelOnly: false
	});*/
	saveSellOk();
}

/* 销售日志表单提交判断 */
function showPopup5() {
	/*$("#afui").popup({
	    title: '提示',
	    message: '确定提交销售表单吗?',
	    cancelText: "取消",
	    cancelCallback: function () {},
	    doneText: "确定",
	    doneCallback: function () {
	        saveTable();
	    },
	    cancelOnly: false
	});*/
	saveTable();
}

/* 拜访登记保存判断 */
function showPopup6(name) {
	$("#afui").popup({
		title: '提示',
		message: '保存后拜访登记将不能修改，请问进行保存吗?',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			doSaveVisitLogin(name);
		},
		cancelOnly: false
	});
}

/* 拜访登记保存判断 */
function showPopup7(id, name) {
	$("#afui").popup({
		title: '提示',
		message: '请问确定删除吗?',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			delMessage(id, name);
		},
		cancelOnly: false
	});
}

/** 订单产品删除判断
 * a 传入对象
 */
function showPopupDelProduct(a) {
	$("#afui").popup({
		title: '提示',
		message: '请问确定删除吗?',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			orderDel(a);
		},
		cancelOnly: false
	});
}

/* 订单产品添加判断 */
function showPopupAddProduct() {
//	if ($(".sales_app_ddcpbutton").attr("qx") || $(".sales_app_ddcpbutton").attr("qx") == "true") {
	if (checkQX("sales_app_ddcpbutton")) {	
		if (parten.test($("#page_ddcp_tempul").html())) {
			showErrorPopup("提示", "请先填写正确产品信息");
		} else {
			$("#afui").popup({
				title: '提示',
				message: '请问确定添加订单产品吗?',
				cancelText: "取消",
				cancelClass: 'button errorbutton',
				cancelCallback: function() {},
				doneText: "确定",
				doneClass: 'button okbutton',
				doneCallback: function() {
					addOrderProduct();
				},
				cancelOnly: false
			});
		}
	} else {
		showErrorPopup("提示", "你没有权限");
	}
}

/* 添加订单产品判断 */
function checkOrderProduct() {
	if (!parten.test($("#ordertype").attr("textid")) && $("#ordertype").attr("textid") != undefined && !parten.test($("#orderdealerno").html()) && !parten.test($("#orderunionno").html())) {
		$.ui.loadContent("#orderproduct", false, false, "up");
	} else if (parten.test($("#ordertype").attr("textid")) || $("#ordertype").attr("textid") == undefined) {
		showErrorPopup("提示", "请先选择类型");
	} else if (parten.test($("#orderdealerno").html())) {
		showErrorPopup("提示", "请先选择经销商");
	} else if (parten.test($("#orderunionno").html())) {
		showErrorPopup("提示", "请先选择联盟商");
	}
}

/* 订单列表删除判断 */
function showPopup8(a) {
	$("#afui").popup({
		title: '提示',
		message: '请问确定删除吗?',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			delOrderList(a, name);
		},
		cancelOnly: false
	});
}

/* 错误提示 */
function showErrorPopup(title, message) {
	$("#afui").popup({
		title: title,
		message: message,
		cancelText: "确定",
		cancelClass: 'button okbutton',
		cancelOnly: true
	});
}

/* 为空警告 */
function showWarming() {
	$("#afui").popup({
		title: '提示',
		message: '必填项不能为空!',
		cancelText: "确定",
		cancelClass: 'button errorbutton',
		cancelOnly: true
	});
}

/* 定位失败判断 */
function showLocationError(a) {
	$("#afui").popup({
		title: '提示',
		message: '定位失败需要重新定位吗?',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			// 考勤目标登记
			if (a == 4 || a == 5 || a == 6 || a == 8 || a == 10) {

			} else {
				showMessage('定位中');
			}
			if (a == 1) {
				locationWorkPlaceCollect();
			} else if (a == 2) { //考勤记录
				locationWorkLogin();
			} else if (a == 3) {
				locationBuildFile();
			} else if (a == 4) {
				buildFileLocaltion();
			} else if (a == 5) {
				clickStartButton();
			} else if (a == 6) {
				supermarketLocaltion();
			} else if (a == 7) {
				locationSuperMarket();
			} else if (a == 8) { //到货信息定位
				locationArrived();
			} else if (a == 9) { //到货明细
				locationGoodsInfo();
			} else if (a == 10) { //ios定位
				getlocationtest();
			}
		},
		cancelOnly: false
	});
}

/** 单选对话框 
 * a 对话框编号
 * c 对话框所在容器ID
 */
function showPopupFont(a, c) {
	var json = {};
	json.data = [];
	// 请假审批列表查询
	if (a == 1) {
		json.data = [{
			"id": "",
			"val": "全部"
		}, {
			"id": "0",
			"val": "未审批"
		}, {
			"id": "1",
			"val": "同意"
		}, {
			"id": "2",
			"val": "不同意"
		}];
	} else if (a == 2) { //请假审批
		json.data = [{
			"id": "0",
			"val": "未审批"
		}, {
			"id": "1",
			"val": "同意"
		}, {
			"id": "2",
			"val": "不同意"
		}];
	} else if (a == 3) { //考勤登记
		json.data = [{
			"id": "1",
			"val": "上班"
		}, {
			"id": "2",
			"val": "下班"
		}];
	} else if (a == 4) { //U1-4终端建档管理
		json.data = [{
			"id": "U1",
			"val": "U1"
		}, {
			"id": "U2",
			"val": "U2"
		}, {
			"id": "U3",
			"val": "U3"
		}, {
			"id": "U4",
			"val": "U4"
		}];
	} else if (a == 5) { //U1-4建档记录查询
		json.data = [{
			"id": "",
			"val": "全部"
		}, {
			"id": "U1",
			"val": "U1"
		}, {
			"id": "U2",
			"val": "U2"
		}, {
			"id": "U3",
			"val": "U3"
		}, {
			"id": "U4",
			"val": "U4"
		}];
	} else if (a == 6) { //请假类型
		json.data = leaveaddstatusobj;
	} else if (a == 7) { //超市门店状态
		json.data = [{
			"id": "正常",
			"val": "正常"
		}, {
			"id": "冻结",
			"val": "冻结"
		}];
	} else if (a == 8) {
		var temptype = {
			"id": "",
			"val": "全部"
		};
		json.data.push(temptype);
		for (var i = 0; i < supermarkettypeobj.length; i++) {
			json.data.push(supermarkettypeobj[i]);
		}
	} else if (a == 9) {
		var temptype = {
			"id": "0",
			"val": "请选择"
		};
		json.data.push(temptype);
		for (var i = 0; i < supermarkettypeobj.length; i++) {
			json.data.push(supermarkettypeobj[i]);
		}
	} else if (a == 10) {
		json.data = [{
			"id": "1",
			"val": "联盟商"
		}, {
			"id": "2",
			"val": "超市"
		}];
	} else if (a == 11) {
		for (var i = 0; i < RQcodeobj.length; i++) {
			var tempdata = {};
			tempdata.id = RQcodeobj[i].cNO;
			if (parten.test(RQcodeobj[i].cName)) {
				tempdata.val = '无';
			} else {
				tempdata.val = RQcodeobj[i].cName;
			}
			json.data.push(tempdata);
		}
	} else if (a == 12) { //特殊陈列类型
		json.data = buildfileSpecialTypeobj;
	} else if (a == 13) { //渠道类型
		json.data = buildfileQDTypeobj;
	}
	var content = '';
	// 单选组合
	for (var i = 0; i < json.data.length; i++) {
		content += "<li>" +
			"<input id='sf" + json.data[i].id + "' type='radio' text='" + json.data[i].val + "' value='" + json.data[i].id + "' name='radiotest'>" +
			"<label for='sf" + json.data[i].id + "'>" +
			"<font>" + json.data[i].val + "</font>" +
			"</label><div style='clear: both;'></div>" +
			"</li>";
	}
	var mess = "<ul id='radioscrl' class='radiostyle'>" + content + "</ul>";
	// 弹框
	$("#afui").popup({
		title: "<center>请选择</center>",
		message: mess,
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			var id = $('input:radio[name="radiotest"]:checked').val();
			var text = $('input:radio[name="radiotest"]:checked').attr('text');
			// 显示
			$('#' + c).val(text);
			// 传出值
			$('#' + c).attr('textid', id);
			if (a == 4 && (id == 'U1' || id == 'U2')) {
				$('.starttime').html('&nbsp;', true);
			} else if (a == 4 && (id == 'U3' || id == 'U4')) {
				$('.starttime').html('*', true);
			} else if (a == 10 && !parten.test($("#orderdealerno").html())) {
				$("#orderunionno").html("", true);
				$("#orderdealername").html("", true);
				$(".unionselectinfo").show();
			}
		},
		cancelOnly: false
	});
	// 选中判断
	if ($('#' + c).attr('textid') != '') {
		$("input:radio[name='radiotest'][value=" + $('#' + c).attr('textid') + "]").attr("checked", true);
	} else {
		$("input:radio[name='radiotest']").eq(0).attr("checked", true);
	}
	// 滚动
	$("#radioscrl").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: true
	});
	//new IScroll('#radioscrl', {scrollX: false, scrollY: true});
}

/** 考勤目标地点单选对话框 
 * a 对话框编号
 * c 对话框所在容器ID
 */
function showPopupWorkLogin(a, c) {
	var json = {};
	// 请假审批列表查询
	if (a == 1) {
		json.data = scoreaddressobj;
	}
	var content = '';
	// 单选组合
	for (var i = 0; i < json.data.length; i++) {
		content += "<li>" +
			"<input id='sfwl" + json.data[i].id + "' type='radio' isCheck='" + json.data[i].isCheck + "' targetX='" + json.data[i].targetX + "' targetY='" + json.data[i].targetY + "' targetAddress='" + json.data[i].targetAddress + "' text='" + json.data[i].targetName + "' value='" + json.data[i].id + "' name='radiotestwl'>" +
			"<label for='sfwl" + json.data[i].id + "'>" +
			"<font>" + json.data[i].targetName + "</font>" +
			"</label><div style='clear: both;'></div>" +
			"</li>";
	}
	var mess = "<ul id='radioscrlwl' class='radiostyle'>" + content + "</ul>";
	// 弹框
	$("#afui").popup({
		title: "<center>请选择</center>",
		message: mess,
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			var id = $('input:radio[name="radiotestwl"]:checked').val();
			var text = $('input:radio[name="radiotestwl"]:checked').attr('text');
			var targetX = $('input:radio[name="radiotestwl"]:checked').attr('targetX');
			var targetY = $('input:radio[name="radiotestwl"]:checked').attr('targetY');
			var isCheck = $('input:radio[name="radiotestwl"]:checked').attr('isCheck');
			var targetAddress = $('input:radio[name="radiotestwl"]:checked').attr('targetAddress');
			// 显示
			$('#' + c).val(text);
			// 传出值
			$('#' + c).attr('textid', id);
			if (a == 1) {
				$('#' + c).attr('targetX', targetX);
				$('#' + c).attr('targetY', targetY);
				$('#' + c).attr('isCheck', isCheck);
				$('#' + c).attr('targetAddress', targetAddress);
				workLoginChangeXY();
			}
		},
		cancelOnly: false
	});
	// 选中判断
	if ($('#' + c).attr('textid') != '') {
		$("input:radio[name='radiotestwl'][value=" + $('#' + c).attr('textid') + "]").attr("checked", true);
	} else {
		$("input:radio[name='radiotestwl']").eq(0).attr("checked", true);
	}
	// 滚动
	$("#radioscrlwl").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: true
	});
	//new IScroll('#radioscrl', {scrollX: false, scrollY: true});
}

/** 省市区单选改变
 * a 搜索类型
 * b 省ID
 * c 市ID
 * e 区、县ID
 */
function changeProvince(a, b, c, e) {
	if (a == 1) {
		var provinceid = $("#" + b).attr("textid");
		var cityinfo = provinceList[provinceid].cityList;
		if (cityinfo.length != 0) {
			$("#" + c).attr("textid", 0);
			$("#" + c).val(cityinfo[0].name);
			$("#" + c).show();
			changeProvince(2, b, c, e);
		} else {
			$("#" + c).hide();
			$("#" + c).val("");
			$("#" + e).hide();
			$("#" + e).val("");
		}
	} else if (a == 2) {
		var provinceid = $("#" + b).attr("textid");
		var cityid = $("#" + c).attr("textid");
		var areainfo = provinceList[provinceid].cityList[cityid].areaList;
		if (areainfo.length != 0) {
			$("#" + e).attr("textid", 0);
			$("#" + e).val(areainfo[0]);
			$("#" + e).show();
		} else {
			$("#" + e).val("");
			$("#" + e).hide();
		}
	}
}

/** 省市区单选对话框 
 * a 搜索类型
 * e 写入位置ID
 * b 省ID
 * c 市ID
 * d 区、县ID
 */
function showPopupProvince(a, e, b, c, d) {
	var json = null;
	var datainfo = "";
	if (a == 1) { // 省
		json = provinceList;
		datainfo = "省";
	} else if (a == 2) { // 市
		var provinceid = $("#" + b).attr("textid");
		var cityinfo = provinceList[provinceid].cityList;
		json = cityinfo;
		datainfo = "市";
	} else if (a == 3) { // 区、县
		var provinceid = $("#" + b).attr("textid");
		var cityid = $("#" + c).attr("textid");
		var areainfo = provinceList[provinceid].cityList[cityid].areaList;
		json = areainfo;
		datainfo = "区、县";
	}
	var content = '';
	// 单选组合
	for (var i = 0; i < json.length; i++) {
		if (a != 3) {
			content += "<li>" +
				"<input id='province" + i + "' value=" + i + " text='" + json[i].name + "' type='radio' name='radiossq'>" +
				"<label for='province" + i + "'>" +
				"<font>" + json[i].name + "</font>" +
				"</label><div style='clear: both;'></div>" +
				"</li>";
		} else {
			content += "<li>" +
				"<input id='province" + i + "' value=" + i + " text='" + json[i] + "' type='radio' name='radiossq'>" +
				"<label for='province" + i + "'>" +
				"<font>" + json[i] + "</font>" +
				"</label><div style='clear: both;'></div>" +
				"</li>";
		}
	}
	var mess = "<ul id='radiosrossq' class='radiostyle'>" + content + "</ul>";
	// 弹框
	$("#afui").popup({
		title: "<div style='border: 1px solid #ccc;border-radius: 10px;'><input type='text' style='width: 78%;border: none;background: none;margin: 0px;' id='prosearchinfo' placeholder='" + datainfo + "'><div class='icon magnifier searchpro' onclick='searchProvince(" + a + ", \"" + e + "\", \"" + b + "\", \"" + c + "\");'></div></div>",
		message: "<div id='tempsearchdata'>" + mess + "</div>",
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			var id = $('input:radio[name="radiossq"]:checked').val();
			var text = $('input:radio[name="radiossq"]:checked').attr('text');
			// 显示
			$('#' + e).val(text);
			// 传出值
			$('#' + e).attr('textid', id);
			changeProvince(a, b, c, d);
		},
		cancelOnly: false
	});
	// 滚动
	$("#radiosrossq").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: true
	});
	// 选中判断
	if (!parten.test($('#' + e).attr('textid'))) {
		$("input:radio[name='radiossq'][value=" + $('#' + e).attr('textid') + "]").attr("checked", true);
	}
	//new IScroll('#radioscrl', {scrollX: false, scrollY: true});
}

/** 省市区搜索
 * a 搜索类型
 * b 省ID
 * c 市ID
 * e 写入位置ID
 */
function searchProvince(a, e, b, c) {
	var json = null;
	var content = '';
	var searchdata = $("#prosearchinfo").val();
	if (a == 1) { // 省
		json = provinceList;
		// 单选组合
		if (!parten.test(searchdata)) {
			for (var i = 0; i < json.length; i++) {
				if (json[i].name.indexOf(searchdata) != -1) {
					content += "<li>" +
						"<input id='province" + i + "' value=" + i + " text='" + json[i].name + "' type='radio' name='radiossq'>" +
						"<label for='province" + i + "'>" +
						"<font>" + json[i].name + "</font>" +
						"</label><div style='clear: both;'></div>" +
						"</li>";
				}
			}
		} else {
			for (var i = 0; i < json.length; i++) {
				content += "<li>" +
					"<input id='province" + i + "' value=" + i + " text='" + json[i].name + "' type='radio' name='radiossq'>" +
					"<label for='province" + i + "'>" +
					"<font>" + json[i].name + "</font>" +
					"</label><div style='clear: both;'></div>" +
					"</li>";
			}
		}
	} else if (a == 2) { // 市
		var provinceid = $("#" + b).attr("textid");
		var cityinfo = provinceList[provinceid].cityList;
		json = cityinfo;
		// 单选组合
		if (!parten.test(searchdata)) {
			for (var i = 0; i < json.length; i++) {
				if (json[i].name.indexOf(searchdata) != -1) {
					content += "<li>" +
						"<input id='province" + i + "' value=" + i + " text='" + json[i].name + "' type='radio' name='radiossq'>" +
						"<label for='province" + i + "'>" +
						"<font>" + json[i].name + "</font>" +
						"</label><div style='clear: both;'></div>" +
						"</li>";
				}
			}
		} else {
			for (var i = 0; i < json.length; i++) {
				content += "<li>" +
					"<input id='province" + i + "' value=" + i + " text='" + json[i].name + "' type='radio' name='radiossq'>" +
					"<label for='province" + i + "'>" +
					"<font>" + json[i].name + "</font>" +
					"</label><div style='clear: both;'></div>" +
					"</li>";
			}
		}
	} else if (a == 3) { // 区、县
		var provinceid = $("#" + b).attr("textid");
		var cityid = $("#" + c).attr("textid");
		var areainfo = provinceList[provinceid].cityList[cityid].areaList;
		json = areainfo;
		// 单选组合
		if (!parten.test(searchdata)) {
			for (var i = 0; i < json.length; i++) {
				if (json[i].indexOf(searchdata) != -1) {
					content += "<li>" +
						"<input id='province" + i + "' value=" + i + " text='" + json[i] + "' type='radio' name='radiossq'>" +
						"<label for='province" + i + "'>" +
						"<font>" + json[i] + "</font>" +
						"</label><div style='clear: both;'></div>" +
						"</li>";
				}
			}
		} else {
			for (var i = 0; i < json.length; i++) {
				content += "<li>" +
					"<input id='province" + i + "' value=" + i + " text='" + json[i] + "' type='radio' name='radiossq'>" +
					"<label for='province" + i + "'>" +
					"<font>" + json[i] + "</font>" +
					"</label><div style='clear: both;'></div>" +
					"</li>";
			}
		}
	}
	var mess = "<ul id='radiosrossq' class='radiostyle'>" + content + "</ul>";
	$("#tempsearchdata").empty();
	$("#tempsearchdata").html(mess, true);
	$("#radiosrossq").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: true
	});
	if (!parten.test($('#' + e).attr('textid'))) {
		$("input:radio[name='radiossq'][value=" + $('#' + e).attr('textid') + "]").attr("checked", true);
	}
}

/** 省市区位置搜索
 * a 搜索类型
 * b 省ID
 * c 市ID
 * e 搜索数据
 */
function searchProvinceNum(a, b, c, e) {
	var json = null;
	if (a == 1) { // 省
		json = provinceList;
		for (var i = 0; i < json.length; i++) {
			if (json[i].name.indexOf(e) != -1) {
				return i;
			}
		}
	} else if (a == 2) { // 市
		var provinceid = $("#" + b).attr("textid");
		var cityinfo = provinceList[provinceid].cityList;
		json = cityinfo;
		for (var i = 0; i < json.length; i++) {
			if (json[i].name.indexOf(e) != -1) {
				return i;
			}
		}
	} else if (a == 3) { // 区、县
		var provinceid = $("#" + b).attr("textid");
		var cityid = $("#" + c).attr("textid");
		var areainfo = provinceList[provinceid].cityList[cityid].areaList;
		json = areainfo;
		for (var i = 0; i < json.length; i++) {
			if (json[i].indexOf(e) != -1) {
				return i;
			}
		}
	}
	return -1;
}

/** 删除接收人对话框 
 * a 输入对象
 */
function showPopupDelMessagePeople(a) {
	var tempfont = $(a).find("font");
	var content = '';
	// 单选组合
	tempfont.each(function() {
		content += "<li style='padding-bottom: 5px;padding-top: 10px;'>" +
			"<div style='width: 90%;float: left;'>" +
			"<font userId='" + $(this).attr("userId") + "'>" + $(this).html() + "</font>" +
			"</div>" +
			"<div style='width: 10%;float: left;'>" +
			"<img src='images/del.jpg' style='width: 80%;' onclick='delMessagePeople(this)'/>" +
			"</div>" +
			"<div style='clear: both;'></div>" +
			"</li>";
	});

	var mess = "<ul id='radioscrlwl' class='radiostyle'>" + content + "</ul>";
	// 弹框
	$("#afui").popup({
		title: "<center>请选择</center>",
		message: mess,
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			var templi = $("#radioscrlwl").find("font");
			$(a).empty();
			templi.each(function() {
				var centent = "";
				if ($(this).index() < 20) {
					centent = "<font userId='" + $(this).attr("userId") + "'>" + $(this).html() + "</font> ";
				} else if ($(this).index() == 20) {
					centent = "<font userId='" + $(this).attr("userId") + "'>...</font>";
				} else {
					centent = "<font userId='" + $(this).attr("userId") + "'></font>";
				}
				$(a).append(centent);
			});
		},
		cancelOnly: false
	});
	// 滚动
	$("#radioscrlwl").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: true
	});
}

/* 删除接收人 */
function delMessagePeople(a) {
	$(a).closest("li").remove();
}

/** 订单产品信息输入
 * a 点击对象
 * b 类型(0:新增;1:修改)
 */
function inputCheckText(a, b) {
	var temptext = $(a).find(".orderproductname").html();
	$("#afui").popup({
		title: temptext,
		message: '<fieldset style="padding: 5px;border: 1px solid #cfcfcf;"><legend>总金额:<font id="orderallprice"></font></legend><table style="width: 100%;"><tr><td>实价</td><td><input id="inputprice" type="number" style="width: 100%;" onkeypress="clearNoNum(this);" onkeyup="countOrderAllPrice();" onchange="inputNull(this);countOrderAllPrice();" /></td></tr><tr><td>数量</td><td><input id="inputnum" type="number" style="width: 100%;" onkeypress="clearNoNum(this);" onkeyup="countOrderAllPrice();" onchange="inputNull(this);countOrderAllPrice();" /></td></tr></table></fieldset>',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			if (b == 1) {
				$(a).find(".orderproductprice").html($("#inputprice").val(), true);
				$(a).find(".orderproductnum").html($("#inputnum").val(), true);
				$(a).find(".orderproductallprice").html($("#orderallprice").html(), true);
			}
			countOrderAllPriceAndNum();
		},
		cancelOnly: false
	});
	if (b != 0) {
		$("#inputprice").val($(a).find(".orderproductprice").html());
		$("#inputnum").val($(a).find(".orderproductnum").html());
		countOrderAllPrice();
	}
}

function inputNull(a) {
	a.value = parten.test(a.value) ? 0 : a.value;
}

/* 单个产品总价结算 */
function countOrderAllPrice() {
	var tempinputprice = parseFloat($("#inputprice").val());
	var tempinputnum = parseFloat($("#inputnum").val());
	var temporderallprice = (tempinputprice * tempinputnum).toFixed(2);
	if (!isNaN(temporderallprice)) {
		$("#orderallprice").html(temporderallprice, true);
	} else {
		$("#orderallprice").html(0, true);
	}
}

/* 所有产品总价和数量计算 */
function countOrderAllPriceAndNum() {
	var temporderproductnum = $("#orderproductlistul").find(".orderproductnum");
	var temporderproductallprice = $("#orderproductlistul").find(".orderproductallprice");
	var allprice = 0;
	var allnum = 0;
	for (var i = 0; i < temporderproductallprice.length; i++) {
		allprice += parseFloat(temporderproductallprice.eq(i).html());
		allnum += parseFloat(temporderproductnum.eq(i).html());
	}
	$("#orderallmoney").html(allprice.toFixed(2), true);
	$("#orderallnum").html(allnum, true);
}