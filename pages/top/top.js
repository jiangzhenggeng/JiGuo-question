// pages/top/top.js
import Const from '../../common/const'
import Session from '../../common/session'
import Request from '../../common/request'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		topList: [],
		userInfo: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const self = this
		this.setData({
			userInfo: Session.get(Const.USER_INFO_KEY),
			mername: options.name
		})
		wx.setNavigationBarTitle({
			title: self.data.mername
		})
		Request({
			url: Const.GET_TOP_INFO,
			data: {
				id: options.id,
			},
			success(replayData) {
				if (replayData.resultCode == 0) {
					self.setData({
						topList: replayData.result,
						init: true
					})
				} else {
					wx.showToast({
						title: '获取失败',
						image: Const.ICON_TIPAS_IMAGE,
						duration: Const.ICON_SHOW_DURATION
					})
				}
			},
			fail() {
				wx.showToast({
					title: '获取失败',
					image: Const.ICON_TIPAS_IMAGE,
					duration: Const.ICON_SHOW_DURATION
				})
			}
		})
	}
})