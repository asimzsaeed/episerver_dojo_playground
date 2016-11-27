<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Personalization.VisitorGroups.Criteria.TimeOfDayModel>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>
<div>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.StartTime, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/starttime"), "epi-criteria-label")%>
    </span>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.EndTime, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/endtime"), "epi-criteria-label")%>
    </span>
    <div id="dayDropdown">
        <span><%= Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/daysofweek")%></span>
        <div id="dayCheckboxes">
            <div><%= Html.DojoEditorFor(p => p.Monday, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/monday"), null, DojoHtmlExtensions.LabelPosition.Right)%></div>
            <div><%= Html.DojoEditorFor(p => p.Tuesday, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/tuesday"), null, DojoHtmlExtensions.LabelPosition.Right)%></div>
            <div><%= Html.DojoEditorFor(p => p.Wednesday, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/wednesday"), null, DojoHtmlExtensions.LabelPosition.Right)%></div>
            <div><%= Html.DojoEditorFor(p => p.Thursday, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/thursday"), null, DojoHtmlExtensions.LabelPosition.Right)%></div>
            <div><%= Html.DojoEditorFor(p => p.Friday, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/friday"), null, DojoHtmlExtensions.LabelPosition.Right)%></div>
            <div><%= Html.DojoEditorFor(p => p.Saturday, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/saturday"), null, DojoHtmlExtensions.LabelPosition.Right)%></div>
            <div><%= Html.DojoEditorFor(p => p.Sunday, null, Html.Translate("/shell/cms/visitorgroups/criteria/timeofday/sunday"), null, DojoHtmlExtensions.LabelPosition.Right)%></div>
        </div>
    </div>
</div>