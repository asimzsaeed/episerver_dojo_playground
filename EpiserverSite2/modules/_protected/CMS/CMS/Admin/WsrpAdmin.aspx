<%@ Page Language="c#" Codebehind="WsrpAdmin.aspx.cs" AutoEventWireup="False" Inherits="EPiServer.UI.Admin.WsrpAdmin, EPiServer.UI" MasterPageFile="../MasterPages/EPiServerUI.Master" Title="WsrpAdmin" %>

<%@ Register TagPrefix="EPiServer" TagName="SourceEditor" Src="WsrpSourceEditor.ascx" %>
<asp:Content ContentPlaceHolderID="MainRegion" runat="server">
    <p>
        <EPiserverUI:ToolButton id="CreateNew" CausesValidation="false" onclick="CreateNew_Click" runat="server" text="<%$ Resources: EPiServer, templates.wsrpfx.admin.createnew %>" tooltip="<%$ Resources: EPiServer, templates.wsrpfx.admin.createnew %>" SkinID="Add" />
    </p>
    <p>
        <EPiServer:SourceEditor runat="Server" ID="SourceEditor" Visible="false" OnSave="Source_Save" />
    </p><br />
    <asp:Repeater runat="server" ID="WsrpSourceList">
        <HeaderTemplate>
            <table class="epistandardtable">
                <tr>
                    <th>
                        <EPiServer:translate Text="/templates/wsrpfx/admin/sourcename" runat="server" /></th>
                    <th>
                        <EPiServer:translate Text="/templates/wsrpfx/admin/test" runat="server" /></th>
                    <th>
                        <EPiServer:translate Text="/templates/wsrpfx/admin/delete" runat="server" /></th>
                </tr>
        </HeaderTemplate>
        <ItemTemplate>
            <tr>
                <td>
                    <asp:LinkButton runat="server" CssClass="Label" OnCommand="Source_Click" CausesValidation="False" CommandArgument='<%# ((EPiServer.Wsrp.Consumer.IProducer)Container.DataItem).ProducerId %>'>
					<%# ((EPiServer.Wsrp.Consumer.IProducer)Container.DataItem).ProducerId %>
                    </asp:LinkButton></td>
                <td>
                         <asp:LinkButton ID="LinkButton1" runat="server" CssClass="Label" CausesValidation="False" OnCommand="SourceTest_Click" CommandArgument='<%# ((EPiServer.Wsrp.Consumer.IProducer)Container.DataItem).ProducerId %>'></asp:LinkButton></td>
                <td>
                    <asp:LinkButton ID="LinkButton2" runat="server" CssClass="Label" CausesValidation="False" OnCommand="SourceDelete_Click" CommandArgument='<%# ((EPiServer.Wsrp.Consumer.IProducer)Container.DataItem).ProducerId %>'></asp:LinkButton></td>
            </tr>
        </ItemTemplate>
        <FooterTemplate>
            </table>
        </FooterTemplate>
    </asp:Repeater>
 
</asp:Content>
