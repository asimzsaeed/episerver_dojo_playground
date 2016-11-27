<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Settings>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.XFormsViewer" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<div class="cms-XFormsViewer-fieldListPanel">
    <fieldset>
        <legend>
            <%= Html.Translate("/shell/cms/XFormsViewer/SelectFields") %>
        </legend>
        <span class="error" htmlFor="Fields" style="display:none"><%=Html.Translate("/shell/cms/XFormsViewer/error/formfields") %></span>
        <% if (Model.AllXFormFields.Count() > 0)
           {
               int i = 0;
                %>
        <ul>
            <% foreach (string field in Model.AllXFormFields)
               {
                   string inputId = "checkBox-" + Model.GadgetId.ToString() + "-" + i++;
            %>
            <li>
                <input 
                    type="checkbox" 
                    id="<%= inputId %>" 
                    class="required" 
                    name="Fields" 
                    value="<%= field %>" 
                    <%= Model.Fields.Contains(field) ? "checked='checked'" : String.Empty %> />
                    
                <label for="<%= inputId %>"><%= field %></label>
            </li>
            <% } %>
        </ul>
        <% } %>
        <%= (Model.AllXFormFields.Count() == 0) ? Html.Translate("/shell/cms/XFormsViewer/NoFieldsAvailable") : String.Empty%>
    </fieldset>
</div>
