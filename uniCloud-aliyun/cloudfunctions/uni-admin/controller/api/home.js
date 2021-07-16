const {
	Controller
} = require('uni-cloud-router')

const response = require('response')

module.exports = class HoomController extends Controller {
	constructor(ctx) {
	    super(ctx)
	    this.brandService = this.service.api.brand
		this.goodsService = this.service.api.goods
		this.homeService = this.service.api.home
	}
	async hot() {
		const data =  this.ctx.data
		var brandList = await this.brandService.hot(data)
	    return response.success(brandList)
	}
	async recommand() {
		const data =  this.ctx.data
		var brandList = await this.goodsService.recommand(data)
	    return response.success(brandList)
	}
	async banner() {
		const banner = await this.homeService.banner()
	    return response.success(banner)
	}

	async overview() {
		const res = await this.service.home.getOverview()
		return res.data
	}

	async setConfig() {
		const data =  this.ctx.data
		const res = await this.service.home.setConfig(data)
		return res
	}

	async getConfig() {
		const data =  this.ctx.data
		const res = await this.service.home.getConfig(data)
		return res
	}

	async fetchUserList() {
		const data =  this.ctx.data
		const res = await this.service.home.fetchUserList(data)
		return res
	}
}
