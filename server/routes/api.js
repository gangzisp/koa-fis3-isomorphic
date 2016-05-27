'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const coRequest = require("co-request");
const session = require('koa-session-redis3');
const util = require('../lib/util');

const render = require('../lib/render');
const config = require('./common/config')

const DB = require('../models/db.class');


/**
 * 上报规范：
 * {
 *     id: '121',                   // 业务id
 *     form: 'http://test.qq.com/', // 来源页面，或者是native页面
 *     msg: 'stack@test.js',        // 错误信息
 *     userAgent: 'android',        // 用户环境，平台，浏览器可以自动分析
 *     ip: '192.158.2.1',           // 用户上报ip
 *     uin: '15383747382',          // 用户id
 *     
 * }
 * @yield {[type]} [description]
 */
const _report = function*() {
    let report = new DB('report');

    let data = yield report.find({
        name: 'admin'
    });

    console.log(data);

    let ctx = this;
    let uri = 'http://test.xiaodao360.cn/mobile/index/get_comment_list?' + util.string.json2str(ctx.query);

    let result = yield coRequest({
        url: uri,
        method: 'get',
        headers: config.oAuthHeader
    });

    try {
        let response = result;
        let viewName;
        let data = JSON.parse(response.body);

        ctx.body = data;

    } catch (e) {
        ctx.redict('/');
    }
};

module.exports = {
    report: _report
}