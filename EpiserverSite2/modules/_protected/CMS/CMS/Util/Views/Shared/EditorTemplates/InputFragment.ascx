<%@ Import Namespace="EPiServer.XForms.Parsing" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<InputFragment>" %>

<% string inputId = "Input_" + Guid.NewGuid().ToString(); %>

<label title="<%: Model.Title %>" for="<%: inputId %>">
    <%: Html.DisplayFor(model => model.Label) %>
</label>
<%: Html.TextBox(Model.Reference, Server.HtmlDecode(Model.Value) ?? string.Empty, new { size = Model.Size, id=inputId, @class = Model.Class})%>
<%: Html.ValidationMessage(Model.ValidationReference)%>

