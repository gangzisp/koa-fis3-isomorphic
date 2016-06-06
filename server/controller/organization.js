'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const render = require('../lib/render');
const md5 = require('../lib/md5');
const coRequest = require('co-request');

/**
 * /
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const indexPage = function*(req, res) {

	let ctx = this;
	let result = yield coRequest("http://localhost:3000/mock/indexPage.json");

	try {
		let response = result;
		let data = JSON.parse(response.body).result;

		ctx.body = yield render('pages/index', {
			pageMenu: data.pageMenu,
			keywords: data.keywords,
			banner2: data.banner2,
			banner3: data.banner3,
			slider: data.slider,
			tabRecmend: data.tabs.recmendList,
			tabMore: data.tabs.moreList,
			panel3: data.panel3
		});
	} catch (e) {
		console.log(e);
	}
};

/**
 * 详情页面路由处理
 * @param {[type]} req           [description]
 * @yield {[type]} [description]
 */
const detailPage = function*() {

	let ctx = this;
	let uri = 'http://' + ctx.hostname + '/v1/activities/';

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

/**
 * 轻社团排行榜
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const orgRank = function*(req, res) {
	let ctx = this;
	let result = yield coRequest("http://127.0.0.1:8085/mock/rank.json");

	try {
		let response = result;
		let data = JSON.parse(response.body).result;


		if (ctx.request.query.r) {
			ctx.body = yield render('pages/org-rank');
		} else {
			ctx.body = yield render('pages/org-rank', {
				data: data
			});
		}

	} catch (e) {
		console.log(e);
	}
};

/**
 * 明星社团页面
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const starOrg = function*(req, res) {
	let ctx = this;
	let result = yield coRequest("http://127.0.0.1:8085/mock/star.json");
	try {
		let response = result;
		let data = JSON.parse(response.body).result;

		if (ctx.request.query.r) {
			ctx.body = yield render('pages/star-org');
		} else {
			ctx.body = yield render('pages/star-org', {
				data: data
			});
		}
	} catch (e) {
		console.log(e);
	}
}

/**
 * 社团主页数据接口格式处理
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function _formatData(data) {

	data.thumb = data.thumb.indexOf('?') >= 0 ? data.thumb : data.thumb + '?imageView2/2/w/180/h/180';
	data.thumb380 = data.thumb.indexOf('?') >= 0 ? data.thumb : data.thumb + '?imageView2/2/w/380/h/380';
	data.thumb404 = data.thumb.indexOf('?') >= 0 ? data.thumb : data.thumb + '?imageView2/2/w/286/h/404';
	data.organize.logo = data.organize.logo.indexOf('?') >= 0 ? data.organize.logo : data.organize.logo + '?imageView2/2/w/93/h/93';
	data.subtitle = data.title.length > 24 ? data.title.slice(0, 24) + '...' : data.title;
	data.closeTag = data.close ? util.time.format('yy-mm-dd hh:ii', data.close) : '永久';
	data.desc = util.html.toRaw(data.content);
	data.reward = util.html.toRaw(data.reward);
	data.compereNum = data.compere_list && data.compere_list.length || 0;

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
	indexPage: indexPage,
	detailPage: detailPage,
	orgRank: orgRank,
	starOrg: starOrg
}