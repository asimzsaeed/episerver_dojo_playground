//>>built
define("epi/shell/xhr/errorHandler",["dojo/_base/declare","dojo/when","dojo/_base/json","dgrid/List","dgrid/extensions/DijitRegistry","../widget/dialog/Alert","../widget/dialog/ErrorDialog"],function(_1,_2,_3,_4,_5,_6,_7){var _8=_1([_4,_5]),_9;function _a(_b){if(typeof _b==="string"){try{return _3.fromJson(_b);}catch(e){console.warn("Failed to parse responseText as json",e);}}return {};};_9={forXhr:function(_c){var _d,_e,_f;if(_c.status>=500){_7.showXmlHttpError(_c,_c);}else{_d=_a(_c.responseText);_e={description:_d.message||_c.message};if(_d.additionalInformation instanceof Array){_f=new _8({className:"epi-grid-max-height--300"});_f.renderArray(_d.additionalInformation);_f.startup();_e.content=_f;}new _6(_e).show();}},wrapXhr:function(_10){_10=_2(_10);_10.otherwise(_9.forXhr);return _10;}};return _9;});