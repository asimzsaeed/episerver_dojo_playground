<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Settings>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.ExternalLinks" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<div class="epi-paddingHorizontal-small epi-formArea">
    <% Func<int, SelectListItem> func = value => new SelectListItem { Text = value.ToString(), Value = value.ToString(), Selected = Model.PageSize == value };
       var list = new[] { func(5), func(20), func(50), func(100) };
       Html.BeginGadgetForm("Configure"); %>
       <%= Html.AntiForgeryToken() %>
    <fieldset>
        <legend>
            <%= Html.Translate("/shell/cms/externallinks/settings/legend") %>
        </legend>
        <div class="epi-size15">
            <div>
                <%= Html.LabeledCheckBox("showDetails", Html.Translate("/shell/cms/externallinks/settings/showdetails"), Model.ShowDetails)%>
            </div>
            <div>
                <%= Html.LabeledDropDownList("pageSize", Html.Translate("/shell/cms/externallinks/settings/pagesize"), list, new { @class = "epi-size3" }, null)%>
            </div>
        </div>
    </fieldset>
    <div class="epi-buttonContainer-simple">
        <%= Html.AcceptButton(new { @class = "epi-button-small" })%>
        <%= Html.CancelButton(new { @class = "epi-button-small" })%>
    </div>
    <% Html.EndForm(); %>
</div>
