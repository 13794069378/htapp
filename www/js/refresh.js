/* 自定义弹框 */
/**
 * msg: 提示的信息
 * duration: 提示显示的时间(ms)
 **/
function Toast(msg, duration) {
	duration = isNaN(duration) ? 3000 : duration;
	var m = document.createElement('div');
	m.innerHTML = msg;
	m.style.cssText = "margin-left:0px; margin-right:0px; width:100%; opacity:0.7; height:20px; color:#fff; line-height:20px; text-align:center; border-radius:5px; position:fixed; bottom: 8%; z-index:999999; font-weight:bold; filter: alpha(opacity=80); background: black; ";
	document.body.appendChild(m);
	setTimeout(function() {
		var d = 0.5;
		m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
		m.style.opacity = '0';
		setTimeout(function() {
			document.body.removeChild(m)
		}, d * 1000);
	}, duration);
}

/**
 *  Refresh Data
 *  @Author Jianyong Shao
 *  @Date 2014-08-30
 */

/* 请假审批上下拉更新 */
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var leavecheckscroller = '';

function updateLeaveCheck(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	leavecheckscroller = $("#" + a + "box").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	leavecheckscroller.addInfinite();
	/* 下拉更新 */
	leavecheckscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(leavecheckscroller, "refresh-release", function() {
		//console.log("refresh-release");
		var that = this;
		clearTimeout(hideClose);
		hideClose = setTimeout(function() {
			//console.log("hiding manually refresh");
			//$("#infinite").remove();
			var ajaxdata = $.ajax({
				url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
				dataType: 'jsonp',
				type: 'GET',
				timeout: 10000, //超时时间设置，单位毫秒
				data: {
					id: $("#" + a).attr('first'),
					userName: leavecheckinfo1,
					censorState: leavecheckinfo2,
					num: 10,
					mark: 1,
					userId: getSession('uid')
				},
				success: function(json) {
					if (json.status == 0) {
						Toast('没有更多了', 1500);
					} else if (json.status == 1) {
						var content = '';
						$("#" + a).attr('first', json.list[0].rownum);
						for (var i = 0; i < json.list.length; i++) {
							content += "<li><a href='#leaveok' data-transition='up' onclick='leavecheckstatus=\"" + json.list[i].censorStateId + "\";setSession(\"spid\", " + json.list[i].id + ")'><div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div><div style='float: left; width: 90%;'><p><font>" + json.list[i].create_date + "</font><font>" + json.list[i].userName + "</font></p><p><font>" + json.list[i].leaveName + "</font><font>审批状态:</font><font>" + json.list[i].censor_state + "</font></p></div><div style='clear: both;'></div></a></li>";
						}
						$("#" + tarP).prepend(content);
					} else if (json.status == -1) {
						showMessage('账号已失效');
						window.setTimeout(function() {
							popup.hide();
							$.ui.loadContent("#main", true, true, "up");
						}, 1500);
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

	$.bind(leavecheckscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	leavecheckscroller.enable();
	var isLoading = false;
	$.bind(leavecheckscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(leavecheckscroller, "infinite-scroll-end", function() {
			$.unbind(leavecheckscroller, "infinite-scroll-end");
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
					type: 'GET',
					timeout: 10000, //超时时间设置，单位毫秒
					data: {
						id: $("#" + a).attr('last'),
						userName: leavecheckinfo1,
						censorState: leavecheckinfo2,
						num: 10,
						mark: 0,
						userId: getSession('uid')
					},
					success: function(json) {
						if (json.status == 0) {
							Toast('没有更多了', 1500);
						} else if (json.status == 1) {
							var content = '';
							$("#" + a).attr('last', json.list[json.list.length - 1].rownum);
							for (var i = 0; i < json.list.length; i++) {
								content += "<li><a href='#leaveok' data-transition='up' onclick='leavecheckstatus=\"" + json.list[i].censorStateId + "\";setSession(\"spid\", " + json.list[i].id + ")'><div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div><div style='float: left; width: 90%;'><p><font>" + json.list[i].create_date + "</font><font>" + json.list[i].userName + "</font></p><p><font>" + json.list[i].leaveName + "</font><font>审批状态:</font><font>" + json.list[i].censor_state + "</font></p></div><div style='clear: both;'></div></a></li>";
							}
							$("#" + tarP).append(content);
						} else if (json.status == -1) {
							showMessage('账号已失效');
							/* 1秒后隐藏提示 */
							window.setTimeout(function() {
								popup.hide();
								$.ui.loadContent("#main", true, true, "up");
							}, 1500);
						}
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
					},
					Error: function() {
						isLoading = false;
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						alert('Error');
					},
					complete: function(response) {
						if (response.status == 200) {} else {
							ajaxdata.abort();
							isLoading = false;
							$(self.el).find("#infinite").remove();
							self.clearInfinite();
							showErrorPopup('提示', '服务器连接失败!');
						}
					}
				});
				//self.scrollToBottom();
				/*}, 1000);*/
			} else {
				return;
			}
		});
	});
}

/* 请假历史记录上下拉更新 */
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var leavescroller = '';

function updateLeave(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	leavescroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	leavescroller.addInfinite();
	/* 下拉更新 */
	leavescroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(leavescroller, "refresh-release", function() {
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
					stTime: leaveinfo1,
					edTime: leaveinfo2,
					num: 10,
					mark: 1,
					userId: getSession('uid')
				},
				success: function(json) {
					if (json.status == 0) {
						Toast('没有更多了', 1500);
					} else if (json.status == 1) {
						var content = '';
						$("#" + tarP).attr('first', json.list[0].rownum);
						for (var i = 0; i < json.list.length; i++) {
							/*content += "<li><a href='#leaveadd' data-transition='up' onclick='leavetypere=true;leaveid=\"" + json.list[i].id + "\";leavestatus=\"" + json.list[i].censor_state + "\"'><div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div><div style='float: left; width: 90%;'><p><font>" + json.list[i].create_date + "</font><font>" + json.list[i].name + "</font></p><p><font>审批状态:</font><font>" + json.list[i].censor_state + "</font></p></div><div style='clear: both;'></div></a></li>";*/
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
						$("#" + tarP + "_ul").prepend(content);
					} else if (json.status == -1) {
						showMessage('账号已失效');
						/* 1秒后隐藏提示 */
						window.setTimeout(function() {
							popup.hide();
							$.ui.loadContent("#main", true, true, "up");
						}, 1500);
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

	$.bind(leavescroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	leavescroller.enable();
	var isLoading = false;
	$.bind(leavescroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(leavescroller, "infinite-scroll-end", function() {
			$.unbind(leavescroller, "infinite-scroll-end");
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
						stTime: leaveinfo1,
						edTime: leaveinfo2,
						num: 10,
						mark: 0,
						userId: getSession('uid')
					},
					success: function(json) {
						if (json.status == 0) {
							Toast('没有更多了', 1500);
						} else if (json.status == 1) {
							var content = '';
							$("#" + tarP).attr('last', json.list[json.list.length - 1].rownum);
							for (var i = 0; i < json.list.length; i++) {
								/*content += "<li><a href='#leaveadd' data-transition='up' onclick='leavetypere=true;leaveid=\"" + json.list[i].id + "\";leavestatus=\"" + json.list[i].censor_state + "\"'><div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div><div style='float: left; width: 90%;'><p><font>" + json.list[i].create_date + "</font><font>" + json.list[i].name + "</font></p><p><font>审批状态:</font><font>" + json.list[i].censor_state + "</font></p></div><div style='clear: both;'></div></a></li>";*/
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
							$("#" + tarP + "_ul").append(content);
						} else if (json.status == -1) {
							showMessage('账号已失效');
							/* 1秒后隐藏提示 */
							window.setTimeout(function() {
								popup.hide();
								$.ui.loadContent("#main", true, true, "up");
							}, 1500);
						}
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
					},
					Error: function() {
						isLoading = false;
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						alert('Error');
					},
					complete: function(response) {
						if (response.status == 200) {} else {
							ajaxdata.abort();
							isLoading = false;
							$(self.el).find("#infinite").remove();
							self.clearInfinite();
							showErrorPopup('提示', '服务器连接失败!');
						}
					}
				});
				//self.scrollToBottom();
				/*}, 1000);*/
			} else {
				return;
			}
		});
	});
}


var uniqueCode = '';
var isapprove = '';
/* 销售日志列表读取 kwb*/
var sellinfo1 = '';
var sellinfo2 = '';

function loadSellList(a, name) {
	var tarP = "page_" + a;
	sellinfo1 = $('#sellsearchbegin').val();
	sellinfo2 = $('#sellsearchend').val();
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
			stTime: sellinfo1,
			edTime: sellinfo2,
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
				$('#' + tarP + '_button').show();
				$('#' + tarP + '_none').show();
			} else if (json.status == 1) {
				$('#' + tarP + '_ul').html('', true);
				$('#' + tarP).attr('first', json.list[0].rownum);
				$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {

					var temp = "";
					var na = '';
					var cz = '';
					if (json.list[i].TraFeeBase == null) {
						temp = "";
					} else {
						temp = json.list[i].TraFeeBase;
					}
					if (json.list[i].name == null) {
						na = '';
					} else {
						na = json.list[i].name;
					}
					if (json.list[i].cZwmc == null) {
						cz = '';
					} else {
						cz = json.list[i].cZwmc;
					}

					/*content = content + "<li><a href='#sellnote' onclick='sellnotetype=true;isapprove=\"" + json.list[i].isapprove + "\";uniqueCode=\"" + json.list[i].uniqueCode + "\";setId(" + json.list[i].pk + ")'>";

					content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>日期:</font><font>" + json.list[i].createDate + " 建档记录</font></p>";
					content = content + "<p><font>姓名:</font><font>" + na + "</font></p>";
					content = content + "<p><font>职位:</font><font>" + cz + "</font></p>";
					content = content + "<p><font>截止上月大区内排名:</font><font>" + temp + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></a></li>";*/
					var hrefinfo = '';
					var delinfo = '';
					if (delshow) {
						hrefinfo = '';
						delinfo = '';
					} else {
						hrefinfo = 'sellnote';
						delinfo = 'hidden';
					}
					content += "<li id='" + json.list[i].pk + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='sellnotetype=true;isapprove=\"" + json.list[i].isapprove + "\";uniqueCode=\"" + json.list[i].uniqueCode + "\";setId(" + json.list[i].pk + ");'><table class='tablemess'><tr><td rowspan='4' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>日期:</font><font>" + json.list[i].createDate + " 建档记录</font></td><td class='deltest' rowspan='4' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].pk + "\", \"appSaleLog/delSaleLog\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + temp + "</font></td></tr></table></a></li>";
				}
				$('#' + tarP + '_ul').append(content);
				sellscroller.scrollToTop();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_button').show();
				$('#' + tarP).show();
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

/* 销售日志上下拉更新 kwb*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var sellscroller = '';

function updateSellList(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	sellscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	sellscroller.addInfinite();
	/* 下拉更新 */
	sellscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(sellscroller, "refresh-release", function() {
		//console.log("refresh-release");
		var that = this;
		clearTimeout(hideClose);
		hideClose = setTimeout(function() {
			var ajaxdata = $.ajax({
				url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
				dataType: 'jsonp',
				type: 'post',
				timeout: 10000, //超时时间设置，单位毫秒
				data: {
					id: $("#" + tarP).attr('first'),
					stTime: sellinfo1,
					edTime: sellinfo2,
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
							var temp = "";
							var na = '';
							var cz = '';
							if (json.list[i].TraFeeBase == null) {
								temp = "";
							} else {
								temp = json.list[i].TraFeeBase;
							}
							if (json.list[i].name == null) {
								na = '';
							} else {
								na = json.list[i].name;
							}
							if (json.list[i].cZwmc == null) {
								cz = '';
							} else {
								cz = json.list[i].cZwmc;
							}
							/*content = content + "<li><a href='#sellnote' onclick='sellnotetype=true;isapprove=\"" + json.list[i].isapprove + "\";uniqueCode=\"" + json.list[i].uniqueCode + "\";setId(" + json.list[i].pk + ")'>";
							content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>日期:</font><font>" + json.list[i].createDate + " 建档记录</font></p>";
							content = content + "<p><font>姓名:</font><font>" + na + "</font></p>";
							content = content + "<p><font>职位:</font><font>" + cz + "</font></p>";
							content = content + "<p><font>截止上月大区内排名:</font><font>" + temp + "</font></p></div>";
							content = content + "<div style='clear: both;'></div></a></li>";*/
							var hrefinfo = '';
							var delinfo = '';
							if (delshow) {
								hrefinfo = '';
								delinfo = '';
							} else {
								hrefinfo = 'sellnote';
								delinfo = 'hidden';
							}
							content += "<li id='" + json.list[i].pk + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='sellnotetype=true;isapprove=\"" + json.list[i].isapprove + "\";uniqueCode=\"" + json.list[i].uniqueCode + "\";setId(" + json.list[i].pk + ");'><table class='tablemess'><tr><td rowspan='4' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>日期:</font><font>" + json.list[i].createDate + " 建档记录</font></td><td class='deltest' rowspan='4' style='width: 10%; padding-left: 5px; padding-right: 0px; ' onclick='showPopup7(\"" + json.list[i].pk + "\", \"appSaleLog/delSaleLog\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + temp + "</font></td></tr></table></a></li>";
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

	$.bind(sellscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	sellscroller.enable();
	var isLoading = false;
	$.bind(sellscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(sellscroller, "infinite-scroll-end", function() {
			$.unbind(sellscroller, "infinite-scroll-end");
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
						stTime: sellinfo1,
						edTime: sellinfo2,
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
								var temp = "";
								var na = '';
								var cz = '';
								if (json.list[i].TraFeeBase == null) {
									temp = "";
								} else {
									temp = json.list[i].TraFeeBase;
								}

								if (json.list[i].name == null) {
									na = '';
								} else {
									na = json.list[i].name;
								}
								if (json.list[i].cZwmc == null) {
									cz = '';
								} else {
									cz = json.list[i].cZwmc;
								}
								/*content = content + "<li><a href='#sellnote' onclick='sellnotetype=true;isapprove=\"" + json.list[i].isapprove + "\";uniqueCode=\"" + json.list[i].uniqueCode + "\";setId(" + json.list[i].pk + ")'>";
								content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>日期:</font><font>" + json.list[i].createDate + " 建档记录</font></p>";
								content = content + "<p><font>姓名:</font><font>" + na + "</font></p>";
								content = content + "<p><font>职位:</font><font>" + cz + "</font></p>";
								content = content + "<p><font>截止上月大区内排名:</font><font>" + temp + "</font></p></div>";
								content = content + "<div style='clear: both;'></div></a></li>";*/
								var hrefinfo = '';
								var delinfo = '';
								if (delshow) {
									hrefinfo = '';
									delinfo = '';
								} else {
									hrefinfo = 'sellnote';
									delinfo = 'hidden';
								}
								content += "<li id='" + json.list[i].pk + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='sellnotetype=true;isapprove=\"" + json.list[i].isapprove + "\";uniqueCode=\"" + json.list[i].uniqueCode + "\";setId(" + json.list[i].pk + ");'><table class='tablemess'><tr><td rowspan='4' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>日期:</font><font>" + json.list[i].createDate + " 建档记录</font></td><td class='deltest' rowspan='4' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].pk + "\", \"appSaleLog/delSaleLog\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + temp + "</font></td></tr></table></a></li>";
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

/*销售日志审批列表 zqf*/
var sellcheckinfo1 = '';
var sellcheckinfo2 = '';
var sellckeckinfo3 = '';

function loadSellCheckList(a, name) {
	var tarP = "page_" + a;
	sellcheckinfo1 = $('#sellchecksearchbegin').val();
	sellcheckinfo2 = $('#sellchecksearchend').val();
	sellckeckinfo3 = $('#sellcheckpeople').val();
	$('#' + tarP + '_button').hide();
	$('#' + tarP).hide();
	$('#' + tarP + '_none').hide();
	$('#' + tarP + '_loading').show();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			stTime: sellcheckinfo1,
			edTime: sellcheckinfo2,
			fifter: sellckeckinfo3,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				$('#' + tarP + '_loading').hide();
				$('#' + tarP).hide();
				$('#' + tarP + '_button').show();
				$('#' + tarP + '_none').show();
			} else if (json.status == 1) {
				$('#' + tarP + '_ul').html('', true);
				$('#' + tarP).attr('first', json.list[0].rownum);
				$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					var trabee = '';
					var na = '';
					var cz = '';
					if (json.list[i].TraFeeBase == null) {
						trabee = '';
					} else {
						trabee = json.list[i].TraFeeBase;
					}
					if (json.list[i].name == null) {
						na = '';
					} else {
						na = json.list[i].name;
					}
					if (json.list[i].cZwmc == null) {
						cz = '';
					} else {
						cz = json.list[i].cZwmc;
					}
					/*content = content + "<li><a href='#sellok' onclick='setId(" + json.list[i].pk + ")'>";
					content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>日期:</font><font>" + json.list[i].createDate + "</font></p>";
					content = content + "<p><font>姓名:</font><font>" + na + "</font></p>";
					content = content + "<p><font>职位:</font><font>" + cz + "</font></p>";
					content = content + "<p><font>截止上月大区内排名:</font><font>" + trabee + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></a></li>";*/
					var slcheckinfo = '';
					var allckeckinfo = '';
					var sellcheckimg = '';
					if (allckeck) {
						allckeckinfo = '';
						slcheckinfo = 'hidden';
					} else {
						slcheckinfo = '';
						allckeckinfo = 'hidden';
					}
					if (json.list[i].isapprove != 1) {
						sellcheckimg = 'messageicon';
					} else {
						sellcheckimg = 'ok';
					}
					content += "<li id='scfalse" + json.list[i].pk + "' class='slcheck' " + slcheckinfo + "><a href='#sellok' data-transition='up' onclick='setId(" + json.list[i].pk + ")'><table class='tablemess'><tr><td rowspan='4' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/" + sellcheckimg + ".png' style='width: 100%;'/></td><td style='width: 80%;'><font>日期:</font><font>" + json.list[i].createDate + "</font></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + trabee + "</font></td></tr></table></a></li>";
					if (json.list[i].isapprove != 1) {
						content += "<li id='sctrue" + json.list[i].pk + "' class='alcheck' " + allckeckinfo + "><table class='tablemess' style='width: 100%;'><tr><td rowspan='4' style='width: 30px; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td><font>日期:</font><font>" + json.list[i].createDate + "</font></td><td class='deltest' rowspan='4' style='width: 30px; padding-left: 10px; padding-right: 0px;'><input id='sc" + json.list[i].pk + "' name='sellokcheckbox' value='" + json.list[i].pk + "' type='checkbox'><label class='bbb' for='sc" + json.list[i].pk + "' style='height: 100%;width: 100%;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><div style='clear: both;'></div></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + trabee + "</font></td></tr></table></li>";
					}
				}
				$('#' + tarP + '_ul').append(content);
				sellcheckscroller.scrollToTop();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				$('#' + tarP + '_button').show();
				$('#' + tarP).show();
			}
		},
		Error: function() {
			$('#' + tarP).hide();
			$('#' + tarP + '_none').hide();
			$('#' + tarP + '_loading').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 销售日志审批列表上下拉更新 zqf*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var sellcheckscroller = '';

function updatSellCheckList(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	sellcheckscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	sellcheckscroller.addInfinite();
	/* 下拉更新 */
	sellcheckscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(sellcheckscroller, "refresh-release", function() {
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
					stTime: sellcheckinfo1,
					edTime: sellcheckinfo2,
					fifter: sellckeckinfo3,
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
							var trabee = '';
							var na = '';
							var cz = '';
							if (json.list[i].TraFeeBase == null) {
								trabee = '';
							} else {
								trabee = json.list[i].TraFeeBase;
							}
							if (json.list[i].name == null) {
								na = '';
							} else {
								na = json.list[i].name;
							}
							if (json.list[i].cZwmc == null) {
								cz = '';
							} else {
								cz = json.list[i].cZwmc;
							}
							/*content = content + "<li><a href='#sellok' onclick='setId(" + json.list[i].pk + ")'>";
							content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>日期:</font><font>" + json.list[i].createDate + "</font></p>";
							content = content + "<p><font>姓名:</font><font>" + na + "</font></p>";
							content = content + "<p><font>职位:</font><font>" + cz + "</font></p>";
							content = content + "<p><font>截止上月大区内排名:</font><font>" + trabee + "</font>    </p></div>";
							content = content + "<div style='clear: both;'></div></a></li>";*/
							var slcheckinfo = '';
							var allckeckinfo = '';
							var sellcheckimg = '';
							if (allckeck) {
								allckeckinfo = '';
								slcheckinfo = 'hidden';
							} else {
								slcheckinfo = '';
								allckeckinfo = 'hidden';
							}
							if (json.list[i].isapprove != 1) {
								sellcheckimg = 'messageicon';
							} else {
								sellcheckimg = 'ok';
							}
							content += "<li id='scfalse" + json.list[i].pk + "' class='slcheck' " + slcheckinfo + "><a href='#sellok' data-transition='up' onclick='setId(" + json.list[i].pk + ")'><table class='tablemess'><tr><td rowspan='4' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/" + sellcheckimg + ".png' style='width: 100%;'/></td><td style='width: 80%;'><font>日期:</font><font>" + json.list[i].createDate + "</font></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + trabee + "</font></td></tr></table></a></li>";
							if (json.list[i].isapprove != 1) {
								content += "<li id='sctrue" + json.list[i].pk + "' class='alcheck' " + allckeckinfo + "><table class='tablemess' style='width: 100%;'><tr><td rowspan='4' style='width: 30px; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td><font>日期:</font><font>" + json.list[i].createDate + "</font></td><td class='deltest' rowspan='4' style='width: 30px; padding-left: 10px; padding-right: 0px;'><input id='sc" + json.list[i].pk + "' name='sellokcheckbox' value='" + json.list[i].pk + "' type='checkbox'><label class='bbb' for='sc" + json.list[i].pk + "' style='height: 100%;width: 100%;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><div style='clear: both;'></div></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + trabee + "</font></td></tr></table></li>";
							}
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

	$.bind(sellcheckscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	sellcheckscroller.enable();
	var isLoading = false;
	$.bind(sellcheckscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(sellcheckscroller, "infinite-scroll-end", function() {
			$.unbind(sellcheckscroller, "infinite-scroll-end");
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
						stTime: sellcheckinfo1,
						edTime: sellcheckinfo2,
						fifter: sellckeckinfo3,
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
								var trabee = '';
								var na = '';
								var cz = '';
								if (json.list[i].TraFeeBase == null) {
									trabee = '';
								} else {
									trabee = json.list[i].TraFeeBase;
								}
								if (json.list[i].name == null) {
									na = '';
								} else {
									na = json.list[i].name;
								}
								if (json.list[i].cZwmc == null) {
									cz = '';
								} else {
									cz = json.list[i].cZwmc;
								}
								/*content = content + "<li><a href='#sellok' onclick='setId(" + json.list[i].pk + ")'>";
								content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>日期:</font><font>" + json.list[i].createDate + "</font></p>";
								content = content + "<p><font>姓名:</font><font>" + na + "</font></p>";
								content = content + "<p><font>职位:</font><font>" + cz + "</font></p>";
								content = content + "<p><font>截止上月大区内排名:</font><font>" + trabee + "</font></p></div>";
								content = content + "<div style='clear: both;'></div></a></li>";*/
								var slcheckinfo = '';
								var allckeckinfo = '';
								var sellcheckimg = '';
								if (allckeck) {
									allckeckinfo = '';
									slcheckinfo = 'hidden';
								} else {
									slcheckinfo = '';
									allckeckinfo = 'hidden';
								}
								if (json.list[i].isapprove != 1) {
									sellcheckimg = 'messageicon';
								} else {
									sellcheckimg = 'ok';
								}
								content += "<li id='scfalse" + json.list[i].pk + "' class='slcheck' " + slcheckinfo + "><a href='#sellok' data-transition='up' onclick='setId(" + json.list[i].pk + ")'><table class='tablemess'><tr><td rowspan='4' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/" + sellcheckimg + ".png' style='width: 100%;'/></td><td style='width: 80%;'><font>日期:</font><font>" + json.list[i].createDate + "</font></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + trabee + "</font></td></tr></table></a></li>";
								if (json.list[i].isapprove != 1) {
									content += "<li id='sctrue" + json.list[i].pk + "' class='alcheck' " + allckeckinfo + "><table class='tablemess' style='width: 100%;'><tr><td rowspan='4' style='width: 30px; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td><font>日期:</font><font>" + json.list[i].createDate + "</font></td><td class='deltest' rowspan='4' style='width: 30px; padding-left: 10px; padding-right: 0px;'><input id='sc" + json.list[i].pk + "' name='sellokcheckbox' value='" + json.list[i].pk + "' type='checkbox'><label class='bbb' for='sc" + json.list[i].pk + "' style='height: 100%;width: 100%;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><div style='clear: both;'></div></td></tr><tr><td><font>姓名:</font><font>" + na + "</font></td></tr><tr><td><font>职位:</font><font>" + cz + "</font></td></tr><tr><td><font>截止上月大区内排名:</font><font>" + trabee + "</font></td></tr></table></li>";
								}
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
				/* }, 1000);*/
			}
		});
	});
}

/* 考勤记录历史列表读取 kwb*/
var worknoteinfo1 = '';
var worknoteinfo2 = '';

function loadWorkNoteList(a, name) {
	var tarP = "page_" + a;
	worknoteinfo1 = $('#worknotesearchbegin').val();
	worknoteinfo2 = $('#worknotesearchend').val();
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
			stTime: worknoteinfo1,
			edTime: worknoteinfo2,
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
					var temp = "";
					if (json.list[i].attenceType == "0") {
						temp = "上班";
					} else if (json.list[i].attenceType == "1") {
						temp = "下班";
					}
					var temp1 = "";
					if (json.list[i].attenceReslut == "0") {
						temp1 = "否";
					} else if (json.list[i].attenceReslut == "1") {
						temp1 = "是";
					}
					content = content + "<li><a href='#workLogin' data-transition='up' onclick='setId(" + json.list[i].id + ")'>";
					content = content + "<div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>" + json.list[i].attenceTime + "&nbsp;&nbsp;" + temp + "考勤</font></p>";
					content = content + "<p><font>经度:" + json.list[i].attenceY + "</font><br><font>纬度:" + json.list[i].attenceX + "</font></p>";
					content = content + "<p><font>地址:</font><font>" + json.list[i].attenceAddress + "</font></p>";
					content = content + "<p><font>考勤地点是否匹配:</font><font>" + temp1 + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></li>";
				}
				$('#' + tarP + '_ul').append(content);
				worknotescroller.scrollToTop();
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

/* 考勤记录历史记录上下拉更新 kwb*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var worknotescroller = '';

function updateWorkNoteList(a, name) {
	/* 上下拉更新 */

	var tarP = "page_" + a;
	/* 开启页面滚动 */
	worknotescroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	worknotescroller.addInfinite();
	/* 下拉更新 */
	worknotescroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(worknotescroller, "refresh-release", function() {
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
					stTime: worknoteinfo1,
					edTime: worknoteinfo2,
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
							var temp = "";
							if (json.list[i].attenceType == "0") {
								temp = "上班";
							} else if (json.list[i].attenceType == "1") {
								temp = "下班";
							}
							var temp1 = "";
							if (json.list[i].attenceReslut == "0") {
								temp1 = "否";
							} else if (json.list[i].attenceReslut == "1") {
								temp1 = "是";
							}
							content = content + "<li><a href='#workLogin' data-transition='up' onclick='setId(" + json.list[i].id + ")'>";
							content = content + "<div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>" + json.list[i].attenceTime + "&nbsp;&nbsp;" + temp + "考勤</font></p>";
							content = content + "<p><font>经度:" + json.list[i].attenceY + "</font><br><font>纬度:" + json.list[i].attenceX + "</font></p>";
							content = content + "<p><font>地址:</font><font>" + json.list[i].attenceAddress + "</font></p>";
							content = content + "<p><font>考勤地点是否匹配:</font><font>" + temp1 + "</font></p></div>";
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

	$.bind(worknotescroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	worknotescroller.enable();
	var isLoading = false;
	$.bind(worknotescroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(worknotescroller, "infinite-scroll-end", function() {
			$.unbind(worknotescroller, "infinite-scroll-end");
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
						stTime: worknoteinfo1,
						edTime: worknoteinfo2,
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
								var temp = "";
								if (json.list[i].attenceType == "0") {
									temp = "上班";
								} else if (json.list[i].attenceType == "1") {
									temp = "下班";
								}
								var temp1 = "";
								if (json.list[i].attenceReslut == "0") {
									temp1 = "否";
								} else if (json.list[i].attenceReslut == "1") {
									temp1 = "是";
								}
								content = content + "<li><a href='#workLogin' data-transition='up' onclick='setId(" + json.list[i].id + ")'>";
								content = content + "<div style='float:left; width: 10%;'><img src='images/manicon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>" + json.list[i].attenceTime + "&nbsp;&nbsp;" + temp + "考勤</font></p>";
								content = content + "<p><font>经度:" + json.list[i].attenceY + "</font><br><font>纬度:" + json.list[i].attenceX + "</font></p>";
								content = content + "<p><font>地址:</font><font>" + json.list[i].attenceAddress + "</font></p>";
								content = content + "<p><font>考勤地点是否匹配:</font><font>" + temp1 + "</font></p></div>";
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

/* 考勤目标历史列表读取 kwb*/
function loadWorkplaceList(a, name) {
	var tarP = "page_" + a;
	$('#' + tarP).hide();
	$('#' + tarP + '_none').hide();
	$('#' + tarP + '_button').hide();
	$('#workplacecheckfont').hide();
	$('#workplacecheckok').hide();
	$('#workplacecheckcancel').hide();
	$('#' + tarP + '_loading').show();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
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
				var count = json.count;
				$('#workplacecheckfont').show();
				if (parseInt(count) > 0) {
					$('#workplacedjbutton').hide();
					$('#workPlaceCollectbutton').hide();
					$('#workplacecheckok').hide();
					$('#workplacecheckcancel').show();
				} else {
					$('#workplacecheckcancel').hide();
					$('#workplacedjbutton').show();
					$('#workPlaceCollectbutton').show();
					$('#workplacecheckok').show();
				}
				$('#' + tarP + '_ul').html('', true);
				$('#' + tarP).attr('first', json.list[0].rownum);
				$('#' + tarP).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					/*content = content + "<li><a href='#workPlaceCollect' onclick='setId(" + json.list[i].id + ")'>";
					content = content + "<div style='float:left; width: 10%;'><img src='images/seticon.png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>经度:</font><font>" + json.list[i].targetY + "</font></p>";
					content = content + "<p><font>纬度:</font><font>" + json.list[i].targetX + "</font></p>";
					content = content + "<p><font>地址:</font><font>" + json.list[i].targetAddress + "</font></p>";
					content = content + "<p><font>名称:</font><font>" + json.list[i].targetName + "</font></p>";
					content = content + "<p><font>姓名:</font><font>" + json.list[i].userName + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></a></li>";*/
					var hrefinfo = '';
					var delinfo = '';
					if (delshow) {
						hrefinfo = '';
						delinfo = '';
					} else {
						hrefinfo = 'workPlaceCollect';
						delinfo = 'hidden';
					}
					content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='5' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/seticon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>经度:</font><font>" + json.list[i].targetY + "</font></td><td class='deltest' rowspan='5' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appAttence/delAttencTarget\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>纬度:</font><font>" + json.list[i].targetX + "</font></td></tr><tr><td><font>地址:</font><font>" + json.list[i].targetAddress + "</font></td></tr><tr><td><font>名称:</font><font>" + json.list[i].targetName + "</font></td></tr><tr><td><font>姓名:</font><font>" + json.list[i].userName + "</font></td></tr></table></a></li>";
				}
				$('#' + tarP + '_ul').append(content);
				workplacescroller.scrollToTop();
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

/* 考勤目标历史记录上下拉更新 kwb*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/

var workplacescroller = '';

function updateWorkplaceList(a, name) {
	/* 上下拉更新 */

	var tarP = "page_" + a;
	/* 开启页面滚动 */
	workplacescroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	workplacescroller.addInfinite();
	/* 下拉更新 */
	workplacescroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(workplacescroller, "refresh-release", function() {
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
							/*content = content + "<li><a href='#workPlaceCollect' onclick='setId(" + json.list[i].id + ")'>";
							content = content + "<div style='float:left; width: 10%;'><img src='images/seticon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>经度:</font><font>" + json.list[i].targetY + "</font></p>";
							content = content + "<p><font>纬度:</font><font>" + json.list[i].targetX + "</font></p>";
							content = content + "<p><font>地址:</font><font>" + json.list[i].targetAddress + "</font></p>";
							content = content + "<p><font>名称:</font><font>" + json.list[i].targetName + "</font></p>";
							content = content + "<p><font>姓名:</font><font>" + json.list[i].userName + "</font></p></div>";
							content = content + "<div style='clear: both;'></div></li>";*/
							var hrefinfo = '';
							var delinfo = '';
							if (delshow) {
								hrefinfo = '';
								delinfo = '';
							} else {
								hrefinfo = 'workPlaceCollect';
								delinfo = 'hidden';
							}
							content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='5' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/seticon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>经度:</font><font>" + json.list[i].targetY + "</font></td><td class='deltest' rowspan='5' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appAttence/delAttencTarget\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>纬度:</font><font>" + json.list[i].targetX + "</font></td></tr><tr><td><font>地址:</font><font>" + json.list[i].targetAddress + "</font></td></tr><tr><td><font>名称:</font><font>" + json.list[i].targetName + "</font></td></tr><tr><td><font>姓名:</font><font>" + json.list[i].userName + "</font></td></tr></table></a></li>";
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

	$.bind(workplacescroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	workplacescroller.enable();
	var isLoading = false;
	$.bind(workplacescroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(workplacescroller, "infinite-scroll-end", function() {
			$.unbind(workplacescroller, "infinite-scroll-end");
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
								/*content = content + "<li><a href='#workPlaceCollect' onclick='setId(" + json.list[i].id + ")'>";
								content = content + "<div style='float:left; width: 10%;'><img src='images/seticon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>经度:</font><font>" + json.list[i].targetY + "</font></p>";
								content = content + "<p><font>纬度:</font><font>" + json.list[i].targetX + "</font></p>";
								content = content + "<p><font>地址:</font><font>" + json.list[i].targetAddress + "</font></p>";
								content = content + "<p><font>名称:</font><font>" + json.list[i].targetName + "</font></p>";
								content = content + "<p><font>姓名:</font><font>" + json.list[i].userName + "</font></p></div>";
								content = content + "<div style='clear: both;'></div></li>";*/
								var hrefinfo = '';
								var delinfo = '';
								if (delshow) {
									hrefinfo = '';
									delinfo = '';
								} else {
									hrefinfo = 'workPlaceCollect';
									delinfo = 'hidden';
								}
								content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='5' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/seticon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>经度:</font><font>" + json.list[i].targetY + "</font></td><td class='deltest' rowspan='5' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appAttence/delAttencTarget\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>纬度:</font><font>" + json.list[i].targetX + "</font></td></tr><tr><td><font>地址:</font><font>" + json.list[i].targetAddress + "</font></td></tr><tr><td><font>名称:</font><font>" + json.list[i].targetName + "</font></td></tr><tr><td><font>姓名:</font><font>" + json.list[i].userName + "</font></td></tr></table></a></li>";
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

/* U1U4建档列表读取 kwb*/
var buildfilehistoryinfo1 = "";
var buildfilehistoryinfo2 = "";

function loadBuildFileHistoryList(a, name) {
	buildfilehistoryinfo1 = $('#buildfilehistorypeople').val();
	buildfilehistoryinfo2 = $('#buildfilehistorystatus').attr('textid');
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
			keyWord: buildfilehistoryinfo1,
			type: buildfilehistoryinfo2,
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
					var temp = json.list[i].type;
					temp = temp.replace(/(^\s*)|(\s*$)/g, "");
					content = content + "<li><a href='#buildfile' data-transition='up' onclick=\"buildfiletrue=true;setId(" + json.list[i].id + ");styp('" + temp + "');\">";
					content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>" + json.list[i].modDate + " 建档记录</font></p>";
					content = content + "<p><font>类型:</font><font>" + json.list[i].type + "</font></p>";
					content = content + "<p><font>编号:</font><font>" + json.list[i].sNo + "</font></p>";
					content = content + "<p><font>名称:</font><font>" + json.list[i].sName + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></a></li>";
				}
				$('#' + tarP + '_ul').append(content);
				buildfilehistoryscroller.scrollToTop();
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
				$('#' + tarP + '_button').show();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* U1U4建档记录上下拉更新 kwb*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var buildfilehistoryscroller = '';

function updateBuildFileHistoryList(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	buildfilehistoryscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	buildfilehistoryscroller.addInfinite();
	/* 下拉更新 */
	buildfilehistoryscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(buildfilehistoryscroller, "refresh-release", function() {
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
					keyWord: buildfilehistoryinfo1,
					type: buildfilehistoryinfo2,
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
							var temp = json.list[i].type;
							temp = temp.replace(/(^\s*)|(\s*$)/g, "");
							content = content + "<li><a href='#buildfile' data-transition='up' onclick=\"buildfiletrue=true;setId(" + json.list[i].id + ");styp('" + temp + "');\">";
							content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>" + json.list[i].modDate + " 建档记录</font></p>";
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

	$.bind(buildfilehistoryscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	buildfilehistoryscroller.enable();
	var isLoading = false;
	$.bind(buildfilehistoryscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(buildfilehistoryscroller, "infinite-scroll-end", function() {
			$.unbind(buildfilehistoryscroller, "infinite-scroll-end");
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
						keyWord: buildfilehistoryinfo1,
						type: buildfilehistoryinfo2,
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
								var temp = json.list[i].type;
								temp = temp.replace(/(^\s*)|(\s*$)/g, "");
								content = content + "<li><a href='#buildfile' data-transition='up' onclick=\"buildfiletrue=true;setId(" + json.list[i].id + ");styp('" + temp + "');\">";
								content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>" + json.list[i].modDate + " 建档记录</font></p>";
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

/*拜访列表 kwb*/
var visitlistinfo1 = '';
var visitlistinfo2 = '';
var visitlistinfo3 = '';

function loadVisitList(a, name) {
	visitlistinfo1 = $('#visitnotesearchbegin').val();
	visitlistinfo2 = $('#visitnotesearchend').val();
	visitlistinfo3 = $('#visitnotepeople').val();
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
			stTime: visitlistinfo1,
			edTime: visitlistinfo2,
			keyWord: visitlistinfo3,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#' + tarP).hide();
				$('#' + tarP + '_button').hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_loading').hide();
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
					/*content = content + "<li><a href='#visitLogin' onclick='setId(" + json.list[i].id + ")'>";
					content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>终端编号:</font><font>" + json.list[i].visitId + "</font></p>";
					content = content + "<p><font>终端名称:</font><font>" + json.list[i].visitName + "</font></p>";
					content = content + "<p><font>类型:</font><font>" + json.list[i].visitType + "</font></p>";
					content = content + "<p><font>开始拜访时间:</font><font>" + json.list[i].startTime + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></a></li>";*/
					var hrefinfo = '';
					var delinfo = '';
					var type1 = '';
					if (delshow) {
						hrefinfo = '';
						delinfo = '';
					} else {
						hrefinfo = 'visitLogin';
						delinfo = 'hidden';
					}
					if (json.list[i].type1 == 1) {
						type1 = '联盟商';
					} else {
						type1 = '超市';
					}
					content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='visitLogintrue=true;setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='5' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>终端编号:</font><font>" + json.list[i].visitId + "</font></td><td class='deltest' rowspan='5' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appVisit/delVisit\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>终端名称:</font><font>" + json.list[i].visitName + "</font></td></tr><tr><td><font>大类型:</font><font>" + type1 + "</font></td></tr><tr><td><font>类型:</font><font>" + json.list[i].visitType + "</font></td></tr><tr><td><font>开始拜访时间:</font><font>" + json.list[i].startTime + "</font></td></tr></table></a></li>";
				}
				$('#' + tarP + '_ul').append(content);
				visitscroller.scrollToTop();
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

/* 拜访列表上下拉更新 kwb*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var visitscroller = '';

function updateVisitList(a, name) {
	/* 上下拉更新 */

	var tarP = "page_" + a;
	/* 开启页面滚动 */
	visitscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	visitscroller.addInfinite();
	/* 下拉更新 */
	visitscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(visitscroller, "refresh-release", function() {
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
					stTime: visitlistinfo1,
					edTime: visitlistinfo2,
					keyWord: visitlistinfo3,
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
							/*content = content + "<li><a href='#visitLogin' onclick='setId(" + json.list[i].id + ")'>";
							content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>终端编号:</font><font>" + json.list[i].visitId + "</font></p>";
							content = content + "<p><font>终端名称:</font><font>" + json.list[i].visitName + "</font></p>";
							content = content + "<p><font>类型:</font><font>" + json.list[i].visitType + "</font></p>";
							content = content + "<p><font>开始拜访时间:</font><font>" + json.list[i].startTime + "</font></p></div>";
							content = content + "<div style='clear: both;'></div></a></li>";*/
							var hrefinfo = '';
							var delinfo = '';
							var type1 = '';
							if (delshow) {
								hrefinfo = '';
								delinfo = '';
							} else {
								hrefinfo = 'visitLogin';
								delinfo = 'hidden';
							}
							if (json.list[i].type1 == 1) {
								type1 = '联盟商';
							} else {
								type1 = '超市';
							}
							content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='visitLogintrue=true;setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='5' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>终端编号:</font><font>" + json.list[i].visitId + "</font></td><td class='deltest' rowspan='5' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appVisit/delVisit\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>终端名称:</font><font>" + json.list[i].visitName + "</font></td></tr><tr><td><font>大类型:</font><font>" + type1 + "</font></td></tr><tr><td><font>类型:</font><font>" + json.list[i].visitType + "</font></td></tr><tr><td><font>开始拜访时间:</font><font>" + json.list[i].startTime + "</font></td></tr></table></a></li>";
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

	$.bind(visitscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	visitscroller.enable();
	var isLoading = false;
	$.bind(visitscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(visitscroller, "infinite-scroll-end", function() {
			$.unbind(visitscroller, "infinite-scroll-end");
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
						id: $("#" + tarP).attr('first'),
						stTime: visitlistinfo1,
						edTime: visitlistinfo2,
						keyWord: visitlistinfo3,
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
								/*content = content + "<li><a href='#visitLogin' onclick='setId(" + json.list[i].id + ")'>";
								content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>终端编号:</font><font>" + json.list[i].visitId + "</font></p>";
								content = content + "<p><font>终端名称:</font><font>" + json.list[i].visitName + "</font></p>";
								content = content + "<p><font>类型:</font><font>" + json.list[i].visitType + "</font></p>";
								content = content + "<p><font>开始拜访时间:</font><font>" + json.list[i].startTime + "</font></p></div>";
								content = content + "<div style='clear: both;'></div></a></li>";*/
								var hrefinfo = '';
								var delinfo = '';
								var type1 = '';
								if (delshow) {
									hrefinfo = '';
									delinfo = '';
								} else {
									hrefinfo = 'visitLogin';
									delinfo = 'hidden';
								}
								if (json.list[i].type1 == 1) {
									type1 = '联盟商';
								} else {
									type1 = '超市';
								}
								content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='visitLogintrue=true;setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='5' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>终端编号:</font><font>" + json.list[i].visitId + "</font></td><td class='deltest' rowspan='5' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appVisit/delVisit\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>终端名称:</font><font>" + json.list[i].visitName + "</font></td></tr><tr><td><font>大类型:</font><font>" + type1 + "</font></td></tr><tr><td><font>类型:</font><font>" + json.list[i].visitType + "</font></td></tr><tr><td><font>开始拜访时间:</font><font>" + json.list[i].startTime + "</font></td></tr></table></a></li>";
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

/*消息接收列表 kwb*/
var receiptinfoinfo1 = '';
var receiptinfoinfo2 = '';

function loadReceiptInfoList(a, name) {
	receiptinfoinfo1 = $('#receiptinfopeople').val();
	receiptinfoinfo2 = $('#receiptinfotitle').val();
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
			sendUser: receiptinfoinfo1,
			keyWord: receiptinfoinfo2,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				$('#' + tarP).hide();
				$('#' + tarP + '_none').hide();
				$('#' + tarP + '_button').hide();
				$('#' + tarP + '_loading').hide();
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
					var tempimg = '';
					if (json.list[i].is_read == 0) {
						tempimg = 'messageicon';
					} else {
						tempimg = 'ok';
					}
					content = content + "<li><a href='#createmessage' data-transition='up' onclick='messagefirst=true;setId(" + json.list[i].message_id + ");readMessage();'>";
					content = content + "<div style='float:left; width: 10%;'><img src='images/" + tempimg + ".png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>标题:</font><font>" + json.list[i].title + "</font></p>";
					content = content + "<p><font>发送人:</font><font>" + json.list[i].publishName + "</font></p>";
					content = content + "<p><font>发送时间:</font><font>" + json.list[i].publishTime + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></a></li>";
				}
				$('#' + tarP + '_ul').append(content);
				receiptinfoscroller.scrollToTop();
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

/* 消息接收列表上下拉更新 kwb*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var receiptinfoscroller = '';

function updateReceiptInfoList(a, name) {
	/* 上下拉更新 */

	var tarP = "page_" + a;
	/* 开启页面滚动 */
	receiptinfoscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	receiptinfoscroller.addInfinite();
	/* 下拉更新 */
	receiptinfoscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(receiptinfoscroller, "refresh-release", function() {
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
					sendUser: receiptinfoinfo1,
					keyWord: receiptinfoinfo2,
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
							var tempimg = '';
							if (json.list[i].is_read == 0) {
								tempimg = 'messageicon';
							} else {
								tempimg = 'ok';
							}
							content = content + "<li><a href='#createmessage' data-transition='up' onclick='messagefirst=true;setId(" + json.list[i].message_id + ");readMessage();'>";
							content = content + "<div style='float:left; width: 10%;'><img src='images/" + tempimg + ".png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>标题:</font><font>" + json.list[i].title + "</font></p>";
							content = content + "<p><font>发送人:</font><font>" + json.list[i].publishName + "</font></p>";
							content = content + "<p><font>发送时间:</font><font>" + json.list[i].publishTime + "</font></p></div>";
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

	$.bind(receiptinfoscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	receiptinfoscroller.enable();
	var isLoading = false;
	$.bind(receiptinfoscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(receiptinfoscroller, "infinite-scroll-end", function() {
			$.unbind(receiptinfoscroller, "infinite-scroll-end");
			//$(self.el).find("#infinite").remove();
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				/*setTimeout(function () { */
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
						sendUser: receiptinfoinfo1,
						keyWord: receiptinfoinfo2,
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
								var tempimg = '';
								if (json.list[i].is_read == 0) {
									tempimg = 'messageicon';
								} else {
									tempimg = 'ok';
								}
								content = content + "<li><a href='#createmessage' data-transition='up' onclick='messagefirst=true;setId(" + json.list[i].message_id + ");readMessage();'>";
								content = content + "<div style='float:left; width: 10%;'><img src='images/" + tempimg + ".png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>标题:</font><font>" + json.list[i].title + "</font></p>";
								content = content + "<p><font>发送人:</font><font>" + json.list[i].publishName + "</font></p>";
								content = content + "<p><font>发送时间:</font><font>" + json.list[i].publishTime + "</font></p></div>";
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
				/* }, 1000);*/
			}
		});
	});
}

/* 消息接收人上拉更新 kwb*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var messagepeoplescroller = '';

function updateMessagePeopleList(a, name) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	messagepeoplescroller = $("#" + tarP + "_box").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	messagepeoplescroller.addInfinite();

	/* 上拉更新 */
	messagepeoplescroller.enable();
	var isLoading = false;
	$.bind(messagepeoplescroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(messagepeoplescroller, "infinite-scroll-end", function() {
			$.unbind(messagepeoplescroller, "infinite-scroll-end");
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
						id: $("#messagepepele").attr("last"),
						keyWord: encodeURI(messagesendkeyword),
						selectMember: messagesendselect,
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
							$('#messagepepele').attr('last', json.memberList[json.memberList.length - 1].rownum);
							var temppage_xxjsr_tempul = $("#page_xxjsr_tempul").find("li");
							var content = '';
							for (var i = 0; i < json.memberList.length; i++) {
								var tempcheck = '';
								temppage_xxjsr_tempul.each(function() {
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

/* 消息读取标志 */
function readMessage() {
	$.jsonP({
		url: "http://" + ipaddress + "/" + serviceName + "/appMessage/readMessage.do?userId=" + getSession('uid') + "&pid=" + getSession('keyid') + "&callback=?",
		success: function(json) {
			if (json.status == -1) {
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				showErrorPopup('提示', '信息标注错误');
			} else if (json.status == 1) {
				var messagenum = parseInt($("#xx").find('.af-badge').html()) - 1;
				$("#xx").find('.af-badge').html(messagenum, true);
			}
		},
		Error: function() {
			alert('Error');
		}
	});
}

/*消息发送列表 kwb*/
var sendinfoinfo1 = "";
var sendinfoinfo2 = "";
var sendinfoinfo3 = "";

function loadSendInfoList(a, name) {
	sendinfoinfo1 = $('#sendinfosearchbegin').val();
	sendinfoinfo2 = $('#sendinfosearchend').val();
	sendinfoinfo3 = $('#sendinfotitle').val();
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
			stTime: sendinfoinfo1,
			edTime: sendinfoinfo2,
			keyWord: sendinfoinfo3,
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
					/*content = content + "<li><a href='#createmessage' onclick='setId(" + json.list[i].id + ")'>";
					content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
					content = content + "<div class='leavefont' style='width: 90%;'>";
					content = content + "<p><font>标题:</font><font>" + json.list[i].title + "</font></p>";
					content = content + "<p><font>发送人:</font><font>" + json.list[i].name + "</font></p>";
					content = content + "<p><font>发送时间:</font><font>" + json.list[i].publish_time + "</font></p></div>";
					content = content + "<div style='clear: both;'></div></a></li>";*/
					var hrefinfo = '';
					var delinfo = '';
					if (delshow) {
						hrefinfo = '';
						delinfo = '';
					} else {
						hrefinfo = 'createmessage';
						delinfo = 'hidden';
					}
					content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='messagefirst=true;setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='3' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>标题:</font><font>" + json.list[i].title + "</font></td><td class='deltest' rowspan='3' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appMessage/delMessage\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>发送人:</font><font>" + json.list[i].name + "</font></td></tr><tr><td><font>发送时间:</font><font>" + json.list[i].publish_time + "</font></td></tr></table></a></li>";
				}
				$('#' + tarP + '_ul').append(content);
				sendinfoscroller.scrollToTop();
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

/* 消息发送列表上下拉更新 kwb*/
/**
 * a: 页面编号
 * name: 刷新接口名称
 **/
var sendinfoscroller = '';

function updateSendInfoList(a, name) {
	/* 上下拉更新 */

	var tarP = "page_" + a;
	/* 开启页面滚动 */
	sendinfoscroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	sendinfoscroller.addInfinite();
	/* 下拉更新 */
	sendinfoscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(sendinfoscroller, "refresh-release", function() {
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
					stTime: sendinfoinfo1,
					edTime: sendinfoinfo2,
					keyWord: sendinfoinfo3,
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
							/*content = content + "<li><a href='#createmessage' onclick='setId(" + json.list[i].id + ")'>";
							content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
							content = content + "<div class='leavefont' style='width: 90%;'>";
							content = content + "<p><font>标题:</font><font>" + json.list[i].title + "</font></p>";
							content = content + "<p><font>发送人:</font><font>" + json.list[i].name + "</font></p>";
							content = content + "<p><font>发送时间:</font><font>" + json.list[i].publish_time + "</font></p></div>";
							content = content + "<div style='clear: both;'></div></a></li>";*/
							var hrefinfo = '';
							var delinfo = '';
							if (delshow) {
								hrefinfo = '';
								delinfo = '';
							} else {
								hrefinfo = 'createmessage';
								delinfo = 'hidden';
							}
							content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='messagefirst=true;setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='3' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>标题:</font><font>" + json.list[i].title + "</font></td><td class='deltest' rowspan='3' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appMessage/delMessage\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>发送人:</font><font>" + json.list[i].name + "</font></td></tr><tr><td><font>发送时间:</font><font>" + json.list[i].publish_time + "</font></td></tr></table></a></li>";
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

	$.bind(sendinfoscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	sendinfoscroller.enable();
	var isLoading = false;
	$.bind(sendinfoscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(sendinfoscroller, "infinite-scroll-end", function() {
			$.unbind(sendinfoscroller, "infinite-scroll-end");
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
						stTime: sendinfoinfo1,
						edTime: sendinfoinfo2,
						keyWord: sendinfoinfo3,
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
								/*content = content + "<li><a href='#createmessage' onclick='setId(" + json.list[i].id + ")'>";
								content = content + "<div style='float:left; width: 10%;'><img src='images/messageicon.png' style='width: 80%;'/></div>";
								content = content + "<div class='leavefont' style='width: 90%;'>";
								content = content + "<p><font>标题:</font><font>" + json.list[i].title + "</font></p>";
								content = content + "<p><font>发送人:</font><font>" + json.list[i].name + "</font></p>";
								content = content + "<p><font>发送时间:</font><font>" + json.list[i].publish_time + "</font></p></div>";
								content = content + "<div style='clear: both;'></div></a></li>";*/
								var hrefinfo = '';
								var delinfo = '';
								if (delshow) {
									hrefinfo = '';
									delinfo = '';
								} else {
									hrefinfo = 'createmessage';
									delinfo = 'hidden';
								}
								content += "<li id='" + json.list[i].id + "'><a href='#" + hrefinfo + "' data-transition='up' onclick='messagefirst=true;setId(" + json.list[i].id + ")'><table class='tablemess'><tr><td rowspan='3' style='width: 10%; padding-right: 5px; padding-left: 0px;'><img src='images/messageicon.png' style='width: 100%;'/></td><td style='width: 80%;'><font>标题:</font><font>" + json.list[i].title + "</font></td><td class='deltest' rowspan='3' style='width: 10%; padding-left: 5px; padding-right: 0px;' onclick='showPopup7(\"" + json.list[i].id + "\", \"appMessage/delMessage\");' " + delinfo + "><img src='images/del.jpg' style='width: 20px;' /></td></tr><tr><td><font>发送人:</font><font>" + json.list[i].name + "</font></td></tr><tr><td><font>发送时间:</font><font>" + json.list[i].publish_time + "</font></td></tr></table></a></li>";
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

/* 根据唯一码读取数据 */
function loadManData() {
	var test = $('input:radio[name="test"]:checked');
	var unicode = test.attr('id');
	var staff = test.attr('staff');
	var name = test.val();
	if (unicode != undefined) {
		showMessage('保存中');
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/appSaleLog/addUpMonthRate.do",
			dataType: 'jsonp',
			type: 'post',
			timeout: 10000, //超时时间设置，单位毫秒
			data: {
				uniqueCode: unicode,
				userId: getSession('uid')
			},
			success: function(json) {
				if (json.status == 'fail') {
					popup.hide();
					showErrorPopup('提示', json.msg);
				} else if (json.status == 'success') {
					$('#sellnotename').html(name, true);
					$('#sellnotecode').html(unicode, true);
					$('#sellnotezw').html(staff, true);
					$('#sellnotekh').html(json.yearTarget, true);
					$('#sellnotedc').html(json.consequence, true);
					$('#sellnotepm').html(json.monthRanking, true);
					popup.hide();
					$.ui.goBack();
				} else if (json.status == -1) {
					popup.hide();
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
					popup.hide();
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
	} else {
		showErrorPopup('提示', '请先选取正确信息!');
	}
}

/* 单选信息查询 */
function checkRadioMapInfo() {
	var info = $('#searchinfo').val();
	if (radiotype == 1) {
		//loadCheckManData('radiomap', 'appLeave/censorManager', info);
		loadCheckManData('radiomap', 'appLeave/getManager', info);
	} else if (radiotype == 2) {
		loadRadioMapData('radiomap', 'appSaleLog/employeeNameList', info);
	} else if (radiotype == 3) {
		loadBusynessData('radiomap', 'appUNewFile/dealerList', info);
	} else if (radiotype == 4) {
		loadBuildFileStructData('radiomap', 'appUNewFile/structList', info)
	} else if (radiotype == 5) {
		loadBuildFileStructData('radiomap', 'appUNewFile/farmList', info)
	} else if (radiotype == 6) {
		loadVisitLoginNoData('radiomap', 'appVisit/loadNoAndSname', info)
	} else if (radiotype == 7) {
		loadUnionData('radiomap', 'AppOrder/allianceList', info)
	}
}

/* 经销商空判断 */
var dealerno = '';

function checkBusynessNull(a) {
	if ($('#buildFileDealerNo').val() == '') {
		showErrorPopup('提示', '请先选取经销商!');
	} else {
		dealerno = $('#buildFileDealerNo').val();
		radiotype = a;
		$.ui.loadContent("#radiomap", false, false, "up");
	}
}

/* 终端编号确定 */
function checkVisitLoginNo() {
	showMessage('保存中');
	var test = $('input:radio[name="test"]:checked');
	var unicode = test.attr('id');
	if (unicode != undefined) {
		changeTragetLocation = "0";
		seriveChange = test.attr("isCheck");
		$('#visitLoginNo').val(unicode);
		$('#visitLoginName').html(test.val(), true);
		$('#visitLoginType1').html(test.attr('type1'), true);
		$('#visitLoginType').html(test.attr('dealertype'), true);
		$('#visitLoginDealerNo').html(test.attr('dealerNo'), true);
		$('#visitLoginDealerName').html(test.attr('cDwmc'), true);
		$('#visitLoginu_x').val(test.attr('u_x'));
		$('#visitLoginu_y').val(test.attr('u_y'));
		cleanStartVisit();
		popup.hide();
		$.ui.goBack();
	} else {
		popup.hide();
		showErrorPopup('提示', '请先选取正确信息!');
	}
}

/* 批发市场确定 */
function checkBuildFileStruct() {
	showMessage('保存中');
	var test = $('input:radio[name="test"]:checked');
	var unicode = test.attr('id');
	if (unicode != undefined) {
		buildfilepk = test.attr('pk');
		$('#buildFileStructPid').val(unicode);
		$('#buildFileStructName').html(test.val(), true);
		popup.hide();
		$.ui.goBack();
	} else {
		popup.hide();
		showErrorPopup('提示', '请先选取正确信息!');
	}
}

/* 农贸市场确定 */
function checkFarmList() {
	showMessage('保存中');
	var test = $('input:radio[name="test"]:checked');
	var unicode = test.attr('id');
	if (unicode != undefined) {
		$('#buildFileFarmPid').val(unicode);
		$('#buildFileFarmName').html(test.val(), true);
		popup.hide();
		$.ui.goBack();
	} else {
		popup.hide();
		showErrorPopup('提示', '请先选取正确信息!');
	}
}

/* 经销商确定 */
function checkBusyness() {
	showMessage('保存中');
	var test = $('input:radio[name="test"]:checked');
	var unicode = test.attr('id');
	if (unicode != undefined) {
		if (busynesstype == 0) {
			$('#buildFileDealerNo').val(unicode);
			$('#buildFileDealerName').html(test.val(), true);
			$('#buildFilexsdq').html(test.attr('xsdq'), true);
			$('#buildFilexsb').html(test.attr('xsb'), true);
			$('#buildFilexsz').html(test.attr('xsz'), true);
			$('.buildFileDealerinfo').show();
			$('.buildFileotherinfo').show();
		} else if (busynesstype == 1) {
			$('#supermarketdealerno').html(unicode, true);
			$('#supermarketdealerno').attr("smid", unicode);
			$('#supermarketdealername').html(test.val(), true);
			/*$('#supermarketxsdq').html(test.attr('xsdq'), true);
			$('#supermarketxsb').html(test.attr('xsb'), true);
			$('#supermarketxsz').html(test.attr('xsz'), true);*/
			$('#supermarketdealerinfo').show();
		} else if (busynesstype == 2) {
			$('#orderdealerno').html(unicode, true);
			$('#orderdealername').html(test.val(), true);
			$("#orderunionno").html("", true);
			$("#orderdealername").html("", true);
			if (!parten.test($("#orderdealerno").html()) && (!parten.test($("#ordertype").attr("textid")) && $("#ordertype").attr("textid") != undefined)) {
				$(".unionselectinfo").show();
			} else {
				$(".unionselectinfo").hide();
			}
		}
		popup.hide();
		$.ui.goBack();
	} else {
		popup.hide();
		showErrorPopup('提示', '请先选取正确信息!');
	}
}

/* 请假审批人信息确定 */
var checkmanpid = '';

function checkMan() {
	showMessage('保存中');
	var test = $('input:radio[name="test"]:checked');
	var unicode = test.attr('id');
	var name = test.val();
	if (unicode != undefined) {
		$('#leaveaddsid').val(name);
		checkmanpid = unicode;
		popup.hide();
		$.ui.goBack();
	} else {
		popup.hide();
		showErrorPopup('提示', '请先选取正确信息!');
	}
}

/* 联盟商确定 */
function checkUnion() {
	showMessage('保存中');
	var test = $('input:radio[name="test"]:checked');
	var unionid = test.attr('id');
	var uniontype = test.attr('nType');
	var unionname = test.val();
	if (unionid != undefined) {
		$('#orderunionno').html(unionid, true);
		$('#orderunionname').html(unionname, true);
		popup.hide();
		$.ui.goBack();
	} else {
		popup.hide();
		showErrorPopup('提示', '请先选取正确信息!');
	}
}

/* 姓名读取 */
/**
 * a: 单选界面id
 * name: 方法名称
 * info: 模糊查询
 */
var messageinfo = '';

function loadRadioMapData(a, name, info) {
	$('#' + a + 'ul').html('', true);
	$('#' + a + 'none').hide();
	$('#' + a + 'box').hide();
	$('#' + a + 'loading').show();
	messageinfo = $('#searchinfo').val();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			fifter: info,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 0) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').show();
			} else if (json.status == 1) {
				$("#" + a).attr('first', json.list[0].rownum);
				$("#" + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input staff='" + json.list[i].staff + "' id='" + json.list[i].uniqueCode + "' type='radio' value='" + json.list[i].empName + "' name='test'><label for='" + json.list[i].uniqueCode + "'><font>" + json.list[i].empName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').html('', true);
				$('#' + a + 'ul').append(content);
				checkmanscroller.scrollToTop();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				$('#' + a + 'box').show();
			} else if (json.status == -1) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#' + a + 'box').hide();
			$('#' + a + 'loading').hide();
			$('#' + a + 'none').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 批发市场数据读取 */
/**
 * a: 界面id
 * name: 方法名称
 * info: 模糊查询
 */

function loadBuildFileStructData(a, name, info) {
	$('#' + a + 'ul').html('', true);
	$('#' + a + 'none').hide();
	$('#' + a + 'box').hide();
	$('#' + a + 'loading').show();
	messageinfo = $('#searchinfo').val();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			khId: dealerno,
			fifter: info
		},
		success: function(json) {
			if (json.status == 0) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').show();
			} else if (json.status == 1) {
				$("#" + a).attr('first', json.list[0].rownum);
				$("#" + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].structPid + "' type='radio' pk='" + json.list[i].pk + "' value='" + json.list[i].structName + "' name='test'><label for='" + json.list[i].structPid + "'><font>" + json.list[i].structName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').html('', true);
				$('#' + a + 'ul').append(content);
				checkmanscroller.scrollToTop();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				$('#' + a + 'box').show();
			} else if (json.status == -1) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#' + a + 'box').hide();
			$('#' + a + 'loading').hide();
			$('#' + a + 'none').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 农贸市场数据读取 */
/**
 * a: 界面id
 * name: 方法名称
 * info: 模糊查询
 */
function loadFarmListData(a, name, info) {
	$('#' + a + 'ul').html('', true);
	$('#' + a + 'none').hide();
	$('#' + a + 'box').hide();
	$('#' + a + 'loading').show();
	messageinfo = $('#searchinfo').val();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			khId: dealerno,
			fifter: info
		},
		success: function(json) {
			if (json.status == 0) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').show();
			} else if (json.status == 1) {
				$("#" + a).attr('first', json.list[0].rownum);
				$("#" + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].farmPid + "' type='radio' value='" + json.list[i].farmName + "' name='test'><label for='" + json.list[i].farmPid + "'><font>" + json.list[i].farmName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').html('', true);
				$('#' + a + 'ul').append(content);
				checkmanscroller.scrollToTop();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				$('#' + a + 'box').show();
			} else if (json.status == -1) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#' + a + 'box').hide();
			$('#' + a + 'loading').hide();
			$('#' + a + 'none').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 请假审批人数据读取 */
/**
 * a: 界面id
 * name: 方法名称
 * info: 模糊查询
 */

function loadCheckManData(a, name, info) {
	$('#' + a + 'ul').html('', true);
	$('#' + a + 'none').hide();
	$('#' + a + 'box').hide();
	$('#' + a + 'loading').show();
	messageinfo = $('#searchinfo').val();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			fifter: info,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 0) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').show();
			} else if (json.status == 1) {
				$("#" + a).attr('first', json.list[0].rownum);
				$("#" + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					//content += "<li><input id='" + json.list[i].PID + "' type='radio' value='" + json.list[i].NAME + "' name='test'><label for='" + json.list[i].PID + "'><font>" + json.list[i].NAME + "</font></label><div style='clear: both;'></div></li>";
					content += "<li><input id='" + json.list[i].userId + "' type='radio' value='" + json.list[i].userName + "' name='test'><label for='" + json.list[i].userId + "'><font>" + json.list[i].userName + " " + json.list[i].deptName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').html('', true);
				$('#' + a + 'ul').append(content);
				checkmanscroller.scrollToTop();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				$('#' + a + 'box').show();
			} else if (json.status == -1) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showMessage('账号已失效');
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#' + a + 'box').hide();
			$('#' + a + 'loading').hide();
			$('#' + a + 'none').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 经销商数据读取 */
/**
 * a: 单选界面id
 * name: 方法名称
 * info: 模糊查询
 */
function loadBusynessData(a, name, info) {
	$('#' + a + 'ul').html('', true);
	$('#' + a + 'none').hide();
	$('#' + a + 'box').hide();
	$('#' + a + 'loading').show();
	messageinfo = $('#searchinfo').val();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			fifter: info,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == 0) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').show();
			} else if (json.status == 1) {
				$("#" + a).attr('first', json.list[0].rownum);
				$("#" + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].cdwbh + "' xsb='" + json.list[i].xsb + "' xsdq='" + json.list[i].xsdq + "' xsz='" + json.list[i].xsz + "' type='radio' value='" + json.list[i].cdwmc + "' name='test'><label for='" + json.list[i].cdwbh + "'><font>" + json.list[i].cdwbh + " " + json.list[i].xsdq + " " + json.list[i].xsb + " " + json.list[i].xsz + " " + json.list[i].cdwmc + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').html('', true);
				$('#' + a + 'ul').append(content);
				checkmanscroller.scrollToTop();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				$('#' + a + 'box').show();
			} else if (json.status == -1) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#' + a + 'box').hide();
			$('#' + a + 'loading').hide();
			$('#' + a + 'none').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

$(document).ready(function() {
	bindScroll();
});

function bindScroll() {
	$("input:radio[name='test']").off("click").on("click", function() {
		checkmanscroller.scrollBy({
			'x': 0,
			'y': 1
		});
		checkmanscroller.scrollBy({
			'x': 0,
			'y': -1
		});
	});
}

/* 终端数据读取 */
/**
 * a: 界面id
 * name: 方法名称
 * info: 模糊查询
 */

function loadVisitLoginNoData(a, name, info) {
		$('#' + a + 'ul').html('', true);
		$('#' + a + 'none').hide();
		$('#' + a + 'box').hide();
		$('#' + a + 'loading').show();
		messageinfo = $('#searchinfo').val();
		var ajaxdata = $.ajax({
			url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
			dataType: 'jsonp',
			type: 'post',
			timeout: 10000, //超时时间设置，单位毫秒
			data: {
				fifter: info,
				userId: getSession('uid')
			},
			success: function(json) {
				if (json.status == 0) {
					$('#' + a + 'box').hide();
					$('#' + a + 'loading').hide();
					$('#' + a + 'none').show();
				} else if (json.status == 1) {
					$("#" + a).attr('first', json.list[0].rownum);
					$("#" + a).attr('last', json.list[json.list.length - 1].rownum);
					var content = '';
					for (var i = 0; i < json.list.length; i++) {
						if (!parten.test(json.list[i].type)) {
							temptype = "--" + json.list[i].type;
						}
						content += "<li><input isCheck='" + json.list[i].isCheck + "' cDwmc='" + json.list[i].cDwmc + "' type1='" + json.list[i].type1 + "' dealerNo='" + json.list[i].dealerNo + "' dealertype='" + json.list[i].type + "' u_x='" + json.list[i].u_x + "' u_y='" + json.list[i].u_y + "' id='" + json.list[i].sno + "' type='radio' value='" + json.list[i].sname + "' name='test'><label for='" + json.list[i].sno + "'><font>" + json.list[i].sname + "--" + json.list[i].type1 + temptype + "</font></label><div style='clear: both;'></div></li>";
					}
					$('#' + a + 'ul').html('', true);
					$('#' + a + 'ul').append(content);
					checkmanscroller.scrollToTop();
					$('#' + a + 'loading').hide();
					$('#' + a + 'none').hide();
					$('#' + a + 'box').show();
				} else if (json.status == -1) {
					$('#' + a + 'box').hide();
					$('#' + a + 'loading').hide();
					$('#' + a + 'none').hide();
					showMessage('账号已失效');
					/* 1秒后隐藏提示 */
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				}
			},
			Error: function() {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				alert('Error');
			},
			complete: function(response) {
				if (response.status == 200) {} else {
					ajaxdata.abort();
					$('#' + a + 'box').hide();
					$('#' + a + 'loading').hide();
					$('#' + a + 'none').hide();
					showErrorPopup('提示', '服务器连接失败!');
				}
			}
		});
	}
	/* 联盟商数据读取 */
	/**
	 * a: 界面id
	 * name: 方法名称
	 * info: 模糊查询
	 */
var uniondealerno = "";
var uniontype = "";

function loadUnionData(a, name, info) {
	$('#' + a + 'ul').html('', true);
	$('#' + a + 'none').hide();
	$('#' + a + 'box').hide();
	$('#' + a + 'loading').show();
	uniondealerno = $("#orderdealerno").html();
	uniontype = $("#ordertype").attr("textid");
	messageinfo = $('#searchinfo').val();
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			keyWord: info,
			dealerNo: uniondealerno,
			type: uniontype
		},
		success: function(json) {
			if (json.status == 0) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').show();
			} else if (json.status == 1) {
				$("#" + a).attr('first', json.list[0].rownum);
				$("#" + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].nNo + "' type='radio' nType='" + json.list[i].nType + "' value='" + json.list[i].nName + "' name='test'><label for='" + json.list[i].nNo + "'><font>" + json.list[i].nNo + " " + json.list[i].nType + " " + json.list[i].nName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').html('', true);
				$('#' + a + 'ul').append(content);
				checkmanscroller.scrollToTop();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				$('#' + a + 'box').show();
			} else if (json.status == -1) {
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			}
		},
		Error: function() {
			$('#' + a + 'box').hide();
			$('#' + a + 'loading').hide();
			$('#' + a + 'none').hide();
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#' + a + 'box').hide();
				$('#' + a + 'loading').hide();
				$('#' + a + 'none').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 单选上下拉更新*/
/**
 * a: 界面id
 **/
var checkmanscroller = '';
var isLoadingCheckMan = false;

function updateCheckMan(a) {
	/* 上下拉更新 */
	/* 开启页面滚动 */
	checkmanscroller = $("#" + a + "box").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	checkmanscroller.addInfinite();
	/* 下拉更新 */
	checkmanscroller.addPullToRefresh();

	var hideClose;
	/* 下拉更新 */
	$.bind(checkmanscroller, "refresh-release", function() {
		//console.log("refresh-release");
		var that = this;
		clearTimeout(hideClose);
		hideClose = setTimeout(function() {
			//console.log("hiding manually refresh");
			//$("#infinite").remove();
			if (radiotype == 1) {
				addCheckManDown(a, $('#radioname').val(), messageinfo, that);
			} else if (radiotype == 2) {
				addRadioMapDown(a, $('#radioname').val(), messageinfo, that);
			} else if (radiotype == 3) {
				addBusynessDown(a, $('#radioname').val(), messageinfo, that);
			} else if (radiotype == 4) {
				addBuildFileStructDown(a, $('#radioname').val(), messageinfo, that);
			} else if (radiotype == 5) {
				addFarmListDown(a, $('#radioname').val(), messageinfo, that);
			} else if (radiotype == 6) {
				addVisitLoginNoDown(a, $('#radioname').val(), messageinfo, that);
			} else if (radiotype == 7) {
				addUnionDown(a, $('#radioname').val(), messageinfo, that);
			}
		}, 1000);
		return false; //tells it to not auto-cancel the refresh
	});

	$.bind(checkmanscroller, "refresh-cancel", function() {
		clearTimeout(hideClose);
	});

	/* 上拉更新 */
	checkmanscroller.enable();
	$.bind(checkmanscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(checkmanscroller, "infinite-scroll-end", function() {
			$.unbind(checkmanscroller, "infinite-scroll-end");
			//$(self.el).find("#infinite").remove();
			if (!isLoadingCheckMan) {
				isLoadingCheckMan = true;
				/*setTimeout(function () {*/
				/*if ($(self.el).find("#infinite").length == 0) {*/
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				/*$(this.el).append("<div id='infinite' class='buttons'><img src='images/loading.gif' style='width: 30px;'>加载中</div>");
				}*/
				if (radiotype == 1) {
					addCheckManUp(a, $('#radioname').val(), messageinfo, self);
				} else if (radiotype == 2) {
					addRadioMapUp(a, $('#radioname').val(), messageinfo, self);
				} else if (radiotype == 3) {
					addBusynessUp(a, $('#radioname').val(), messageinfo, self);
				} else if (radiotype == 4) {
					addBuildFileStructUp(a, $('#radioname').val(), messageinfo, self);
				} else if (radiotype == 5) {
					addFarmListUp(a, $('#radioname').val(), messageinfo, self);
				} else if (radiotype == 6) {
					addVisitLoginNoUp(a, $('#radioname').val(), messageinfo, self);
				} else if (radiotype == 7) {
					addUnionUp(a, $('#radioname').val(), messageinfo, self);
				}
				//self.scrollToBottom();
				/*}, 1000);*/
			}
		});
	});
}

/* 终端下拉更新 */
function addVisitLoginNoDown(a, name, info, that) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('first'),
			fifter: info,
			num: 10,
			mark: 1,
			userId: getSession('uid')
		},
		success: function(json) {
			if (json.status == -1) {
				that.hideRefresh();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				that.hideRefresh();
				Toast("没有更多", 2000);
			} else if (json.status == 1) {
				$('#' + a).attr('first', json.list[0].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					if (!parten.test(json.list[i].type)) {
						temptype = "--" + json.list[i].type;
					}
					content += "<li><input isCheck='" + json.list[i].isCheck + "' cDwmc='" + json.list[i].cDwmc + "' type1='" + json.list[i].type1 + "' dealerNo='" + json.list[i].dealerNo + "' dealertype='" + json.list[i].type + "' u_x='" + json.list[i].u_x + "' u_y='" + json.list[i].u_y + "' id='" + json.list[i].sno + "' type='radio' value='" + json.list[i].sname + "' name='test'><label for='" + json.list[i].sno + "'><font>" + json.list[i].sname + "--" + json.list[i].type1 + temptype + "</font></label><div style='clear: both;'></div></li>";
				}
				$("#" + a + "ul").prepend(content);
				bindScroll();
				that.hideRefresh();
			}
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
}

/* 终端上拉加载 */
function addVisitLoginNoUp(a, name, info, self) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('last'),
			fifter: info,
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
				$('#' + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					var temptype = "";
					if (!parten.test(json.list[i].type)) {
						temptype = "--" + json.list[i].type;
					}
					content += "<li><input isCheck='" + json.list[i].isCheck + "' cDwmc='" + json.list[i].cDwmc + "' type1='" + json.list[i].type1 + "' dealerNo='" + json.list[i].dealerNo + "' dealertype='" + json.list[i].type + "' u_x='" + json.list[i].u_x + "' u_y='" + json.list[i].u_y + "' id='" + json.list[i].sno + "' type='radio' value='" + json.list[i].sname + "' name='test'><label for='" + json.list[i].sno + "'><font>" + json.list[i].sname + "--" + json.list[i].type1 + temptype + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').append(content);
				bindScroll();
			}
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
		},
		Error: function() {
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$(self.el).find("#infinite").remove();
				self.clearInfinite();
				isLoadingCheckMan = false;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 批发市场下拉更新 */
function addBuildFileStructDown(a, name, info, that) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('first'),
			khId: dealerno,
			fifter: info,
			num: 10,
			mark: 1
		},
		success: function(json) {
			if (json.status == -1) {
				that.hideRefresh();
				showMessage('账号已失效');
				/* 1秒后隐藏提示 */
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == 0) {
				that.hideRefresh();
				Toast("没有更多", 2000);
			} else if (json.status == 1) {
				$('#' + a).attr('first', json.list[0].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].structPid + "' pk='" + json.list[i].pk + "' type='radio' value='" + json.list[i].structName + "' name='test'><label for='" + json.list[i].structPid + "'><font>" + json.list[i].structName + "</font></label><div style='clear: both;'></div></li>";
				}
				that.hideRefresh();
				$("#" + a + "ul").prepend(content);
				bindScroll();
			}
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
}

/* 批发市场上拉加载 */
function addBuildFileStructUp(a, name, info, self) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('last'),
			khId: dealerno,
			fifter: info,
			num: 10,
			mark: 0
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
				$('#' + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].structPid + "' pk='" + json.list[i].pk + "' type='radio' value='" + json.list[i].structName + "' name='test'><label for='" + json.list[i].structPid + "'><font>" + json.list[i].structName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').append(content);
				bindScroll();
			}
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
		},
		Error: function() {
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$(self.el).find("#infinite").remove();
				self.clearInfinite();
				isLoadingCheckMan = false;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 农贸市场下拉更新 */
function addFarmListDown(a, name, info, that) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('first'),
			khId: dealerno,
			fifter: info,
			num: 10,
			mark: 1
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
				$('#' + a).attr('first', json.list[0].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].farmPid + "' type='radio' value='" + json.list[i].farmName + "' name='test'><label for='" + json.list[i].farmPid + "'><font>" + json.list[i].farmName + "</font></label><div style='clear: both;'></div></li>";
				}
				$("#" + a + "ul").prepend(content);
				bindScroll();
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
}

/* 农贸市场上拉加载 */
function addFarmListUp(a, name, info, self) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('last'),
			khId: dealerno,
			fifter: info,
			num: 10,
			mark: 0
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
				$('#' + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].farmPid + "' type='radio' value='" + json.list[i].farmName + "' name='test'><label for='" + json.list[i].farmPid + "'><font>" + json.list[i].farmName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').append(content);
				bindScroll();
			}
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
		},
		Error: function() {
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$(self.el).find("#infinite").remove();
				self.clearInfinite();
				isLoadingCheckMan = false;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 经销商下拉更新 */
function addBusynessDown(a, name, info, that) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('first'),
			fifter: info,
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
				$('#' + a).attr('first', json.list[0].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].cdwbh + "' type='radio' value='" + json.list[i].cdwmc + "' name='test'><label for='" + json.list[i].cdwbh + "'><font>" + json.list[i].cdwbh + " " + json.list[i].xsdq + " " + json.list[i].xsb + " " + json.list[i].xsz + " " + json.list[i].cdwmc + "</font></label><div style='clear: both;'></div></li>";
				}
				$("#" + a + "ul").prepend(content);
				bindScroll();
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
}

/* 经销商上拉加载 */
function addBusynessUp(a, name, info, self) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('last'),
			fifter: info,
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
				$('#' + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].cdwbh + "' type='radio' value='" + json.list[i].cdwmc + "' name='test'><label for='" + json.list[i].cdwbh + "'><font>" + json.list[i].cdwbh + " " + json.list[i].xsdq + " " + json.list[i].xsb + " " + json.list[i].xsz + " " + json.list[i].cdwmc + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').append(content);
				bindScroll();
			}
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
		},
		Error: function() {
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$(self.el).find("#infinite").remove();
				self.clearInfinite();
				isLoadingCheckMan = false;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 审批人下拉更新 */
function addCheckManDown(a, name, info, that) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('first'),
			fifter: info,
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
				$('#' + a).attr('first', json.list[0].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					//content += "<li><input id='" + json.list[i].PID + "' type='radio' value='" + json.list[i].NAME + "' name='test'><label for='" + json.list[i].PID + "'><font>" + json.list[i].NAME + "</font></label><div style='clear: both;'></div></li>";
					content += "<li><input id='" + json.list[i].userId + "' type='radio' value='" + json.list[i].userName + "' name='test'><label for='" + json.list[i].userId + "'><font>" + json.list[i].userName + " " + json.list[i].deptName + "</font></label><div style='clear: both;'></div></li>";
				}
				$("#" + a + "ul").prepend(content);
				bindScroll();
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
}

/* 审批人上拉加载 */
function addCheckManUp(a, name, info, self) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('last'),
			fifter: info,
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
				$('#' + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					//content += "<li><input id='" + json.list[i].PID + "' type='radio' value='" + json.list[i].NAME + "' name='test'><label for='" + json.list[i].PID + "'><font>" + json.list[i].NAME + "</font></label><div style='clear: both;'></div></li>";
					content += "<li><input id='" + json.list[i].userId + "' type='radio' value='" + json.list[i].userName + "' name='test'><label for='" + json.list[i].userId + "'><font>" + json.list[i].userName + " " + json.list[i].deptName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').append(content);
				bindScroll();
			}
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
		},
		Error: function() {
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$(self.el).find("#infinite").remove();
				self.clearInfinite();
				isLoadingCheckMan = false;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 姓名信息下拉更新 */
function addRadioMapDown(a, name, info, that) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('first'),
			fifter: info,
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
				$('#' + a).attr('first', json.list[0].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input staff='" + json.list[i].staff + "' id='" + json.list[i].uniqueCode + "' type='radio' value='" + json.list[i].empName + "' name='test'><label for='" + json.list[i].uniqueCode + "'><font>" + json.list[i].empName + "</font></label><div style='clear: both;'></div></li>";
				}
				$("#" + a + "ul").prepend(content);
				bindScroll();
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
}

/* 姓名信息上拉加载 */
function addRadioMapUp(a, name, info, self) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('last'),
			fifter: info,
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
				$('#' + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input staff='" + json.list[i].staff + "' id='" + json.list[i].uniqueCode + "' type='radio' value='" + json.list[i].empName + "' name='test'><label for='" + json.list[i].uniqueCode + "'><font>" + json.list[i].empName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').append(content);
				bindScroll();
			}
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
		},
		Error: function() {
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$(self.el).find("#infinite").remove();
				self.clearInfinite();
				isLoadingCheckMan = false;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 联盟商信息下拉更新 */
function addUnionDown(a, name, info, that) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('first'),
			keyWord: info,
			dealerNo: uniondealerno,
			type: uniontype,
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
				$('#' + a).attr('first', json.list[0].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].nNo + "' type='radio' nType='" + json.list[i].nType + "' value='" + json.list[i].nName + "' name='test'><label for='" + json.list[i].nNo + "'><font>" + json.list[i].nNo + " " + json.list[i].nType + " " + json.list[i].nName + "</font></label><div style='clear: both;'></div></li>";
				}
				$("#" + a + "ul").prepend(content);
				bindScroll();
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
}

/* 联盟商信息上拉加载 */
function addUnionUp(a, name, info, self) {
	var ajaxdata = $.ajax({
		url: "http://" + ipaddress + "/" + serviceName + "/" + name + ".do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: $("#" + a).attr('last'),
			keyWord: info,
			dealerNo: uniondealerno,
			type: uniontype,
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
				$('#' + a).attr('last', json.list[json.list.length - 1].rownum);
				var content = '';
				for (var i = 0; i < json.list.length; i++) {
					content += "<li><input id='" + json.list[i].nNo + "' type='radio' nType='" + json.list[i].nType + "' value='" + json.list[i].nName + "' name='test'><label for='" + json.list[i].nNo + "'><font>" + json.list[i].nNo + " " + json.list[i].nType + " " + json.list[i].nName + "</font></label><div style='clear: both;'></div></li>";
				}
				$('#' + a + 'ul').append(content);
				bindScroll();
			}
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
		},
		Error: function() {
			$(self.el).find("#infinite").remove();
			self.clearInfinite();
			isLoadingCheckMan = false;
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$(self.el).find("#infinite").remove();
				self.clearInfinite();
				isLoadingCheckMan = false;
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}