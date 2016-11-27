<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Personalization.VisitorGroups.Criteria.NumberOfVisitsModel>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups.Criteria" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>

<div id='numberofvisits'>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(model => model.Comparison) %>
    </span>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(model => model.Threshold, new { @class = "epi-criteria-intinput" })%>
    </span>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(model => model.TimeFrameSelection)%>
    </span>
    <span id='fixtime' class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(model => model.FixTime, new { @class = "epi-criteria-dateinput" })%>
    </span>
    <span id='floattime' class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(model => model.FloatTimeValue, new { @class = "epi-criteria-intinput" })%>
        <%= Html.DojoEditorFor(model => model.FloatTimePeriod)%>
    </span>
</div>