const parse = require('co-body');
const render = require('../lib/views');
const todos = require('../models/todos');
const pages = require('../lib/pages');

const dataMock = require('../mock/indexPage');

/**
 * Item List.
 */
exports.indexPage = function*() {
	var results = yield todos.find({});
	var data = dataMock.result;
	console.log(data);
	this.body = yield pages('pages/index', {
		pageMenu: data.pageMenu,
		keywords: data.keywords,
		banner2: data.banner2,
		banner3: data.banner3,
		slider: data.slider,
		tabRecmend: data.tabs.recmendList,
		tabMore: data.tabs.moreList,
		panel3: data.panel3
	});
};