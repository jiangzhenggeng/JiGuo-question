var tool = require('./tool');
var Const = require('./const');

var noop = () => {
};

function request(options) {
	if (typeof options !== 'object') {
		var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
		throw new Error(message);
	}

	var requireLogin = options.login;
	var success = options.success || noop;
	var fail = options.fail || noop;
	var complete = options.complete || noop;
	options.data = options.data || {};
	options.data = tool.extend({
		platform: 'nm'
	}, options.data);
	options.method = options.method || 'GET'
	options.fail = fail;
	options.complete = complete

	options.showNavigationBarLoading = ('showNavigationBarLoading' in options)
		? options.showNavigationBarLoading
		: true

	options.header = options.method != 'GET' ? {
		"Content-Type": "application/x-www-form-urlencoded"
	} : {};

	// 成功回调
	var callSuccess = function () {
		success.apply(null, arguments);
		complete.apply(null, arguments);
	};

	// 失败回调
	var callFail = function (error) {
		fail.call(null, error);
		complete.call(null, error);
	};

	if (requireLogin && options.loginCallBack) {
		options.loginCallBack(doRequest, callFail);
	} else {
		doRequest();
	}

	// 实际进行请求的方法
	function doRequest() {
		options.data.sign = tool.encryptionParams(options.data, false);
		// console.log(options.data);

		options.showNavigationBarLoading &&
		wx.showNavigationBarLoading()

		wx.request({
			url: options.url,
			data: options.data,
			method: options.method,
			header: options.header,
			success: function (result) {
				if (options.noMessage) return;

				if (result.statusCode == 200 && result.data) {
					var data, replayData;
					if (Object.prototype.toString.call(result.data) == '[object String]') {
						data = result.data.replace(/^\s+|\s+$/, '');
						if (
							data.substr(0, 1) != '[' || data.substr(0, 1) != '{' ||
							data.substr(data.length, -1) != ']' || data.substr(data.length, -1) != '}'
						) {
							wx.showToast({
								title: '获取数据失败',
								image: Const.ICON_TIPAS_IMAGE,
								duration: Const.ICON_SHOW_DURATION
							});
						}
						replayData = JSON.parse(data);
					} else {
						replayData = result.data;
					}
					// console.log('JS:'+options.data.sign);
					// console.log('PP:'+replayData.result.sign);

					callSuccess.call(null, replayData);
				} else if (result.data) {
					options.fail(result.data);
					wx.showToast({
						title: '获取数据格式错误',
						image: Const.ICON_TIPAS_IMAGE,
						duration: Const.ICON_SHOW_DURATION
					});
				} else {
					options.fail(result);
					wx.showToast({
						title: '请求失败',
						image: Const.ICON_TIPAS_IMAGE,
						duration: Const.ICON_SHOW_DURATION
					});
				}
			},
			fail: callFail,
			complete() {
				options.showNavigationBarLoading &&
				wx.hideNavigationBarLoading()
				noop(...arguments)
			},
		});
	};

};

module.exports = request;