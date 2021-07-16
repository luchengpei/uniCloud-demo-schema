const {
	Controller
} = require('uni-cloud-router')

const response = require('response')

module.exports = class BrandController extends Controller {
	constructor(ctx) {
	    super(ctx)
	    this.brandService = this.service.api.brand
		this.goodsService = this.service.api.goods
	}
	async detail() {
		var pcode =  this.ctx.data.pcode
		var brandInfo = await this.brandService.detail(pcode)
	    return response.success(brandInfo)
	}

	async cate() {
		const data =  this.ctx.data
		const cateInfo = await this.brandService.cate(data)
	    return response.success(cateInfo)
	}

	async init() {
		const initResult = await this.brandService.init()
	    return response.success(initResult)
	}
}
