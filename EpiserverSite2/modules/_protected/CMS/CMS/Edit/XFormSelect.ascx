<%@ Control Language="c#" AutoEventWireup="False" Codebehind="XFormSelect.ascx.cs" Inherits="EPiServer.UI.Edit.XFormSelect" TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<%@ Import Namespace="EPiServer.Core" %>
<%@ Import Namespace="EPiServer.Web.PageExtensions" %>

<script type="text/javascript">
//<![CDATA[
var KEYCODE_C = 67;

$(document).ready(function () {
    document.getElementById("<%= IsNewFormPostBack.ClientID %>").value = false;
});

if(document.all)
{
    window.document.attachEvent('onkeydown', xFormKeyHandler);
    window.document.body.focus();
}
var folderDialogUrl = '<%=ResolveUrl("XFormFolderDialog.aspx")%>';

function xFormKeyHandler()
{
	var returnValue = true;	

	if (event.shiftKey && event.ctrlKey)
	{
		switch (event.keyCode)
		{
			case KEYCODE_C:
				var formId = document.getElementById('<%=SelectedFormID.ClientID%>').value;
				if (confirm("Copy xform id to clipboard?\n\n" + formId))
					clipboardData.setData("Text", formId);
				break;
		}
	}
	
	return returnValue;
}

function setxFormID(formID)
{
    document.getElementById('<%=SelectedFormID.ClientID%>').value =  formID;
}

function editXForm(action,sFormID)
{
    var editUrl = '<%=ResolveUrl("XFormEdit.aspx")%>?pageId=<%=Request["pageId"]%>&parentId=<%=Request["parentId"]%>&epslanguage=<%=EPiServer.Globalization.ContentLanguage.PreferredCulture %>&formid=';
	if(action=='edit')
	{
		 editUrl = editUrl + sFormID;		 
	}
	
	var index = document.getElementById('<%= FormFolders.ClientID %>').selectedIndex;
    editUrl = editUrl + "&selectedFormName=" + encodeURIComponent(document.getElementById('<%= FormFolders.ClientID %>')[index].value);
	
    EPi.CreateDialog(editUrl, OnEditDialogCompleted, null, null, { width: 900, height: 800 });
}

function OnEditDialogCompleted(formid, onCompleteArguments)
{
    if (formid != null)
    {
        document.getElementById("<%= SelectedFormID.ClientID %>").value = formid;
        document.getElementById("<%= IsNewFormPostBack.ClientID %>").value = true;
    }        
	document.getElementById("<%= HiddenPostBackButton.ClientID %>").click();
}

function clearValue()
{
    selectAndClose('');
}
function cancel()
{
    selectAndClose(null);
}
function selectAndClose(selectedForm)
{
	EPi.GetDialog().Close(selectedForm);
}

function LaunchNewFolderWindow()
{
	EPi.CreateDialog(folderDialogUrl + "?mode=create", FolderDialogClose, null, null, {width:430, height:110});
}

function LaunchRenameFolderWindow()
{
	var folderList = document.getElementById('<%= FormFolders.ClientID %>');
	var dialogArguments;
	var onCompleteArguments = dialogArguments = folderList.options[folderList.selectedIndex].text;
	
    EPi.CreateDialog(folderDialogUrl + "?mode=rename", FolderDialogClose, onCompleteArguments, dialogArguments, {width:430, height:110});
}

function FolderDialogClose(returnValue, onCompleteArguments)
{
    if (!returnValue)
    {
        return;
    }
    
    if (onCompleteArguments)
	{
	    document.getElementById('<%=RenameFolder.ClientID%>').value = onCompleteArguments;
    }
	document.getElementById('<%=NewFolderName.ClientID%>').value = returnValue;
	document.forms[0].submit();
}

function LaunchDeleteFolderWindow()
{
	var folderList = document.getElementById('<%= FormFolders.ClientID %>');
	var selectedFolder = folderList.options[folderList.selectedIndex].value;

	if (confirm('<%=InternalTranslate("/edit/editxform/folderdialog/deletequestion")%>'))
	{
		document.getElementById('<%=DeleteFolder.ClientID%>').value = selectedFolder;
		document.forms[0].submit();
	}
}
//]]>
</script>

