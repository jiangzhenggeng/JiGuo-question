import Extend from '../../common/extend'
import Const from '../../common/const'
import Request from '../../common/request'
import Session from '../../common/session'
import Countdown from '../index-components/countdown/index'

// var testQuestion = {
// 	"id": 19,
// 	"desc": ["AAAAA", "BBBBBB", "CCCCC", "DDDDD"],
// 	"title": "新增题目新增题目2222",
// 	"answer": "0",
// 	"cid": "2",
// 	"start_time": 1516791475,
// 	"end_time": 1516791480,
// 	"is_last": 1
// }

let app = getApp()
let pageMarginObject = Extend({
	data: {
		questionArray: [],
		countdownShowStatusChange: true
	},
	onLoad(param) {
		this.data.id = param.id
		this.data.name = param.name || ''
	},
	onShow() {
		let self = this
		self.socket = app.socket
		if (!self.socket || !self.socket.on) {
			setTimeout(() => {
				self.onShow()
			}, 30)
			return
		}
		self.setData({
			userInfo: Session.get(Const.USER_INFO_KEY)
		})
		Request({
			url: Const.sdsd,
			data: {
				id: self.data.id
			},
			success(replayData) {
				self.socket.on('get_question', (question) => {
					let _question = JSON.parse(question)
					self.responsQuestion(_question)
				})
				self.data.name = replayData.result.title || ''
				self.setData({
					init: true,
					isStart: replayData.result.is_start == 1,
					result: replayData.result || {}
				})

			}
		})
	},
	onReady() {
		this['dialog-toast'] = this.selectComponent('#dialog-toast').position('top')
	},
	responsQuestion(question) {
		let questionArray = this.data.questionArray
		let hasQuestion = false

		delete question.errorIndex
		delete question.rightIndex
		delete question.selectAnswer

		this.data.questionArray.forEach((item) => {
			if (item.id == question.id) {
				hasQuestion = true
			}
		})
		if (hasQuestion) {
			return
		}
		questionArray.push(question)

		let currentQuestion = questionArray[questionArray.length - 1]
		let time = currentQuestion.end_time - currentQuestion.start_time
		this.setData({
			init: true,
			isStart: true,
			questionArray,
			currentQuestion,
			lock: false,
			countdownTime: time < 5 ? 5 : (time >= 30 ? 30 : time)
		})
	},
	selectQuestionAnswer(e) {

		let self = this
		let index = e.currentTarget.dataset.index
		let currentQuestion = this.data.currentQuestion
		let userInfo = this.data.userInfo

		if (
			this.data.lock ||
			currentQuestion.countdownIsEnd ||
			!userInfo.uid
		) {
			return
		}


		wx.showLoading({
			title: '提交中',
			mask: true
		})

		if (currentQuestion.answer == index) {
			currentQuestion.rightIndex = parseInt(index)
		} else {
			currentQuestion.errorIndex = parseInt(index)
		}

		currentQuestion._index_ = parseInt(index)
		currentQuestion._showAnswer_ = false
		currentQuestion.selectAnswer = true

		this.setData({
			lock: true,
			currentQuestion
		})

		Request({
			url: Const.SUBMIT_QUESTION_ANSWER,
			data: {
				uid: userInfo.uid,
				aid: currentQuestion.id,
				answer: index
			},
			success(replayData) {
				wx.hideLoading()

				if (replayData.resultCode == 0) {
					self['dialog-toast'].message('提交成功').show()
				} else {
					self['dialog-toast'].message(replayData.errorMsg || '请重新提交').show()
				}
			},
			fail() {
				wx.hideLoading()
				self['dialog-toast'].message('提交失败，请重新提交').show()
			}
		})
	},
	_countdownEnd() {
		let currentQuestion = this.data.currentQuestion
		currentQuestion.countdownIsEnd = true
		currentQuestion._showAnswer_ = true
		let is_last = currentQuestion.is_last == 1
		this.setData({
			currentQuestion,
			countdownShowStatusChange: false,
		}, () => {
			if (is_last) {
				setTimeout(() => {
					this.setData({
						isStart: !is_last,
						isEnd: is_last
					})
					setTimeout(() => {
						wx.redirectTo({
							url: '/pages/top/top?id=' + this.data.id + '&name=' + this.data.name
						})
					}, 1000)
				}, 3000)
			} else {
				this.setData({
					countdownShowStatusChange: true
				})
			}
		})
	},

	//转发
	onShareAppMessage() {
		return {
			title: '极果头脑大会',
			path: 'pages/index/index?id=' + this.data.id,
			imageUrl: 'http://s1.jiguo.com/7aa58226-3eee-44bc-b041-105de32ef7b9'
		}
	},
}, Countdown)

Page(pageMarginObject)

