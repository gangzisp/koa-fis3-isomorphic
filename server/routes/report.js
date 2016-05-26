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

module.exports = {
    detailPage: detailPage
}