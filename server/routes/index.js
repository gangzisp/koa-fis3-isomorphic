'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const organization = require('../controller/organization');
const api = require('../controller/api');
const page = require('../controller/page');

const router = require('koa-router')();


router.get('/org-rank.html', organization.orgRank);
router.get('/star-org.html', organization.starOrg);
router.get('/index.html', page.index);
router.get('/react.html', page.react);

module.exports = router;