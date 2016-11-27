<%@ Page Language="c#" Codebehind="XFormFolderDialog.aspx.cs" AutoEventWireup="False" Inherits="EPiServer.UI.Edit.XFormFolderDialog"  %>
<asp:Content ID="Content2" ContentPlaceHolderID="FullRegion" runat="server">

    <script type="text/javascript">
		//<![CDATA[
			/* Trim() function duplicated from HtmlTextBox2_API.js */
			String.prototype.Trim = new Function("return this.replace(/^\\s+|\\s+$/g,'')");

			function Initialize()
			{
			    var dialogArguments = EPi.GetDialog().dialogArguments;
			    if (dialogArguments)
			    {
			        document.getElementById('<%=FolderName.ClientID %>').value = dialogArguments;
			    }
			}
			
			function save()
			{
				var newName = document.getElementById('<%=FolderName.ClientID %>').value.Trim();
				if (newName.length == 0 || new RegExp('[<>\"\'\/\\\\]').test(newName))
				{
				    alert('<%=ErrorMessage%>');
				    return false;
				}
				
				var returnValue = newName.Trim();
				EPi.GetDialog().Close(returnValue);
				
			}
			
			function cancel()
			{
				EPi.GetDialog().Close()
			}
			
			function handleKeyPressed(e)
            {
	            if(e.keyCode == 13)
	            {
		            save();
	            }
            }
		//]]>
    </script>

    <div class="epi-formArea epi-padding-small">
        <div class="epi-size15">
            <div>
                <asp:Label AssociatedControlID="FolderName" runat="server" ID="InputLabel" />
                <asp:TextBox ID="FolderName" SkinID="Size200" runat="server" />
            </div>
        </div>
        <episerverscript:scriptevent runat="server" EventHandler="handleKeyPressed" EventTargetID="FolderName" EventType="KeyDown" />
        <div class="epi-buttonContainer">
            <EPiServerUI:ToolButton runat="server" id="save" OnClientClick="save();" GeneratesPostBack="false" text="<%$ Resources: EPiServer, button.save %>" ToolTip="<%$ Resources: EPiServer, button.save %>" SkinID="Save" />
            <EPiServerUI:ToolButton runat="server" id="cancel" OnClientClick="cancel();" GeneratesPostBack="false" text="<%$ Resources: EPiServer, button.cancel %>" ToolTip="<%$ Resources: EPiServer, button.cancel %>" SkinID="Cancel" />
        </div>
    </div>
</asp:Content>
