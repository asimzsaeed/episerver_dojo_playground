//>>built
define("epi-cms/component/MainNavigationComponent",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/dom-geometry","dijit/layout/_LayoutWidget","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","epi/dependency","epi-cms/widget/SearchBox"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _2([_5,_6,_7],{templateString:"<div>                            <div data-dojo-type=\"epi-cms/widget/SearchBox\" data-dojo-attach-point=\"search\" class=\"epi-gadgetInnerToolbar\"></div>                            <div data-dojo-attach-point=\"navigation\" style=\"overflow:auto;\">                            </div>                        </div>",contentRepositoryDescriptors:null,postCreate:function(){this.inherited(arguments);this.contentRepositoryDescriptors=this.contentRepositoryDescriptors||_8.resolve("epi.cms.contentRepositoryDescriptors");var _b=this.contentRepositoryDescriptors[this.repositoryKey];var _c=this.roots?this.roots:_b.roots;this.search.set("area",_b.searchArea);this.search.set("searchRoots",_c);var _d=_b.customNavigationWidget||"epi-cms/component/ContentNavigationTree";require([_d],_3.hitch(this,function(_e){var _f=new _e({typeIdentifiers:_b.mainNavigationTypes?_b.mainNavigationTypes:_b.containedTypes,containedTypes:_b.containedTypes,settings:_b,roots:_c,repositoryKey:this.repositoryKey});_f.placeAt(this.navigation);this.tree=_f;this.tree.resize();this.own(this.tree.watch("showAllLanguages",_3.hitch(this,function(){this.search.set("filterOnCulture",!this.tree.get("showAllLanguages"));})));}));},layout:function(){var cb=this._contentBox,ocb=this._oldContentBox;if(!cb){return;}if(!ocb||cb.w!==ocb.w||cb.h!==ocb.h){this._oldContentBox=cb;var sb=_4.getMarginBox(this.search.domNode);_4.setMarginBox(this.navigation,{w:cb.w,h:cb.h-sb.h});}}});});