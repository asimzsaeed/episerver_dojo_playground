//>>built
define("xstyle/ext/dgrid",["dojo/_base/declare","dojo/promise/all","dojo/Deferred","dojo/when","./widget","../core/expression"],function(_1,_2,_3,_4,_5,_6){var _7={"selectionMode":"Selection","columns":"Grid","keyboard":"Keyboard"};var _8={"selectionMode":function(_9,_a){_9.selectionMode=_a;},"keyboard":function(_b,_c){_b.cellNavigation=_c=="cell";},"collection":function(_d,_e,_f){_e=_6.evaluate(_f,_e);return _4(_e.valueOf(),function(_10){_d.collection=_10;});},"columns":function(_11,_12){var _13=_11.columns={};_12[0].eachProperty(function(_14,_15){var _16=_5.parse(_15[0]);_16.className=_15[0].selector.slice(1);_13[_14]=_16;});return _13;}};return {put:function(_17,_18,_19){_19=_19.slice(6);if(!_18.constructors){_18.constructors=["dgrid/OnDemandList"];_18.handlers=[];}var _1a=_17[0];var _1b=[];_1a.eachProperty(function(_1c,_1d){var _1e=_8[_1c];if(_1e){var _1f=_1e(_1a.values,_1d,_18);if(_1f){_1b.push(_1f);}}if(_7[_1c]){_18.constructors.push("dgrid/"+_7[_1c]);}});_2(_1b).then(function(){_5.parse(_17[0],function(_20){_18.elements(_20);},_18.constructors);});}};});