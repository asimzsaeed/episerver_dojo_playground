//>>built
define("epi-cms/conversion/ContentReferenceConverter",["dojo/_base/declare","dojo/_base/lang","dojo/when","epi/dependency","epi/UriParser","epi-cms/core/ContentReference"],function(_1,_2,_3,_4,_5,_6){return _1(null,{convert:function(_7,_8,_9){if(!_9||(!_9.uri&&!_9.contentLink)){return null;}var _a;if(_9.uri){var _b=new _5(_9.uri);_a=_b.getId();}else{_a=_9.contentLink;}return new _6(_a).createVersionUnspecificReference().toString();}});});