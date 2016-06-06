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

/**
 * 获取评论列表内容处理
 * @param {[type]} req           [description]
 * @yield {[type]} [description]
 */
const _getCommentList = function*() {

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
    getCommentList: _getCommentList
}