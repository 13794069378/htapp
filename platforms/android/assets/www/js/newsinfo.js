/**
 * 新闻明细操作
 **/
var htuserid = ''; //登录名
var htusername = ''; //中文名
/* 点击赞或踩 */
/**
 * name: 点击名称(UnLike, Like)
 **/
function clickunlike(name) {
	/* 判断是否已经登录 */
	/*$.jsonP({
		url: "http://" + htipaddress + "/southcn/click" + name + ".do?newsId=" + getSession('keyid') + "&memberId=" + htuserid + "&s=" + getSession("sid") + "&callback=?",
		success: function (json) {
			if (json.msg == 'change') {
				refresh(name);
			} else if (json.msg == 'no') { 
				//clearUserInfo();
				showMessage('账号已失效');
				window.setTimeout(function () {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == "error") {
				showErrorPopup("提示", json.msg)
			}
		},
		Error: function () {
			alert('Error');
		}
	});*/
	var ajaxdata = $.ajax({
		url: "http://" + htipaddress + "/southcn/click" + name + ".do",
		dataType: "jsonp",
		type: "post",
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			newsId: getSession('keyid'),
			s: getSession('uid'),
			memberId: htuserid,
			memberName: htusername
		},
		success: function(json) {
			if (json.msg == 'change') {
				refresh(name);
			} else if (json.msg == 'no') { /* 判断服务器是否重置账号 */
				//clearUserInfo();
				showMessage('账号已失效');
				window.setTimeout(function() {
					popup.hide();
					$.ui.loadContent("#main", true, true, "up");
				}, 1500);
			} else if (json.status == "error") {
				showErrorPopup("提示", json.msg)
			}
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 赞踩数目更新 */
function refresh(clicked) {
	var ajaxdata = $.ajax({
		url: "http://" + htipaddress + "/southcn/getHeat.do",
		dataType: "jsonp",
		type: "post",
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			id: getSession('keyid')
		},
		success: function(json) {
			// 刷新赞或踩的数目显示
			if (clicked == "Like") { //赞
				document.getElementById('znum').innerHTML = "<div style='color:red'>" + json.like + "</div>";
				document.getElementById('cnum').innerHTML = json.unlike;
			} else { //踩
				document.getElementById('znum').innerHTML = json.like;
				document.getElementById('cnum').innerHTML = "<div style='color:red'>" + json.unlike + "</div>";
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

var tcontent = null;
/* 写评论 */
function writeDiscuss(a) {
	tcontent = a;
	if (tcontent !== '') {
		showMessage('提交中');
		var ajaxdata = $.ajax({
			url: "http://" + htipaddress + "/southcn/writeDiscuss.do",
			dataType: "jsonp",
			timeout: 20000, //超时时间设置，单位毫秒
			type: "post",
			data: {
				news_id: getSession('keyid'),
				s: getSession('uid'),
				member_id: htuserid,
				memberName: htusername,
				content: tcontent
			},
			success: function(json) {
				popup.hide();
				if (json.msg == 'success') {
					showMessage('发贴成功');
					window.setTimeout(function() {
						popup.hide();
						clearInput('tcontent');
						tcontent = null;
					}, 1500);
				} else if (json.msg == 'no') {
					showMessage('账号已失效');
					window.setTimeout(function() {
						popup.hide();
						$.ui.loadContent("#main", true, true, "up");
					}, 1500);
				} else if (json.status == "error") {
					showErrorPopup("提示", json.msg)
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

/* 输入清除 */
/**
 * id: 清除位置的ID
 **/
function clearInput(id) {
	$('#' + id).val('');
}