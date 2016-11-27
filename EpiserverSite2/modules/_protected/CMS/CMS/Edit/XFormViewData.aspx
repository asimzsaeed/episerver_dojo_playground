<%@ Page language="c#" Codebehind="XFormViewData.aspx.cs" AutoEventWireup="False" Inherits="EPiServer.UI.Edit.XFormViewData"  Title="<%$ Resources: EPiServer, edit.editxform.viewdata.title %>" %>
<%@ Register TagPrefix="EPiServerEdit" TagName="XFormPostings" Src="XFormPostings.ascx" %>
<%@ Import Namespace="EPiServer.Core" %>
<asp:Content ContentPlaceHolderID="MainRegion" runat="server">
<script type='text/javascript'>
    	//<![CDATA[    
            function onCancel() {
                EPi.GetDialog().Close();
            }
		//]]>
    </script>
    <EPiServerEdit:XFormPostings id="XFormPostingsCtrl" runat="server" />
    <EPiServerUI:ToolButton id="CloseButton" IsDialogButton="true" GeneratesPostBack="False" runat="server" OnClientClick="onCancel();" Text="<%$ Resources: EPiServer, button.close %>" ToolTip="<%$ Resources: EPiServer, button.close %>" SkinID="Cancel" />
</asp:Content>
