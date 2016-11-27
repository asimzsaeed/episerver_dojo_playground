<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<NotesData>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models" %>

<div class="epi-formArea epi-paddingHorizontal-small">
    <% Html.BeginGadgetForm("StoreConfiguration"); %>
        <%= Html.AntiForgeryToken() %>
        <fieldset>
            <legend><%= Html.Translate("/EPiServer/Shell/Resources/Texts/Settings") %></legend>
            <div class="epi-size10">
                <div>
                    <%= Html.LabeledDropDownList("data.FontSize", Html.Translate("/shell/cms/notesgadget/textsize"), Model.TestSizeOptions)%>
                </div>
                <div>
                    <%= Html.LabeledDropDownList("data.BackgroundColor", Html.Translate("/shell/cms/notesgadget/backgroundcolor"), Model.BackgroundColorOptions, new { @class = "notesSelect" }, null)%>
                </div>
            </div>
        </fieldset>
        
        <div class="epi-buttonContainer-simple">
            <%= Html.AcceptButton()%>        
            <%= Html.CancelButton()%>        
        </div>
        
    <% Html.EndForm(); %>
</div>
