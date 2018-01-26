var Session = require('./session');
var Const = require('./const');
var tool = require('./tool');

function doLogin(options) {

	wx.login({
		success(loginResult) {
			let loginCode = loginResult.code;
			wx.getUserInfo({
				withCredentials: true,
				success(userResult) {
					let data = {
						code: loginCode,
						encryptedData: userResult.encryptedData,
						iv: userResult.iv
					};
					data.sign = tool.encryptionParams(data);

					wx.showLoading({
						title: '登录中'
					})

					wx.request({
						url: Const.GET_USER_INFO,
						data: data,
						success(result) {
							wx.hideLoading()
							if (result.statusCode == 200 && result.data) {
								var data, replayData;
								if (Object.prototype.toString.call(result.data) == '[object String]') {
									data = result.data.replace(/^\s+|\s+$/, '');
									if (
										data.substr(0, 1) != '[' || data.substr(0, 1) != '{' ||
										data.substr(data.length, -1) != ']' || data.substr(data.length, -1) != '}'
									) {
										wx.showToast({
											title: replayData.errorMsg || '登录失败',
											image: Const.ICON_TIPAS_IMAGE,
											duration: Const.ICON_SHOW_DURATION
										});
									}
									replayData = JSON.parse(data);
								} else {
									replayData = result.data;
								}
								if (replayData.resultCode == 0) {

									var userInfo = replayData.result;

									Session.set(Const.USER_INFO_KEY, userInfo);
									options.success(userInfo);
									return;
								} else {
									wx.showToast({
										title: replayData.errorMsg || '登录失败',
										image: Const.ICON_TIPAS_IMAGE,
										duration: Const.ICON_SHOW_DURATION
									});
								}
							}
							options.fail(result);
						},
						fail (loginResponseError) {
							options.fail(loginResponseError);
						},
					});

				},
				fail (userError) {
					wx.openSetting({
						success: function (data) {
							if (data && data.authSetting["scope.userInfo"] == true) {
								doLogin(options);
							} else {
								options.fail(userError);
							}
						},
						fail: function (res) {
							options.fail(userError);
						}
					});
				},
			});
		},
		fail(loginError) {
			options.fail(loginError);
		},
	});

}


function login(options) {

	var userInfo = Session.get(Const.USER_INFO_KEY);

	options.fail = options.fail || function () {
		wx.showToast({
			title: '登录失败',
			image: Const.ICON_TIPAS_IMAGE,
			duration: Const.ICON_SHOW_DURATION
		});
	};

	if (userInfo.uid) {
		wx.checkSession({
			success: function () {
				options.success(userInfo);
			},
			fail: function () {
				Session.clear();
				doLogin(options);
			},
		});
	} else {
		doLogin(options);
	}
};


module.exports = login;