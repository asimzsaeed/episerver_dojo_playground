//>>built
define("epi/shell/PropertyMetadata",["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","epi/shell/TypeDescriptorManager"],function(_1,_2,_3,_4){var _5=_1([],{_propertyMap:null,constructor:function(_6,_7){_1.safeMixin(this,_6);if(_7){if(_7.getName()){this._fullName=_7.getName()+"."+this.name;}else{this._fullName=this.name;}if(this.name){var _8="properties."+this.name.toLowerCase();var _9=_2.getObject("additionalValues.modelTypeIdentifier",false,_7);if(_9){var _a=_4.getResourceValue(_9,_8);if(_a&&_a.caption){this.displayName=_a.caption;}}}}this._propertyMap={};_3.forEach(this.properties,function(_b){var _c=new _5(_b,this);this._propertyMap[_c.name.toLowerCase()]=_c;},this);},hasSubProperties:function(){return (this.properties&&this.properties.length);},getPropertyMetadata:function(_d){var _e=_d.toLowerCase().split(".");return this._getPropertyMetaData(_e);},getName:function(){return this._fullName;},_getPropertyMetaData:function(_f){var _10=_f.shift();var _11=this._propertyMap[_10]||this._propertyMap[this._getMappedName(_10)];if(_11&&_f.length){return _11._getPropertyMetaData(_f);}return _11;},_getMappedName:function(_12){var _13;_3.some(this.mappedProperties||[],function(_14){return _14.from.toLowerCase()===_12&&(_13=_14);});return _13?_13.to.toLowerCase():_12;}});return _5;});