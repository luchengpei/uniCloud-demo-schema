
const {
	Service
} = require('uni-cloud-router')
const {
	getCardDataOverview,
	updateCardSetting,
	getCardSetting,
	getUserList
} = require('../request')

module.exports = class homeService extends Service {
	constructor(ctx) {
		super(ctx)
		this.collection = this.db.collection('goods')
	}

	async getOverview() {
		const res = await getCardDataOverview()
		return res
	}

	async setConfig(data) {

		console.log(JSON.stringify(data))

		const db = this.db
		const configRes = await db.collection('config').get();
		console.log(JSON.stringify(configRes))
		if (!configRes.data.length) {
			const addRes = db.collection('config').add(data)
			console.log(JSON.stringify(addRes))
		} else {
			const res = await db.collection('config')
				.doc(configRes.data[0]._id)
				.update(data)
			console.log(JSON.stringify(res))
		}

		const updateRes = await updateCardSetting(data)
		console.log(JSON.stringify(updateRes))
		return updateRes.data
	}

	async getConfig(data) {
		const res = await getCardSetting(data)
		console.log(JSON.stringify(res))
		return res.data
	}

	async fetchUserList(data) {
		const res = await getUserList(data)
		console.log(JSON.stringify(res))
		return res.data
	}

}