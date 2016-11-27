<%@ Import Namespace="EPiServer.Web.Mvc.Html" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Core.XhtmlString>" %>
<% 
    Html.RenderXhtmlString(Model);
%>