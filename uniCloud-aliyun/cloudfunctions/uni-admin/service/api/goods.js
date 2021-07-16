const {
	Service
} = require('uni-cloud-router')

const {
	goodsResource
} = require('../../resource/api/goods')

const {
	getCardGoodsList
} = require('../../request')

const { asyncRequest, noVirtual } = require('../util')


module.exports = class GoodsService extends Service {
	constructor(ctx) {
		super(ctx)
		this.collection = this.db.collection('goods')
		this.brandCollection = this.db.collection('brand')
	}

	async recommand(data) {
		const { platform } = data;
		const option = noVirtual(platform) ? { is_virtual: 2 } : {}
		// const option = platform == "ios" ? { } : {}
		const {
			data: goodsList
		} = await this.collection.where({
			...option,
			status: 1
		}).get()
		// for (let i in goodsList) {
		// 	goodsList[i] = goodsResource(goodsList[i])
		// }

		const list = await Promise.all(goodsList.map(async item => {
			const { brand_code } = item;
			// 应该联表
			const {
				data: brandDetail
			} = await this.brandCollection.where({
				code: brand_code
			}).orderBy("sort", "desc").limit(1).get()
			return {
				...goodsResource(item),
				bg_card: brandDetail[0] ? brandDetail[0].bg_card : ""
			}
		}))

		console.log(JSON.stringify(list))

		return list
	}

	async detail(gcode) {
		const {
			data
		} = await this.collection.where({
			code: gcode
		}).orderBy("sort", "desc").limit(1).get()
		const goodsDetail = {
			...data[0],
			use_rules: ["1.购买后在【我的】-【我的订单】查看优惠券码；", "2.如有优惠券兑换或使用问题，可在【我的】联系客服处理；"]
		}
		return goodsResource(goodsDetail)
	}

	async init() {
		const res = await getCardGoodsList();
		const list = await Promise.all(res.data.data.map(async (item) => {
			const { thumb } = item;
			if (!thumb) {
				return {
					...item,
					created_at: new Date().getTime(),
					updated_at: new Date().getTime(),
				};
			}
			const body = await asyncRequest(`https://cdn.letwind.com${thumb}`)
			const thumbList = thumb.split('/')
			const result = await uniCloud.uploadFile({
				cloudPath: thumbList[thumbList.length - 1],
				fileContent: body
			});
			console.log(result)
			return {
				...item,
				thumb: result.fileID,
				created_at: new Date().getTime(),
				updated_at: new Date().getTime(),
			};
		}));

		console.log(JSON.stringify(list))
		const removeResult = await this.collection.remove();
		const result = await this.collection.add(list);

		return result
	}
}
