/**
 *  Leave Data
 *  @Author Jianyong Shao
 *  @Date 2014-09-16
 */

/* 请假申请界面读取 */
var leavetypere = '';
var leaveaddstatusobj = '';

function loadLeaveAdd() {
	$.ui.toggleNavMenu(false);
	document.getElementById('maintitle').innerHTML = '请假申请';
	if (leavetypere) {
		$('#leaveaddnone').css('display', 'none');
		$('#leaveaddbox').css('display', 'none');
		$('#leaveaddloading').css('display', 'block');
		$('#leaveaddname').val('');
		$('#leaveaddbu').val('');
		$('#l1').val('');
		$('#l2').val('');
		panelInputCSS("leaveaddbox");
		var temptoggle = '<input id="qingjia" type="checkbox" name="qingjia" value="0" class="toggle"onchange="checkLeaveManager();" checked><label for="qingjia" data-on="天" data-off="时" style="width: 60px;left: 50%;top: 2px;"><span></span></label>';
		$("#inserttoggle").html(temptoggle, true);
		//document.getElementById('qj1').checked = true;
		document.getElementById('leaveaddall').value = '';
		document.getElementById('leaveaddre').value = '';
		//document.getElementById('leaveaddsid').selectedIndex = 0;
		//$('#leaveaddname').attr('disabled', false);
		$('#leaveaddbu').attr('disabled', false);
		$('#leaveaddstatus').attr('onclick', "showPopupFont(6, 'leaveaddstatus')");
		//$('#leaveaddstatus').attr('disabled', false);
		document.getElementById('l1').onclick = function() {
			WdatePicker({
				startDate: '%y-%M-%d 08:00:00',
				alwaysUseStartDate: true,
				dateFmt: 'yyyy-MM-dd HH:mm:ss',
				maxDate: '#F{$dp.$D(\'l2\')}'
			});
		};
		document.getElementById('l2').onclick = function() {
			WdatePicker({
				startDate: '%y-%M-%d 17:30:00',
				alwaysUseStartDate: true,
				dateFmt: 'yyyy-MM-dd HH:mm:ss',
				minDate: '#F{$dp.$D(\'l1\')}'
			});
		};
		$('#leaveaddall').attr('disabled', false);
		/*$('#qj1').attr('disabled', false);
		$('#qj2').attr('disabled', false);*/
		$('#leaveaddre').attr('disabled', false);
		//$('#leaveaddsid').attr('disabled', false);
		$('#leaveaddcheck').css('display', 'none');
		$('#leaveaddcheckbutton').css('display', 'block');
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/appLeave/leaveRecordEdit.do",
			dataType: 'jsonp',
			type: 'GET',
			timeout: 10000, //超时时间设置，单位毫秒
			data: {
				id: leaveid,
				userId: getSession('uid')
			},
			success: function(json) {
				if (leaveaddstatusobj != undefined) {
					leaveaddstatusobj = json.leaveType;
				}
				if (json.status == 0) { /* 信息不存在 */
					$('#leaveaddloading').css('display', 'none');
					$('#leaveaddbox').css('display', 'none');
					$('#leaveaddnone').css('display', 'block');
				} else if (json.status == 2) { /* 新增 */
					/*$('#leaveaddbox').find('textarea').css('border-color', '#ccc');
					$('#leaveaddbox').find('select').css('border-color', '#ccc');
					$('#leaveaddbox').find('input').css('border-color', '#ccc');*/
					$('#leaveaddname').val(json.form.userName);
					/*var content = '';
					for (var i = 0; i < json.leaveType.length; i++) {
					    content += '<option value="' + json.leaveType[i].Code + '">' + json.leaveType[i].Name + '</option>'
					}
					$('#leaveaddstatus').html('', true);
					$('#leaveaddstatus').append(content);*/
					$('#leaveaddstatus').val(json.leaveType[0].val);
					$('#leaveaddstatus').attr('textid', json.leaveType[0].id);
					$('#leaveaddsid').val('');
					checkmanpid = '';
					//addCheckMan();
					$('#leaveaddsidbu').show();
					$('#leaveaddcheck').css('display', 'none');
					$('#leaveaddloading').css('display', 'none');
					$('#leaveaddnone').css('display', 'none');
					$('#leaveaddbox').css('display', 'block');
				} else if (json.status == -1) { /* 账号失效 */
					$('#leaveaddloading').css('display', 'none');
					$('#leaveaddnone').css('display', 'none');
					$('#leaveaddbox').css('display', 'none');
					showMessage('账号已失效');
					/* 1秒后隐藏提示 */
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				} else if (json.status == 1) { /* 修改、浏览 */
					if (leavestatus != '未审批') { /* 浏览 */
						panelCheckCSS("leaveaddbox");
						/*$('#leaveaddbox').find('textarea').css('border', 'none');
						$('#leaveaddbox').find('select').css('border', 'none');
						$('#leaveaddbox').find('input').css('border', 'none');*/
						$('#leaveaddname').val(json.form.userName);
						$('#leaveaddbu').val(json.form.dept_name);
						$('#leaveaddstatus').attr('textid', json.form.leave_type_id);
						$('#leaveaddstatus').val(json.form.leaveName);
						/*var content = '';
						for (var i = 0; i < json.leaveType.length; i++) {
						    content += '<option value="' + json.leaveType[i].Code + '">' + json.leaveType[i].Name + '</option>'
						}
						$('#leaveaddstatus').html('', true);
						$('#leaveaddstatus').append(content);
						//addCheckMan();
						document.getElementById('leaveaddstatus').value = json.form.leave_type_id;*/
						$('#l1').val(json.form.leave_start_time);
						$('#l2').val(json.form.leave_end_time);
						$('#leaveaddall').val(json.form.leave_total);

						if (!json.form.leave_unit) {
							$("#qingjia").attr("checked", true);
						} else {
							$("#qingjia").removeAttr("checked");
						}

						/*var obj = document.getElementsByName('qingjia');
						for (var i = 0; i < obj.length; i++) {
						    if (obj[i].value == json.form.leave_unit) {
						        obj[i].checked = true;
						    }
						}*/


						$('#leaveaddsid').val(json.form.censorName);
						$('#leaveaddre').val(json.form.leave_reason);
						var censor_state = '';
						if (json.form.censor_state == 0) {
							censor_state = '未审批';
						} else if (json.form.censor_state == 1) {
							censor_state = '同意';
						} else if (json.form.censor_state == 2) {
							censor_state = '不同意';
						}
						if (json.form.oAStauts == 'false') {
							$('#leaveaddcheckoa').html('未生成OA公文', true);
						} else {
							$('#leaveaddcheckoa').html(json.oaApprovalStatus, true);
						}
						$('#leaveaddcheckinfo').html(json.form.censor_opinion, true);
						$('#leaveaddcheckdata').html(json.form.censor_time, true);
						$('#leaveaddsidbu').hide();
						$('#leaveaddcheckstatus').html(censor_state, true);
						$('#leaveaddchecktime').html(json.form.create_date, true);
						$('#leaveaddname').attr('disabled', true);
						$('#leaveaddbu').attr('disabled', true);
						//$('#leaveaddstatus').attr('disabled', true);
						$('#leaveaddstatus').removeAttr('onclick');
						document.getElementById('l1').onclick = '';
						document.getElementById('l2').onclick = '';
						$('#leaveaddall').attr('disabled', true);
						$('#qingjia').attr('disabled', true);
						/*$('#qj1').attr('disabled', true);
						$('#qj2').attr('disabled', true);*/
						$('#leaveaddre').attr('disabled', true);
						//$('#leaveaddsid').attr('disabled', true);
						$('#leaveaddcheck').css('display', 'block');
						$('#leaveaddcheckbutton').css('display', 'none');
					} else { /* 修改 */
						/*$('#leaveaddbox').find('textarea').css('border-color', '#ccc');
						$('#leaveaddbox').find('select').css('border-color', '#ccc');
						$('#leaveaddbox').find('input').css('border-color', '#ccc');*/
						$('#leaveaddname').val(json.form.userName);
						$('#leaveaddbu').val(json.form.dept_name);
						/*var content = '';
						for (var i = 0; i < json.leaveType.length; i++) {
						    content += '<option value="' + json.leaveType[i].Code + '">' + json.leaveType[i].Name + '</option>'
						}
						$('#leaveaddstatus').html('', true);
						$('#leaveaddstatus').append(content);
						//addCheckMan();
						document.getElementById('leaveaddstatus').value = json.form.leave_type_id;*/
						$('#leaveaddstatus').attr('textid', json.form.leave_type_id);
						$('#leaveaddstatus').val(json.form.leaveName);
						$('#l1').val(json.form.leave_start_time);
						$('#l2').val(json.form.leave_end_time);
						$('#leaveaddall').val(json.form.leave_total);
						if (!json.form.leave_unit) {
							$("#qingjia").attr("checked", true);
						} else {
							$("#qingjia").removeAttr("checked");
						}
						/*var obj = document.getElementsByName('qingjia');
						for (var i = 0; i < obj.length; i++) {
						    if (obj[i].value == json.form.leave_unit) {
						        obj[i].checked = true;
						    }
						}*/
						$('#leaveaddsidbu').show();
						$('#leaveaddsid').val(json.form.censorName);
						checkmanpid = json.form.censor_manager_id;
						$('#leaveaddre').val(json.form.leave_reason);
						$('#leaveaddcheck').css('display', 'none');
					}
					$('#leaveaddloading').css('display', 'none');
					$('#leaveaddnone').css('display', 'none');
					$('#leaveaddbox').css('display', 'block');
				}
			},
			Error: function() {
				$('#leaveaddloading').css('display', 'none');
				$('#leaveaddnone').css('display', 'none');
				$('#leaveaddbox').css('display', 'none');
				alert('Error');
			},
			complete: function(response) {
				if (response.status == 200) {} else {
					ajaxdata.abort();
					$('#leaveaddloading').css('display', 'none');
					$('#leaveaddnone').css('display', 'none');
					$('#leaveaddbox').css('display', 'none');
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
		leavetypere = false;
	}
}

/* 审批人添加 */
/*function addCheckMan() {
    $.jsonP({
        url: "http://" + ipaddress + "/" + serviceName + "/appLeave/censorManager.do?num=10&callback=?",
        success: function (json) {
            if (json.status == 1) {
                var content = '';
                for (var i = 0; i < json.list.length; i++) {
                    content += '<option value="' + json.list[i].PID + '">' + json.list[i].NAME + '</option>'
                }
                $('#leaveaddsid').html('', true);
                $('#leaveaddsid').append(content);
            } else if (json.status == -1) {
                showMessage('账号已失效,请重新登录');
                 1秒后隐藏提示 
                window.setTimeout(function () {
                    popup.hide();
                    $.ui.loadContent("#main", true, true, "up");
                }, 1500);
            }
        },
        Error: function () {
            alert('Error');
        }
    });
}*/

/* 确定申请 */
function leaveAddSave() {
	showPopup('提示', '确定提交申请吗?');
}

/* 请假申请保存 */
function leaveAddSaveDo() {
	var week = $("#leaveaddstatus");
	var weekid = week.attr('textid');
	var begin = $('#l1').val();
	var end = $('#l2').val();
	var leaveaddall = $('#leaveaddall').val();
	var qingjia = $('input:checkbox[name="qingjia"]:checked').length;
	if (qingjia == 0) {
		qingjia = "1";
	} else {
		qingjia = "0";
	}
	var leaveReason = $('#leaveaddre').val();
	var leaveaddname = $('#leaveaddname').val();
	var leaveaddbu = $('#leaveaddbu').val();
	if (parten.test(leaveaddname) || parten.test(leaveaddbu) || parten.test(leaveaddall) || parten.test(end) || parten.test(begin) || parten.test(leaveReason)) {
		showWarming();
	} else {
		showMessage('提交中');
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/appLeave/saveLeaveRecord.do",
			timeout: 20000, //超时时间设置，单位毫秒
			dataType: "jsonp",
			type: "post",
			data: {
				userName: encodeURI(leaveaddname),
				userId: getSession('uid'),
				id: leaveid,
				deptName: encodeURI(leaveaddbu),
				leaveTypeId: weekid,
				leaveStartTime: begin,
				leaveEndTime: end,
				leaveTotal: leaveaddall,
				leaveUnit: qingjia,
				leaveReason: encodeURI(leaveReason),
				censorManagerId: checkmanpid
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
					showErrorPopup('提示', '保存失败');
				} else if (json.status == -1) {
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
}

var leaveid = '';
var leavestatus = '';
/* 请假历史列表读取 */
var leaveinfo1 = '';
var leaveinfo2 = '';

function loadLeaveData(a, name) {
	leaveinfo1 = $('#leavesearchbegin').val();
	leaveinfo2 = $('#leavesearchend').val();
	$('#page_1').css('display', 'none');
	$('#leavenone').css('display', 'none');
	$('#page_' + a + '_button').hide();
	$('#leaveloading').css('display', 'block');
	var tarP = "page_" + a;
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'GET',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			stTime: leaveinfo1,
			edTime: leaveinfo2,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 0) {
				$('#leaveloading').css('display', 'none');
				$('#page_1').css('display', 'none');
				$('#page_' + a + '_button').show();
				$('#leavenone').css('display', 'block');
			} else if (json.status == 1) {
				$("#" + tarP).attr('first', json.list[0].rownum);
				$("#" + tarP).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					/*content += "<li><a href='#leaveadd' data-transition='up' onclick='leavetypere=true;leaveid=\"" + json.list[i].id + "\";leavestatus=\"" + json.list[i].censor_state + "\";'><div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div><div style='float: left; width: 90%;'><p><font>" + json.list[i].create_date + "</font><font>" + json.list[i].name + "</font></p><p><font>审批状态:</font><font>" + json.list[i].censor_state + "</font></p></div><div style='clear: both;'></div></a></li>";*/
					var hrefinfo = '';
					var delinfo = '';
					if (delshow) {
						hrefinfo = '';
						delinfo = '';
					} else {
						hrefinfo = 'leaveadd';
						delinfo = 'hidden';
					}
					content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='leavetypere=true;leaveid=\"" + json.list[i].id + "\";leavestatus=\"" + json.list[i].censor_state + "\";'><table class='tablemess'><tr><td rowspan='2' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/manicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>" + json.list[i].create_date + "</font><font>" + json.list[i].name + "</font></td><td class='deltest' rowspan='2' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appLeave/delLeaveRecord\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>审批状态:</font><font>" + json.list[i].censor_state + "</font></td></tr></table></a></li>";
				}
				$('#page_1_ul').html('', true);
				$("#page_1_ul").append(content);
				leavescroller.scrollToTop();
				$('#leaveloading').css('display', 'none');
				$('#leavenone').css('display', 'none');
				$('#page_' + a + '_button').show();
				$('#page_1').css('display', 'block');
			} else if (json.status == -1) {
				$('#leaveloading').css('display', 'none');
				$('#leavenone').css('display', 'none');
				$('#page_1').css('display', 'none');
				$('#page_' + a + '_button').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#leaveloading').css('display', 'none');
			$('#leavenone').css('display', 'none');
			$('#page_1').css('display', 'none');
			$('#page_' + a + '_button').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#leaveloading').css('display', 'none');
				$('#leavenone').css('display', 'none');
				$('#page_1').css('display', 'none');
				$('#page_' + a + '_button').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

var leavecheckstatus = '';
/* 请假审批列表读取 */
var leavecheckinfo1 = '';
var leavecheckinfo2 = '';

function loadLeaveCheckData(a, name) {
	leavecheckinfo1 = $('#leavecheckpeople').val();
	leavecheckinfo2 = $('#leavecheckstatus').attr('textid');
	$('#' + a + '_box').css('display', 'none');
	$('#' + a + '_none').css('display', 'none');
	$('#' + a + 'loading').css('display', 'block');
	var tarP = a;
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'GET',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			userName: leavecheckinfo1,
			censorState: leavecheckinfo2,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 0) {
				$('#' + a + 'loading').css('display', 'none');
				$('#' + a + 'box').css('display', 'none');
				$('#' + a + 'none').css('display', 'block');
			} else if (json.status == 1) {
				$("#" + tarP).attr('first', json.list[0].rownum);
				$("#" + tarP).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><a href='#leaveok' data-transition='up' onclick='leavecheckstatus=\"" + json.list[i].censorStateId + "\";setSession(\"spid\", " + json.list[i].id + ")'><div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div><div style='float: left; width: 90%;'><p><font>" + json.list[i].create_date + "</font><font>" + json.list[i].userName + "</font></p><p><font>" + json.list[i].leaveName + "</font><font>审批状态:</font><font>" + json.list[i].censor_state + "</font></p></div><div style='clear: both;'></div></a></li>";
				}
				$('#page_' + a).html('', true);
				$("#page_" + a).append(content);
				leavecheckscroller.scrollToTop();
				$('#' + a + 'loading').css('display', 'none');
				$('#' + a + 'none').css('display', 'none');
				$('#' + a + 'box').css('display', 'block');
			} else if (json.status == -1) {
				$('#' + a + 'loading').css('display', 'none');
				$('#' + a + 'leavenone').css('display', 'none');
				$('#' + a + 'box').css('display', 'none');
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#' + a + 'loading').css('display', 'none');
			$('#' + a + 'leavenone').css('display', 'none');
			$('#' + a + 'box').css('display', 'none');
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + a + 'loading').css('display', 'none');
				$('#' + a + 'leavenone').css('display', 'none');
				$('#' + a + 'box').css('display', 'none');
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 请假审批界面读取 */
function loadLeaveOk() {
	$.ui.toggleNavMenu(false);
	document.getElementById('maintitle').innerHTML = '请假审批';
	$("#leaveokspyj").attr('textid', 0);
	$("#leaveokspyj").val('未审批');
	$("#leaveokspyj").attr('onclick', 'showPopupFont(2, "leaveokspyj")');
	/*document.getElementById("leaveokspyj").selectedIndex = 0;
	document.getElementById("leaveokspyj").disabled = false;*/
	document.getElementById('leaveokopinion').disabled = false;
	$('#leaveokoashow').hide();
	$('#leaveokopinion').val('');
	$('#checkbutton').css('display', 'block');
	$('#checkoa').css('display', 'none');
	$('#leaveoknone').css('display', 'none');
	$('#leaveokbox').css('display', 'none');
	$('#leaveokloading').css('display', 'block');
	$("#leaveokinfo").show();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appLeave/leaveApprovalEdit.do",
		dataType: 'jsonp',
		type: 'GET',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: getSession('spid'),
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 1) {
				$('#leaveokname').html(json.form.userName, true);
				$('#leaveokbu').html(json.form.dept_name, true);
				$('#leaveokstatus').html(json.form.leaveName, true);
				$('#leaveokbegin').html(json.form.leave_start_time, true);
				$('#leaveokend').html(json.form.leave_end_time, true);
				$('#leaveokall').html(json.form.leave_total, true);
				var unit = '';
				if (json.form.leave_unit) {
					unit = '小时';
				} else {
					unit = '天';
				}
				$('#leaveokunit').html(unit, true);
				$('#leaveokzg').html(json.form.censorName, true);
				$('#leaveoktime').html(json.form.create_date, true);
				$('#leaveokman').html(json.loginName, true);
				/* 非未审批状态 */
				if (leavecheckstatus != 0) {
					$("#leaveokinfo").show();
					var templeaveokspyj = $("#leaveokspyj");
					templeaveokspyj.removeAttr('onclick');
					var templeaveokopinion = document.getElementById('leaveokopinion');
					switch (json.form.censor_state) {
						case 0:
							templeaveokspyj.val('未审批');
							templeaveokspyj.attr('textid', '0');
							break;
						case 1:
							templeaveokspyj.val('同意');
							templeaveokspyj.attr('textid', '1');
							break;
						case 2:
							templeaveokspyj.val('不同意');
							templeaveokspyj.attr('textid', '2');
					}
					//templeaveokspyj.selectedIndex = json.form.censor_state;
					templeaveokopinion.disabled = true;
					templeaveokopinion.value = json.form.censor_opinion;
					$('#leaveokdate').html(json.form.censor_time, true);
					$('#checkbutton').css('display', 'none');
					// 审批同意状态
					if (leavecheckstatus == 1) {
						$('#leaveokoashow').show();
						if (json.form.oAStauts == 'false') {
							$('#leaveokoastatus').html('未生成OA公文', true);
						} else {
							$('#leaveokoastatus').html(json.oaApprovalStatus, true);
						}
						// oa公文提交状态 
						if (!json.form.oAStauts && json.form.censor_manager_id == getSession('uid')) {
							$('#checkoa').css('display', 'block');
						} else {
							$('#checkoa').css('display', 'none');
						}
					} else {
						$('#checkoa').css('display', 'none');
					}
				} else if (json.form.censor_manager_id != getSession('uid')) {
					$("#leaveokinfo").hide();
				}
				$('#leaveokloading').css('display', 'none');
				$('#leaveoknone').css('display', 'none');
				$('#leaveokbox').css('display', 'block');
			} else if (json.status == -1) {
				$('#leaveokloading').css('display', 'none');
				$('#leaveoknone').css('display', 'none');
				$('#leaveokbox').css('display', 'none');
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#leaveokloading').css('display', 'none');
				$('#leaveokbox').css('display', 'none');
				$('#leaveoknone').css('display', 'block');
			}
		},
		Error: function() {
			$('#leaveokloading').css('display', 'none');
			$('#leaveoknone').css('display', 'none');
			$('#leaveokbox').css('display', 'none');
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#leaveokloading').css('display', 'none');
				$('#leaveoknone').css('display', 'none');
				$('#leaveokbox').css('display', 'none');
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 提交OA公文 */
function checkLeaveOkOA() {
	showPopup2('提示', '确定提交OA公文吗?');
}

/* 提交OA公文 */
function changeLeaveOkOA() {
	showMessage('提交中');
	$.jsonP({
		url: "http://" + ipaddress + "/" + serviceName + "/appLeave/submitOADocument.do?id=" + getSession('spid') + "&callback=?",
		success: function(json) {
			popup.hide();
			if (json.status == 1) {
				showMessage('提交成功');
				window.setTimeout(function() {
					popup.hide();
					$.ui.goBack();
				}, 1500);
			} else if (json.status == 0) {
				showErrorPopup('提示', '提交失败');
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
		}
	});
}

/* 请假审批提交 */
function checkLeaveOk() {
	showPopup1('提示', '确定提交审批吗?');
}

/* 提交审批 */
function changeLeaveOk() {
	var week = $("#leaveokspyj");
	var weekid = week.attr('textid');
	var leaveokopinion = $('#leaveokopinion').val();
	showMessage('提交中');
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appLeave/ApprovalLeaveRecord.do",
		dataType: "jsonp",
		timeout: 20000, //超时时间设置，单位毫秒
		type: "post",
		data: {
			id: getSession('spid'),
			userId: getSession('uid'),
			censorState: weekid,
			censorOpinion: encodeURI(leaveokopinion)
		},
		success: function(json) {
			popup.hide();
			if (json.status == 1) {
				showMessage('保存成功');
				window.setTimeout(function() {
					week.disabled = true;
					week.removeAttr('onclick');
					document.getElementById('leaveokopinion').disabled = true;
					$('#checkbutton').css('display', 'none');
					if (weekid == 1) {
						$('#checkoa').css('display', 'block');
					} else {
						$('#checkoa').css('display', 'none');
					}
					popup.hide();
				}, 1500);
			} else if (json.status == 0) {
				showErrorPopup('提示', '保存失败');
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

/* 请假自动主管读取 */
function checkLeaveManager() {
	var leaveday = 0;
	/*var qingjia = $('input:radio[name="qingjia"]:checked').val();
	if(qingjia == 0) {
		leaveday = $("#leaveaddall").val();
	} else if(qingjia == 1) {
		leaveday = Math.ceil((parseFloat($("#leaveaddall").val()) / 24).toFixed(4));
	}*/
	var qingjia = $('input:checkbox[name="qingjia"]:checked').length;
	if (qingjia == 1) {
		leaveday = $("#leaveaddall").val();
	} else {
		leaveday = Math.ceil((parseFloat($("#leaveaddall").val()) / 24).toFixed(4));
	}
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/appLeave/getManagerOne.do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			day: leaveday,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 1) {
				$('#leaveaddsid').val(json.upManager.userName);
				checkmanpid = json.upManager.userId;
			} else if (json.status == -1) {
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else {
				$('#leaveaddsid').val('');
				checkmanpid = '';
			}
		},
		Error: function() {
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}