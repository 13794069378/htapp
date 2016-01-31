//var htipaddress = '115.29.107.221';
//var htipaddress = '192.168.168.11:8187';
var htipaddress = 'hip.haday.cn:8186';


function init_carousel2(n) {
	$('#page_' + n + '_li').carousel({
		pagingDiv: 'page_' + n + '_ul',
		pagingCssName: "carousel_paging2",
		pagingCssNameSelected: "carousel_paging2_selected",
		preventDefaults: false,
		wrap: true //Set to false to disable the wrap around
	});
}

/* 新闻明细读取 */
function loadTransition3() {
	$.ui.toggleNavMenu(true);
	/* 清空内容 */
	$("#transition3_box").hide();
	$("#transition3_loading").show();
	$("#rong").html("", true);
	$("#dz").html("", true);
	$("#pinglun").html("", true);
	/* 获取新闻明细 */
	if (getSession('keyid') != null) {
		var ajaxdata = $.ajax({
			url: "http://" + htipaddress + "/southcn/getDetailNews.do",
			dataType: 'jsonp',
			type: 'post',
			timeout: 10000, //超时时间设置，单位毫秒
			data: {
				id: getSession('keyid')
			},
			success: function(json) {
				/* 新闻标题、时间、内容 */
				$("#rong").append("<div class='tou'><h1>" + json.title + "</h1><h2>" + json.push_date + "</h2></div><div id='nei'>" + json.content + "</div>");
				$("#nei").find("img").css("width", "100%");
				$("#nei").find("img").css("height", "");
				/* 赞踩信息获取 */
				$("#dz").append("<div class='ld' onclick='clickunlike(\"Like\")'><img src='images/essay_image_list_digg_icon_normal.png' /><font id='znum'>" + json.like_num + "</font></div><div class='rc' onclick='clickunlike(\"UnLike\")'><img src='images/essay_image_list_bury_icon_normal.png' /><font id='cnum'>" + json.unlike_num + "</font></div>");
				// 回帖数
				if (json.number == undefined || parten.test(json.number)) {
					document.getElementById('tnum').innerHTML = 0;
				} else {
					document.getElementById('tnum').innerHTML = json.number;
				}
				loadDiscuss();
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
		/* 获取热门回帖 */

	} else {
		showErrorPopup("提示", "新闻不存在");
		$("#transition3_loading").hide();
		$("#transition3_box").hide();
	}
}

/* 获取评论 */
function loadDiscuss() {
	var ajaxdata = $.ajax({
		url: "http://" + htipaddress + "/southcn/getDiscussList.do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			news_id: getSession('keyid')
		},
		success: function(json) {
			var j;
			/* 获取前四个回帖 */
			if (json.data.length < 4) {
				j = json.data.length;
			} else {
				j = 4;
			}
			for (var i = 0; i < j; i++) {
				$("#pinglun").append("<a href='#forum_list'><li class='clearfix item'><img src='images/user.gif' /><p class='tming'>" + json.data[i].alias + "<span style='float: right;'>" + json.data[i].rownum + "楼</span></p><p class='tneirong'>" + json.data[i].content + "</p><p class='data'>" + json.data[i].push_date + "</p></li></a>");
			}
			$("#transition3_loading").hide();
			$("#transition3_box").show();
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

/* 帖子列表界面 */
function loadForum_List() {
	//$('#page_forum_list_box').css('height', panelheight - 90);
	$.ui.toggleNavMenu(false);
	$("#tpinglun").html("", true);
	/* 判断是否首次加载 */
	var ajaxdata = $.ajax({
		url: "http://" + htipaddress + "/southcn/getDiscussList.do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			news_id: getSession('keyid')
		},
		success: function(json) {
			if (json.data.length != 0) {
				var temp;
				if (json.data.length < 10) {
					$('#forum_list').attr('lastid', json.data[json.data.length - 1].id);
					temp = json.data.length;
				} else {
					$('#forum_list').attr('lastid', json.data[9].id);
					temp = 10;
				}
				for (var i = 0; i < temp; i++) {
					$("#tpinglun").append("<li class='clearfix item'><img src='images/user.gif' /><p class='tname'>" + json.data[i].alias + "<span style='float: right;'>" + json.data[i].rownum + "楼</span></p><p class='tneirong'>" + json.data[i].content + "</p><p class='tdate'>" + json.data[i].push_date + "</p></li>");
				}
				discussscroller.scrollToTop();
			} else {
				$('#forum_list').attr('lastid', 0);
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

/** 评论更新
 * a: 页面编号
 **/
var discussscroller = '';

function updateDiscuss(a) {
	/* 上下拉更新 */
	var tarP = "page_" + a;
	/* 开启页面滚动 */
	discussscroller = $("#forum_list").scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	discussscroller.addInfinite();

	/* 上拉更新 */
	discussscroller.enable();
	var isLoading = false;
	$.bind(discussscroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons' style='margin-top: -15px;'>上拉加载更多</div>");
		}
		$.bind(discussscroller, "infinite-scroll-end", function() {
			$.unbind(discussscroller, "infinite-scroll-end");
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				var ajaxdata = $.ajax({
					url: "http://" + htipaddress + "/southcn/getDiscussButtom.do",
					dataType: 'jsonp',
					type: 'post',
					timeout: 10000, //超时时间设置，单位毫秒
					data: {
						id: $('#forum_list').attr('lastid'),
						news_id: getSession('keyid')
					},
					success: function(json) {
						var str;
						if (json.buttomId == -1) {
							Toast('没有更多了', 2000);
						} else {
							$('#forum_list').attr('lastid', json.buttomId);
							for (var i = 0; i < json.data.length; i++) {
								$("#tpinglun").append("<li class='clearfix item'><img src='images/user.gif' /><p class='tname'>" + json.data[i].alias + "<span style='float: right;'>" + json.data[i].rownum + "楼</span></p><p class='tneirong'>" + json.data[i].content + "</p><p class='tdate'>" + json.data[i].push_date + "</p></li>");
							}
						}
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
						var linum = $("#tpinglun").find("li");
						if (json.buttomId == -1 && linum.length > 10) {
							self.scrollToBottom();
						}
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

/* 发帖输入 */
function inputText() {
	$("#afui").popup({
		title: '发帖',
		message: '<span id="remainWord">你还可以输入<span class="f_big" id="wordRemainTipSpan">120</span>个字</span><span id="extendWord" style="display: none;color: red" >已超出<span class="f_big" id="wordExtTipSpan">0</span>个字</span><textarea id="wb_ta" maxlength="120" style="overflow-y: hidden; height: 30px;resize: none;" onpropertychange="checkLength(this)" oninput="checkLength(this)" onload="this.focused = true; this.select();"></textarea>',
		cancelText: "取消",
		cancelClass: 'button errorbutton',
		cancelCallback: function() {},
		doneText: "确定",
		doneClass: 'button okbutton',
		doneCallback: function() {
			writeDiscuss($("#wb_ta").val());
			//document.getElementById('tcontent').value = $('#wb_ta').val();
		},
		cancelOnly: false
	});
	document.getElementById('tcontent').disabled = true;
	$("#wb_ta").focus();
	checkLength(document.getElementById('wb_ta'));
}

/* 剩余字数提醒 */
/**
 * a: 输入框元素
 **/
function checkLength(a) {
	//moveEnd(a);
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

/* 赞图片改变 */
/**
 * a: 点击所在位置
 **/
function changeSupport(a) {
	a.innerHTML = "<img src='images/biz_comment_support_done.png'/><img id='flag' src='images/biz_comment_add_support_flag.png'>";
	moveOnce();
}

/* 点赞特效 */
function moveOnce() {
	$("#flag").css3Animate({
		y: "-20px",
		time: "800ms",
		opacity: 0,
		callback: function() {
			reset()
		}
	});
}

/* 滚动导航的新闻页面读取 */
/**
 * colId: 栏目ID
 * pageN: 页面编号
 **/
function loadHTWebData(colId, pageN) {
	$('#page_' + pageN + '_box').hide();
	$('#page_' + pageN + '_loading').show();
	$('#page_' + pageN + '_top').empty();
	$('#page_' + pageN + '_dul').empty();
	var tempinfo = '<div id="page_' + pageN + '_ul" style="position: absolute; top: 183px; right: 10px; z-index: 200;text-align: right;"></div>' +
		'<div id="page_' + pageN + '_li" class="car" style="height:200px;"></div>';
	$('#page_' + pageN + '_top').append(tempinfo);
	var tarP = "#page_" + pageN;
	/* 判断是否首次加载 */
	var imgnum = 0;
	var ajaxdata = $.ajax({
		url: "http://" + htipaddress + "/southcn/getNews.do",
		dataType: 'jsonp',
		type: 'post',
		timeout: 10000, //超时时间设置，单位毫秒
		data: {
			num: 10,
			column_id: colId
		},
		success: function(json) {
			var str;
			var imgcol = 0.6;
			/* 读取首个和最后的新闻ID */
			var firstId = json.data[0].id;
			var lastId = json.data[json.data.length - 1].id;
			/* 保存首个和最后的新闻ID */
			$(tarP).attr('first', firstId);
			$(tarP).attr('last', lastId);
			for (var i = 0; i < json.data.length; i++) {
				// 末尾加载无图新闻
				if (json.data[i].pic_type === 0) {
					$('#page_' + pageN + '_dul').append("<li class='none_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ");'><h4>" + json.data[i].title + "</h4><p>" + json.data[i].sub_title + "<font>" + json.data[i].number + "跟帖</font></p></a></li>");
				} else if (json.data[i].pic_type == 1) {
					// 末尾加载左图新闻
					str = json.data[i].pic_url.split(";");
					$('#page_' + pageN + '_dul').append("<li class='left_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /><div><h4>" + json.data[i].title + "</h4><p>" + json.data[i].sub_title + "<font>" + json.data[i].number + "跟帖</font></p></div></a></li>");
				} else if (json.data[i].pic_type == 2) {
					// 末尾加载右图新闻
					str = json.data[i].pic_url.split(";");
					$('#page_' + pageN + '_dul').append("<li class='right_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><div><h4>" + json.data[i].title.substring(0, 14) + "</h4><p>" + json.data[i].sub_title.substring(0, 28) + "<font>" + json.data[i].number + "跟贴</font></p></div><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /></a></li>");
				} else if (json.data[i].pic_type == 3) {
					// 末尾加载三图新闻
					str = json.data[i].pic_url.split(";");
					$('#page_' + pageN + '_dul').append("<li class='three_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><h4>" + json.data[i].title.substring(0, 14) + "<font>" + json.data[i].number + "跟帖</font></h4><div><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /><img src='images/imgloading.gif' onload='Imagess(\"" + str[1] + "\",this,checkJQimg);' /><img src='images/imgloading.gif' onload='Imagess(\"" + str[2] + "\",this,checkJQimg);' /></div></a></li>");
				} else if (json.data[i].pic_type == 4) {
					// 加载顶部滚动图片新闻
					// 加载最多四张顶部大图其余变成左图
					if (imgnum < 4) {
						str = json.data[i].pic_url.split(";");
						$('#page_' + pageN + '_li').append("<a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")' style='text-decoration: none;position: relative;'><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /><div class='toptitle'><font>" + json.data[i].title.substring(0, 14) + "</font></div></a>");
						imgnum++;
					} else {
						str = json.data[i].pic_url.split(";");
						$('#page_' + pageN + '_dul').append("<li class='left_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /><div><h4>" + json.data[i].title + "</h4><p>" + json.data[i].sub_title + "<font>" + json.data[i].number + "跟帖</font></p></div></a></li>");
					}
				} else if (json.data[i].pic_type == 5) {
					// 加载大图新闻
					str = json.data[i].pic_url.split(";");
					$('#page_' + pageN + '_dul').append("<li class='big_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><h4>" + json.data[i].title.substring(0, 14) + "<font>" + json.data[i].number + "跟帖</font></h4><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /></a></li>");
				}
			}
			if (imgnum > 1) {
				$('#afui .toptitle').css('bottom', 0);
				$('#page_' + pageN + '_top').show();
				init_carousel2(pageN);
			} else if (imgnum == 1) {
				$('#afui .toptitle').css('bottom', 5);
				$('#page_' + pageN + '_top').show();
			} else {
				$('#page_' + pageN + '_top').hide();
			}
			$('#page_' + pageN).find("#infinite").remove();
			myScroller.scrollToTop();
			$('#page_' + pageN + '_loading').hide();
			$('#page_' + pageN + '_box').show();
		},
		Error: function() {
			alert('Error');
		},
		complete: function(response) {
			if (response.status == 200) {} else {
				ajaxdata.abort();
				$('#page_' + pageN).find("#infinite").remove();
				$('#page_' + pageN + '_loading').hide();
				$('#page_' + pageN + '_box').hide();
				showErrorPopup('提示', '服务器连接失败!');
			}
		}
	});
}

/* 滚动导航新闻上下拉更新 */
/**
 * a: 页面编号
 **/
var myScroller;

function updateNews(a) {
	/* 上下拉更新 */

	var tarP = "page_" + a;
	/* 开启页面滚动 */
	myScroller = $("#" + tarP).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: false,
		runCB: false
	});
	/* 上拉更新 */
	myScroller.addInfinite();

	/* 上拉更新 */
	myScroller.enable();
	var isLoading = false;
	$.bind(myScroller, "infinite-scroll", function() {
		var self = this;
		if ($(self.el).find("#infinite").length == 0) {
			$(this.el).append("<div id='infinite' class='buttons'>上拉加载更多</div>");
		}
		$.bind(myScroller, "infinite-scroll-end", function() {
			$.unbind(myScroller, "infinite-scroll-end");
			if (!isLoading) {
				isLoading = true;
				$(self.el).find("#infinite").html("<img src='images/loading.gif' style='width: 30px;'>加载中", true);
				$.jsonP({
					url: "http://" + htipaddress + "/southcn/getNewsButtom.do?id=" + $("#" + tarP).attr('last') + "&column_id=" + $("#" + tarP).attr('col') + "&callback=?",
					success: function(json) {
						var str;
						if (json.buttomId == -1) {
							Toast('没有更多了', 2000);
						} else {
							/* 保存新的末尾新闻ID */
							$("#" + tarP).attr('last', json.buttomId);
							/* 末尾加载新闻 */
							for (var i = 0; i < json.data.length; i++) {
								if (json.data[i].pic_type === 0) {
									$('#page_' + a + '_dul').append("<li class='none_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ");'><h4>" + json.data[i].title + "</h4><p>" + json.data[i].sub_title + "<font>" + json.data[i].number + "跟帖</font></p></a></li>");
								} else if (json.data[i].pic_type == 1 || json.data[i].pic_type == 4) {
									str = json.data[i].pic_url.split(";");
									$('#page_' + a + '_dul').append("<li class='left_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /><div><h4>" + json.data[i].title + "</h4><p>" + json.data[i].sub_title + "<font>" + json.data[i].number + "跟帖</font></p></div></a></li>");
								} else if (json.data[i].pic_type == 2) {
									str = json.data[i].pic_url.split(";");
									$('#page_' + a + '_dul').append("<li class='right_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><div><h4>" + json.data[i].title.substring(0, 14) + "</h4><p>" + json.data[i].sub_title.substring(0, 28) + "<font>" + json.data[i].number + "跟贴</font></p></div><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /></a></li>");
								} else if (json.data[i].pic_type == 3) {
									str = json.data[i].pic_url.split(";");
									$('#page_' + a + '_dul').append("<li class='three_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><h4>" + json.data[i].title.substring(0, 14) + "<font>" + json.data[i].number + "跟帖</font></h4><div><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /><img src='images/imgloading.gif' onload='Imagess(\"" + str[1] + "\",this,checkJQimg);' /><img src='images/imgloading.gif' onload='Imagess(\"" + str[2] + "\",this,checkJQimg);' /></div></a></li>");
								} else if (json.data[i].pic_type == 5) {
									str = json.data[i].pic_url.split(";");
									$('#page_' + a + '_dul').append("<li class='big_img' style='float: left;'><a href='#transition3' data-transition='slide' data-refresh-ajax='true' onclick='setId(" + json.data[i].id + ")'><h4>" + json.data[i].title.substring(0, 14) + "<font>" + json.data[i].number + "跟帖</font></h4><img src='images/imgloading.gif' onload='Imagess(\"" + str[0] + "\",this,checkJQimg);' /></a></li>");
								}
							}
						}
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
						var linum = $('#page_' + a + '_dul').find("li");
						if (json.buttomId == -1 && linum.length > 10) {
							self.scrollToBottom();
						}
					},
					Error: function() {
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						isLoading = false;
						alert('Error');
					}
				});
			}
		});
	});
}

//判断浏览器
var Browser = new Object();
Browser.userAgent = window.navigator.userAgent.toLowerCase();
Browser.ie = /msie/.test(Browser.userAgent);
Browser.Moz = /gecko/.test(Browser.userAgent);

//判断是否加载完成
function Imagess(url, imgid, callback) {
	var val = url;
	var img = new Image();
	if (Browser.ie) {
		img.onreadystatechange = function() {
			if (img.readyState == "complete" || img.readyState == "loaded") {
				callback(img, imgid);
			}
		}
	} else if (Browser.Moz) {
		img.onload = function() {
			if (img.complete == true) {
				callback(img, imgid);
			}
		}
	}
	//如果因为网络或图片的原因发生异常，则显示该图片
	img.onerror = function() {
		img.src = 'images/picnull.png'
	}
	img.src = val;
}

//显示图片
function checkimg(obj, imgid) {
	document.getElementById(imgid).src = obj.src;
	$("#" + imgid).removeAttr("onload");
}

function checkJQimg(obj, imgid) {
	$(imgid)[0].src = obj.src;
	$(imgid).removeAttr("onload");
}

/* 新闻数量获取 */
function loadNewsNum() {
	$.jsonP({
		url: "http://" + htipaddress + "/southcn/getNewsCount.do?loginName=" + htuserid + "&callback=?",
		success: function(json) {
			if (json.status == "success") {
				if (json.data != 0) {
					$("#htwebnum").html(json.data, true);
					$("#htwebnum").show();
				} else {
					$("#htwebnum").hide();
				}
			} else {
				$("#htwebnum").hide();
			}
		},
		Error: function() {
			$("#htwebnum").hide();
			alert('Error');
		}
	});
}