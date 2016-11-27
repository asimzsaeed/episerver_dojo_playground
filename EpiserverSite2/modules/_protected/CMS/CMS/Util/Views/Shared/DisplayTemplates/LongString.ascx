<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<System.String>" %>
<%@ Import Namespace="EPiServer.Core.Html" %>

<%= WebStringHelper.EncodeForWebString(Model) %>