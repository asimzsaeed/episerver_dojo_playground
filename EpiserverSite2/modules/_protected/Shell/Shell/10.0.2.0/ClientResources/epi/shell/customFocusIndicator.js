//>>built
define("epi/shell/customFocusIndicator",["dojo/_base/window","dojo/dom-class","dojo/on","dojo/domReady!"],function(_1,_2,on){var _3=_1.body();var _4=function(){_2.add(_3,"epi-mouse-focus");_2.remove(_3,"epi-keyboard-focus");};var _5=function(){_2.remove(_3,"epi-mouse-focus");_2.add(_3,"epi-keyboard-focus");};_2.add(_3,"epi-mouse-focus");on(_3,"mousedown",_4);on(_3,"mouseup",_4);on(_3,"keydown",_5);on(_3,"keyup",_5);});