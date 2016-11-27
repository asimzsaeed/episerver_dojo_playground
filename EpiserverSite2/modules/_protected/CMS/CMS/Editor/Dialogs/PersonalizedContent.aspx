<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PersonalizedContent.aspx.cs" Inherits="EPiServer.UI.Editor.Dialogs.PersonalizedContent"%>
<%@ Register TagPrefix="EPiServerUI" TagName="GroupList" Src="GroupListEditor.ascx" %>
<asp:Content id="Content2" ContentPlaceHolderID="FullRegion" runat="server">
<script type="text/javascript">
// <![CDATA[
/*
 * JavaScript support routines for EPiServer
 * Copyright (c) 2010 EPiServer AB
*/
    function okClick() {
        var values = <%= PersonalizedContentMarkupJson %>;
        EPi.GetDialog().Close(values.PersonalizedContentMarkup);
    }

    function deleteClick() {
        var returnObject = new Object();
        returnObject.removePersonalization = true;
        EPi.GetDialog().Close(returnObject);
    }

// ]]>
</script>
    <EPiServerUI:BodySettings ID="BodySettings1" runat="server" CssClass="epiemptybackground claro" />
    <div class="epi-paddingHorizontal-small epi-formArea" style="overflow: hidden;">
        <asp:ValidationSummary ID="ValidationSummaryForPersonalizedContent" CssClass="EP-validationSummary" runat="server" />
        <fieldset id="VisitorPanel" runat="server">
            <legend><asp:Literal ID="Literal1" Text="<%$ Resources: EPiServer, editor.tools.dynamiccontent.grouplistheading %>" runat="server" /></legend>
            <EPiServerUI:GroupList runat="server" id="GroupList"  />
            
        </fieldset>
        <div class="epi-buttonContainer">
            <EPiServerUI:ToolButton ID="OkButton" IsDialogButton="True" runat="server" EnableViewState="false" OnClick="OkButton_Click" Text="<%$ Resources: EPiServer, button.ok %>" />
            <EPiServerUI:ToolButton ID="ToolButton1" IsDialogButton="True" runat="server" GeneratesPostBack="false" OnClientClick="EPi.GetDialog().Close();" Text="<%$ Resources: EPiServer, button.cancel %>" />
            <EPiServerUI:ToolButton ID="RemoveButton" IsDialogButton="True" runat="server" GeneratesPostBack="false" OnClientClick="deleteClick();" Text="<%$ Resources: EPiServer, edit.grouplisteditor.removebutton%>" />
            <span class="epi-helpBtnWrapper"><EPiServerUI:HelpButton ID="HelpButton1" Runat="server" /></span>
        </div>
    </div>
</asp:Content>
