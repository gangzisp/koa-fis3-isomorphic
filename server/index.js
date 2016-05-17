'use strict';

const http = require('http');

const koa = require('koa');
const logger = require('koa-logger');
const router = require('koa-router');
const serve = require('koa-static');
const stylus = require('koa-stylus');

const routeMap = require('./routes');

// Create koa app
const app = koa();

// middleware
app.use(logger());
app.use(stylus('./pages'));
app.use(serve('./pages'));

// 路由中间件
app.use(router.get('/index', routeMap.indexPage));

// 创建服务器监听
http.createServer(app.callback()).listen(3000);
// app.listen(3000);

console.log('Server listening on port 3000');