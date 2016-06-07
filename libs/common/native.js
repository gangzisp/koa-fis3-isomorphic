/**
 * m.xiaodao360.com
 * mobile lib
 * @author yaoyoa
 * @date 2015
 */
//baidu statistics
/*var _hmt = _hmt || [];
(function() {
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?a0c2d815893821a3b69bfa4e694c6a32";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();*/

var XDWM = {};

XDWM.Config = {
	Url: {
		test: {
			server: '',
			host: '',
			domain: 'test.xiaodao360.com',
			trgEvt: 'click'
		},
		product: {
			server: '',
			host: '',
			domain: 'www.xiaodao360.com',
			trgEvt: 'tap'
		},
		local: {
			server: '',
			host: '',
			domain: 'localhost',
			trgEvt: 'click'
		},
		active: 'test',
		qqLogin: '/api/qq/login.php',
		wxRedirect: '/mobile/index/callback/type/weixin/response_type/code/scope/snsapi_userinfo/state/STATE#wechat_redirect',
		download: '/index/android_ios.html?from=h5',
		appLink: ''
	},
	WX: {
		debug: false,
		appId: '',
		timestamp: '',
		nonceStr: '',
		signature: '',
		jsApiList: ''
	},
	UI: {
		dlBnr: true
	}
};
XDWM.State = {
	WX: false,
	QQ: false,
	iPad: false,
	iPhone: false,
	iOS: false,
	android: false,
	hasApp: false,
	iOS9: false
};
for (k in XDWM.Config.Url) {
	var url = XDWM.Config.Url[k];
	if (typeof(url) === 'object' && url.domain == window.location.host) {
		XDWM.Config.Url.active = k;
		break;
	}
}
window.XMUrl = XDWM.Config.Url[XDWM.Config.Url.active];

