<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<NotesData>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models" %>

<%= Html.AntiForgeryToken() %>
<div tabindex="0" class="epi-padding epi-wordWrap notesArea" style="font-size: <%=Model.FontSize%>;background-color: <%=Model.BackgroundColor%>"><%=Model.Content%></div>