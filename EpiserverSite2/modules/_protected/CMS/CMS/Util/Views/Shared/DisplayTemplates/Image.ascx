<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Core.ContentReference>" %>
<%@ Import Namespace="EPiServer.Web.Mvc.Html" %>

<img src="<%: Url.ContentUrl(Model) %>" alt="" />