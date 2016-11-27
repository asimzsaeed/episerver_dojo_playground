<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Settings>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.XFormsViewer" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<%= Html.ShellValidationSummary()%>
<div class="epi-paddingHorizontal-small epi-formArea">
    <% Html.BeginGadgetForm("Configure"); %>
    <%= Html.AntiForgeryToken() %>
    <fieldset>
        <legend>
            <%= Html.Translate("/shell/cms/XFormsViewer/settings")%>
        </legend>
        <div class="epi-size15">
            <div>
                <%= Html.LabeledCheckBox("DemoMode", Html.Translate("/shell/cms/XFormsViewer/DemoMode"), Model.DemoMode) %>
            </div>
            <div>
                <%= Model.AllXForms.Count() > 0 ? Html.LabeledDropDownList("XFormID", Html.Translate("/shell/cms/XFormsViewer/SelectXForm"), Model.AllXForms, new { @class = "epi-size15" }, null) : Html.Translate("/shell/cms/XFormsViewer/NoFormsAvailable") + Html.Hidden("XFormID", Guid.Empty.ToString())%>
            </div>
            <% Html.RenderPartial("FieldList", Model); %>
            <div>
                <%= Html.LabeledTextBox("NumberOfPosts", Html.Translate("/shell/cms/XFormsViewer/NumberOfPosts"), Model.NumberOfPosts, new { @class = "epi-size3", maxlength = 2 }, null) %>
            </div>
            <div>
                <%= Html.LabeledCheckBox("ShowDate", Html.Translate("/shell/cms/XFormsViewer/ShowDate"), Model.ShowDate) %>
            </div>
            <fieldset>
                <legend>
                    <%= Html.Translate("/shell/cms/XFormsViewer/ChartSettings")%>
                </legend>
                <div>
                    <%= Html.LabeledCheckBox("ShowChart", Html.Translate("/shell/cms/XFormsViewer/ShowChart"), Model.ShowChart)%>
                </div>
                <div>
                    <%= Html.LabeledDropDownList("ChartPeriodicity", Html.Translate("/shell/cms/XFormsViewer/ChartPeriodicityLabel"), Model.ChartPeriodicities, new { @class = "epi-size15" }, null)%>
                </div>
            </fieldset>
            <div>
                <%= Html.LabeledDropDownList("AutoupdateLevel", Html.Translate("/shell/cms/XFormsViewer/AutoupdateLevel"), Model.AutoupdateLevels, new { @class = "epi-size15" }, null)%>
            </div>
        </div>
    </fieldset>
    <div class="epi-buttonContainer-simple">
        <%= Html.AcceptButton(new { @class = "epi-button-small" })%>
        <%= Html.CancelButton(new { @class = "epi-button-small" })%>
    </div>
    <% Html.EndForm(); %>
</div>
