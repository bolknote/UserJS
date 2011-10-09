// ==UserScript==
// @name        UnSnow - Turn off stupid snow
// @author      Evgeny Stepanischev aka Bolk
// @version     1.01
// @namespace   http://bolknote.ru/files/unsnow.js
// @modified    2008-01-29
// ==/UserScript==

document.addEventListener
(
        'load',
        function () {
                if (window) for (var v in window)
                if (/snow|^fall$/i.test(v) && typeof window[v] == 'function') window[v] = function () {}
        },
        false
)
