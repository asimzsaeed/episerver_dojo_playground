//>>built
define("epi-cms/project/viewmodels/ProjectCommentViewModel",["dojo/_base/declare","epi/i18n!epi/cms/nls/episerver.cms.activities.commentfeed","./_ProjectFeedViewModel"],function(_1,_2,_3){return _1([_3],{isSingleItemSelected:true,noDataMessage:_2.nodatamessage,_selectedProjectIdSetter:function(_4){this.selectedProjectId=_4;this.set("store",_4?this.activitiesStore:null);this.set("query",{projectId:_4,activityType:"ProjectMessageActivity"});}});});