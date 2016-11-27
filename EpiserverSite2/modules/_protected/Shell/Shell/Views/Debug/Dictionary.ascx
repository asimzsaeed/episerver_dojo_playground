<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IDictionary>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<ul style="font-size:.9em">
<% foreach (DictionaryEntry item in Model)
   {
    Response.Write("<li>");
    Response.Write(item.Key);
    Html.RenderPartial("Something", item.Value);
    Response.Write("</li>");
} %>
</ul>