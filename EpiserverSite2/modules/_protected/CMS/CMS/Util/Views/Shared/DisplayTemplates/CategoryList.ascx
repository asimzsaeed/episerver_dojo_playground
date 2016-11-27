<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Core.CategoryList>" %>
<%@ Import Namespace="EPiServer.Web.Mvc.Html" %>
<%: Html.CategoryList(Model)%>