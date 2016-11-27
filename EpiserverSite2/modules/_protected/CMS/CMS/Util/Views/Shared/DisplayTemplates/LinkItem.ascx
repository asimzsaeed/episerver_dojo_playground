<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.SpecializedProperties.LinkItem>" %>
<%@ Import Namespace="EPiServer.Web.Mvc.Html" %>
<%: Html.ContentLink(Model) %>