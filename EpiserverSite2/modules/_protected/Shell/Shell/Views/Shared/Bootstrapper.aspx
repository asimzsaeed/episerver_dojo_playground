<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<EPiServer.Shell.Web.Mvc.BootstrapperViewModel>" MasterPageFile="Sleek.Master" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Framework.Web.Resources"%>
<%@ Import Namespace="EPiServer.Framework.Serialization" %>
<%@ Import Namespace="EPiServer.Shell.Navigation" %>
<%@ Import Namespace="EPiServer.Shell.Web" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Shell.UI.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Shell.UI.Web.Resources" %>

<asp:Content ContentPlaceHolderID="TitleContent" runat="server"><%: Model.ViewTitle %></asp:Content>

<asp:Content ContentPlaceHolderID="HeaderContent" runat="server">
    <%= Page.ClientResources("navigation", new[] { ClientResourceType.Style })%>
    <%= Html.RequiredClientResources("BootstrapperHeader") %>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <% if (Model.GlobalNavigationMenuType.Equals(GlobalNavigationMenuType.PullDown)) { %>
    <div id="globalMenuContainer" class="epi-navigation-container epi-navigationContainer" data-dojo-type="epi/shell/widget/GlobalMenu">
        <%= Html.GlobalMenu()%>
    </div>
    <% } %>
    <% if (Model.UseContainers) { %>
    <div data-dojo-type="dijit/layout/BorderContainer" id="rootContainer" gutters="false" style="padding: 0;height: 100%; width: 100%;">
        <% if (Model.GlobalNavigationMenuType.Equals(GlobalNavigationMenuType.Static)) { %>
        <div data-dojo-type="dijit/layout/ContentPane" class="epi-navigationContainer" region="top" style="border:0; overflow:visible; z-index:900">
            <%-- /* z-index to make menu drop-downs appear above view content */ --%>
            <%= Html.GlobalMenu()%>
        </div>
        <% } %>
        <div data-dojo-type="epi/shell/widget/LicenseInformation" region="top"></div>
        <div id="applicationContainer" class="epi-applicationContainer" data-dojo-type="epi/shell/widget/Application" region="center"></div>
    </div>
    <% } else { %>
        <% if (Model.GlobalNavigationMenuType.Equals(GlobalNavigationMenuType.Static)) { %>
        <div class="epi-navigationContainer">
            <%= Html.GlobalMenu()%>
        </div>
        <% } %>
        <div id="applicationContainer" class="epi-applicationContainer" data-dojo-type="epi/shell/widget/Application" style="height: 100%">
            <div></div>
        </div>
    <% } %>
</asp:Content>

<asp:Content ContentPlaceHolderID="ScriptContent" runat="server">
    
    <%= Page.ClientResources("navigation", new[] { ClientResourceType.Script }) %>

    <%--Add the scripts required for bootstrapping the app. Anything else will be loaded lazily by the ModuleManager --%>
    <%= Html.ModuleScripts(Model.Modules.GetStartupModules(Model.ModuleName)) %>

    <script type="text/javascript">
        
        require(["epi/shell/Bootstrapper"], function(Bootstrapper) {

            var settings = <%= Html.SerializeObject(Model.Modules, KnownContentTypes.Json).Replace("<", "&lt;").Replace(">", "&gt;") %>,
                viewSettings = <%= Html.SerializeObject(Model.ViewSettings, KnownContentTypes.Json).Replace("<", "&lt;").Replace(">", "&gt;") %>,
                bootStrapper = new Bootstrapper(settings);
            
            bootStrapper.initializeApplication("<%: Model.ViewName  %>", "<%: Model.ModuleName %>", viewSettings).then(function() {
                require([
                        "dojo/_base/connect",
                        "dojo/parser",
                        "dijit/registry",
                        "dijit/layout/BorderContainer",
                        "dijit/layout/ContentPane",
                        "epi/shell/widget/GlobalMenu",
                        "epi/shell/widget/Application",
                        "epi/shell/widget/LicenseInformation",
                        "epi/shell/widget/ApplicationContentPane",
                        "dojo/domReady!"], 
                    function (connect, parser, registry) {

                        parser.parse();

                        <% if (Model.UseContainers) { %>
                        // Trigger layout when the global navigation changes its layout.
                        connect.subscribe("/epi/shell/globalnavigation/layoutchange", null,  function() { 
                            registry.byId("rootContainer").layout(); 
                        });
                        <% } %>
                    });
            });
        });
    </script>

</asp:Content>