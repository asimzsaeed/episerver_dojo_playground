<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>

<% 
    string namingContainer = ViewData["NamingContainer"].ToString();
%>

<span class="epi-criteria-inlineblock"><%= Html.DropDownList(namingContainer + "ProfileKey", null, new { dojoType = "dijit.form.FilteringSelect", selectOnClick = true })%></span>
<span class="epi-criteria-inlineblock" id='<%= namingContainer + "MatchTypeContainer" %>'><%= Html.DropDownList(namingContainer + "MatchType", null, new { dojoType = "dijit.form.FilteringSelect", selectOnClick = true })%></span>
<span class="epi-criteria-inlineblock" id='<%= namingContainer + "MatchValueContainer" %>'></span>
