Component({
	properties: {
		endtime: {
			type: String
		},
		format: {
			type: String,
			value: '%dd天%hh小时%ii分%ss秒'
		},
		key: {
			type: String,
			value: ''
		},
		interval: {
			type: Number,
			value: 1000
		},
		formatType: {
			type: Number,
			value: 1
		},
		return:{
			type: Boolean,
			value: true
		}
	},
	relations: {
		'../countdown-group/index': {
			type: 'ancestor'
		}
	},
	methods: {
		run() {
			var newTime = new Date().getTime()
			var endTime = this._parseTime()

			var timeNumber = Math.floor((endTime - newTime) / 1000)
			var _timeNumber = timeNumber >= 0 ? timeNumber : 0

			let countdownTime = this._formatTime(_timeNumber)
			this.setData({
				countdownTime
			})

			let rData = {
				key: this.data.key,
				endTime,
				countdownTime,
				format: this.changeFormat,
				time: timeNumber,
				_time: _timeNumber,
				run: true,
				end: false
			}
			if (timeNumber >= 0) {
				rData.run = true
				rData.end = false
				this.triggerEvent('run', rData)
				return true
			}else{
				rData.run = false
				rData.end = true
				this.triggerEvent('end', rData)
				return false
			}
		},

		_parseTime() {
			if (this._endtime) {
				return this._endtime
			}
			let endtime = this.data.endtime
			let _end = new Date().getTime()
			let newTime = _end

			if (endtime.indexOf(' ') > -1) {
				_end = new Date(endtime).getTime()
			} else if (endtime.length <= 9) {
				_end = newTime + endtime * 1000
			} else {
				_end = endtime
			}
			this._endtime = _end
			return this._endtime
		},
		_formatTime(intDiff) {
			var day = 0
			var hour = 0
			var minute = 0
			var second = 0

			if (intDiff >= 0) {
				day = Math.floor(intDiff / (60 * 60 * 24))
				hour = Math.floor(intDiff / (60 * 60)) - (day * 24)
				minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60)
				second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
			}

			let changeFormat = this.data.format

			if (this.data.formatType == 1) {
				if (day > 0) {
					changeFormat = '%dd天后'
				} else if (hour > 0) {
					changeFormat = '%hh小时后'
				} else if (intDiff > 180) {
					changeFormat = '%ii分钟后'
				} else {
					changeFormat = '%ss秒后'
					second = intDiff
				}
			} else if (this.data.formatType == 2) {
				if (day > 0) {
					changeFormat = '%dd天%hh小时%ii分%ss秒'
				} else if (hour > 0) {
					changeFormat = '%hh小时%ii分%ss秒'
				} else if (minute > 0) {
					changeFormat = '%ii分%ss秒'
				} else {
					changeFormat = '%ss秒'
				}
			}

			this.changeFormat = changeFormat

			return this.changeFormat
				.replace('%dd', day)
				.replace('%hh', hour)
				.replace('%ii', minute)
				.replace('%ss', second)
		}
	}
})