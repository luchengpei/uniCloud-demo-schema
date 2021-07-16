const {
    Service
} = require('uni-cloud-router')

module.exports = class homeService extends Service {
    constructor(ctx) {
        super(ctx)
        this.bannerCollection = this.db.collection('banner')
        this.couponCollection = this.db.collection('coupon')
    }

    async banner() {
        const [{ data: banner }, { data: coupon }] = await Promise.all([this.bannerCollection.where({status: true}).get(), this.couponCollection.where({status: true}).get()])
        
        return { banner, coupon }
    }

}
