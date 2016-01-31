/**
 *  Sell Log
 *  @Author Jianyong Shao
 *  @Date 2014-09-17
 */

/* 姓名选择点击 */
function checkName() {
	radiotype = 2;
	$.ui.loadContent("#radiomap", false, false, "up");
}

/* 销售日志登记界面读取 */
var sellnotetype = '';

function loadSellNote() {
	$.ui.toggleNavMenu(false);
	document.getElementById('maintitle').innerHTML = '销售日志登记';
	/*document.getElementById('gonext').innerHTML = '选择姓名';
	document.getElementById('gonext').href = '#radiomap';
	document.getElementById('gonext').onclick = function () {
	    radiotype = 2;
	};*/
	if (sellnotetype) {
		$('#gonext').hide();
		$("#sellnotesa").css('display', 'block');
		$("#sellnoteup").css('display', 'none');
		$("#sellnotetable").css('display', 'none');
		$('#sellnotenone').css('display', 'none');
		$('#sellnotebox').css('display', 'none');
		$('#sellnoteloading').css('display', 'block');
		$("#sellnotedd").attr('disabled', false);
		$("#sellnotextr").attr('disabled', false);
		$("#sellnotextd").attr('disabled', false);
		$("#sellnotejl").attr('disabled', false);
		panelInputCSS("sellnotebox");
		var inp = document.getElementById('tablebody').getElementsByTagName('input');
		for (var i = 0; i < inp.length; i++) {
			inp[i].disabled = false;
		}
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/saleLogEdit.do",
			dataType: 'jsonp',
			type: 'post',
			timeout: 10000, //超时时间设置，单位毫秒
			data: {
				pid: getSession('keyid'),
				userId: getSession('uid')
			},
			success: function(json) {
				if (json.status == 0) { // 数据不存在
					$('#sellnoteloading').css('display', 'none');
					$('#sellnotebox').css('display', 'none');
					$('#sellnotenone').css('display', 'block');
				} else if (json.status == 1) { // 修改
					$("#sellnotename").html(json.form.name, true);
					$("#sellnotezw").html(json.form.position, true);
					$("#sellnotekh").html(json.form.yearAssessTarget, true);
					$("#sellnotedc").html(json.form.lastmonthTotalSale, true);
					$("#sellnotepm").html(json.form.lastmonthAreaRanking, true);
					//$("#sellnotecode").html(uniqueCode, true);
					$("#sellnotecode").html(json.form.uniqueCode, true);
					$("#sellnotedd").val(json.form.workplace);
					$("#sellnotejl").val(json.form.jobContent);
					$("#sellnotextr").val(json.form.collWorkPeople);
					$("#sellnotextd").val(json.form.collTel);
					$("#sellNoteCreateTime").val(json.form.createDate); //创建时间放到隐藏值
					//判断创建日期是否等于今天来隐藏或显示保存按钮
					if (json.form.isSave == 1) { // 未审批 
						if (isapprove == 1) { // 不能编辑 
							$("#sellnotedd").attr("disabled", "true");
							$("#sellnotejl").attr("disabled", "true");
							$("#sellnotextr").attr("disabled", "true");
							$("#sellnotextd").attr("disabled", "true");
							$("#sellnotenameadd").hide();
							var content = ''
							for (var i = 0; i < json.list.length; i++) {
								content += "<tr><td>" + json.list[i].cdwbh + "</td><td>" + json.list[i].cDwmc + "</td><td><input type='number' placeholder='请输入销量' value='" + json.list[i].Amount + "' disabled/></td></tr>";
							}
							$('#tablebody').html('', true);
							$('#tablebody').append(content);
							$('#gonext').hide();
							panelCheckCSS("sellnotebox");
							$("#sellnotetable").show();
							$("#sellnotesa").hide();
							$("#sellnoteup").hide();
						} else if (isapprove == 0) { // 可编辑 
							$("#sellnotedd").removeAttr("disabled");
							$("#sellnotejl").removeAttr("disabled");
							$("#sellnotextr").removeAttr("disabled");
							$("#sellnotextd").removeAttr("disabled");
							$("#sellnotenameadd").hide();
							var content = ''
							for (var i = 0; i < json.list.length; i++) {
								content += "<tr><td>" + json.list[i].cdwbh + "</td><td>" + json.list[i].cDwmc + "</td><td><input type='number' placeholder='请输入销量' value='" + json.list[i].Amount + "' onkeypress='clearNoNum(this)' /></td></tr>";
							}
							$('#gonext').show();
							$('#tablebody').html('', true);
							$('#tablebody').append(content);
							$("#sellnotetable").show();
							$("#sellnotesa").show();
							$("#sellnoteup").show();
						}
					} else if (json.form.isSave == 0) { // 已审批
						$("#sellnotesa").hide();
						$("#sellnoteup").hide();
						$('#gonext').hide();
						$("#sellnotedd").attr("disabled", "true");
						$("#sellnotejl").attr("disabled", "true");
						$("#sellnotextr").attr("disabled", "true");
						$("#sellnotextd").attr("disabled", "true");
						$("#sellnotenameadd").hide();
						var content = ''
						for (var i = 0; i < json.list.length; i++) {
							content += "<tr><td style='border:none;'>" + json.list[i].cdwbh + "</td><td style='border:none;'>" + json.list[i].cDwmc + "</td></tr><tr><td colspan=2><div style='border:1px solid #ccc; border-radius: 5px;'><label style='width:10%;float:left;'>￥</label><input type='number' style='float:left;width:75%;border:none;padding:0px 5px;margin-bottom:0px;' placeholder='请输入销量' value='" + json.list[i].Amount + "' disabled/><font style='width:15%;float:left;margin-top: 10px;'>万元</font><div style='clear:both;'></div></div></td></tr>";
						}
						$('#tablebody').html('', true);
						$('#tablebody').append(content);
						panelCheckCSS("sellnotebox");
						$("#sellnotetable").show();
					}
					$('#sellnoteloading').css('display', 'none');
					$('#sellnotenone').css('display', 'none');
					$('#sellnotebox').css('display', 'block');
				} else if (json.status == 2) { // 新增
					isapprove = '';
					//初始化按钮
					$("#sellnotesa").show();
					$("#sellnotedd").removeAttr("disabled");
					$("#sellnotejl").removeAttr("disabled");
					$("#sellnotextr").removeAttr("disabled");
					$("#sellnotextd").removeAttr("disabled");
					$("#sellnotenameadd").hide();
					$("#sellNoteCreateTime").val(json.form.createDate); //创建时间放到隐藏值
					$("#sellnotename").html('', true);
					$("#sellnotezw").html('', true);
					$("#sellnotekh").html('', true);
					$("#sellnotedc").html('', true);
					$("#sellnotepm").html('', true);
					$("#sellnotecode").html('', true);
					$("#sellnotedd").val('');
					$("#sellnotejl").val('');
					$("#sellnotextr").val('');
					$("#sellnotextd").val('');
					$('#gonext').show();
					loadSellManInfo();
				} else if (json.status == -1) { // 账号失效
					$('#sellnoteloading').css('display', 'none');
					$('#sellnotenone').css('display', 'none');
					$('#sellnotebox').css('display', 'none');
					showMessage('账号已失效');
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				}
			},
			Error: function() {
				$('#sellnoteloading').css('display', 'none');
				$('#sellnotenone').css('display', 'none');
				$('#sellnotebox').css('display', 'none');
				alert('Error');
			},
			complete: function(response) {
				if (response.status == 200) {} else {
					ajaxdata.abort();
					$('#sellnoteloading').css('display', 'none');
					$('#sellnotenone').css('display', 'none');
					$('#sellnotebox').css('display', 'none');
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
		sellnotetype = false;
	}
}

/* 销售日志登记人信息自动读取 */
function loadSellManInfo() {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/newUserInfo.do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 'fail') { /* 数据不存在 */
				$('#sellnoteloading').css('display', 'none');
				$('#sellnotenone').css('display', 'none');
				$('#sellnotebox').css('display', 'none');
				showErrorPopup('提示', '信息不存在');
			} else if (json.status == 'success') {
				$('#sellnotename').html(json.userName, true);
				$('#sellnotecode').html(json.unCode, true);
				$('#sellnotezw').html(json.userSaff, true);
				loadSellOtherInfo(json.unCode);
			} else if (json.status == -1) { /* 账号失效 */
				$('#sellnoteloading').css('display', 'none');
				$('#sellnotenone').css('display', 'none');
				$('#sellnotebox').css('display', 'none');
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#sellnoteloading').css('display', 'none');
			$('#sellnotenone').css('display', 'none');
			$('#sellnotebox').css('display', 'none');
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#sellnoteloading').css('display', 'none');
				$('#sellnotenone').css('display', 'none');
				$('#sellnotebox').css('display', 'none');
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 获取个人信息 */
function loadSellOtherInfo(a) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/addUpMonthRate.do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			uniqueCode: a,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 'fail') {
				$('#sellnoteloading').css('display', 'none');
				$('#sellnotenone').css('display', 'none');
				$('#sellnotebox').css('display', 'none');
				showErrorPopup('提示', json.msg);
			} else if (json.status == 'success') {
				$('#sellnotekh').html(json.yearTarget, true);
				$('#sellnotedc').html(json.consequence, true);
				$('#sellnotepm').html(json.monthRanking, true);
				$('#sellnoteloading').css('display', 'none');
				$('#sellnotenone').css('display', 'none');
				$('#sellnotebox').css('display', 'block');
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
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#sellnoteloading').css('display', 'none');
				$('#sellnotenone').css('display', 'none');
				$('#sellnotebox').css('display', 'none');
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 销售日志审批界面读取 */
function loadSellOk() {
	$.ui.toggleNavMenu(false);
	document.getElementById('maintitle').innerHTML = '销售日志审批';
	/* document.getElementById('xs1').checked = true;*/
	$('#checkinfoopinion').val('');
	$('#selloknone').css('display', 'none');
	$('#sellokbox').css('display', 'none');
	$('#sellokloading').css('display', 'block');
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/saleLogConfEdit.do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: getSession('keyid'),
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 0) { /* 数据不存在 */
				$('#sellokloading').css('display', 'none');
				$('#sellokbox').css('display', 'none');
				$('#selloknone').css('display', 'block');
			} else if (json.status == 1) { /* 修改 */
				$('#sellokname').html(json.form.name, true);
				$('#sellokzw').html(json.form.position, true);
				$('#sellokmb').html(json.form.yearAssessTarget, true);
				$('#sellokdc').html(json.form.lastmonthTotalSale, true);
				$('#sellokpm').html(json.form.lastmonthAreaRanking, true);
				$('#sellokdd').html(json.form.workplace, true);
				$('#sellokdd').html(json.form.workplace, true);
				$('#sellokjl').html(json.form.jobContent, true);
				$('#sellokxtr').html(json.form.collWorkPeople, true);
				$('#sellokdh').html(json.form.collTel, true);
				$('#sellokbcr').html(json.form.creater, true);
				$('#selloktime').html(json.form.createDate, true);

				//审核人初始化
				if (json.form.approver == "") {
					$('#checkinfoname').html(json.form.thisApprover, true);
				} else {
					$('#checkinfoname').html(json.form.approver, true);
				}

				//审核时间初始化
				if (json.form.approverTime == "") {
					$('#checkinfotime').html(json.form.thisApproverTime, true);
				} else {
					$('#checkinfotime').html(json.form.approverTime, true);
				}
				//审核意见
				$('#checkinfoopinion').val(json.form.competentviews);
				if (json.form.approverTime != "") {
					$('#checkinfoopinion').attr('disabled', true);
					$('#sellokbutton').hide();
				} else {
					$('#checkinfoopinion').attr('disabled', false);
					$('#sellokbutton').show();
				}
				$('#sellokloading').css('display', 'none');
				$('#selloknone').css('display', 'none');
				$('#sellokbox').css('display', 'block');
			} else if (json.status == -1) { /* 账号失效 */
				$('#sellokloading').css('display', 'none');
				$('#selloknone').css('display', 'none');
				$('#sellokbox').css('display', 'none');
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#sellokloading').css('display', 'none');
			$('#selloknone').css('display', 'none');
			$('#sellokbox').css('display', 'none');
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#sellokloading').css('display', 'none');
				$('#selloknone').css('display', 'none');
				$('#sellokbox').css('display', 'none');
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 销售日志保存 */
function saveSellNote() {
	var workplace = encodeURI($("#sellnotedd").val());
	var collWorkPeople = encodeURI($("#sellnotextr").val());
	var collTel = $("#sellnotextd").val();
	var jobContent = encodeURI($("#sellnotejl").val());
	var lastmonthTotalSale = $("#sellnotedc").html();
	var yearAssessTarget = $("#sellnotekh").html();
	var uniqueCode = $("#sellnotecode").html();
	if (parten.test(uniqueCode)) {
		showErrorPopup('提示', '请先选取登记姓名!');
	} else if (parten.test(workplace) || parten.test(collWorkPeople) || parten.test(collTel) || parten.test(jobContent)) {
		showWarming();
	} else {
		showMessage('提交中');
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/saleLogSave.do",
			dataType: "jsonp",
			timeout: 20000, //超时时间设置，单位毫秒
			type: "post",
			data: {
				id: getSession('keyid'),
				userId: getSession('uid'),
				workplace: workplace,
				collWorkPeople: collWorkPeople,
				collTel: collTel,
				jobContent: jobContent,
				lastmonthTotalSale: lastmonthTotalSale,
				yearAssessTarget: yearAssessTarget,
				uniqueCode: uniqueCode
			},
			success: function(json) {
				popup.hide();
				if (json.status == 1) {
					$("#sellnotedd").attr('disabled', true);
					$("#sellnotextr").attr('disabled', true);
					$("#sellnotextd").attr('disabled', true);
					$("#sellnotejl").attr('disabled', true);
					showMessage('保存成功');
					window.setTimeout(function() {
						popup.hide();
					}, 1500);
					if (getSession('keyid') == '') {
						var content = ''
						for (var i = 0; i < json.list.length; i++) {
							content += "<tr><td style='border:none;'>" + json.list[i].cdwbh + "</td><td style='border:none;'>" + json.list[i].cDwmc + "</td></tr><tr><td colspan=2><div style='border:1px solid #ccc; border-radius: 5px;'><label style='width:10%;float:left;'>￥</label><input type='number' style='float:left;width:75%;border:none;padding:0px 5px;margin-bottom:0px;' placeholder='请输入销量' value='" + json.list[i].Amount + "' /><font style='width:15%;float:left;margin-top:10px;'>万元</font><div style='clear:both;'></div></div></td></tr>";
						}
						$('#tablebody').html('', true);
						$('#tablebody').append(content);
					}
					/*if (isapprove == '') {
					    $("#sellnotesa").css('display', 'none');
					} else {
					    $("#sellnotesa").css('display', 'block');
					}*/
					$("#sellnotesa").css('display', 'block');
					$("#sellnoteup").css('display', 'block');
					$("#sellnotetable").css('display', 'block');
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

/* 销售表单保存 */
function saveTable() {
	//var inp = document.getElementById('tablebody').getElementsByTagName('input');
	showMessage('保存中');
	var rows = document.getElementById("sellNoteTable").rows; //获取所有行
	var length = $("#sellNoteTable").find("tr").length;
	var pks = "";
	if (length > 1) {
		for (var i = 1; i < length; i++) {
			pks += rows[i].cells[0].innerText + "-" + rows[i].cells[2].getElementsByTagName('input')[0].value + ",";
		}
	}
	pks = pks.substring(0, pks.length - 1);
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/saleLogSaveSaleMaster.do",
		dataType: "jsonp",
		timeout: 20000, //超时时间设置，单位毫秒
		type: "post",
		data: {
			cnosAndValues: pks,
			createDate: $("#sellNoteCreateTime").val()
		},
		success: function(json) {
			popup.hide();
			if (json.status == 1) {
				showMessage('保存成功');
				window.setTimeout(function() {
					popup.hide();
					$.ui.goBack();
				}, 1500);
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

/* 销售日志审批保存 */
function saveSellOk() {
	var approver = encodeURI($('#checkinfoname').html());
	//var approveTime = $('#checkinfotime').html();
	var competentviews = encodeURI($('#checkinfoopinion').val());
	if (parten.test(competentviews)) {
		showErrorPopup('提示', '审批意见不能为空!');
	} else {
		showMessage('提交中');
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/saleLogConfSave.do",
			dataType: "jsonp",
			timeout: 20000, //超时时间设置，单位毫秒
			type: "post",
			data: {
				id: getSession('keyid'),
				userId: getSession('uid'),
				approver: approver,
				competentviews: competentviews
			},
			success: function(json) {
				popup.hide();
				if (json.status == 1) {
					showMessage('保存成功');
					window.setTimeout(function() {
						popup.hide();
						$.ui.goBack();
					}, 1500);
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

//验证手机号
//校验手机号码：必须以数字开头，除数字外，可含有“-”
function isMobile(object) {
	var s = document.getElementById(object.id).value;
	var reg0 = /^13\d{5,9}$/;
	var reg1 = /^153\d{4,8}$/;
	var reg2 = /^159\d{4,8}$/;
	var reg3 = /^0\d{10,11}$/;
	var my = false;
	if (reg0.test(s)) my = true;
	if (reg1.test(s)) my = true;
	if (reg2.test(s)) my = true;
	if (reg3.test(s)) my = true;
	if (s != "") {
		if (!my) {
			alert('请输入正确的手机号码');
			object.value = "";
			object.focus();
		}
	}
}

//校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
function isTel(obj) {
	//国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)"
	var s = document.getElementById(object.id).value;
	var pattern = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
	//var pattern =/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/; 
	if (s != "") {
		if (!pattern.exec(s)) {
			alert('请输入正确的电话号码:电话号码格式为国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)"');
			object.value = "";
			object.focus();
		}
	}

}

/* 只能输入数字和. */
function clearNoNum(obj) {
	//先把非数字的都替换掉，除了数字和.
	obj.value = obj.value.replace(/[^\d.]/g, "");
	//必须保证第一个为数字而不是.
	obj.value = obj.value.replace(/^\./g, "");
	//保证只有出现一个.而没有多个.
	obj.value = obj.value.replace(/\.{2,}/g, ".");
	//保证.只出现一次，而不能出现两次以上
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
}

/* 只能输入数字和"-" */
function clearPhone(obj) {
	obj.value = obj.value.replace(/[^\d-]/g, "");
}

/* 只能输入数字*/
function clearIntNum(obj) {
	obj.value = obj.value.replace(/\\d+/g, "");
}


/* 审批意见输入 */
function inputSellCheckText() {
	$("#afui").popup({
		title: '审批意见',
		message: '<span id="remainWord">你还可以输入<span class="f_big" id="wordRemainTipSpan">120</span>个字</span><span id="extendWord" style="display: none;color: red" >已超出<span class="f_big" id="wordExtTipSpan">0</span>个字</span><textarea id="wb_ta" maxlength="120" style="overflow-y: hidden; height: 30px;" onpropertychange="checkLength(this)" oninput="checkLength(this)" onload="this.focused = true; this.select();"></textarea>',
		cancelText: "取消",
		cancelCallback: function() {},
		doneText: "确定",
		doneCallback: function() {
			var info = $('#wb_ta').val();
			checkAllCheck(info);
		},
		cancelOnly: false
	});
	$("#wb_ta").focus();
	checkLength(document.getElementById('wb_ta'));
}

/* 剩余字数提醒 */
/**
 * a: 输入框元素
 **/
function checkLength(a) {
	a.style.height = a.scrollHeight + 'px';
	var maxLength = 120;
	var wb_ta = $("#wb_ta");
	var currLength = wb_ta.val().length;
	var remain;
	if (currLength > maxLength) {
		$('#remainWord').hide();
		remain = currLength - maxLength;
		document.getElementById("wordExtTipSpan").innerHTML = remain;
		$('#extendWord').show();
	} else {
		$('#extendWord').hide();
		remain = maxLength - currLength;
		document.getElementById("wordRemainTipSpan").innerHTML = remain;
		$('#remainWord').show();
	}
}

/* 判断批量审批id是否为空 */
function checkSellOkId() {
	var ids = $('input:checkbox[name="sellokcheckbox"]:checked');
	if (ids.length == 0) {
		showErrorPopup('提示', '请勾选后再进行批量审批!')
	} else {
		inputSellCheckText();
	}
}

/* 进行销售日志批量审批 */
function checkAllCheck(info) {
	showMessage('提交中');
	var name1 = encodeURI($('#name1').html());
	var info1 = encodeURI(info);
	var ids = [];
	$('input:checkbox[name="sellokcheckbox"]:checked').each(function() {
		ids.push($(this).val());
	});
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/saleLogBatchApproval.do",
		dataType: "jsonp",
		timeout: 20000, //超时时间设置，单位毫秒
		type: "post",
		data: {
			ids: ids.join(','),
			userId: getSession('uid'),
			approver: name1,
			competentviews: info1
		},
		success: function(json) {
			if (json.status == 1) {
				var idslength = ids.length;
				for (var j = 0; j < idslength; j++) {
					var tempid = ids.pop();
					$('#sctrue' + tempid).remove();
					$('#scfalse' + tempid).find('img').attr('src', 'images/ok.png');
				}
				popup.hide();
				showMessage(json.success);
				window.setTimeout(function() {
					popup.hide();
				}, 1500);
			} else if (json.status == 0) {
				popup.hide();
				showErrorPopup('提示', json.error);
			} else if (json.status == -1) {
				popup.hide();
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