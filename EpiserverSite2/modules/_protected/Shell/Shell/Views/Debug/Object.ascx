<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<object>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<ul style="font-size:.9em">
    <% if (Model == null){ %>
        (null)
    <% } else { foreach (var pi in Model.GetType().GetProperties()) { %>
        <li><%= pi.Name %>: <% try { Response.Write(pi.GetValue(Model, null)); } catch (Exception ex) { Response.Write(ex.Message); } %></li>
    <% }} %>
</ul>