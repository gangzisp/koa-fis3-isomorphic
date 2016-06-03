/**
 * main
 * @require './index.scss' // 无需在页面中控制 css
 */


var getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) {
        return unescape(r[2]);
    }
    return null; //返回参数值
};

var localAjax = require('localAjax');
var scrollLoad = require('scrollload');
var rankHeader = require('rank-header');
var rankTop = require('rank-top');
var rankNormal = require('rank-normal');

// var pageMenu = require('page-menu');
// var dialog = require('dialog');
// var banner2 = require('banner-2');
// var banner3 = require('banner-3');
// var slider = require('slider');
// var tab = require('tab');
// var panel3 = require('panel-3');

window.r = getUrlParam('r');

var page = {
    $el: $('body'),

    init: function() {
        this._renderData();
    },

    _renderData: function() {
        var self = this;
        if (window.r) {
            self._ajaxData();
        } else {
            self._initComponent();
            self._bindEvent();
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

        var self = this;

        scrollLoad(300, function(count) {
            console.log(count);
        })
    }
};

module.exports = page;