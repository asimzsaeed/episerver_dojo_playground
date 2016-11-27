<%@ Page Language="c#" Codebehind="XFormEdit.aspx.cs" AutoEventWireup="False" Inherits="EPiServer.UI.Edit.XFormEdit"  %>
<%@ Register TagPrefix="EPiServerUI" TagName="XFormToolbox" Src="XFormToolbox.ascx" %>
<%@ Register TagPrefix="EPiServerUI" TagName="XFormFieldProperty" Src="XFormFieldProperty.ascx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContentRegion" runat="server">
    <link type="text/css" rel="Stylesheet" href="<%= EPiServer.UriSupport.ResolveUrlFromUtilBySettings("styles/xformedit.css") %>" />
    <asp:literal runat="server" id="CssPath" />
    <style type="text/css">
        #id_matrix textarea {
            min-height: 1em;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FullRegion" runat="server">
 <EPiServerUI:BodySettings CssClass="epiemptybackground" runat="server"/>
    <script type='text/javascript'>
		<!--
		 function Initialize(e)
		{
			id_matrix = document.getElementById("id_matrix");
			if (id_matrix) {
			    initialXForm = id_matrix.innerHTML;
			}
			xFormControl = document.getElementById("<%=XformControl.ClientID %>");					
			id_propertiesdefault = document.getElementById("id_propertiesdefault");
			id_propertiestextarea = document.getElementById("id_propertiestextarea");		
            id_propertiestext = document.getElementById("id_propertiestext");		
            id_propertiesmultiple = document.getElementById("id_propertiesmultiple");		
            id_propertiesspan = document.getElementById("id_propertiesspan");		
            id_propertieshr = document.getElementById("id_propertieshr");	
            id_propertiesbutton = document.getElementById("id_propertiesbutton");		
            id_verticallayout = document.getElementById("id_verticallayout");
            formContent = document.getElementById("<%= FormContent.ClientID %>");
            sFormName = document.getElementById("<%=FormName.ClientID %>");
            sFolderID = document.getElementById("<%=FormFolders.ClientID %>");
            isSaveAsAction = document.getElementById("<%=SaveAsAction.ClientID %>");
            sConfirmDelete = '<%= TranslateForScript("/edit/editxform/confirmdelete") %>';      
            sNotSelctedRowError = '<%= TranslateForScript("/edit/editxform/notselectedrow") %>';                         
            sformEmptyError  = '<%= TranslateForScript("/edit/editxform/formnameempty") %>';
            sSaveFormUsedInMultiplePages = '<%= TranslateForScript("/edit/editxform/savewarninginfo") %>\n<%= TranslateForScript("/edit/editxform/savewarningquestion") %>';             
            sMorethenOneOptionSelectedError = '<%= TranslateForScript("/edit/editxform/morethanoneoptionselected") %>';
            sLessThanOptionsError = '<%= TranslateForScript("/edit/editxform/lessthanoptionserror") %>';
            sUpImageURL = '<%= ResolveClientUrl("~/App_Themes/Default/Images/Tools/Up.gif") %>';
            sDownImageURL = '<%= ResolveClientUrl("~/App_Themes/Default/Images/Tools/Down.gif") %>';
            sDeleteImageURL = '<%= ResolveClientUrl("~/App_Themes/Default/Images/Tools/Delete.gif") %>';
            sClearImageURL = '<%= ResolveClientUrl("~/App_Themes/Default/Images/Tools/Clear.gif") %>';
            emailRegex = <%='/' + EPiServer.Framework.Validator.EmailRegexString + '/' %>;
            multipleEmailRegex = <%='/' + EPiServer.Framework.Validator.MultipleEmailRegexString + '/' %>;
        
        	focusBody();
        	// Customize page leave check
        	window.setTimeout(CustomizePageLeaveCheck, 90);
			
			return true;
		}
		
		function HandleKeyPressed(e)
		{
		    if (e.keyCode == 13 && !(e.target.type == "submit" || e.target.type == "button" || e.target.tagName == "TEXTAREA" || e.target.tagName == "BUTTON"))
			{
				e.preventDefault();
			}
		}
		
		// function to be checked by PageLeaveCheck handler.
		function XFormChanged(e) {
		    if (id_matrix) {
		        return initialXForm != id_matrix.innerHTML;
		    } else {
		        return false;
		    }
		}

		function CustomizePageLeaveCheck(e) {
		    var i, count, eventType;
		    var inputTexts, textAreas, selects;
		    
		    // Add custom function to page leave check handler.
		    EPi.PageLeaveCheck.AddToChecklist(XFormChanged);
		
		    // Remove setting pageLeaveCheck when changing form fields (inputs etc).	
		    inputTexts = EPi.GetElementsByAttribute("input", "type");
            count = inputTexts.length;
		    for (i = 0; i < count; i++) {
		        switch (inputTexts[i].type.toUpperCase()) {
		            case "TEXT":
		            case "RADIO":
		            case "PASSWORD":
		            case "FILE":
		            case "CHECKBOX":
		                eventType = "change";
		                break;
		            default:
		                eventType = null;
		                break;
		        }
		        if (eventType != null) {
		            EPi.RemoveEventListener(inputTexts[i], eventType, EPi.PageLeaveCheck._InputChange);
		        }
		    }

		    textAreas = document.getElementsByTagName("textarea");
		    count = textAreas.length;
		    for (i = 0; i < count; i++) {
		        EPi.RemoveEventListener(textAreas[i], "change", EPi.PageLeaveCheck._InputChange);
		    }

		    selects = document.getElementsByTagName("select");
		    count = selects.length;
		    for (i = 0; i < count; i++) {
		        EPi.RemoveEventListener(selects[i], "change", EPi.PageLeaveCheck._InputChange);
		    }

            // Add setting pageChanged when changing inputs in Form settings area
		    inputTexts = EPi.GetElementsByAttribute("input", "type", null, document.getElementById("formSettingsContainer"));
		    count = inputTexts.length;
		    for (i = 0; i < count; i++) {
		        switch (inputTexts[i].type.toUpperCase()) {
		            case "TEXT":
		            case "RADIO":
		            case "PASSWORD":
		            case "FILE":
		            case "CHECKBOX":
		                eventType = "change";
		                break;
		            default:
		                eventType = null;
		                break;
		        }
		        if (eventType != null) {
		            EPi.AddEventListener(inputTexts[i], eventType, EPi.PageLeaveCheck._InputChange);
		        }
		    }

		    selects = EPi.GetElementsByAttribute("select", null, null, document.getElementById("formSettingsContainer"));
		    count = selects.length;
		    for (i = 0; i < count; i++) {
		        EPi.AddEventListener(selects[i], "change", EPi.PageLeaveCheck._InputChange);
		    }
		}
		
        function ResizeXformArea(e)
		{
           var xformArea = document.getElementById("XFormArea");
		   var editArea = document.getElementById("<%= EditContainer.ClientID %>");
		   var propertiesArea = document.getElementById("<%= PropertiesArea.ClientID %>");
		   editArea.style.width = Math.max(0, (xformArea.offsetWidth - propertiesArea.offsetWidth-9)) + "px";
		   
		}
		// -->
    </script>

    <asp:TextBox runat="server" CssClass="hidden" ID="FormContent" EnableTheming="False" />    
    <div class="epi-applicationToolbar epi-padding-xsmall">
        <div class="epi-floatRight"><EPiServerUI:HelpButton Runat="server" /></div>
        <EPiServerUI:ToolButtonContainer runat="server">
            <EPiServerUI:ToolButton id="SaveButton" SkinID="Save" Text="<%$ Resources: EPiServer, button.save %>" runat="server" DisablePageLeaveCheck="true" OnClientClick="return fnSave(this);" OnClick="SaveButton_Click" />
            <EPiServerUI:ToolButton id="SaveAndClose" SkinID="Save" Text="<%$ Resources: EPiServer, button.saveandclose %>" runat="server" DisablePageLeaveCheck="true" OnClientClick="return fnSave(this);" OnClick="SaveAndCloseButton_Click" />
            <EPiServerUI:ToolButton id="SaveAsButton" GeneratesPostBack="false" SkinID="Save" Text="<%$ Resources: EPiServer, edit.editxform.saveas %>" runat="server" DisablePageLeaveCheck="true" OnClientClick="saveAs(event); formPopulateForSubmit(this.form);"  />            
        </EPiServerUI:ToolButtonContainer> 
        
        <EPiServerUI:ToolButtonContainer runat="server">
            <EPiServerUI:ToolButton id="DeleteButton" SkinID="Delete" Text="<%$ Resources: EPiServer, button.delete %>" EnableClientConfirm="true" runat="server" DisablePageLeaveCheck="true" OnClick="DeleteButton_Click" />    
            <EPiServerScript:ScriptSettings runat="server" TargetControlID="DeleteButton" ConfirmMessage="<%$ Resources: EPiServer, edit.editxform.deletequestion %>" />
        </EPiServerUI:ToolButtonContainer>         
        
        

        <EPiServerUI:ToolButtonContainer runat="server">
            <EPiServerUI:ToolButton id="CancelButton" SkinID="Cancel" Text="<%$ Resources: EPiServer, button.cancel %>" runat="server" OnClick="CancelButton_Click" DisablePageLeaveCheck="true" />
        </EPiServerUI:ToolButtonContainer>
    </div>
    
    <div class="epi-paddingHorizontal-xsmall">
        <asp:Panel runat="server" Visible="false" ID="MessagePanel" />
    </div>
    
    <div class="epi-formArea epi-paddingHorizontal-small" id="formSettingsContainer">
        <div class="epi-grid-1-1">
            <div class="epi-gridColumn">
                <div class="epi-size10">
                    <div>
                        <asp:Label runat="server" AssociatedControlID="FormName" Text="<%$ Resources: EPiServer, edit.editform.formnamecaption %>" />
                        <asp:TextBox ID="FormName" runat="server" />
                    </div>
                    <div>
                        <asp:Label runat="server" AssociatedControlID="FormFolders" Text="<%$ Resources: EPiServer, edit.editxform.formfoldercaption %>" /> 
                        <asp:ListBox ID="FormFolders" runat="server" Rows="1" />
                    </div>
                    <div>
                        <asp:Label runat="server" AssociatedControlID="FormPageAfterPost" Text="<%$ Resources: EPiServer, edit.editform.pageafterpost %>" />
                        <episerver:inputpagereference id="FormPageAfterPost" runat="server" RequireUrlForSelectedPage="true" DisableCurrentPageOption="true" style="display: inline; zoom:1;" />
                    </div>
                </div>
            </div>
            <div class="epi-gridColumn">
                <div class="epi-size25">
                  <div>
                        <asp:CheckBox ID="FormAnonymousPost" runat="server" />
                        <asp:Label runat="server" AssociatedControlID="FormAnonymousPost" Text="<%$ Resources: EPiServer, edit.editform.allowanonymouspostcaption %>" />
                  </div>
                  <div>
                        <asp:CheckBox ID="FormMultiplePost" runat="server" />  
                        <asp:Label runat="server" AssociatedControlID="FormMultiplePost" Text="<%$ Resources: EPiServer, edit.editform.allowmultiplepostcaption %>" />
                  </div>
              </div>
            </div>
            
        </div>
    </div>
          
    <EPiServerUI:TabStrip id="menuTab" runat="server" GeneratesPostBack="false" targetid="tabView">
	    <EPiServerUI:Tab  Text="/edit/editform/tablelayout" runat="server" id="TableLayout"/>
	    <EPiServerUI:Tab  Text="/edit/editform/formfields" runat="server" id="FormFields"/>
		<EPiServerUI:Tab  Text="/edit/editform/importexport" runat="server" id="ImportExport"/>
	</EPiServerUI:TabStrip>
    
    <asp:Panel ID="tabView" runat="server">
        
        <asp:Panel ID="TableLayoutPanel" runat="server" CssClass="epi-padding-small"> 
            <fieldset>         
                <legend>
                    <span><asp:Literal runat="server" Text="<%$ Resources: EPiServer, edit.editxform.editordescription %>" /></span>
                </legend>
                <EPiServerUI:ToolButton Text="<%$ Resources: EPiServer, edit.editform.insertrowbutton %>" runat="server" OnClientClick="fieldInsertRow(id_matrix)" GeneratesPostBack="False" /><EPiServerUI:ToolButton Text="<%$ Resources: EPiServer, edit.editform.addrowbutton %>" runat="server" OnClientClick="fieldAddRow(id_matrix)" GeneratesPostBack="False" /><EPiServerUI:ToolButton Text="<%$ Resources: EPiServer, edit.editform.deleterowbutton %>" runat="server" OnClientClick="fieldDeleteRow(id_matrix)" GeneratesPostBack="False" /><EPiServerUI:ToolButton Text="<%$ Resources: EPiServer, edit.editform.insertcolumnbutton %>" runat="server" OnClientClick="fieldInsertColumn(id_matrix)" GeneratesPostBack="False" /><EPiServerUI:ToolButton Text="<%$ Resources: EPiServer, edit.editform.addcolumnbutton %>" runat="server" OnClientClick="fieldAddColumn(id_matrix)" GeneratesPostBack="False" /><EPiServerUI:ToolButton Text="<%$ Resources: EPiServer, edit.editform.deletecolumnbutton %>" runat="server" OnClientClick="fieldDeleteColumn(id_matrix)" GeneratesPostBack="False" />
            </fieldset>    
        </asp:Panel>
        
        <asp:Panel ID="FormFieldsPanel" runat="server" CssClass="epi-padding-small">
            <fieldset>
                <legend>
                    <span><%= Translate("/edit/editform/formcontrolinfotext")%></span>
                </legend>
                <EPiServerUI:XFormToolbox id="Toolbox" runat="server" />
            </fieldset>                  
        </asp:Panel>
        
        <asp:Panel ID="ImportExportPanel" runat="server" CssClass="epi-padding-small">
            <fieldset>
                <legend>
                    <span><%= Translate("/edit/editxform/importinfotext")%></span>
                </legend>
                <asp:FileUpload runat="server" ID="FileUploadControl" />
                <EPiServerUI:ToolButton id="Import" SkinID="Import" Text="<%$ Resources: EPiServer, button.import %>" runat="server" DisablePageLeaveCheck="true" OnClick="ImportForm_Click"/>
                <EPiServerUI:ToolButton id="Export" SkinID="Export" Text="<%$ Resources: EPiServer, button.export %>" runat="server" OnClick="ExportForm_Click" OnClientClick="formPopulateForSubmit(this.form);" />
            </fieldset>
        </asp:Panel>
        
    </asp:Panel>
    
    <!-- Properties/Right Column -->
    <div id="XFormArea" class="xformarea">
        <asp:Panel ID="PropertiesArea" CssClass="propertiesarea epi-formArea" runat="server">
            <div class="propertiesContainer">
                <EPiServerUI:XFormFieldProperty id="FieldProperty" runat="server"  />
            </div>
        </asp:Panel>
        
        <asp:Panel ID="EditContainer" CssClass="editarea" runat="server">
            <asp:Panel ID="XformControl" CssClass="editContainer" onclick="fieldProperties(event)" runat="server">
                <XForms:XFormControl Runat="Server" ID="FormControl" EditMode="True" />
                <asp:Literal runat="server" ID="NewFormContent">
                    <table id="id_matrix">
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                    </table>
                </asp:Literal>
            </asp:Panel>
        </asp:Panel>
    </div>
    
    <EPiServerScript:ScriptResizeWindowEvent EventType="load" EventTargetClientNode="window" ResizeElementId="PropertiesArea" runat="server" />
    <EPiServerScript:ScriptResizeWindowEvent EventType="load" EventTargetClientNode="window" ResizeElementId="EditContainer" runat="server" />
  
    <script type="text/javascript">
        EPi.AddEventListener(window, "resize", ResizeXformArea);
        EPi.AddEventListener(window, "load", ResizeXformArea);
        EPi.AddEventListener(window, "load", Initialize);
        EPi.AddEventListener(document, "keypress", HandleKeyPressed);
    </script>
    <input type="hidden" runat="Server" id="SaveAsAction" />
</asp:Content>
