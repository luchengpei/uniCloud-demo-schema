const {
	Service
} = require('uni-cloud-router')

const {
	goodsResource
} = require('../../resource/api/goods')

const {
	getCardOrderList
} = require('../../request')

module.exports = class OrderService extends Service {
	constructor(ctx) {
		super(ctx)
		this.goodsCollection = this.db.collection('goods')
		this.brandCollection = this.db.collection('brand')
	}
	
	async sku(gcode) {
		const {
			data: goodsInfo
		} = await this.goodsCollection.where({
			code: gcode
		}).orderBy("sort", "desc").limit(1).get()
		var goods = goodsResource(goodsInfo[0])
		const {
			data: brandInfo
		} = await this.brandCollection.where({
			code: goods.brand_code
		}).limit(1).get()
		var brand = brandInfo[0]
		return {
			brand,
			goods,
		}
	}
	
	async confirm(gcode, num) {
		const {
			data: goodsInfo
		} = await this.goodsCollection.where({
			code: gcode
		}).orderBy("sort", "desc").limit(1).get()
		var goods = goodsInfo[0]
		return {
			brand,
			goods,
		}
	}

	async orderList(data) {
		const res = await getCardOrderList(data);

		console.log('getCardOrderList',res)

		const list = res.data.data.list;
		const goodsCollection = this.goodsCollection;

		const returnList = await Promise.all(list.map(async item => {
			const { code } = item.goods || {};

			console.log('code',code)

			if(!code) {
				return item
			}

			const {
				data: goodsInfo
			} = await goodsCollection.where({
				code: code
			}).orderBy("sort", "desc").limit(1).get()

			const goods = goodsInfo[0] ? goodsInfo[0] : item.goods 

			return {
				...item,
				goods
			}
		}))

		return {
			...res.data.data,
			list: returnList
		}
	}
}
