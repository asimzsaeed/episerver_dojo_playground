<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Route>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<ul>
    <li>Url: <%= Model.Url %></li>
    <li>Defaults: <% Html.RenderPartial("Collection", Model.Defaults ?? new RouteValueDictionary()); %></li>
    <li>Constraints: <% Html.RenderPartial("Collection", Model.Constraints ?? new RouteValueDictionary()); %></li>
</ul>