<%@ Register TagPrefix="EPiServer" Namespace="EPiServer.Web.WebControls" Assembly="EPiServer" %>
<%@ Control Language="c#" AutoEventWireup="False" Codebehind="WsrpSourceEditor.ascx.cs" Inherits="EPiServer.UI.Admin.WsrpSourceEditor, EPiServer.UI" TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<div id="_sourceeditor">
    <table>
        <tr>
            <td class="EP-tableCaptionCell">
                <asp:Label runat="server" Text='<%# EPiServer.Core.LanguageManager.Instance.Translate("/templates/wsrpfx/admin/sourcename") %>' ID="Label1" /></td>
            <td>
                <asp:TextBox runat="server" ID="SourceName" CssClass="EP-requiredField" Size="50" />
                <asp:RequiredFieldValidator runat="server" ID="RequireNameValidator" ControlToValidate="SourceName">*</asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td></td>
            <td><br /><asp:RadioButton runat="server" ID="UseWsdlRadio" AutoPostBack="True" OnCheckedChanged="Radio_CheckedChanged" Name="useWsdlRadio" Text='<%# EPiServer.Core.LanguageManager.Instance.Translate("/templates/wsrpfx/admin/usewsdlradio") %>' GroupName="type" onclick="setDisabled();"></asp:RadioButton></td>
        </tr>
        <tr>
            <td class="EP-tableCaptionCell">
                <asp:Label runat="server" Translate="/templates/wsrpfx/admin/wsdlurl" /></td>
            <td>
                <asp:TextBox runat="server" ID="WsdlUrl" CssClass="EP-requiredField" MaxLength="100" />
                <asp:RequiredFieldValidator runat="server" ID="RequireWsdlValidator" ControlToValidate="WsdlUrl">*</asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td></td>
            <td><br /><asp:RadioButton runat="server" ID="UseServicesRadio" AutoPostBack="True" OnCheckedChanged="Radio_CheckedChanged" Text='<%# EPiServer.Core.LanguageManager.Instance.Translate("/templates/wsrpfx/admin/useservicesradio") %>' GroupName="type" onclick="setDisabled();"></asp:RadioButton></td>
        </tr>
        <tr>
            <td class="EP-tableCaptionCell">
                <asp:Label runat="server" Text='<%# EPiServer.Core.LanguageManager.Instance.Translate("/templates/wsrpfx/admin/markupurl") %>' ID="Label2" /></td>
            <td>
                <asp:TextBox runat="server" ID="MarkupUrl" CssClass="EP-requiredField" />
                <asp:RequiredFieldValidator runat="server" ID="RequireMarkupValidator" ControlToValidate="MarkupUrl">*</asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td class="EP-tableCaptionCell">
                <asp:Label runat="server" Text='<%# EPiServer.Core.LanguageManager.Instance.Translate("/templates/wsrpfx/admin/servicedescriptionurl") %>' ID="Label3" /></td>
            <td>
                <asp:TextBox runat="server" CssClass="EP-requiredField" ID="ServiceDescriptionUrl" />
                <asp:RequiredFieldValidator runat="server" ID="RequireServiceDescriptionValidator" ControlToValidate="ServiceDescriptionUrl">*</asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td class="EP-tableCaptionCell">
                <asp:Label runat="server" Text='<%# EPiServer.Core.LanguageManager.Instance.Translate("/templates/wsrpfx/admin/registrationurl") %>' ID="Label4" /></td>
            <td>
                <asp:TextBox runat="server" ID="RegistrationUrl" />
            </td>
        </tr>
        <tr>
            <td class="EP-tableCaptionCell">
                <asp:Label runat="server" Text='<%# EPiServer.Core.LanguageManager.Instance.Translate("/templates/wsrpfx/admin/portletmanagementurl") %>' ID="Label5" /></td>
            <td>
                <asp:TextBox runat="server" ID="PortletManagementUrl" />
            </td>
        </tr>
        <tr>
            <td></td>
            <td><br /><EPiServerUI:ToolButton ID="SaveButton" DisablePageLeaveCheck="true" OnClick="Save_Click" runat="server" Text="<%$ Resources: EPiServer, button.save %>" ToolTip="<%$ Resources: EPiServer, button.save %>" SkinID="Save" /><EPiServerUI:ToolButton ID="CancelButton" runat="server" GeneratesPostBack="False" Text="<%$ Resources: EPiServer, button.cancel %>" ToolTip="<%$ Resources: EPiServer, button.cancel %>" SkinID="Cancel" />        
                <EPiServerScript:ScriptReloadPageEvent EventTargetID="CancelButton" EventType="click" runat="server" />
            </td>
        </tr>
    </table>
    <br />
    

    <script type="text/javascript">
		function setDisabled() {
			var useWsdlRadio				= document.getElementById('<%= UseWsdlRadio.ClientID %>');
			var wsdlUrl						= document.getElementById('<%= WsdlUrl.ClientID %>');
			var markupUrl					= document.getElementById('<%= MarkupUrl.ClientID %>');
			var serviceDescriptionUrl		= document.getElementById('<%= ServiceDescriptionUrl.ClientID %>');
			var registrationUrl				= document.getElementById('<%= RegistrationUrl.ClientID %>');
			var PortletManagementUrl		= document.getElementById('<%= PortletManagementUrl.ClientID %>');
			
			wsdlUrl.disabled				= !useWsdlRadio.checked;
			
			markupUrl.disabled				= useWsdlRadio.checked;
			serviceDescriptionUrl.disabled	= useWsdlRadio.checked;
			registrationUrl.disabled		= useWsdlRadio.checked;
			PortletManagementUrl.disabled	= useWsdlRadio.checked;
		}
		
		document.body.onload = setDisabled;
    </script>

</div>
