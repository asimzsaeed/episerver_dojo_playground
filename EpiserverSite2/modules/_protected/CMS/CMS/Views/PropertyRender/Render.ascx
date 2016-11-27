<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Web.Mvc.Html" %>
<%: Html.Display("Property", ViewData["templateName"] as string) %>