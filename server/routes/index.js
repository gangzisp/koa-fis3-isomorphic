'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const organization = require('../controller/organization');
const api = require('../controller/api');
const page = require('../controller/page');

const router = require('koa-router')();

router.get('/index/detail/id/:id/type/:type', organization.detailPage);
router.get('/index/get_comment_list', api.getCommentList);

router.get('/org-rank.html', organization.orgRank);
router.get('/star-org.html', organization.starOrg);
router.get('/index.html', page.index);


module.exports = router;