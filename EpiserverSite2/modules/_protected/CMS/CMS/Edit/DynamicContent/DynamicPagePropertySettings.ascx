<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="dynamicpagepropertysettings.ascx.cs" Inherits="EPiServer.UI.Edit.DynamicContent.DynamicPagePropertySettings" %>

<div class="epirowcontainer" style="margin-left: 8px;">
    <asp:Label runat="server" AssociatedControlID="PageLink" Text="<%$ Resources: EPiServer, edit.dynamiccontent.dynamicpagepropertysettings.pagelinklabel %>" /><br />
    <episerver:InputPageReference style="display: inline;" runat="server" ID="PageLink" AutoPostBack="True" DisableCurrentPageOption="True" />
</div>
<div id="PropertyPanel" visible="false" runat="server" class="epirowcontainer" style="margin-left: 8px;">
    <label for="PropertyList"><asp:literal runat="server" Text="<%$ Resources: EPiServer, edit.dynamiccontent.dynamicpagepropertysettings.propertylistlabel %>" /></label><br />
    <select name="PropertyList" id="PropertyList" class="episize280"><asp:Literal runat="server" ID="PropertyListItems" /></select>
</div>