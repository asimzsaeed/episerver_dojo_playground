<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="XFormSaveAsDialog.aspx.cs" Inherits="EPiServer.UI.Edit.XFormSaveAsDialog"  %>
<asp:Content ID="Content1" ContentPlaceHolderID="FullRegion" runat="server">
  <script type="text/javascript">
    // <![CDATA[
        
        function ToolButtonClick(returnValue) {
            if(returnValue==1 ) {
                if(!Page_IsValid) {
                    return;
                }
               var sNewFileName = document.getElementById("<%=NewFileName.ClientID %>").value
               var sFolderID = document.getElementById("<%=FormFolders.ClientID %>").value
               returnValue=sNewFileName +":"+sFolderID;
           }
            else
            {
                returnValue = null;
            }
            
            EPi.GetDialog().Close(returnValue);            
        }        
         
    // ]]>
    </script>
    
    <div class="epi-formArea epi-padding-small">
        <div class="epi-size10">
            <div>
                <asp:Label runat="server" AssociatedControlID="NewFileName" Text="<%$ Resources: EPiServer, edit.editxform.newformnamecaption %>" />
                <asp:TextBox ID="NewFileName" runat="server" />
                <asp:RequiredFieldValidator ControlToValidate="NewFileName" runat="server" Text="*" EnableClientScript="true" />
            </div>
            <div>
                <asp:Label runat="server" AssociatedControlID="FormFolders" Text="<%$ Resources: EPiServer, edit.editxform.formfoldercaption %>" />
                <asp:ListBox ID="FormFolders" runat="server" Rows="1"  />
            </div>
            <div class="epi-buttonContainer">
                <EPiServerUI:ToolButton id="SaveButton"  GeneratesPostBack="false" SkinID="Save" OnClientClick="ToolButtonClick(1)" Text="<%$ Resources: EPiServer, button.save %>" ToolTip="<%$ Resources: EPiServer, button.save %>" runat="server"/>
                <EPiServerUI:ToolButton id="CancelButton" OnClientClick="ToolButtonClick(0)" GeneratesPostBack="false" SkinID="Cancel" Text="<%$ Resources: EPiServer, button.cancel %>" ToolTip="<%$ Resources: EPiServer, button.cancel %>" runat="server"/>            
            </div>
        </div>
    </div>
</asp:Content>