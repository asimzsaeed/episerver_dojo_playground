<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Framework.Web.Resources"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/coordinatepicker") %></title>
<script type="text/javascript" src="<%= Server.HtmlEncode(EPiServer.Configuration.Settings.Instance.GoogleMapsApiV3Url) %>"></script>
<script type="text/javascript">

var parameters = <%= ViewData["ParametersJson"] %>; 

var map;
var currentMarker;
var geocoder;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var startingPoint = new google.maps.LatLng(parameters.latitude, parameters.longitude);
    var mapOptions = {
        zoom: 2,
        center: startingPoint,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);

    if (startingPoint.lat() != 0 && startingPoint.lng() != 0)
    {
        setMarker(startingPoint);
    }

    google.maps.event.addListener(map, 'click', function(event) {
        setMarker(event.latLng);
    });
}

function setMarker(location) {
    if (currentMarker)
    {
        currentMarker.setMap(null);
    }
    
    currentMarker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function saveToOpener(location) {
    geocoder.geocode({'latLng': location}, function(results, status) {
        var address = '';
        var showLatLng = true;
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
            showLatLng = false;
            for (var i=0; i < results[0].types.length; i++) {
                if (results[0].types[i]=='country') {
                    showLatLng = true;
                    break;
                }
            }
        
            address = results[0].formatted_address;
        }

        if (window.opener) {
            window.opener.pluginMethods[parameters.typeName].setGeographicCoordinates(parameters.namingContainer, {'location': address, 'latitude': location.lat(), 'longitude': location.lng(), 'showLatLng': showLatLng});
            window.close();
        }
    });
}
</script>
<style type="text/css">
html, body {
    margin:0;
    padding:0;
    height:100%;
}

#map_canvas {
    position: absolute;
    width: 100%;
    top: 0px;
    bottom: 40px;
}

#toolbar {
    position: absolute;
    width: 100%;
    height: 40px;
    bottom: 0px;
    text-align: right;
}
</style>
<%= Html.CssLink(EPiServer.Web.PageExtensions.ThemeUtility.GetCssThemeUrl(Page, "system.css"))%>
<%= Html.CssLink(EPiServer.Web.PageExtensions.ThemeUtility.GetCssThemeUrl(Page, "ToolButton.css"))%>
<%= Page.ClientResources("ShellCore") %>
<%= Page.ClientResources("ShellCoreLightTheme") %>
<%= Html.ScriptResource(EPiServer.UriSupport.ResolveUrlFromUIBySettings("javascript/system.js")) %>
</head>
<body onload="initialize();">
<div id="map_canvas">Javascript is required</div>
<div id="toolbar" class="epiemptybackground">
    <div style="margin: 0.7em">
        <span class="epi-cmsButton">
                <input type="button" 
                    value="<%= Html.Translate("/button/ok") %>" 
                    onclick="saveToOpener(currentMarker.getPosition());"
                    onmouseover="EPi.ToolButton.MouseDownHandler(this)" 
                    onmouseout="EPi.ToolButton.ResetMouseDownHandler(this)" 
                    class="epi-cmsButton-text epi-cmsButton-tools epi-cmsButton-Check" />
        </span>
        <span class="epi-cmsButton">
                <input type="button" 
                    value="<%= Html.Translate("/button/cancel") %>" 
                    onclick="window.close();"
                    onmouseover="EPi.ToolButton.MouseDownHandler(this)" 
                    onmouseout="EPi.ToolButton.ResetMouseDownHandler(this)" 
                    class="epi-cmsButton-text epi-cmsButton-tools epi-cmsButton-Cancel" />
        </span>
   </div>
</div>
</body>
</html>