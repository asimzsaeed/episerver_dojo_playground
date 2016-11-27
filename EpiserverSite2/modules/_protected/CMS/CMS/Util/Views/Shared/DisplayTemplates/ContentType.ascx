<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.DataAbstraction.ContentType>" %>
<%: (Model != null ? Model.LocalizedFullName : String.Empty) %>