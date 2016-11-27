<%@ Page Language="c#" Codebehind="XFormSelect.aspx.cs" AutoEventWireup="False" Inherits="EPiServer.UI.Edit.XFormSelectPage" %>
<%@ Register TagPrefix="EPiServerEdit" TagName="XFormSelect" Src="XFormSelect.ascx" %>
<%@ Import Namespace="EPiServer.Core" %>
<asp:Content ID="Content1" ContentPlaceHolderID="FullRegion" runat="server">
    <EPiServerEdit:XFormSelect id="XFormSelect" runat="server" />
</asp:Content>