XDWM.Utils = {
	routeUrl: function(u, nl) {
		if (typeof u == 'undefined') return false;
		nl = typeof nl == 'undefined' ? 0 : nl;
		return XMUrl.server + '/mobile/route/index?nl=' + nl + '&q=' + encodeURIComponent(u);
	},
	genRnd: function() {

	},
	getStatus: function() {
		var ua = navigator.userAgent;
		if (/MicroMessenger/.test(ua)) {
			XDWM.State.WX = true;
		}
		if (/QQ/.test(ua)) {
			XDWM.State.QQ = true;
		}
		if (!!navigator.userAgent.match(/OS 9/ig)) {
			XDWM.State.iOS9 = true;
		}
		if (/iPhone/.test(ua)) {
			XDWM.State.iPhone = true;
			XDWM.State.iOS = true;
		} else if (/iPad/.test(ua)) {
			XDWM.State.iPad = true;
			XDWM.State.iOS = true;
		} else if (/Android/.test(ua)) {
			XDWM.State.android = true;
		}
		XDWM.State.aId = $('.page_ctn').attr('act_id');
		if (typeof XDWM.State.aId == 'undefined') XDWM.State.aId = XMUtl.request('id');
		XDWM.State.aType = $('.page_ctn').attr('act_type');
		if (typeof XDWM.State.aType == 'undefined') XDWM.State.aType = XMUtl.request('type');
		//app 协议url 构建
		XDWM.State.appUrl = encodeURIComponent($('body').attr('data-appurl'));
		if (typeof XDWM.State.appUrl == 'undefined') XDWM.State.appUrl = XMUtl.request('appUrl');
	},
	/*获取 url 中的 query 的值*/
	request: function(query) {
		var svalue = location.search.match(new RegExp("[\?\&]" + query + "=([^\&]*)(\&?)", "i"));
		return svalue ? svalue[1] : '';
	},
	urlDecode: function(str) {
		if (typeof str == 'undefined' || !str) return '';
		var ret = "";
		for (var i = 0; i < str.length; i++) {
			var chr = str.charAt(i);
			if (chr == "+") {
				ret += " ";
			} else if (chr == "%") {
				var asc = str.substring(i + 1, i + 3);
				if (parseInt("0x" + asc) > 0x7f) {
					ret += XDWM.utils.asc2str(parseInt("0x" + asc + str.substring(i + 4, i + 6)));
					i += 5;
				} else {
					ret += XDWM.utils.asc2str(parseInt("0x" + asc));
					i += 2;
				}
			} else {
				ret += chr;
			}
		}
		return ret;
	},
	getLen: function(str) {
		///<summary>获得字符串实际长度，中文2，英文1</summary>
		///<param name="str">要获得长度的字符串</param>
		var realLength = 0,
			len = str.length,
			charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 2;
		}
		return realLength;
	},
	getRelLen: function(str) {
		///<summary>获得字符串实际长度，中文2，英文1</summary>
		///<param name="str">要获得长度的字符串</param>
		var realLength = 0,
			len = str.length,
			charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			realLength += 1;
		}
		return realLength;
	},
	/** 
	 * js截取字符串，中英文都能用 
	 * @param str：需要截取的字符串 
	 * @param len: 需要截取的长度 
	 */
	cutStr: function(str, l) {
		var strLen = 0;
		var len = str.length;
		strCut = new String();
		for (var i = 0; i < len; i++) {
			a = str.charAt(i);
			strLen++;
			if (escape(a).length > 4) {
				//中文字符的长度经编码之后大于4  
				strLen++;
			}
			strCut = strCut.concat(a);
			if (strLen >= l) {
				strCut = strCut.concat("...");
				return strCut;
			}
		}
		//如果给定字符串小于指定长度，则返回源字符串；  
		if (strLen < l) {
			return str;
		}
	},
	asc2str: function(ascasc) {
		return String.fromCharCode(ascasc);
	},
	genId: function(l) {
		l = typeof l == 'undefined' ? 2 : l;
		var S4 = function() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			},
			result = '';
		for (var i = 0; i < l; i++) {
			result += S4();
		}
		return result;
	},
	loadImage: function(url, callback) {
		var img = new Image(); //创建一个Image对象，实现图片的预下载  
		img.src = url;

		if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
			callback.call(img);
			return; // 直接返回，不用再处理onload事件  
		}
		img.onload = function() { //图片下载完毕时异步调用callback函数。  
			callback.call(img); //将回调函数的this替换为Image对象  
		};
	},
	formatTimestamp: function(s, sH) {
		sH = typeof sH == 'undefined' ? '00:00' : sH;
		var time = new Date(s.substr(0, 4), s.substr(5, 2) - 1, s.substr(8, 2), sH.substr(0, 2), sH.substr(3, 2));
		return Math.round(time.getTime() / 1000);
	},
	formatTime: function(s, all) {
		all = typeof all == 'undefined' ? false : all;
		var time = new Date(s * 1000);
		var month = XMUtl.pad(time.getMonth() + 1, 2);
		var date = XMUtl.pad(time.getDate(), 2);
		var hour = XMUtl.pad(time.getHours(), 2);
		var min = XMUtl.pad(time.getMinutes(), 2);
		var sec = XMUtl.pad(time.getSeconds(), 2);
		var result = time.getFullYear() + '-' + month + '-' + date;
		if (all && (hour != 0 || min != 0)) {
			result += ' ' + hour + ':' + min;
		}
		return result;
	},
	formatTS: function(t, p) {
		p = typeof p == 'undefined' ? true : p;
		var time = new Date(t * 1000);
		var result = [time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes()];
		if (p) {
			for (var i = 1; i < result.length; i++) {
				result[i] = XMUtl.pad(result[i], 2);
			}
		}
		return result;
	},
	formatSpokenTime: function(t) {
		var now = parseInt(new Date().getTime() / 1000);
		if (now - t < 60) {
			s = '刚刚';
		} else if (now - t < 3600) {
			s = parseInt((now - t) / 60) + '分钟前';
		} else {
			var now = XMUtl.formatTS(new Date().getTime() / 1000);
			var des = XMUtl.formatTS(t);
			if (now[0] == des[0] && now[1] == des[1]) {
				if (now[2] == des[2]) { //today
					s = (now[3] - des[3]) + '小时前';
				} else if (now[2] - des[2] == 1) {
					s = '昨日 ' + des[3] + ':' + des[4];
				} else if (now[2] - des[2] == 2) {
					s = '前日 ' + des[3] + ':' + des[4];
				} else {
					s = des[0] + '-' + des[1] + '-' + des[2] + ' ' + des[3] + ':' + des[4];
				}
			} else {
				s = des[0] + '-' + des[1] + '-' + des[2] + ' ' + des[3] + ':' + des[4];
			}
		}
		return s;
	},
	WXCfg: function(a, t, s, n, j) {
		//if (typeof wx!='object')return false;
		j = typeof j == 'undefined' ? ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] : j;
		XDWM.Config.WX = {
			debug: false,
			appId: a,
			timestamp: t,
			nonceStr: n,
			signature: s,
			jsApiList: j
		};
		wx.config(XDWM.Config.WX);
	},
	WXShare: function(t, d, l, i, s, c) {
		i = typeof i == 'undefined' ? 'http://www.xiaodao360.com/Public/mobile/images/logo_light.png' : i;
		s = typeof s == 'undefined' ? function() {} : s;
		c = typeof c == 'undefined' ? function() {} : c;
		wx.ready(function() {
			var cfg = {
				title: t,
				desc: d,
				link: l,
				imgUrl: i,
				dataUrl: '',
				type: '',
				success: s,
				cancel: c
			};
			wx.onMenuShareAppMessage(cfg);
			delete cfg.type;
			delete cfg.dataUrl;
			wx.onMenuShareTimeline(cfg);
			wx.onMenuShareQQ(cfg);
			wx.onMenuShareWeibo(cfg);
			wx.onMenuShareQZone(cfg);
		});
	},
	setCookie: function(c_name, value, expiredays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/;domain=." + XMUrl.domain;
	},
	getCookie: function(Name) {
		var search = Name + "=";
		var returnvalue = "";
		if (document.cookie.length > 0) {
			offset = document.cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				end = document.cookie.indexOf(";", offset);
				if (end == -1) end = document.cookie.length;
				returnvalue = (document.cookie.substring(offset, end));
			}
		}
		return returnvalue;
	},
	pad: function() {
		var tbl = [];
		return function(num, n) {
			var len = n - num.toString().length;
			if (len <= 0) return num;
			if (!tbl[len]) tbl[len] = (new Array(len + 1)).join('0');
			return tbl[len] + num;
		}
	}(),
	testApp: function(url) {

		url = typeof url == 'undefined' ? 'xiaodao360://activity/detail/id/6021/type/0' : url;
		var timeout, t = 2000,
			hasApp = true;
		setTimeout(function() {
			if (hasApp) {
				XDWM.State.hasApp = true;
			} else {
				XDWM.State.hasApp = false;
			}
			document.body.removeChild(ifr);
		}, 2000)

		var t1 = Date.now();
		var ifr = document.createElement("iframe");
		ifr.setAttribute('src', url);
		ifr.setAttribute('style', 'display:none');
		document.body.appendChild(ifr);
		timeout = setTimeout(function() {
			var t2 = Date.now();
			if (!t1 || t2 - t1 < t + 100) {
				hasApp = false;
			}
		}, t);
	},
	dlApp: function(e) {
		var self = this,
			t1 = Date.now(),
			t = 600,
			hasApp = true,
			st = XDWM.State,
			appUrl = $('body').attr('data-appurl') || '',
			el = e && e.target || e && e.srcElememt;

		/**
		 * 这里使用data-appurl保存app的uri,否则使用url跳转
		 * @param  {[type]} appUrl [description]
		 * @return {[type]}        [description]
		 */
		if ($(self).attr('class') || $(self).attr('type') === 'button' || el && $(el).attr('type') === 'button') {
			url = appUrl || 'xiaodao360://activity/detail/id/' + XDWM.State.aId + '/type/' + XDWM.State.aType;
			var ifr = document.createElement("iframe");
			ifr.setAttribute('style', 'display:none');
			document.body.appendChild(ifr);
			ifr.setAttribute('src', url);
			if (st.WX || st.QQ) {
				var WXNotice = $('<section class="wx_notice"><p>请点击页面右上角<br/>选择【<b>在Safari中打开</b>】</p></section>');
				$('body').append(WXNotice);
				WXNotice.show();

				if (!st.iOS) WXNotice.find('b').html('在浏览器中打开');

				$('.wx_notice').on(XMUrl.trgEvt, function() {
					$(this).hide();
				});
				return false;
			}
			var timeout = setTimeout(function() {
				var t2 = Date.now();
				if (!t1 || t2 - t1 < t + 100) {
					hasApp = false;
				}
			}, t);
			setTimeout(function() {
				if (!hasApp) {
					location.href = XDWM.Config.Url.download + '&id=' + XDWM.State.aId + '&type=' + XDWM.State.aType + '&appUrl=' + encodeURIComponent($('body').attr('data-appurl'));
				}
				document.body.removeChild(ifr);
			}, 1000);
			return false;
		} else {
			window.location.href = 'http://www.xiaodao360.com/index/android_ios.html?_wv=3';
			return;
		}
	}
};
window.XMUtl = XDWM.Utils;
XDWM.UI = {};
XDWM.UI.init = function() {
	XDWM.UI.showDlBnr();
};
/**
display or hide top download banner
@author yao
@param t[true] true:show,false:hide banner
@param f[false] force to set the banner, rewrite the globe conf & url conf. when banner was displayed， the close method has the highest priority
*/
XDWM.UI.showDlBnr = function(t, f, copywriting) {
	f = typeof f == 'undefined' ? false : f;
	if (typeof t != 'undefined' && t == false) {
		$('.top_download').remove();
		$('body').removeClass('top_event_3');
		return false;
	}
	if (XDWM.Utils.request('inApp') == 1) {
		return false;
	} else {
		if ($('.top_download').length == 0) {
			var str = '<section class="top_download top_event_3_cont border_bottom">' +
				'<img src="' + XMUrl.host + '/Public/mobile/images/app_logo.png"/>' +
				'<b>' + (copywriting || '校导—大学生成长社区') + '</b>' +
				'<a href="' + XDWM.Config.Url.download + '">下载APP</a>' +
				'<del>×</del>' +
				'</section>';
			$('.page_ctn').before(str);
			$('.top_event_3_cont').on(XMUrl.trgEvt, 'a', XMUtl.dlApp);
		}
		$('body').addClass('top_event_3');
	};
};
/**
reset the globe page scale value to fit all devide
@author yao
*/
XDWM.UI.resizeWin = function() {
	var oHtml = document.getElementsByTagName('html')[0];
	var oBody = document.getElementsByTagName('body')[0];
	var winH = document.documentElement.clientWidth;
	var pageWidth = parseInt(oBody.getAttribute('pageWidth'));
	pageWidth = isNaN(pageWidth) ? 360 : pageWidth;
	var w = document.body.clientWidth;
	w = (w >= 960) ? 960 : w;
	var sFontSize = parseInt((w / pageWidth) * 10000 / 100) + '%';;
	oHtml.style.fontSize = sFontSize;
};
/**
show a notice on page buttom
@author yao
@param s msg to show
*/
XDWM.UI.notice = function(s) {
	if ($('.YY_notice').length > 0) {
		$('.YY_notice').remove();
	}
	var o = $('<dialog class="YY_notice">' + s + '</dialog>');
	$('body').append(o);
	setTimeout(function() {
		o.remove();
	}, 3000);
};
/**
show a loader animation on page
@author yao
@param p object. p.mask [true] show a mask to cover the page, p.str[...] text on the animation
*/
XDWM.UI.loader = function(p) {
	var key;
	this.s = {
		mask: true,
		autoOpen: true,
		str: '正在努力加载...'
	};
	this.s = $.extend(this.s, p);
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] == 'string') {
			key = 'str';
		} else if (typeof arguments[i] == 'function') {
			key = 'cb';
		} else if (typeof arguments[i] == 'boolean') {
			key = 't';
		}
		this.s[key] = arguments[i];
	}
	this.s.prefix = 'YY_loader_';
	this.s.dialogId = this.s.prefix + XMUtl.genId();
	if ($('#' + this.s.dialogId).length == 1) {
		$('#' + this.s.dialogId).remove();
	}

	var c = $('<div class="loader_dialog" id="' + this.s.dialogId + '">' + this.s.str + '</div>');

	var pInfo = {
		restrict: true,
		dialogId: this.s.dialogId,
		pack: false,
		closable: true,
		width: '6.25rem',
		height: '6.25rem',
		easyClose: false,
		showClose: false,
		forceCenter: true
	};
	if (typeof this.s.cb != 'undefined') pInfo.close = b;
	if (typeof this.s.str != 'undefined' && this.s.str != '') {
		c.html('<b>' + this.s.str + '</b>');
	}
	if (!this.s.mask) {
		pInfo.restrict = false;
		c.addClass('loader_bg');
	}
	$('body').append(c);
	c.YY_dialog(pInfo);
	this.openDialog = function() {
		$('#' + this.s.dialogId).YY_dialog('open');
	};
	this.open = function() {
		$('#' + this.s.dialogId).YY_dialog('open');
	};
	if (this.s.autoOpen) this.open();
	this.close = function() {
		$('#' + this.s.dialogId).YY_dialog('close');
	};
};
XDWM.UI.alert = function(p) {
	var s = {
		title: '您确定继续操作吗？',
		ok: 'close'
	};
	s.prefix = 'YY_alert';
	s.dialogId = s.prefix;
	if ($('#' + s.dialogId).length == 1) {
		$('#' + s.dialogId).remove();
	}
	if (typeof p == 'object')
		s = $.extend(s, p);
	else if (typeof p == 'string')
		s.title = p;
	var c = $('<div id="' + s.dialogId + '"></div>');

	var pInfo = {
		restrict: true,
		dialogId: s.dialogId,
		pack: false,
		'class': 'alert_dialog',
		closable: true,
		easyClose: false,
		showClose: false,
		forceCenter: true
	};
	if (typeof s.cb != 'undefined') pInfo.close = b;
	if (typeof s.title != 'undefined' && s.title != '') {
		c.html(s.title);
	}
	pInfo.buttons = [];
	if (s.cancel != null) pInfo.buttons.push({
		name: '取消',
		action: 'close'
	});
	pInfo.buttons.push({
		name: '确定',
		class: 'green',
		action: function() {
			if (s.ok != 'close') {
				s.ok();
				$('#YY_alert').YY_dialog('close');
			} else {
				$('#YY_alert').YY_dialog('close');
			}
		}
	});
	$('body').append(c);
	c.YY_dialog(pInfo);

	this.open = function() {
		$('#YY_alert').YY_dialog('open');
	};
	this.open();
	this.close = function() {
		$('#YY_alert').YY_dialog('close');
	};
};
XDWM.UI.wordCount = function(p, t) {
	this.o = p.find('textarea');
	this.p = p;
	this.t = t;
	this.max = parseInt(t.find('b').text());
	var that = this;
	this.count = function() {
		window.clearTimeout(that.autoCount);
		var len = that.o.val().length,
			s;
		var err = false;
		if (that.o.val().length <= that.max) {
			s = '还可以输入<b>' + (that.max - len) + '</b>个字';
		} else {
			s = '已经超出<b>' + (len - that.max) + '</b>个字'
		}
		if (s != t.html()) {
			that.t.html(s);
			if (err) {
				that.p.addClass('error');
			} else {
				that.o.removeClass('error');
			}
		}
		that.autoCount = window.setTimeout(that.count, 300);
	};
	//p.on('keyup', 'textarea', $.proxy(this.count, this)).on('keyup', 'textarea', $.proxy(this.count, this));
	p.on('focus', 'textarea', function() {
		that.autoCount = window.setTimeout(that.count, 300);
	}).on('blur', 'textarea', function() {
		window.clearTimeout(that.autoCount);
	});
};
XDWM.UI.datePicker = null;
XDWM.UI.initDatePicker = function(o) {
	if (o) o.attr('readonly', 'readonly').addClass('XMDateSelector');
	if (XDWM.UI.datePicker == null) {
		XDWM.UI.datePicker = new dateSelector({
			def: '1995-06-15'
		});
	}
};
XDWM.UI.timePicker = null;
//time picker callback buffer
XDWM.UI.timePickerBuffer = [];
XDWM.UI.initTimePicker = function(o, cb) {
	XDWM.UI.timePickerBuffer.push(cb);
	if (o) o.attr('readonly', 'readonly').addClass('XMTimeSelector').attr('timePickerCB', XDWM.UI.timePickerBuffer.length - 1);
	if (XDWM.UI.timePicker == null) {
		XDWM.UI.timePicker = new timeSelector();
	}
};
XDWM.UI.cityPicker = null;
XDWM.UI.cityPickerBuffer = [];
XDWM.UI.initCityPicker = function(o, cb) {
	if (typeof cb != 'undefined') XDWM.UI.cityPickerBuffer.push(cb);
	if (o) o.attr('readonly', 'readonly').addClass('XMCitySelector').attr('cityPickerCB', XDWM.UI.cityPickerBuffer.length - 1);;
	if (XDWM.UI.cityPicker == null) {
		XDWM.UI.cityPicker = new XDWM.School.selCity();
	}
};
XDWM.UI.schoolPicker = null;
XDWM.UI.schoolPickerBuffer = [];
XDWM.UI.initSchoolPicker = function(o, cb) {
	if (typeof cb != 'undefined') XDWM.UI.schoolPickerBuffer.push(cb);
	if (o) o.attr('readonly', 'readonly').addClass('XMSchoolSelector').attr('schoolPickerCB', XDWM.UI.schoolPickerBuffer.length - 1);;
	if (XDWM.UI.schoolPicker == null) {
		XDWM.UI.schoolPicker = new XDWM.School.selSchool();
	}
};
/**
show a single option select sub page
@author yao
@param data array, data to show. [{id: "1", name: "北京市"}]
@param title string, title on the page
@param cb function, trigger when click the option
@param bk function, trigger when close the option sub page
*/
XDWM.UI.selection = function(data, title, cb, bk) {
	var s = '<div class="opt_box"><h3><button type="button" class="back"></button><b>' + (title) + '</b></h3><ul>';
	for (var k in data) {
		var attr = [];
		for (var j in data[k]) {
			attr.push('XMData_' + j + '="' + data[k][j] + '"');
		}
		s += '<li ' + attr.join(' ') + '>' + data[k].name + '</li>';
	}

	s += '</ul></div>';
	var box = $(s);
	$('body').append(box);
	this.open = function() {
		$('.page_ctn').hide();
		box.show()
	};
	box.find('.opt_box li').addClass('border_top');
	this.open();
	$('body').scrollTop(0);
	box.on('click', 'li', cb).on('click', 'h3 button.back', $.proxy(function() {
		box.hide();
		$('.page_ctn').show();
		bk();
	}, this));
	this.close = function() {
		$('.page_ctn').show();
		box.hide();
	};
};

