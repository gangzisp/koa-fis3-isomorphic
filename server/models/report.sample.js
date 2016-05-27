'use strict';

const dbname = 'localhost/datasite';
const db = require('monk')(dbname);
const report = db.get('report');

/*
 * 数据库操作promise样例
 * 数据协议操作遵循数据库格式规范，insert为插入，find为查询，update为全量更新，delelete为删除
 * var promise = report.insert({});
 * promise.type;
 * promise.error(function(err){});
 * promise.on('error', function(err){});
 * promise.on('success', function(doc){});
 * promise.on('complete', function(err, doc){});
 * promise.success(function(doc){});
 */

/**
 * 数据库插入操作
 * @param {[type]} obj           [description]
 * @yield {[type]} [description]
 */
function* _insert(data) {
	let result = yield report.insert(data);
	return result;
}

/**
 * 数据库查询操作
 * @param {[type]} obj           [description]
 * @yield {[type]} [description]
 */

function* _find(obj, sort) {
	let result;
	if (sort) {
		result = yield report.find(obj, sort);
	} else {
		result = yield report.find(obj);
	}
	return result;
}

/**
 * 数据库查询单个操作
 * @param {[type]} obj           [description]
 * @yield {[type]} [description]
 */
function* _findOne(condition) {
	let result = yield report.findOne(condition);
	return result;
}

/**
 * 数据库更新操作
 * @param {[type]} obj           [description]
 * @yield {[type]} [description]
 */
function* _update(condition, data) {
	let result = yield report.update(condition, data);
	return result;
}

/**
 * 数据库查找并更新操作
 * @param {[type]} obj           [description]
 * @yield {[type]} [description]
 */
function* _findAndModify(condition, data) {
	let result = yield report.findAndModify(condition, data);
	return result;
}

/**
 * 数据库删除满足条件记录
 * @param {[type]} obj           [description]
 * @yield {[type]} [description]
 */
function* _remove(condition) {
	let result = yield report.remove(condition);
	return result;
}

module.exports = {
	insert: _insert,
	find: _find,
	findOne: _findOne,
	update: _update,
	remove: _remove
};