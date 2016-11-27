<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable<SearchProviderViewModel>>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%@ Import Namespace="EPiServer.Framework.Serialization" %> 
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Shell.UI.Models" %>

<script type="text/javascript" src="<%= Url.Action("GetLocalizationResource", "Resources", new {typeName = "episerver.shell.ui.views.search.resources", culture = System.Threading.Thread.CurrentThread.CurrentUICulture })%>"></script>

<script type="text/javascript">
    epi.search.initialize(<%= Html.SerializeObject(ViewData.Model, KnownContentTypes.Json) %>);
    $("#epiSearchForm").bind("submit", epi.search.performSearch);
</script>

<div id="epiSearch" class="epi-search">
    <form id="epiSearchForm" action="<%= Url.Action("Search") %>" class="epi-searchBox" role="search">
        <label for="epiSearchQuery"><%= Html.Translate("/EPiServer/Shell/UI/Views/Search/Resources/LabelSearchText")%></label>
        <%= Html.TextBox("epiSearchQuery", null, new { @class = "epi-searchInput"}) %>
        <%= Html.ShellSubmitButton(null, Html.Translate("/EPiServer/Shell/UI/Views/Search/Resources/ButtonSearchText"), null)%>
    </form>
    <div id="epiSearchResultContainer">
        <% foreach (var provider in ViewData.Model) { %>
            <div id="epiProviderResult<%= provider.Id  %>" class="clearfix epi-searchProviderResult epi-noDisplay">
                <div class="epi-searchProviderCategory">
                    <h2 class="epi-wordWrap"><%= provider.Category %></h2>
                </div>
                <div class="epi-searchProviderHits">
                    <ol />
                </div>
            </div>
        <% } %>
        <div id="epiSearchNoResultMessage" class="epi-noDisplay">
            <%= Html.Translate("/EPiServer/Shell/UI/Views/Search/Resources/NoResultMessage") %>
        </div>
    </div>
</div>
