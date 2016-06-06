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

router.get('/mobile/index/detail/id/:id/type/:type', organization.detailPage);
router.get('/mobile/index/detail/id/:id/type/:type', organization.detailPage);

router.get('/mobile/index/get_comment_list', api.getCommentList);

router.get('/page/org-rank.html', organization.orgRank);
router.get('/page/star-org.html', organization.starOrg);

module.exports = router;