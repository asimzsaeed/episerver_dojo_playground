<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.SpecializedProperties.LinkItemCollection>" %>
<%@ Import Namespace="EPiServer.Web.Mvc.Html" %>
<ul>
    <% foreach(var linkItem in Model ?? Enumerable.Empty<EPiServer.SpecializedProperties.LinkItem>()) %>
    <% { %>
        <li>
            <%: Html.ContentLink(linkItem)%> 
        </li>
    <% } %>
</ul>