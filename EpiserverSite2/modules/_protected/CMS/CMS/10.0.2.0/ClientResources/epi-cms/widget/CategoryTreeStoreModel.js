//>>built
define("epi-cms/widget/CategoryTreeStoreModel",["dojo/_base/declare","dojo/_base/lang","dojo/when","dojox/html/entities","epi/dependency","epi/routes"],function(_1,_2,_3,_4,_5,_6){return _1(null,{store:null,rootCategory:undefined,constructor:function(_7){_2.mixin(this,_7);if(!this.store){var _8=_5.resolve("epi.storeregistry");this.store=_8.get("epi.cms.category");}},getRoot:function(_9){_3(this.store.get(this.rootCategory),_9);},mayHaveChildren:function(_a){return _a.hasChildren;},getChildren:function(_b,_c){var id=this.getIdentity(_b),_d=this.store.query({id:id,query:"getchildren"});_d.then(function(_e){_b.children=_e;_c(_e);});},getIdentity:function(_f){return this.store.getIdentity(_f);},getLabel:function(_10){return _4.encode(_10.description);}});});