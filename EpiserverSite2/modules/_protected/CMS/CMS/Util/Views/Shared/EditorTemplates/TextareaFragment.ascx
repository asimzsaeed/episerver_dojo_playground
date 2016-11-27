<%@ Import Namespace="EPiServer.XForms.Parsing" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<TextareaFragment>" %>

<% string inputId = "Input_" + Guid.NewGuid().ToString(); %>

<label title="<%: Model.Title %>" for="<%: inputId %>">
    <%: Html.DisplayFor(model => model.Label)%>
</label>
<%: Html.TextArea(Model.Reference, Model.Value, Model.Rows, Model.Columns, new { id = inputId, @class = Model.Class })%>
<%: Html.ValidationMessage(Model.ValidationReference)%>
