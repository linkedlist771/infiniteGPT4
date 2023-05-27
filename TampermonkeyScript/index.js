// ==UserScript==
// @name        无限GPT4
// @namespace   https://github.com/linkedlist771
// @description 无限使用GPT4,有人在使用插件后，出现封号退款的情况，是不是由于插件导致的不清楚，酌情使用哦。
// @license MIT
// @include     *
// @version     2
// @grant       none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 添加启动/不启动的UI选项
    let isScriptEnabled = localStorage.getItem('isScriptEnabled') ? true : false;
 
    // 按钮点击事件
    function toggleScript() {
        isScriptEnabled = !isScriptEnabled;
        localStorage.setItem('isScriptEnabled', isScriptEnabled);
        toggleButton.textContent = isScriptEnabled ? '停止无限GPT-4插件' : '启动无限GPT-4插件';
        if(isScriptEnabled && !localStorage.getItem('alertShown')){
            alert("有人在使用插件后，出现封号退款的情况，是不是由于插件导致的不清楚，酌情使用哦。");
            localStorage.setItem('alertShown', true);
        }
    }
 
    let toggleButton = document.createElement('button');
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '50%';
    toggleButton.style.transform = 'translateX(-50%)';
    toggleButton.style.backgroundColor = 'red';
    toggleButton.style.color = 'white';
    toggleButton.style.fontSize = '20px';
    toggleButton.style.padding = '10px 20px';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.25)';
    toggleButton.textContent = isScriptEnabled ? '停止无限GPT-4插件' : '启动无限GPT-4插件';
 
    toggleButton.onclick = toggleScript;
 
    document.body.appendChild(toggleButton);
 
    let realFetch = window.fetch;
    window.fetch = function(url, init) {
        if (!isScriptEnabled) {
            return realFetch(url, init);
        }
        try {
            if (init && init.method === 'POST') {
                let data = JSON.parse(init.body);
                if (data.hasOwnProperty('model')) {
                    data.model = 'gpt-4-mobile';
                    init.body = JSON.stringify(data);
                }
            }
            return realFetch(url, init);
        } catch (e) {
            console.error('在处理请求时出现错误:', e);
            return realFetch(url, init);
        }
    };
})();