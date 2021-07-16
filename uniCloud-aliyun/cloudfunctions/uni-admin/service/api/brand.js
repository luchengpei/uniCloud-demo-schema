const {
	Service
} = require('uni-cloud-router')

const {
	goodsResource
} = require('../../resource/api/goods')

const {
	getCardBrandList
} = require('../../request')

const { asyncRequest, noVirtual } = require('../util')


const dealPic = async url => {
	if (!url) {
		return ""
	}
	const body = await asyncRequest(`https://cdn.letwind.com${url}`)
	const urlList = url.split('/')
	const result = await uniCloud.uploadFile({
		cloudPath: urlList[urlList.length - 1],
		fileContent: body
	});
	console.log(result.fileID)
	return result.fileID
}

module.exports = class BrandService extends Service {
	constructor(ctx) {
		super(ctx)
		this.collection = this.db.collection('brand')
		this.goodsCollection = this.db.collection('goods')
	}

	async hot(data) {
		const { platform } = data;
		const option = noVirtual(platform) ? { is_virtual: 2 } : {}
		// const option = platform == "ios" ? {  } : {}
		const {
			data: brandList
		} = await this.collection.aggregate().match(option)
		.sample({
		  size: 9
		})
		.end()

		console.log(JSON.stringify(brandList))

		return brandList
	}
	async detail(pcode) {
		const {
			data: brandDetail
		} = await this.collection.where({
			code: pcode
		}).orderBy("sort", "desc").limit(1).get()
		const {
			data: goodsList
		} = await this.goodsCollection.where({
			brand_code: pcode
		}).orderBy("sort", "desc").get()
		for (let i in goodsList) {
			goodsList[i] = goodsResource(goodsList[i])
		}
		return {
			...brandDetail[0],
			goodsList
		}
	}

	async cate(cateData) {
		const { platform } = cateData;
		const isIOS = noVirtual(platform)
		// const isIOS = false
		const option = isIOS ? { is_virtual: 2 } : {}
		const cate = isIOS ? ["美食餐饮", "交通出行", "读书学习", "购物消费", "生活服务"] : ["影音娱乐", "美食餐饮", "交通出行", "读书学习", "购物消费", "生活服务"]
		const list = await Promise.all(cate.map(async (item, index) => {
			const { data: brandList } = await this.collection.where({
				...option,
				cate_id: isIOS ? index + 2 : index + 1
			}).orderBy("sort", "desc").get()
			return {
				name: item,
				products: brandList
			}
		}))

		console.log(JSON.stringify(list))

		return {
			cate,
			list
		}
	}

	async init() {
		const res = await getCardBrandList();
		const list = await Promise.all(res.data.data.map(async (item) => {
			const { bg_card, cover_url, logo } = item;

			const [bgCardId, coverUrlId, logoId] = await Promise.all([
				dealPic(bg_card), dealPic(cover_url), dealPic(logo)
			])

			return {
				...item,
				bg_card: bgCardId,
				cover_url: coverUrlId,
				logo: logoId,
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
