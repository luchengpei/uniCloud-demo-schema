/*
 * @Author: dazhao 
 * @Date: 2021-05-27 18:11:02 
 * @Last Modified by: dazhao
 * @Last Modified time: 2021-06-06 22:20:21
 */

const config = require("./admin-config");

const db = uniCloud.database();
const { baseUrl } = config
let Appid = ""

const request = async (opts) => {
    const { data, url, method } = opts;

    if (!Appid) {
        const { data } = await db.collection('config').get();
        Appid = data && data.length ? data[0].Appid : ""
    }

    const res = await uniCloud.httpclient.request(`${baseUrl}${url}`, {
        dataType: 'json',
        headers: {
            Appid: Appid
        },
        method,
        data
    })
    res.data.data.Appid = Appid
    return res
}

exports.getCardOrderList = (data) => {
    return request({
        url: "/addon/open/v2/card/order",
        data
    })
}

exports.getCardGoodsList = data => {
    return request({
        url: "/addon/open/v1/card/goods/list",
        data
    })
}

exports.getCardBrandList = data => {
    return request({
        url: "/addon/open/v1/card/brand/list",
        data
    })
}

exports.getCardDataOverview = data => {
    return request({
        url: "/addon/open/v1/card/data/overview",
        data
    })
}

exports.updateCardSetting = data => {
    return request({
        url: "/addon/open/v1/card/setting/minapp/update",
        method: "POST",
        data
    })
}

exports.getCardSetting = data => {
    return request({
        url: "/addon/open/v1/card/setting/minapp/info",
        data
    })
}

exports.getUserList = data => {
    return request({
        url: "/addon/open/v1/card/user/list",
        data
    })
}