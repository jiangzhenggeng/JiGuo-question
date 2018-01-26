var host_v = 'https://wx.jiguo.com/wxcode/';

module.exports = {

	//获取用户信息
	GET_USER_INFO: host_v + 'answer/UserAuth',
	//提交答案
	SUBMIT_QUESTION_ANSWER: host_v + 'answer/answer',
	// ?id=8
	sdsd: host_v + 'answer/GetCate',
	//提示图标
	ICON_TIPAS_IMAGE: '/images/icon_tips.png',
	//错误图标
	ICON_ERROR_IMAGE: '/images/icon_tips.png',
	//提示时间
	ICON_SHOW_DURATION: 1500,
	USER_INFO_KEY: 'user_info_key',
//获取排行榜信息
	GET_TOP_INFO: host_v + 'answer/GetAnswerUserList',
}



