<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<IEnumerable<SearchProviderPair>>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Shell" %>
<%@ Import Namespace="EPiServer.Shell.Search" %> 
<%@ Import Namespace="EPiServer.Shell.UI" %> 
<%@ Import Namespace="EPiServer.Shell.UI.Models" %> 
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
    <head runat="server">
	    <title><%= Html.Translate("/EPiServer/Shell/UI/Views/Search/Resources/Heading") %></title>
        <!-- Shell -->
        <%=Page.ClientResources("ShellCore")%>
             
         <!-- LightTheme -->
        <%=Page.ClientResources("ShellCoreLightTheme")%>
        
        <!-- Navigation -->
        <%=Page.ClientResources("Navigation")%>
        <script type="text/javascript" src="<%= Paths.ToClientResource(typeof(SearchProviderPair), "ClientResources/EPi/Views/Search/Search.Settings.js") %>"></script>
    </head>
    <body>
        <div class="epi-contentContainer epi-padding">
            <div class="epi-contentArea">
                <h1 class="EP-prefix">
                    <%= Html.Translate("/EPiServer/Shell/UI/Views/Search/Resources/Heading") %>
                    <%= Html.HelpButton()%>
                </h1>
                <div id="searchFeedback" class="epi-feedbackContent epi-feedbackContent-info epi-margin-bottom epi-marginVertical">
                <%= Html.Translate("/EPiServer/Shell/UI/Views/Search/Resources/SettingsSaved") %></div>
                <p><%= Html.Translate("/EPiServer/Shell/UI/Views/Search/Resources/Description") %></p>
                
                <div class="epi-paddingVertical-small">
                    <form action="<%= Url.Action("Save") %>" id="searchSettingsForm">
                        <ol class="epi-searchSortable">
                        <%foreach (var providerSetting in Model){ %>
                            <li id="<%= providerSetting.ProviderKey %>" title="<%= providerSetting.Provider.Area %>" class="epi-padding-small">
                                <%= Html.LabeledCheckBox("IsEnabled", providerSetting.Provider.Category, providerSetting.Setting.IsEnabled, new { @class = "isEnabled" }, new { @class = "epi-checkBoxLabel" })%>
                            </li>
                        <%}%>
                        </ol>
                        <div class="epi-buttonContainer">
                            <%= Html.AntiForgeryToken() %>
                            <%= Html.ShellSubmitButton(null, Html.Translate("/EPiServer/Shell/Resources/Texts/Save"), new {id = "saveSettingsButton"})%>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </body>
</html>