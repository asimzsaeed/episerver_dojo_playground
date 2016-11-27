<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<ul style="font-size:.9em">
<% 
    foreach(object item in Model) {
        Response.Write("<li>");
        Response.Write(item);
        Html.RenderPartial("Something", item);
        Response.Write("</li>");
    }
%>
</ul>