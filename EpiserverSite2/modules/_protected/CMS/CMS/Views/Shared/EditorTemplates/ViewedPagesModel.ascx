<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Personalization.VisitorGroups.Criteria.ViewedPagesModel>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>
<div>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.ViewedPage, new { @class = "episize200" }, null, "dijitReset dijitInputInner")%> 
    </span>
</div>
