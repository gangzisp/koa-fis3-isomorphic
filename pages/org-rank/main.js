/**
 * main
 * @require './index.scss' // 无需在页面中控制 css
 */

var localAjax = require('localAjax');
var util = require('util')

var scrollLoad = require('scrollload');
var rankHeader = require('rank-header');
var rankTop = require('rank-top');
var rankNormal = require('rank-normal');

var tpl = require('./index.tpl');
var Component = require('comBase');
var component = new Component($('body'), tpl);

// window.r 用于判断是否使用浏览器端拉数据渲染，有r且含有值则使用浏览器端渲染
window.r = util.url.getUrlParam('r');

component.extends({


    init: function() {
        this._renderData();
    },

    _renderData: function() {
        if (window.r) {
            this._ajaxData();
        } else {
            this._initComponent();
            this._bindEvent();
        }
    },

    _ajaxData: function() {
        var self = this;
        $.localAjax({
            url: '../mock/rank.json',
            method: 'get',
            dataType: 'json',
            data: {},
            done: function(data) {
                self._initComponent(data.result);
                self._bindEvent(data.result);
            },
            fail: function(msg) {
                // dialog.init();
            }
        });
    },

    _initComponent: function(data) {

        rankHeader.init(data);
        rankTop.init(data.rankList.slice(0, 3));
        rankNormal.init(data.rankList.slice(3, 6));

    },

    _bindEvent: function(data) {

        // var self = this;

        // scrollLoad(300, function(count) {
        //     console.log(count);
        // })
    }
});

module.exports = component;