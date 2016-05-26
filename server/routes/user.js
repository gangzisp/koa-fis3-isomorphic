'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const coRequest = require("co-request");
const session = require('koa-session-redis3');
const util = require('../lib/util');
const render = require('../lib/render');
const config = require('./common/config');

/**
 * 认证认证接口
 * @yield {[type]} [description]
 */
const auth = function*() {
    let ctx = this;
    let auth = yield coRequest({
        url: "http://dev.xiaodao360.cn/auth/login",
        method: "POST",
        header: config.oAuthHeader,
        form: {
            'client_key': 'key',
            'device_id': 'id',
            'os': 'android',
            'password': 'sdf',
            'platform': '3', // android=1，ios=2，h5=3  string  
            'username': '18565814531'
        }
    });

    let response = auth;
    let data = JSON.parse(result.body);

}

/**
 * 详情页面路由处理
 * @param {[type]} req           [description]
 * @yield {[type]} [description]
 */
const detailPage = function*() {

    let ctx = this;
    let uri = 'http://test.xiaodao360.cn/v1/activities/';

    let result = yield coRequest({
        url: uri + ctx.params.id,
        method: 'get',
        headers: config.oAuthHeader
    });

    let wxJsConfig = yield config.getWxJsConfig(ctx);

    try {
        let response = result;
        let viewName;
        let data = JSON.parse(response.body);

        data = _formatData(data);

        /**
         * 根据不同活动type类型，使用不同模板
         * @param  {[type]} data.type [description]
         * @return {[type]}           [description]
         */
        switch (data.type) {
            case 0:
                viewName = 'pages/activity/detail';
                break;
            case 2:
                viewName = 'pages/activity/vote';
                break;
            case 3:
                viewName = 'pages/activity/topic';
                break;
            default:
                viewName = 'pages/activity/detail';
                break;
        }

        ctx.body = yield render(viewName, {
            data: data,
            ctx: ctx,
            wxJsConfig: wxJsConfig
        });

    } catch (e) {
        this.redict('/');
    }
};

function _formatData(data) {

    data.thumb = data.thumb.indexOf('?') >= 0 ? data.thumb : data.thumb + '?imageView2/2/w/180/h/180';
    data.thumb380 = data.thumb.indexOf('?') >= 0 ? data.thumb : data.thumb + '?imageView2/2/w/380/h/380';
    data.thumb404 = data.thumb.indexOf('?') >= 0 ? data.thumb : data.thumb + '?imageView2/2/w/286/h/404';
    data.organize.logo = data.organize.logo.indexOf('?') >= 0 ? data.organize.logo : data.organize.logo + '?imageView2/2/w/93/h/93';
    data.subtitle = data.title.length > 24 ? data.title.slice(0, 24) + '...' : data.title;
    data.closeTag = data.close ? util.time.format('yy-mm-dd hh:ii', data.close) : '永久';
    data.desc = util.html.toRaw(data.content);
    data.reward = util.html.toRaw(data.reward);
    data.compereNum = data.compere_list.length;

    data.wxJsConfig = {
        "appid": "wx80792921613f141d",
        "timestamp": +new Date(),
        "signature": "7579c0dbfcfff1b725efef22a4edc1572bd32d28",
        "noncestr": "Wm3WZYTPz0wzccnW"
    };

    data.startTime = {
        day: util.time.format('yy-mm-dd ', data.begin),
        time: util.time.format('hh:ii', data.begin)
    };
    data.endTime = {
        day: util.time.format('yy-mm-dd ', data.end),
        time: util.time.format('hh:ii', data.end)
    }
    data.closeTime = {
        day: util.time.format('yy-mm-dd ', data.close),
        time: util.time.format('hh:ii', data.close)
    }

    data.content = util.html.htmlDecode(data.content);
    data.reward = util.html.htmlDecode(data.reward);

    return data;
}

module.exports = {
    detailPage: detailPage
}