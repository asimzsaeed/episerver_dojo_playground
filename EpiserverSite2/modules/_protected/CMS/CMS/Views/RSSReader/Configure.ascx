<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Settings>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Core" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.RssReader" %>

<%= Html.ShellValidationSummary()%>

<div class="epi-paddingHorizontal-small epi-formArea">
    <% Html.BeginGadgetForm("StoreConfiguration"); %>
        <%= Html.AntiForgeryToken()%>
        <fieldset>
            <legend><%= Html.Translate("/EPiServer/Shell/Resources/Texts/Settings") %></legend>
            <div class="epi-size10">
                <div>
                    <%= Html.LabeledTextBox("FeedUrl", Html.Translate("/shell/cms/rssgadget/settings/feedurl"), null, new { @class = "epi-size20 required" }, null)%>
                </div>
                <div>
                    <%= Html.LabeledTextBox("FeedItemsToShow", Html.Translate("/shell/cms/rssgadget/settings/itemstoshow"), null, new { @class = "epi-size3", maxlength = 2}, null)%>
                </div>
                <div>
                    <%= Html.LabeledTextBox("Title", Html.Translate("/shell/cms/rssgadget/settings/title"), null, new { @class = "epi-size15 required nohtml" }, null)%>
                    <%= Html.ShellButton(null, Html.Translate("/shell/cms/rssgadget/settings/loadfeedtitle"), "epi-button-small", new { id = "fetchTitleButton" })%>
                </div>
            </div>
        </fieldset>
        <div class="epi-buttonContainer-simple">
            <%= Html.AcceptButton() %>
<%--            
            // Clear the default onclick which otherwise loads the default view (Index)
            // This is instead handled in RSSReader.js
--%>            
            <%= Html.CancelButton(new { onclick = String.Empty }) %>
        </div>
    <% Html.EndForm(); %>
</div>
