import Login from './common/login'
import Const from './common/const'
import io from './common/socket.io'

App({
	onLaunch(options) {
		const socket = io("wss://dev.jiguo.com")
		socket.on('connect', () => {
			this.socket = socket
		})
	},
	onShow(options) {
		if (parseInt(wx.getSystemInfoSync().SDKVersion.replace(/\./g, '')) < 190) {
			wx.showModal({
				showCancel: false,
				content: '您的微信版本过低，可能无法正常使用本小程序，建议将微信更新至最新版本',
				confirmText: '确定',
				complete(res) {
					if (res.confirm) {
						wx.navigateBack()
					}
				}
			})
			return
		}

		Login({
			success(userInfo) {

			},
			fail(err) {
				wx.showToast({
					title: '登录失败',
					image: Const.ICON_TIPAS_IMAGE,
					duration: Const.ICON_SHOW_DURATION
				})
			}
		})
	}
})