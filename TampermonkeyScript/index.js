// ==UserScript==
// @name        无限GPT4
// @namespace   https://github.com/linkedlist771
// @description 无限使用GPT4
// @license MIT
// @include     *
// @version     1
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    let realFetch = window.fetch;
    window.fetch = function(url, init) {
        if (init && init.method === 'POST') {
            let data = JSON.parse(init.body);
            if (data.hasOwnProperty('model')) {
                data.model = 'gpt-4-mobile';
                init.body = JSON.stringify(data);
            }
        }
        return realFetch(url, init);
    };
})();