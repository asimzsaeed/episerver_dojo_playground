//>>built
define("xstyle/core/load-css",[],function(){"use strict";var _1=typeof _css_cache=="undefined"?{}:_css_cache;var _2=document;function _3(){return !_2.createStyleSheet;};var _4=_2.head;function _5(_6){if(_3("dom-create-style-element")){_7=_2.createElement("style");_7.setAttribute("type","text/css");_7.appendChild(_2.createTextNode(_6));_4.insertBefore(_7,_4.firstChild);return _7;}else{var _7=_2.createStyleSheet();_7.cssText=_6;return _7.owningElement;}};function _8(_9,_a,_b){var _c=_1[_9];if(_c){_d=_5(_c);return _a(_d);}var _d=_2.createElement("link");_d.type="text/css";_d.rel="stylesheet";_d.href=_9;var _e=!_b||_b.wait!==false;var _f=navigator.userAgent.match(/AppleWebKit\/(\d+\.?\d*)/);_f=_f&&+_f[1];if(_d.onload===null&&!(_f<536)){_d.onload=function(){_d.onload=null;_d.onerror=null;_e&&_a(_d);};_d.onerror=function(){console.error("Error loading stylesheet "+_9);_e&&_a(_d);};}else{if(_e){var _10=setInterval(function(){if(_d.style){clearInterval(_10);_a(_d);}},15);}}(_4||_2.getElementsByTagName("head")[0]).appendChild(_d);if(!_e){_a(_d);}};_8.insertCss=_5;return _8;});