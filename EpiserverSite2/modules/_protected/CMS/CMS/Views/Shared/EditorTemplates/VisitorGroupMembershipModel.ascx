<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Personalization.VisitorGroups.Criteria.VisitorGroupMembershipModel>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>
<div>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.MembershipStatus)%>
    </span>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.VisitorGroupId) %>
    </span>
</div>
