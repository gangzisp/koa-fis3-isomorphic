'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const organization = require('../controller/organization');
const api = require('../controller/api');

const router = require('koa-router')();

/**
 * 轻社团主页
 */

router.get('/index/detail/id/:id/type/:type', organization.detailPage);
router.get('/index/get_comment_list', api.getCommentList);

router.get('/org-rank.html', organization.orgRank);
router.get('/star-org.html', organization.starOrg);

module.exports = router;