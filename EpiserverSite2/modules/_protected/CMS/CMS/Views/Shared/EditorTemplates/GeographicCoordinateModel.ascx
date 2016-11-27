<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Personalization.VisitorGroups.Criteria.GeographicCoordinateModel>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>

<div>
    <div class="epi-criteria-block">
        <span id="LocationPlaceholder" class="epi-criteria-inlineblock">
            <%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/location") %><span id="DisplayLocation"></span>
        </span>
        <span id="LatitudeLongitudePlaceholder" class="epi-criteria-inlineblock">
            <%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/latitude") %><span id="DisplayLatitude"></span>
            <%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/longitude") %><span id="DisplayLongitude"></span>
        </span>
        <%= Html.HiddenFor(p => p.Location) %>
        <span class="epi-criteria-inlineblock"><input id="SelectLocation" type="button" value="<%= Server.HtmlEncode(Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/selectlocation")) %>" /></span>
    </div>
    <div class="epi-criteria-block">
        <span class="epi-criteria-inlineblock">
            <%= Html.DojoEditorFor(p => p.Radius, new { @class = "epi-criteria-intinput" }, Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/radius"), "epi-criteria-label")%>
            <%= Html.DojoEditorFor(p => p.RadiusUnit) %>
        </span>
    </div>
    <%= Html.HiddenFor(p => p.Latitude) %>
    <%= Html.HiddenFor(p => p.Longitude) %>
</div>