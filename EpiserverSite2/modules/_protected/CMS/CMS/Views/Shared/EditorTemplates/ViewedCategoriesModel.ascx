<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.Personalization.VisitorGroups.Criteria.ViewedCategoriesModel>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>
<div>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.SelectedCategory, null, Html.Translate("/shell/cms/visitorgroups/criteria/categories/categorylabel"), "epi-criteria-label")%> 
    </span>
    <span class="epi-criteria-inlineblock">
        <%= Html.DojoEditorFor(p => p.NumberOfPageViews, new { @class = "epi-criteria-intinput" }, Html.Translate("/shell/cms/visitorgroups/criteria/categories/numberofpageviewslabel"), "epi-criteria-label")%> 
        <label class="epi-criteria-label" for="NumberOfPageViews"><%= Html.Translate("/shell/cms/visitorgroups/criteria/categories/totalcountlabel")%> <strong id="numberOfPagesUsingCategoryDislay">0</strong>.</label>
    </span>
</div>
