//>>built
define("epi-cms/project/ProjectItemQueryEngine",["epi-cms/core/ContentReference","epi-cms/store/queryUtils"],function(_1,_2){return function(_3,_4){_4=_4||{};_4.comparers={contentLinks:function(_5,_6){return _5.some(function(_7){return _1.compareIgnoreVersion(_7,_6.contentLink);});}};return _2.createEngine(_3,_4);};});