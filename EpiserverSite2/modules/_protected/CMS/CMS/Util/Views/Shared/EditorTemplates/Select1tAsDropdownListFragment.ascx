<%@ Import Namespace="EPiServer.XForms.Parsing" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Select1Fragment>" %>

<% string inputId = "Input_" + Guid.NewGuid().ToString(); %>

<label title="<%: Model.Title %>" for="<%: inputId %>">
    <%: Model.Label %>
</label>
<%: Html.DropDownList(Model.Reference, Model.Options.Select(o => new SelectListItem() { Text = Server.HtmlDecode(o.Text), Value = Server.HtmlDecode(o.Value), Selected = o.SelectedItem }), 
    new { @class = Model.Class, @title = Model.Title, @id = inputId })%>
<%: Html.ValidationMessage(Model.ValidationReference)%>
