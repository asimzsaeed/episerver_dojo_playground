<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Personalization.VisitorGroups.Criteria.HostNameReferrerModel>" %>
<%@ Import Namespace="EPiServer.Web.Mvc.VisitorGroups" %>
<div>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.MatchType)%>
    </span>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.HostName, new { @class = "episize200" }, true, "dijitReset dijitInputInner")%> 
    </span>
</div>