export default {
	data: {
		countdownTime: 5,
	},
	countdownRun(e) {

		let setData = {}
		if (!this.__first_run_countdown__) {
			setData.totalTime = this.data.countdownTime
			setData.countdownTime = this.data.countdownTime
		} else {
			setData.countdownTime = this.data.countdownTime - 1
		}
		this.__first_run_countdown__ = true

		this.setData(setData)

		this._countdownRun &&
		this._countdownRun(e)
	},
	countdownEnd(e) {
		this.setData({
			countdownTime: 0
		})
		this._countdownEnd &&
		this._countdownEnd(e)
	}
}
