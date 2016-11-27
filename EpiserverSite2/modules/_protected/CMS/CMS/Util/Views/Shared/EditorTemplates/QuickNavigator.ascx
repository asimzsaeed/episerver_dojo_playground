<%@ Import Namespace="EPiServer.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer" %>
<%@ Import Namespace="EPiServer.Core" %>
<%@ Import Namespace="EPiServer.Framework.Localization" %>
<%@ Import Namespace="EPiServer.Globalization" %>

<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<QuickNavigatorMenu>" %>

<%--Only render the menu when user has edit right--%>
<%if (!EPiServer.Security.PrincipalInfo.HasEditAccess) { return; } %>

<link rel="stylesheet" href='<%: UriSupport.ResolveUrlFromUtilBySettings("styles/quicknavigator.css") %>' media="all"/>
<script type='text/javascript' src='<%= UriSupport.ResolveUrlFromUtilBySettings("javascript/quicknavigator.js") %>'></script>

<script type="text/javascript">
    (function () { new epi.QuickNavigator(<%= Model.SerializeSettings() %>); }());
</script>