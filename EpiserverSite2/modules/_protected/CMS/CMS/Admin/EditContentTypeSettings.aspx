<%@ Page Title="EditContentTypeSettings" Language="C#"  AutoEventWireup="false" CodeBehind="EditContentTypeSettings.aspx.cs" Inherits="EPiServer.UI.Admin.EditContentTypeSettings" %>
<%@ Register TagPrefix="EPiServerUI" TagName="ContentTypeInformation" Src="ContentTypeInformation.ascx" %>
<asp:Content ContentPlaceHolderID="MainRegion" runat="server">
    <div class="epi-formArea epi-padding">
        <asp:Panel ID="GeneralSettings" runat="server">
            <div class="epi-formArea">
                <EPiServerUI:ContentTypeInformation runat="server" ID="ContentTypeInformation" />
                <fieldset>
                    <legend>
                        <asp:Literal runat="server" Text="<%$ Resources: EPiServer, admin.editpagetypesettings.requiredaccess %>" />
                    </legend>
                    <div>
                        <EPiServerUI:MembershipAccessLevel CssClass="EPEdit-sidAccessLevel" runat="server" ID="ContentTypeAccess" />
                        <EPiServerUI:ToolButton ID="UserGroupAddButton" GeneratesPostBack="False" OnClientClick="OpenUserGroupBrowser(0);"
                            runat="server" Text="<%$ Resources: EPiServer, button.addusergroupsid %>" ToolTip="<%$ Resources: EPiServer, button.addusergroupsid %>"
                            SkinID="AddUserGroup" />
                    </div>
                </fieldset>
            </div>
        </asp:Panel>
        <div class="epi-buttonContainer">
            <EPiServerUI:ToolButton DisablePageLeaveCheck="true" ID="ApplyButton" runat="server"
                Text="<%$ Resources: EPiServer, button.save %>" ToolTip="<%$ Resources: EPiServer, button.save %>"
                SkinID="Save" OnClick="ApplyButton_Click" />
            <EPiServerUI:ToolButton DisablePageLeaveCheck="true" ID="DeleteButton" runat="server"
                Text="<%$ Resources: EPiServer, button.delete %>" ToolTip="<%$ Resources: EPiServer, button.delete %>"
                SkinID="Delete" OnClick="DeleteButton_Click" CausesValidation="False" Visible="false" ConfirmMessage="<%$ Resources: EPiServer, admin.editcontenttypesettings.deletewarning %>" />
            <EPiServerUI:ToolButton ID="DeleteCustomSettings" runat="server" 
                    DisablePageLeaveCheck="true"
                    Text="<%$ Resources: EPiServer, admin.contenttypeinformation.deletecustomsettings %>" 
                    ToolTip="<%$ Resources: EPiServer, admin.contenttypeinformation.deletecustomsettingstooltip %>"
                    SkinID="Delete"
                    ConfirmMessage="<%$ Resources: EPiServer, admin.contenttypeinformation.deletecustomsettingsconfirm %>" 
                    OnClick="DeleteCustomSettingsButton_Click"
                    CausesValidation="False"
                    Visible="<%# !String.IsNullOrEmpty(ContentTypeData.ModelTypeString) %>" />
            <EPiServerUI:ToolButton ID="CancelButton" runat="server" Text="<%$ Resources: EPiServer, button.cancel %>"
                ToolTip="<%$ Resources: EPiServer, button.cancel %>" SkinID="Cancel" OnClick="CancelButton_Click"
                CausesValidation="False" />
        </div>
    </div>
    
</asp:Content>
