//>>built
define("xstyle/core/expression",["xstyle/core/utils","xstyle/core/Definition"],function(_1,_2){function _3(_4,_5){var _6=_5[0];if(_6&&_4){_6=_7(_6);return _3(_4.property?_4.property(_6):_4[_6],_5.slice(1));}return _4;};var _7=_1.convertCssNameToJs;var _8=_1.someHasProperty;function _9(_a){_a.selfResolving=true;return _a;};function _b(_c,_d,_e){if(_8(_d,_c)){var _f={};_f[_c]=function(_10){var _11=[];for(var i=0,l=_d.length;i<l;i++){var _12=_d[i];if(_12&&typeof _12[_c]=="function"){_12=_12[_c](_10);}_11[i]=_12;}return _e(_11);};return _f;}return _e(_d);};function _13(_14,_15){return {apply:function(_16,_17,_18){for(var i=0,l=_17.length;i<l;i++){var _19=_17[i];_19.dependencyOf&&_19.dependencyOf(_18);}var _1a=function(){var _1b=[];if(_14.selfExecuting){return _14.apply(_16,_17,_18);}for(var i=0,l=_17.length;i<l;i++){_1b[i]=_17[i].valueOf();}if(_14.selfWaiting){return _14.apply(_16,_1b,_18);}_1b.push(_16);return _1.whenAll(_1b,function(_1c){var _1d=_1c.pop();return _b("forRule",_1c,function(_1e){return _b("forElement",_1e,function(_1f){return _14.apply(_1d,_1f,_18);});});});};_1a.reverse=function(_20){return _15(_20,_17);};return _1a;}};};var _21={};var _22={};var _23={};function _24(_25){return _22[_25]||(_22[_25]=new Function("a","b","return "+_25));};function _26(_27,_28,_29,_2a,_2b){var _2c=function(_2d,_2e){var a=_2e[0],b=_2e[1];if(a&&a.put){var _2f=_2a(_2d,b&&b.valueOf());if(_2f!==_21){a.put(_2f);}}else{if(b&&b.put){b.put(_2b(_2d,a&&a.valueOf()));}else{throw new TypeError("Can not put");}}};var _30={apply:function(_31,_32,_33){var _34;_29=_24(_29);_2a=_2a&&_24(_2a);_2b=_2b&&_24(_2b);_23[_27]=_34=_13(_29,_2c);_35(_34);return _34.apply(_31,_32,_33);}};function _35(_36){_36.skipResolve=true;_36.precedence=_28;_36.infix=_2b!==false;};_35(_30);_23[_27]=_30;};_26("+",6,"a+b","a-b","a-b");_26("-",6,"a-b","a+b","b-a");_26("*",5,"a*b","a/b","a/b");_26("/",5,"a/b","a*b","b/a");_26("?",16,"b[a?0:1]","a===b[0]||(a===b[1]?false:deny)","[a,b]");_26(":",15,"[a,b]","a[0]?a[1]:deny","a[1]");_26("!",4,"!a","!a",false);_26("%",5,"a%b");_26(">",8,"a>b");_26(">=",8,"a>=b");_26("<",8,"a<b");_26("<=",8,"a<=b");_26("==",9,"a===b");_26("&",8,"a&&b");_26("|",8,"a||b");function _37(_38,_39){var i;var _3a;_39=_39.join?_39.slice():[_39];for(i=0;i<_39.length;i++){_3a=_39[i];if(typeof _3a=="string"){var _3b=_3a.match(/"[^\"]*"|[+\-<>\|\/\?\:^*!&|]+|[\w_$\.\/-]+/g);var _3c=[i,1];if(_3b){_3c.push.apply(_3c,_3b);}_39.splice.apply(_39,_3c);i+=_3c.length-3;}}var _3d;var _3e=[];var _3f;var _40={};for(i=0;i<_39.length;i++){_3a=_39[i];if(_3a.operator=="("){var _41=_3e[_3e.length-1];if(_41===undefined||_23.hasOwnProperty(_41)){_3a=_37(_38,_3a.getArgs()[0]);}else{_3e.pop();_3a=(function(_42,_43){var _44;var _45;function _46(_47){return _1.when(_42.valueOf(),function(_48){var _49=_42.parent&&_42.parent.valueOf();if(!_48.selfResolving){if(!_44){_44=[];for(var i=0,l=_43.length;i<l;i++){_44[i]=_37(_38,_43[i]);}if(_48.selfReacting){_45=_48.apply(_49,_44,_4a);}else{_45=_13(_48).apply(_49,_44,_4a);}}return _45();}var _4b=_48.apply(_49,_43,_4a);return _47?_4b:_4b.valueOf();});};var _4a=new _2(_46);_4a.setReverseCompute(function(){var _4c=arguments;return _1.when(_46(true),function(_4d){return _4d.put.apply(_4d,_4c);});});return _4a;})(_41,_3a.getArgs());}}else{if(_23.hasOwnProperty(_3a)){var _4e=_23[_3a];_4f(_4e);_3d=(_3f||_4e).precedence;}else{if(_3a>-1){_3a=+_3a;}else{if(_3a.isLiteralString){_3a=_3a.value;}else{var _50=_3a.split(/\s*\/\s*/);var _51=_50[0];var _52=_38.getDefinition(_51);if(typeof _52=="string"||_52 instanceof Array){_52=_37(_38,_52);}else{if(_52===undefined){throw new Error("Could not find reference \""+_51+"\"");}}_40[_51]=_52;if(_50.length>1){_52=_3(_52,_50.slice(1));}_3a=_52;}}}}_3e.push(_3a);}_4f({precedence:100});function _4f(_53){while(_3d<=_53.precedence){var _54=_3e.pop();var _55=_23[_3e.pop()];var _56=new _2();_56.setCompute(_55.apply(null,_55.infix?[_3e.pop(),_54]:[_54],_56));_3f=_3e.length?_3e[_3e.length-1]:undefined;_3e.push(_56);_3d=_3f&&_23[_3f]&&_23[_3f].precedence;}};if(_3e.length>1){throw new Error("Could not reduce expression");}_3a=_3e[0];_3a.inputs=_40;return _3a;};return {react:_13,evaluate:_37,selfResolving:_9};});