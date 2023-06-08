// ==UserScript==
// @name         无限GPT4
// @namespace    https://github.com/linkedlist771
// @description  无限使用GPT4,有人在使用插件后，出现封号退款的情况，是不是由于插件导致的不清楚，酌情使用哦。
// @license      MIT
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn7ypz5Cmxi2_LPdPukJUVKwHqKYP_ffJPTOm4_5YIhA&s
// @include      /^https://chat\.openai\.com/.*/
// @version      4
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // add mobile GPT-4
// 将代码插入到网页中
    const script = document.createElement('script');
    script.textContent = `
            const responseHandlers = {
        'https://chat.openai.com/backend-api/models': async function(response) {
            const body = await response.clone().json();
            models = [
                {
                    "category": "gpt_4",
                    "human_category_name": "GPT-4 Mobile",
                    "subscription_level": "plus",
                    "default_model": "gpt-4-mobile"
                },
                {
                    "category": "gpt_3.5",
                    "human_category_name": "GPT-3 Mobile",
                    "subscription_level": "free",
                    "default_model": "text-davinci-002-render-sha-mobile"
                }
            ]

            models.forEach(model => {
              body.categories.push(model);
            });

            return new Response(JSON.stringify(body), {
                status: response.status,
                statusText: response.statusText,
                headers: {'Content-Type': 'application/json'}
            });
        },

        'https://chat.openai.com/backend-api/moderations': async function(response) {
            const body = await response.clone().json();
            body.flagged = false;
            body.blocked = false;

            return new Response(JSON.stringify(body), {
                status: response.status,
                statusText: response.statusText,
                headers: {'Content-Type': 'application/json'}
            });
        }
    };
    window.fetch = new Proxy(window.fetch, {
        apply: async function(target, thisArg, argumentsList) {
            const response = await Reflect.apply(...arguments);
            for (let key in responseHandlers) {
                if (argumentsList[0].includes(key)) {
                    return responseHandlers[key](response);
                }
            }
            return response;
        }
    });
    `;
    document.body.appendChild(script);


   // set default
    const BUTTONS_GROUPS = ['GPT-3.5', 'GPT-4','GPT-4 Mobile', 'GTP-3.5 Mobile']
    const DEFAULT_BUTTON = 'GPT-4 Mobile'
    let menus = []
    let isSwitch = false;

    // 注册脚本菜单
    const registerMenuCommand = () => {
      const onHandle = (value) => {
        GM_setValue('defaultModel', value)
        registerMenuCommand()
      }
      if (!GM_getValue('defaultModel')) GM_setValue('defaultModel', DEFAULT_BUTTON)
      const defaultValue = GM_getValue('defaultModel')
      menus.forEach(menu => GM_unregisterMenuCommand(menu))
      menus = BUTTONS_GROUPS.map((buttonText) => GM_registerMenuCommand(`切换默认为：${buttonText}${defaultValue === buttonText ? '（当前）' : ''}`, () => onHandle(buttonText)))
    }

    const checkButton = (addedNode) => {
      const model = `${GM_getValue('defaultModel')}`
      if (addedNode.nodeType === Node.ELEMENT_NODE) {
        const buttons = addedNode.querySelectorAll('button');
        for (let button of buttons) {
          if (button.textContent === model) {
            button.querySelector('span')?.click();
            button.querySelector('span')?.click();
            return true;
          }
        }
      }
      return false;
    }

    const handleClick = () => {
      isSwitch = true;
    }

    // 监听newChat事件
    const addEventTargetA = () => {
      const buttons = document.querySelectorAll('a')
      for (const button of buttons) {
        if (button.textContent === 'New chat') {
          button.removeEventListener('click', handleClick)
          button.addEventListener('click', handleClick)
          break;
        }
      }
    }

    const callback = (mutationRecords) => {
      for (const mutationRecord of mutationRecords) {
        if (mutationRecord.addedNodes.length) {
          for (const addedNode of mutationRecord.addedNodes) {
            if (checkButton(addedNode)) return;
          }
        }
      }
      addEventTargetA()
    };
    registerMenuCommand()
    addEventTargetA();
    const observer = new MutationObserver(callback);
    observer.observe(document.getElementById('__next'), {
      childList: true,
      subtree: true,
    });

    // 修改pushStatus和replaceStatus
    const pushState = window.history.pushState;
    const replaceState = window.history.replaceState;
    window.history.pushState = function () {
      if (isSwitch) {
        setTimeout(() => checkButton(document.getElementById('__next')), 300)
      }
      pushState.apply(this, arguments);
      isSwitch = false
    }
    window.history.replaceState = function () {
      if (isSwitch) {
        setTimeout(() => checkButton(document.getElementById('__next')), 300)
      }
      replaceState.apply(this, arguments);
      isSwitch = false
    }

})();

