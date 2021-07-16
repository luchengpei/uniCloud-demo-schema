const {
	price
} = require('../../service/util.js')

function goodsResource(res){
	res.price_str = price(res.price / 100)
	res.origin_price_str = price(res.origin_price / 100)
	res.discountStr = (res.price * 10/res.origin_price).toFixed(1) + "折"
	res.allDiscount_str = price((res.origin_price - res.price)/100)
	return res
}

module.exports = {
	goodsResource
}
