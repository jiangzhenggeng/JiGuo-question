Component({
	properties: {
		interval: {
			type: Number,
			value: 1000
		}
	},
	relations: {
		'../countdown/index': {
			type: 'descendant',
			linked(target) {
				if (!this.countdownArray) {
					this.countdownArray = []
				}
				this.countdownArray.push(target)
				this._runingLoop()
				this.startAllBack()
			},
			linkChanged() {
				this.countdownArray = this.getRelationNodes('../countdown/index')
			},
			unlinked() {
				this.countdownArray = this.getRelationNodes('../countdown/index')
				if (!this.countdownArray.length) {
					this.stopAllBack()
				}
			}
		}
	},
	detached() {
		this.countdownGroupRunStatus &&
		clearTimeout(this.countdownGroupRunStatus)
		this.countdownGroupRunStatus = false
	},
	methods: {
		startAllBack() {
			if (this.countdownGroupRunStatus) return
			this.countdownGroupRunStatus = this._runingAllCountdown()
		},
		stopAllBack() {
			this.countdownGroupRunStatus &&
			clearTimeout(this.countdownGroupRunStatus)
			this.countdownGroupRunStatus = false
		},
		_runingAllCountdown() {
			var setTimeoutId = setTimeout(() => {
				this._runingLoop()
				this._runingAllCountdown()
			}, this.data.interval)
			return setTimeoutId
		},
		_runingLoop() {
			this.countdownArray.forEach((countdown, index) => {
				if (!countdown.run.call(countdown)) {
					this.countdownArray.splice(index, 1)
				}
			})
		}
	}
})