<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<EPiServer.Shell.Web.Mvc.BootstrapperViewModel>" MasterPageFile="../../Views/Shared/Sleek.Master" %>
<%@ Import Namespace="EPiServer.Shell" %>
<%@ Import Namespace="EPiServer.Shell.Navigation" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Shell.Web.Resources" %>
<%@ Import Namespace="EPiServer.Shell.ViewComposition" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>


<asp:Content ContentPlaceHolderID="ScriptContent" runat="server">

    <% 
        // HACK: for firebug debugging
        // TODO: add server side config directive to enable/disable this
        if (true)
       {  %>
    <script type="text/javascript">
        dojo["eval"] = function (scriptFragment) { return eval(scriptFragment); }
    </script>
    <% } %>

    <script type="text/javascript">
        dojo.require("dojo.parser");
        dojo.require("dijit.layout.BorderContainer");
        dojo.require("dijit.layout.ContentPane");

        dojo.ready(function () {
            dojo.parser.parse();
            new epi.shell.Bootstrapper("<%: Model.viewName  %>", <%= new JavaScriptSerializer().Serialize(Model.modules) %>, ["applicationContainer"]);
        }); 
    </script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <div dojoType="dijit.layout.BorderContainer" style="padding: 0px; height: 100%; width: 100%;">
        <div dojoType="dijit.layout.ContentPane" region="top">
            <%= Html.GlobalMenu()%>
        </div>
        <div id="applicationContainer" dojoType="dijit.layout.ContentPane" region="center"></div>
    </div>
</asp:Content>
