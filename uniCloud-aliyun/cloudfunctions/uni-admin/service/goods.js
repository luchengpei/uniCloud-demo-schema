const {
	Service
} = require('uni-cloud-router')

module.exports = class GoodsService extends Service {
	constructor(ctx) {
		super(ctx)
		this.collection = this.db.collection('goods')
	}
	
	async list() {
		const {
			data: goodsList
		} = await this.collection.get()
		return goodsList
	}
}
