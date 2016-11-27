<%@ Import Namespace="EPiServer.XForms.Parsing" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<SelectFragment>" %>
<fieldset class="<%: Model.Class %> orientation<%: Model.Orientation %>">
    <legend>
        <%: Model.Label %>
    </legend>
    <div title="<%: Model.Title %>">
        <% foreach (SelectOption selectoption in Model.Options)
           { %>

        <label for="<%: selectoption.Id %>">
            <%: Html.CheckBox(selectoption.Id, selectoption.SelectedItem, new { id = selectoption.Id })%>
            <%: Html.Raw(selectoption.Text) %>
        </label>
        <%} %>
        <%: Html.ValidationMessage(Model.ValidationReference)%>
    </div>
</fieldset>
