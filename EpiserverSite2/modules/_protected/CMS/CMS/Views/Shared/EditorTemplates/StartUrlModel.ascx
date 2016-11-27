<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Personalization.VisitorGroups.Criteria.StartUrlModel>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>

<div>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.MatchType)%> 
    </span>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.Url, new { @class = "episize300" }, Html.Translate("/shell/cms/visitorgroups/criteria/starturl/url"), "epi-criteria-label")%>
    </span>
</div>