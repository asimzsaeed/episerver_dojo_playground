<%@ Page language="c#" Codebehind="DynamicContent.aspx.cs" AutoEventWireup="False" Inherits="EPiServer.UI.Editor.Dialogs.DynamicContent" %>
<%@ Register TagPrefix="EPiServerUI" TagName="Settings" Src="../../Edit/DynamicContentSettings.ascx" %>
<%@ Register TagPrefix="EPiServerUI" TagName="GroupList" Src="GroupListEditor.ascx" %>

<asp:Content id="Content2" ContentPlaceHolderID="FullRegion" runat="server">
<script type="text/javascript">
// <![CDATA[
/*
 * JavaScript support routines for EPiServer
 * Copyright (c) 2007 EPiServer AB
*/
    function OkClick()
    {
        EPi.GetDialog().Close('<%= DynamicContentMarkup %>');
    }

    function OnChange(elem) {
        //This function is for refreshing the page and sending a new parameter with the new selected value instead of
        //using autopostback to update which adapter to load. This is due to viewstate/control state issues that otherwise appear on postback.
        var rest, restindex,
            value = $(elem).val(),
            loc = document.location.search,
            ampIndex = loc.indexOf('&SelectedPlugin='),
            questIndex = loc.indexOf('?SelectedPlugin=');

        if (ampIndex > -1) {
            //Remove the old parameter by making the new query to whats before and after the parameter.
            loc = loc.substr(0, ampIndex) + GetRestOfQuery(loc, ampIndex);
        } else if (questIndex > -1) {
            rest = GetRestOfQuery(loc, questIndex);
            if (rest.length > 0) {
                loc = "?" + rest.substring(1, rest.length); //remove the first & sign from the rest and add it after the ? in the query                
            } else {
                //Since we did not have anything after the parameter location should just update with the new parameter value
                document.location.href = GetLocationBasePath() + "?SelectedPlugin=" + value;
                return;
            }
        }
        document.location.href = GetLocationBasePath() + loc + "&SelectedPlugin=" + value;
    }

    function GetRestOfQuery(loc, index) {
        //Searches the rest of the querystring for any parameters. (loc is the remaining querystring)
        var rest = loc.substr(index + 1, loc.length);
        var restindex = rest.indexOf("&");
        if (restindex > 0) {
            rest = rest.substring(restindex, rest.length);
        } else {
            rest = "";
        }
        return rest;
    }

    function GetLocationBasePath() {
        //Creates the path for the current page (only before the ? if any such exists)
        var port = document.location.port;
        var host = document.location.hostname;
        if (port.length > 0) {
            host = host + ":" + port;
        }
        return document.location.protocol + "//" + host + document.location.pathname;        
    }
// ]]>
</script>
    <EPiServerUI:BodySettings runat="server" CssClass="epiemptybackground claro" />
    <div class="epi-paddingHorizontal-small epi-formArea" style="overflow: hidden;">
        <asp:ValidationSummary CssClass="EP-validationSummary" runat="server" />
        <fieldset id="AdapterPanel" runat="server">
            <legend><asp:Literal Text="<%$ Resources: EPiServer, editor.tools.dynamiccontent.adapterheading %>" runat="server" /></legend>
            <div class="epirowcontainer">
                <asp:Label runat="server" CssClass="episize100 epiindent" AssociatedControlID="AdapterList" Text="<%$ Resources:EPiServer, editor.tools.dynamiccontent.adapterlistlabel %>" />
                <asp:DropDownList runat="server" ID="AdapterList" onchange="OnChange(this);" />
                <asp:CustomValidator runat="server" ID="AdapterValidator" Text="*" />
            </div>
            <div ID="DescriptionPanel" runat="server" class="epirowcontainer">
                <asp:Label runat="server" AssociatedControlID="AdapterDescription" CssClass="episize100 epiindent" Text="<%$ Resources:EPiServer, editor.tools.dynamiccontent.adapterdescriptionlabel %>" />
                <span class="episize300">
                    <asp:Literal runat="server" ID="AdapterDescription" EnableViewState="false" />
                </span>
            </div>
        </fieldset>
        <fieldset id="SettingsPanel" runat="server">
            <legend><asp:Literal Text="<%$ Resources: EPiServer, editor.tools.dynamiccontent.adaptersettingheading %>" runat="server" /></legend>
            <div id="settingsContainer" class="epirowcontainer">
                <asp:PlaceHolder runat="server" ID="AdapterSettingsContainer" />
            </div>
        </fieldset>
        <fieldset id="VisitorPanel" runat="server">
            <legend><asp:Literal ID="Literal1" Text="<%$ Resources: EPiServer, editor.tools.dynamiccontent.grouplistheading %>" runat="server" /></legend>
            <EPiServerUI:GroupList runat="server" id="GroupList"  />
        </fieldset>
        <div class="epi-buttonContainer">
            <EPiServerUI:ToolButton ID="OkButton" IsDialogButton="True" runat="server" Enabled="false" EnableViewState="false" OnClick="OnOkClick" Text="<%$ Resources: EPiServer, button.ok %>" />
            <EPiServerUI:ToolButton IsDialogButton="True" runat="server" GeneratesPostBack="false" OnClientClick="EPi.GetDialog().Close();" Text="<%$ Resources: EPiServer, button.cancel %>" />
            <span class="epi-helpBtnWrapper"><EPiServerUI:HelpButton Runat="server" /></span>
        </div>
    </div>
</asp:Content>