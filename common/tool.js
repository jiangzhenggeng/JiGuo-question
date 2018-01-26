var md5 = require('./md5');

/*

 */
function designation(groupid) {
	if (groupid == 1) {
		return {
			name: '玩家',
			style: 'player'
		}
	} else if (groupid == 2) {
		return {
			name: '体验师',
			style: 'tys'
		}
	} else if (groupid == 3) {
		return {
			name: '首席体验师',
			style: 'sxtys'
		}
	} else if (groupid == 4) {
		return {
			name: '视频体验师',
			style: 'sptys'
		}
	} else if (groupid == 5) {
		return {
			name: '见习体验师',
			style: 'jxtys'
		}
	} else {
		return {
			name: '',
			style: ''
		}
	}
}


/**
 * 拓展对象
 */
function extend(target) {
	var sources = Array.prototype.slice.call(arguments, 1);
	if (Object.prototype.toString.call(target) != '[object Object]') {
		target = {}
	}
	for (var i = 0; i < sources.length; i += 1) {
		var source = sources[i];
		for (var key in source) {
			if (source.hasOwnProperty(key)) {
				if (Object.prototype.toString.call(target[key]) == '[object Object]') {
					target[key] = extend(target[key], source[key]);
				} else {
					target[key] = source[key];
				}
			}
		}
	}

	return target;
};

/**
 * 工具类
 */
var TS = Object.prototype.toString;
var tool = {
	isArray: function (a) {
		if (!Array.isArray) {
			return TS.call(a) === '[object Array]';
		} else {
			return Array.isArray(a);
		}
	},
	isString: function (a) {
		return TS.call(a) === '[object String]';
	},
	isNumber: function (a) {
		return TS.call(a) === '[object Number]';
	},
	isFunction: function (a) {
		return TS.call(a) === '[object Function]';
	},
	isNull: function (a) {
		return TS.call(a) === '[object Null]';
	},
	isRegExp: function (a) {
		return TS.call(a) === '[object RegExp]';
	},
	has: function (a, b) {
		if (TS.call(a) === '[object Array]') {
			for (var i in a) {
				if (i == b) {
					return true;
				}
			}
			return false;
		}
		if (TS.call(a) === '[object Object]') {
			return b in a;
		}
	},
	getLength: function (a) {
		if (this.isArray(a)) {
			return a.length;
		}
		var Length = 0;
		for (var item in a) {
			Length++;
		}
		return Length;
	},
	toArray: function (a) {
		if (this.isArray(a)) {
			return a;
		}
		var temp = [];
		for (var item in a) {
			temp.push(a[item]);
		}
		return temp;
	},
	randomStr: function () {
		return String(Math.random()).replace('.', '') + String((new Date()).getTime());
	}
};


//加密类
function encryptionParams(paramse, debug = false) {
	paramse = paramse || {};
	var key = Object.keys(paramse).sort();
	var c_array = [];
	key.forEach((item) => {
		c_array.push(item + paramse[item]);
	});
	var key_string = c_array.join('');
	var $secret = 'jiguozhidx2015';
	return debug ? $secret + key_string : md5($secret + key_string);
}

function _t(intDiff) {
	var day = 0,
		hour = 0,
		minute = 0,
		second = 0;//时间默认值

	if (intDiff > 0) {
		day = Math.floor(intDiff / (60 * 60 * 24));
		hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
		minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
		second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
	}
	if (minute <= 9) minute = '' + minute;
	if (second <= 9) second = '' + second;
	return (day > 0 ? day + '天' : '') + (hour > 0 ? hour + '时' : '') + minute + '分' + second + '秒后开始';
}

function getCurrentPageUrl(options, absolute = true) {
	var pages = getCurrentPages()    //获取加载的页面
	var currentPage = pages[pages.length - 1]    //获取当前页面的对象
	var url = currentPage.route    //当前页面url
	var path = url
	if (absolute) {
		path = absolute && url.substr(0, 1) != '/' ? '/' + url : url
	}
	if (options && currentPage.options) {
		var param = ''
		for (var i in currentPage.options) {
			param += (param ? '&' : '') + i + '=' + encodeURIComponent(currentPage.options[i])
		}
		path += param ? '?' + param : ''
	}
	return path
}


function showToast(text) {
	var showToast = true
	this.setData({
		showToast: true,
		toastText: text
	});
	showToast && setTimeout(() => {
		this.setData({
			showToast: false
		});
	}, 2000)
}

module.exports = extend({
	designation: designation,
	extend: extend,
	encryptionParams: encryptionParams,
	formatTime: _t,
	getCurrentPageUrl: getCurrentPageUrl,
	showToast: showToast
}, tool);










