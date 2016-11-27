<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Url>" %>
<%@ Import Namespace="EPiServer.Web.Mvc.Html" %>
<%: Html.ContentLink(Model) %>