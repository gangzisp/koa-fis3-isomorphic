'use strict';

/**
 * 统一路由入口层
 * @type {[type]}
 */
const user = require('./user');
const api = require('./api');
const report = require('./report');
const page = require('./page')

module.exports = {
    user: user,
    api: api,
    report: api,
    page: page
}