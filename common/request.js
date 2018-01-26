var login = require('./login');
var request2 = require('./request2');


function request(options) {
	if (options.login) {
		options.loginCallBack = function (doRequest, callFail) {
			login({success: doRequest, fail: callFail});
		}
	}
	request2(options)
};

module.exports = request;