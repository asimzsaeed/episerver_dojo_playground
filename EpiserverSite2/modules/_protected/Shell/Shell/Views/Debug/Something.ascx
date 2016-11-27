<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<object>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%
    if (Model is string)
        ViewContext.Writer.Write("<pre>" + Model + "</pre>");
    else if (Model is IDictionary)
        Html.RenderPartial("Dictionary", Model);
    else if (Model is Route)
        Html.RenderPartial("Route", Model);
    else if (Model is IEnumerable<EPiServer.Framework.Initialization.TimeMeters>)
        Html.RenderPartial("TimeMeters", Model);
    else if (Model is IEnumerable<EPiServer.Shell.UI.Controllers.FileVersionMetaData>)
        Html.RenderPartial("FileVersionMetaData", Model);
    else if (Model is IEnumerable)
        Html.RenderPartial("Collection", Model);
    else
        Html.RenderPartial("Object", Model);
%>