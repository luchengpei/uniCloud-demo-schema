const {
	Controller
} = require('uni-cloud-router')

const response = require('response')

module.exports = class OrderController extends Controller {
	constructor(ctx) {
	    super(ctx)
	    this.orderService = this.service.api.order
	}
	async sku() {
		var gcode =  this.ctx.data.gcode
		var order = await this.orderService.sku(gcode)
	    return response.success(order)
	}
	async confirm() {
		var gcode =  this.ctx.data.gcode
		var num =  this.ctx.data.num
		var order = await this.orderService.confirm(gcode, num)
	    return response.success(order)
	}

	async orderList() {
		const data =  this.ctx.data
		const orderList = await this.orderService.orderList(data)
		return response.success(orderList)
	}
}
