'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const organization = require('../controller/organization');

const router = require('koa-router')();

router.get('/rank_list.html', organization.orgRank);
router.get('/rank_detail.html', organization.starOrg);

module.exports = router;