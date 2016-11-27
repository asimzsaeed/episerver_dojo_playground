<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<LinkViewData>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Shell.Web"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Shell"%>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.BrokenLinks" %>
<td>
    <%= Html.Anchor(Model.ReferredUrl, "EPiServerLinkPreview", "", Model.ReferredUrl, 50)%>
</td>
<td><%= Model.StatusText %></td>
<td title="<%= Model.BrokenSince %>"><%= Model.BrokenSince.ToFriendlyDateString()%></td>
<td title="<%= Model.LastChecked %>"><%= Model.LastChecked.ToFriendlyDateString()%></td>