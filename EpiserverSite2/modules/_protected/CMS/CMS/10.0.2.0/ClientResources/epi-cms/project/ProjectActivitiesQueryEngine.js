//>>built
define("epi-cms/project/ProjectActivitiesQueryEngine",["dojo/_base/lang","epi-cms/store/queryUtils"],function(_1,_2){return function(_3,_4){_4=_1.mixin({comparers:{projectId:function(_5,_6){return !_6.projectId||_5===_6.projectId;},contentReferences:function(_7,_8){return _7&&_7.some(function(_9){return _9===_8.contentLink;});}}},_4);return _2.createEngine(_3,_4);};});