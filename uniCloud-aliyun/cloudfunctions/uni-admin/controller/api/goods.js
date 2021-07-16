const {
	Controller
} = require('uni-cloud-router')

const response = require('response')

module.exports = class GoodsController extends Controller {
	constructor(ctx) {
	    super(ctx)
		this.goodsService = this.service.api.goods
	}
	async detail() {
		var gcode =  this.ctx.data.gcode
		var goodsDetail = await this.goodsService.detail(gcode)
	    return response.success(goodsDetail)
	}

	async init() {
		const initResult = await this.goodsService.init()
	    return response.success(initResult)
	}
}
