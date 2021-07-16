const {
	Controller
} = require('uni-cloud-router')

const response = require('response')

module.exports = class GoodsController extends Controller {
	constructor(ctx) {
	    super(ctx)
	    this.goodsService = this.service.goods
	}
	async list() {
		var goodsList = await this.goodsService.list()
	    return response.success(goodsList)
	}
}