window.XMUI = XDWM.UI;
XDWM.User = {
	//request login
	Login: {
		login: function(cb) {
			var e = typeof event == 'undefined' ? window.event : event;
			var o = $('.XDWM_login_dialog'),
				btn = o.find('.form button');
			btn.html('正在登录').addClass('loading').prop('disabled', true);
			data = {
				username: o.find('input').eq(0).val(),
				password: md5(o.find('input').eq(1).val())
			}
			$.ajax({
				url: XMUrl.server + '/mobile/route/login',
				data: data,
				type: 'post',
				hrFields: {
					withCredentials: true
				},
				crossDomain: true,
				dataType: 'json',
				beforeSend: function(xhr, settings) {
					xhr.withCredentials = true;
				},
				success: function(resp) {
					btn.removeClass('loading').html('立即登录');
					if (resp.status == 1) {
						btn.html('登录成功');
						if (cb) cb();
						window.setTimeout(function() {
							btn.html('立即登录').prop('disabled', false);
							o.YY_dialog('close');
						}, 500);
					} else {
						btn.prop('disabled', false);
						if (resp.status == '-2') {
							var msg = '密码错误',
								style = 'error';
							o.find('input').eq(1).attr('class', style).siblings('b').html(msg).parent().attr('class', style);
						} else if (resp.status == '-1') {
							var msg = '帐号不存在',
								style = 'error';
							o.find('input').eq(0).attr('class', style).siblings('b').html(msg).parent().attr('class', style);
						}
					}
				}
			});
			return false;
		},
		//show login dialog
		show: function(p) {
			this.s = {
				redirectUrl: window.location.href,
				cb: function() {}
			};
			this.s = $.extend(this.s, p);
			this.s.dialogId = 'XDWM_login_dialog';
			var o = $('.' + this.s.dialogId);
			if (o.length == 0) {
				var lstr = '<div class="' + this.s.dialogId + '" id="' + this.s.dialogId + '"><del></del>' +
					'<h3 class="border_bottom">登录</h3>' +
					'<section class="form">' +
					'<p><input type="tel" placeholder="请输入手机号" regtype="mobile"/><b></b></p>' +
					'<p><input type="password" placeholder="请输入密码" regtype="notNull"/><b></b></p>' +
					'<button type="button">立即登录</button>' +
					'</section>' +
					'<section class="link">' +
					'<h4 class="border_bottom">其他方式直接登录</h4>' +
					'<a href="" class="wx"></a><a href="" class="qq"></a>' +
					'</section></div>';
				$('body').append(lstr);
				o = $('.' + this.s.dialogId);
				var cb = this.s.cb;
				o.find('.form').YY_vali({
					dialogId: this.s.dialogId,
					submitObj: o.find('button'),
					autoSubmit: false,
					submitType: 'manual',
					onSubmit: function() {
						XMUser.Login.login(cb);
					}
				});
				o.find('del').on('click', function() {
					o.YY_dialog('close');
				});
				var pInfo = {
					restrict: true,
					autoOpen: true,
					dialogId: this.s.dialogId,
					pack: false,
					'class': 'login_dialog',
					closable: true,
					easyClose: false,
					showClose: false,
					forceCenter: true
				};
				o.YY_dialog(pInfo);
				XMUtl.setCookie('get_url', this.s.redirectUrl); //define login success redirect url

				var WXCfg = XDWM.Config.WX;
				if (XDWM.State.WX) {
					if (WXCfg.appId != '') {
						o.find('.link a.wx').show().attr('href', 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WXCfg.appId + '&redirect_uri=' + encodeURIComponent('http://www.xiaodao360.com' + XDWM.Config.Url.wxRedirect) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect');
					}
				} else {
					o.find('.link a.wx').hide();
				}
				o.find('.link a.qq').attr('href', XMUrl.server + XDWM.Config.Url.qqLogin);
			} else {
				o.find('input').val('');
				o.find('.error').removeClass('error');
				o.find('b').html('');
				o.find('[vali]').removeAttr('vali');
				o.YY_dialog('open');
			}
		}
	}
};
window.XMUser = XDWM.User;

XDWM.NAPI = {
	Bridge: null,
	buffer: []
};
XDWM.NAPI.init = function() {};
XDWM.NAPI.send = function(m, p, c) {
	if (XDWM.NAPI.Bridge != null) {
		XDWM.NAPI.sendToNative([m, p, c]);
	} else {
		XDWM.NAPI.buffer.push([m, p, c]);
		console.log('set buffer');
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			if (!WebViewJavascriptBridge._messageHandler) {
				WebViewJavascriptBridge.init(function(data, responseCallback) {
					responseCallback(data);
					console.log('init');
				});
			}
			XDWM.NAPI.Bridge = WebViewJavascriptBridge;
			XDWM.NAPI.buffer.forEach(XDWM.NAPI.sendToNative);
			XDWM.NAPI.buffer = [];
		}, false)
	}
};
XDWM.NAPI.sendToNative = function(mpc) {
	console.log('run', mpc);
	if (typeof mpc[0] == 'undefined' || mpc[0] == '') return false;
	var p = typeof mpc[1] != 'undefined' ? mpc[1] : '';
	var c = typeof mpc[2] != 'undefined' ? mpc[2] : function() {};
	XDWM.NAPI.Bridge.callHandler(mpc[0], p, c);
};
XDWM.NAPI.share = function(d) {
	if (XDWM.NAPI.Bridge != null) {
		XDWM.NAPI.Bridge.registerHandler('getShareInfo', function(data, responseCallback) {
			responseCallback(d);
		});
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			WebViewJavascriptBridge.init(function(data, responseCallback) {
				responseCallback(data);
			});
			XDWM.NAPI.Bridge = WebViewJavascriptBridge;
			XDWM.NAPI.share(d);
		}, false);
	}
};
XDWM.NAPI.regHandler = function(f, c) {
	if (XDWM.NAPI.Bridge != null) {
		XDWM.NAPI.Bridge.registerHandler(f, function(data, responseCallback) {
			c();
		});
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			console.log('reg init');
			XDWM.NAPI.Bridge = WebViewJavascriptBridge;
			XDWM.NAPI.regHandler(f, c);
		}, false);
	}
};
//全局初始化方法
XDWM.init = function() {
	//scale page
	XMUI.resizeWin();
	window.onresize = XMUI.resizeWin;

	XMUtl.getStatus();
	XDWM.UI.init();
	XDWM.NAPI.init();
};


//全局初始化
XDWM.init();

module.exports = XDWM;