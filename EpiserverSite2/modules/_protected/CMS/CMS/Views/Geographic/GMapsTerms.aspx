<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>

<%@ Register TagPrefix="EPiServerUI" Namespace="EPiServer.UI.WebControls" Assembly="EPiServer.UI" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/googlemapsterms/title")%></title>
<%= Html.CssLink(EPiServer.Web.PageExtensions.ThemeUtility.GetCssThemeUrl(Page, "system.css"))%>
<%= Html.CssLink(EPiServer.Web.PageExtensions.ThemeUtility.GetCssThemeUrl(Page, "ToolButton.css"))%>
<%= Page.ClientResources("ShellCore") %>
<%= Page.ClientResources("ShellCoreLightTheme") %>
</head>
<body>

<div class="epi-padding epi-contentContainer epi-fullWidth">

    <div class="epi-contentArea">
        <h1>
            <%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/googlemapsterms/title")%>
        </h1>
    </div>

<% if ((bool)ViewData["acceptedTerms"])
   { %>
   
    <div class="epi-contentArea">
        <p><%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/googlemapsterms/thankyoutext")%></p>
        
        <p><%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/googlemapsterms/customurltext")%></p>
        
        <span class="epi-cmsButton">
                <input type="button" 
                    value="<%= Html.Translate("/button/close") %>" 
                    onclick="window.close();"
                    class="epi-cmsButton-text epi-cmsButton-tools epi-cmsButton-Cancel" />
        </span>
    </div>
   
<% }
   else
   { %>
    <% Html.BeginForm("AcceptTerms", "Geographic"); %>
    <div class="epi-formArea">
        <p><%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/googlemapsterms/accepttext")%></p>
        
        <p><a href="http://code.google.com/apis/maps/terms.html" target="_blank"><%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/googlemapsterms/reviewlink")%></a></p>

        <p><%= Html.CheckBox("acceptedTerms", false)%> <label for="acceptedTerms"><%= Html.Translate("/shell/cms/visitorgroups/criteria/geographiccoordinate/googlemapsterms/agreecheckbox")%></label></p>

        <span class="epi-cmsButton">
                <input type="submit" 
                    value="<%= Html.Translate("/button/ok") %>" 
                    class="epi-cmsButton-text epi-cmsButton-tools epi-cmsButton-Check" />
        </span>

    </div>
    <% Html.EndForm(); %>
<% } %>
</div>
</body>
</html>