<EPiServerScript:ScriptSettings runat="server" ConfirmMessage="<%$ Resources: EPiServer, edit.editxform.deletequestion  %>" ID="deleteCommon" />
<EPiServerScript:ScriptResizeWindowEvent EventType="load" EventTargetClientNode="window" ResizeElementId="XformsGridArea" runat="server" />

    <div class="epi-applicationToolbar epi-padding-xsmall">
        <div class="epi-floatRight"><EPiServerUI:HelpButton Runat="server" /></div>
        <asp:Label runat="server"><strong><episerver:translate ID="Translate1" runat="server" text="/edit/editxform/selectedfolder" /></strong></asp:Label>
        <asp:ListBox ID="FormFolders" runat="server" AutoPostBack="True" Rows="1" Width="150px" OnSelectedIndexChanged="FormFolders_SelectedIndexChanged" />
        <EPiServerUI:ToolButton SkinId="CreateFolder" Id="NewFolderButton" Tooltip="<%$ Resources: EPiServer, edit.editxform.createnewformfoldertooltip %>" runat="server" GeneratesPostBack="False" />
        <EPiServerUI:ToolButton SkinId="RenameFolder" Id="RenameFolderButton" Tooltip="<%$ Resources: EPiServer, edit.editxform.renameformfoldertooltip %>" runat="server" GeneratesPostBack="False" />
        <EPiServerUI:ToolButton SkinId="DeleteFolder" Id="DeleteFolderButton" Tooltip="<%$ Resources: EPiServer, edit.editxform.deleteformfoldertooltip %>" runat="server" GeneratesPostBack="False" />
        <EPiServerScript:ScriptEvent EventTargetId="newFolderButton" EventType="click" EventHandler="LaunchNewFolderWindow" runat="server" />
        <EPiServerScript:ScriptEvent EventTargetId="renameFolderButton" EventType="click" EventHandler="LaunchRenameFolderWindow" runat="server" />
        <EPiServerScript:ScriptEvent EventTargetId="deleteFolderButton" EventType="click" EventHandler="LaunchDeleteFolderWindow" runat="server" />
        <asp:Label runat="server"><strong><episerver:translate ID="Translate2" runat="server" text="/edit/editxform/listmyformonly" /></strong></asp:Label>
        <asp:CheckBox ID="chkListMyFormsOnly" runat="server"  OnCheckedChanged="ListMyFormsOnly_Changed" AutoPostBack="true" />  
    </div>

    <div runat="server" id="XformsGridArea" class="episcroll">
        <div class="epi-padding-small">
            <asp:ValidationSummary ID="ValidationSummary" runat="server" CssClass="EP-validationSummary" ForeColor="Black" />

            <div class="epi-buttonContainer-small">
                <EPiServerUI:ToolButton SkinID="Add" Id="CreatexFormButton" Text="<%$ Resources: EPiServer, button.create %>" runat="server" OnClientClick="editXForm('create','' )" GeneratesPostBack="False" />
            </div>
                  
            <EPiServerUI:SortedGridView ID="GridAvailableXForms" runat="server"
                DefaultSortExpression="FormName" 
                DefaultSortDirection="Ascending"
                Width="97.3%" 
                AutoGenerateColumns="false" 
                OnRowCommand="GridAvailableXForms_ItemCommand" 
                OnDataBound="GridAvailableXForms_OnDataBound" 
                OnSelectedIndexChanged="GridAvailableXForms_OnSelectedIndexChanged" 
                OnRowCreated="GridAvailableXForms_OnRowCreated"
                >
                <RowStyle CssClass="FM-ItemRow epi-xForms-ItemRow" />
                <SelectedRowStyle BackColor="LightGray" />
                <Columns>

                   <asp:BoundField SortExpression="FormName" HeaderText="<%$ Resources: EPiServer, edit/editxform/formname %>" DataField="FormName" HtmlEncode="false">		                		                
                   </asp:BoundField>
                   <asp:BoundField HeaderText="<%$ Resources: EPiServer, edit/editxform/folder %>" DataField="Folder">		                		                
                   </asp:BoundField>
                   <asp:BoundField SortExpression="" HeaderText="<%$ Resources: EPiServer, edit/editxform/usedonpages %>" DataField="UsedonPages" HtmlEncode="false">		                		                
                   </asp:BoundField>
                   <asp:BoundField SortExpression="Created" HeaderText="<%$ Resources: EPiServer, edit/editxform/gridheadingcreated%>" DataField="Created">		                
                   </asp:BoundField>
                   <asp:BoundField SortExpression="CreatedBy" HeaderText="<%$ Resources: EPiServer, edit/editxform/gridheadingcreatedby %>" DataField="CreatedBy">		                		                
                   </asp:BoundField>
                   <asp:BoundField SortExpression="Changed" HeaderText="<%$ Resources: EPiServer, edit/editxform/gridheadingchanged %>" DataField="Changed">		                		                
                   </asp:BoundField>
                   <asp:BoundField SortExpression="ChangedBy" HeaderText="<%$ Resources: EPiServer, edit/editxform/gridheadingchangedby %>" DataField="ChangedBy">		                		                
                   </asp:BoundField>	            
                   <asp:TemplateField HeaderText="<%$ Resources: EPiServer, button.edit %>" ItemStyle-HorizontalAlign="left">
                        <ItemTemplate>
                            <EPiServerUI:ToolButton SkinID="Edit" Id="EditExistingFormButton" Enabled='true' runat="server" 
                            ToolTip="<%$ Resources: EPiServer, button.edit %>" 
                            OnClientClick=<%# "editXForm('edit','"+ DataBinder.Eval(Container.DataItem,"xformID") + "' )" %>
                            GeneratesPostBack="False" />
                        </ItemTemplate>                
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="<%$ Resources: EPiServer, button.delete %>" ItemStyle-HorizontalAlign="left">
                        <ItemTemplate>
                           <EPiServerUI:ToolButton ID="DeleteButton" CommandName="Delete" SkinID="Delete" 
                           EnableClientConfirm="true" 
                           ToolTip="<%$ Resources: EPiServer, button.delete %>" 
                           OnClientClick=<%# "setxFormID('"+ DataBinder.Eval(Container.DataItem,"xformID") + "')" %> 
                           Enabled=<%# DataBinder.Eval(Container.DataItem, "ButtonStatus") %>
                           runat="server" />
                            <EPiServerScript:ScriptSettings ID="ScriptSettings1" runat="server" TargetControlID="DeleteButton" CommonSettingsControlID="deleteCommon" />                    
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="<%$ Resources: EPiServer, button.select %>" ItemStyle-HorizontalAlign="left">
                        <ItemTemplate>
                            <EPiServerUI:ToolButton ID="ToolButton1" CommandName="Select" runat="server" SkinID="Check" Enabled="true" 
                            CausesValidation="false"
                            ToolTip="<%$ Resources: EPiServer, button.select %>" />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="xformID" />
                </Columns>
                <PagerSettings Mode="NumericFirstLast" />
            </EPiServerUI:SortedGridView>
              <div class="epi-floatLeft epi-marginVertical-small"><asp:Literal ID="HitsCount" runat="server" /></div>
             
             <asp:ObjectDataSource ID="XFormSelectData" runat="server" SortParameterName="sortExpression" 
                TypeName="EPiServer.UI.Edit.XFormSelect"  
                SelectMethod="GetPages" DeleteMethod="DeleteXForm" SelectCountMethod="GetRowCount" EnablePaging="true" 
                OnSelected="OnXFormSelectDataSelected"
                >
                <SelectParameters>
                    <asp:ControlParameter Direction="Input" PropertyName="FormFolder" Name="formFolder" />
                    <asp:ControlParameter Direction="Input" PropertyName="MyFormsOnly" Name="myFormsOnly" />
                    <asp:ControlParameter Direction="Input" PropertyName="FormId" Name="formId" />
                    <asp:Parameter Direction="Output" Name="rowCount" DefaultValue="0"/>
                </SelectParameters>
             </asp:ObjectDataSource>
        </div>
    </div>

    <div class="epi-padding-small">
        <div class="epi-buttonContainer">
            <EPiServerUI:ToolButton SkinID="Save" Id="UseButton" Text="<%$ Resources: EPiServer, edit.editxform.useformbutton %>" runat="server" OnClick="UseForm_Click" />
            <EPiServerUI:ToolButton SkinID="Delete" Id="ClearButton" Text="<%$ Resources: EPiServer, edit.editxform.noformbutton %>" runat="server" OnClientClick="clearValue();" GeneratesPostBack="False" />
            <EPiServerUI:ToolButton SkinID="Cancel" Id="CancelButton" Text="<%$ Resources: EPiServer, button.cancel %>" runat="server" OnClientClick="cancel();" GeneratesPostBack="False" />
        </div>
    </div>
    
    <asp:Button style="display:none;" Id="HiddenPostBackButton" OnClick="HiddenPostBackButton_Click" runat="server" />

    <input type="hidden" runat="Server" id="SelectedFormID" />
    <input type="hidden" runat="Server" id="RenameFolder" />
    <input type="hidden" runat="Server" id="NewFolderName" />
    <input type="hidden" runat="Server" id="DeleteFolder" />
    <input type="hidden" runat="Server" id="IsNewFormPostBack" />

