<%@ Control Language="c#" AutoEventWireup="False" Codebehind="XFormFieldProperty.ascx.cs" Inherits="EPiServer.UI.Edit.XFormFieldProperty" TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<%@ Register TagPrefix="EPiServer" Namespace="EPiServer.Web.WebControls" Assembly="EPiServer" %>
<%@ Import Namespace="EPiServer.Core" %>
<div id="id_propertiesdefault">
    <h3><%= InternalTranslate("/edit/editform/defaultpropertyheading")%></h3>
</div>


<!-- Properties for Text Box -->
<div id="id_propertiestext" style="display: none;" onpropertychange="ClearError( '___errortext' );">
    <div id="___errortext" class="EP-systemMessage">
	    <table>
		    <tr>
			    <td><EPiServer:ThemeImage runat="server" ImageUrl="Tools/Warning.gif" /></td>
			    <td><span id='___errortext_text'></span></td>
		    </tr>
	    </table> 
    </div>
    
    <h3><%= InternalTranslate("/edit/editform/textinputproperties")%></h3>
    <div class="epi-size10">
        <div>
            <label><%= InternalTranslate("/edit/editform/namecaption")%></label>
            <input type="text" class="inputtext" id="__textname" onmousedown="setControlFocus(this);" />
        </div>
    
	    <div>
	        <label><%= InternalTranslate("/edit/editform/headingcaption")%></label>
	        <input type="text" class="inputtext" id="__textlabel" onmousedown="setControlFocus(this);" />
	    </div>
	    
	    <div>
	        <label><%= InternalTranslate("/edit/editform/tooltipcaption")%></label>
	        <input type="text" class="inputtext" id="__texttooltip" onmousedown="setControlFocus(this);" />
	    </div>
	    
	    <div>
	        <%= InternalTranslate("/edit/editform/widthcaption")%>
	        <input type="text" class="inputtextmini" id="__textsize" onmousedown="setControlFocus(this);" />
	    </div>
	    
	    <div class="epi-indent">
	        <input type="checkbox" id="__textrequired" />
		    <%= InternalTranslate("/edit/editform/requiredcaption")%>
	    </div>
	    
	    <div>
	        <label><%= InternalTranslate("/edit/editform/classcaption")%></label>
	        <input type="text" class="inputtext" id="__textclass" maxlength="255" onmousedown="setControlFocus(this);" />
	    </div>
		
		<div>
		    <label><%= InternalTranslate("/edit/editform/typecaption")%></label>
		    <select Runat="server" class="inputtext" id="InputType" />
		</div>
	    
	    <div class="epi-buttonContainer">
	        <EPiServerUI:ToolButton id="TextInputSaveButton"  Text="<%$ Resources: EPiServer, button.save %>" runat="server" OnClientClick="if( validateName( '__textname', '___errortext' ) ) {fieldPropertiesTextSave();} " GeneratesPostBack="false"/><EPiServerUI:ToolButton id="TextInputDeleteButton"  Text="<%$ Resources: EPiServer, button.delete %>" runat="server" OnClientClick="ClearError( '___errortext' ); fieldPropertiesDelete('1')" GeneratesPostBack="false"/><EPiServerUI:ToolButton id="TextInputCancelButton"  Text="<%$ Resources: EPiServer, button.cancel %>" runat="server" OnClientClick="ClearError( '___errortext' ); fieldPropertiesHideAll()" GeneratesPostBack="false"/>
	    </div>
    </div>
</div>

<!-- Properties for Text Area -->
<div id="id_propertiestextarea" style="display: none;" onpropertychange="ClearError( '___errortextarea' );">
    <div id="___errortextarea" class="EP-systemMessage">
	    <table>
		    <tr>
			    <td><EPiServer:ThemeImage runat="server" ImageUrl="Tools/Warning.gif" /></td>
			    <td><span id='___errortextarea_text'></span></td>
		    </tr>
	    </table> 
    </div>
    <h3><%= InternalTranslate("/edit/editform/textareaproperties")%></h3>
    <div class="epi-size10">
        <div>
            <label><%= InternalTranslate("/edit/editform/namecaption")%></label>
            <input type="text" class="inputtext" id="__textareaname" onmousedown="setControlFocus(this);" />
        </div>
        <div>
            <label><%= InternalTranslate("/edit/editform/headingcaption")%></label>
            <input type="text" class="inputtext" id="__textarealabel" onmousedown="setControlFocus(this);" />
        </div>
        <div>
            <label><%= InternalTranslate("/edit/editform/tooltipcaption")%></label>
            <input type="text" class="inputtext" id="__textareatooltip" onmousedown="setControlFocus(this);" />
        </div>
        <div>
            <%= InternalTranslate("/edit/editform/widthcaption")%>
            <input type="text" class="inputtextmini" id="__textareawidth" onmousedown="setControlFocus(this);" />
        </div>
        <div>
            <%= InternalTranslate("/edit/editform/heightcaption")%>
            <input type="text" class="inputtextmini" id="__textareaheight" onmousedown="setControlFocus(this);" />
        </div>
		<div class="epi-indent">
		    <input type="checkbox" id="__textarearequired" />
		    <%= InternalTranslate("/edit/editform/requiredcaption")%>
		</div>
	    <div>
	        <label><%= InternalTranslate("/edit/editform/classcaption")%></label>
	        <input type="text" class="inputtext" id="__textareaclass" maxlength="255" onmousedown="setControlFocus(this);" />
	    </div>
	    <div>
	        <label><%= InternalTranslate("/edit/editform/typecaption")%></label>
	        <select Runat="server" id="TextareaType" class="inputtext" />
	    </div>
	    <div class="epi-buttonContainer">
            <EPiServerUI:ToolButton id="TextAreaSaveButton"  Text="<%$ Resources: EPiServer, button.save %>" runat="server" OnClientClick="if( validateName( '__textareaname', '___errortextarea' ) ){ fieldPropertiesTextareaSave(); }"  GeneratesPostBack="false" /><EPiServerUI:ToolButton id="TextAreaDeleteButton"  Text="<%$ Resources: EPiServer, button.delete %>" runat="server" OnClientClick="ClearError( '___errortextarea' ); fieldPropertiesDelete('1')" GeneratesPostBack="false"/><EPiServerUI:ToolButton id="TextAreaCancelButton"  Text="<%$ Resources: EPiServer, button.cancel %>" runat="server" OnClientClick="ClearError( '___errortextarea' ); fieldPropertiesHideAll()" GeneratesPostBack="false" />
	    </div>
    </div>
</div>

<!-- Properties for Drop-down List, Radio Button, Checkbox -->
<div id="id_propertiesmultiple" style="display: none;" onpropertychange="ClearError( '___errormultiple' );" >

    <div id="___errormultiple" class="EP-systemMessage">
	    <table>
		    <tr>
			    <td><EPiServer:ThemeImage runat="server" ImageUrl="Tools/Warning.gif" /></td>
			    <td><span id='___errormultiple_text'></span></td>
		    </tr>
	    </table> 
    </div>
    
    <h3 id="id_headingmultiple"><%= InternalTranslate("/edit/editform/checkboxproperties")%></h3>
    
    <div class="epi-size10">
        <div>
            <label><%= InternalTranslate("/edit/editform/namecaption")%></label>
            <input type="text" class="inputtext" id="__multiplename" onmousedown="setControlFocus(this);" />
        </div>
	    <div>
	        <label><%= InternalTranslate("/edit/editform/headingcaption")%></label>
	        <input type="text" class="inputtext" id="__multiplelabel" onmousedown="setControlFocus(this);" />
	    </div>
        <div>
            <label><%= InternalTranslate("/edit/editform/tooltipcaption")%></label>
            <input type="text" class="inputtext" id="__multipletooltip" onmousedown="setControlFocus(this);" />
        </div>
    
        <div id="id_verticallayout">
            <div>
                <label><%= InternalTranslate("/edit/editform/placementcaption")%></label>
                <input type="radio" name="__multiplelayout" checked="checked" id="__multiplelayouthorizontal" /><%=InternalTranslate("/edit/editform/horizontal")%>
                <input type="radio" name="__multiplelayout" id="__multiplelayoutvertical" /><%=InternalTranslate("/edit/editform/vertical")%>
            </div>
        </div>    
            <fieldset id="fldOptions" style="margin-top: 0.5em">  
                <legend><span><%= InternalTranslate("/edit/editform/optionscaption")%></span></legend>
                <table id="tblNameValuePair" class="epi-default" style="margin-bottom: 0;">
                    <tbody>
                        <tr>
                            <th><%=InternalTranslate("/edit/editform/checkedcaption")%></th>
                            <th><%=InternalTranslate("/edit/editform/namecaption")%></th>
                            <th><%=InternalTranslate("/edit/editform/valuecaption")%></th>			                        			          
                            <th></th>
                            <th style="width: 0px;">&nbsp;</th>
                        </tr>
                        <tr>		                            			                        
                            <td>&nbsp;</td>
                            <td><input type="text" class="inputsmalltext" size="5" ID="__multipletextName"  onkeypress="return onKeyEnter(event,'tblNameValuePair')" onmousedown="setControlFocus(this);"  /> </td>
                            <td><input type="text" class="inputsmalltext" size="5" ID="__multipletextValue" onkeypress="return onKeyEnter(event,'tblNameValuePair')" onmousedown="setControlFocus(this);" /> </td>
                            <td><EPiServerUI:ToolButton Text="<%$ Resources: EPiServer, button.add %>" runat="server"  OnClientClick="addNameValuePair('tblNameValuePair')" GeneratesPostBack="False" /></td>			                        
                            <td style="width: 0px;"></td><!-- Do not remove. Container used for saving values. Used in JavaScript  -->
                        </tr>
                    </tbody>
                </table>
            </fieldset> 
        
        
        <div class="epi-indent">
            <input type="checkbox" id="__multiplerequired" />
	        <%= InternalTranslate("/edit/editform/requiredcaption")%>
        </div>
    	        
	     <div>
	        <label><%= InternalTranslate("/edit/editform/classcaption")%></label>
	        <input type="text" class="inputtext" id="__multipleclass" maxlength="255" onmousedown="setControlFocus(this);" />
	     </div>

        <div class="epi-buttonContainer">
            <EPiServerUI:ToolButton id="MultipleOptionSaveButton"  Text="<%$ Resources: EPiServer, button.save %>" runat="server" OnClientClick="return fieldPropertiesMultipleSave()" GeneratesPostBack="false" /><EPiServerUI:ToolButton id="MultipleOptionDeleteButton"  Text="<%$ Resources: EPiServer, button.delete %>" runat="server" OnClientClick="ClearError( '___errormultiple' ); fieldPropertiesDelete('1')" GeneratesPostBack="false"/><EPiServerUI:ToolButton id="MultipleOptionCancelButton"  Text="<%$ Resources: EPiServer, button.cancel %>" runat="server" OnClientClick="ClearError( '___errormultiple' ); fieldPropertiesHideAll()" GeneratesPostBack="false" />
        </div>
    </div>
</div>

<!-- Properties for Button -->
<div id="id_propertiesbutton" style="display: none;">
    <div id="___erroremail" class="EP-systemMessage">
	    <table>
		    <tr>
			    <td><EPiServer:ThemeImage runat="server" ImageUrl="Tools/Warning.gif" /></td>
			    <td><span id='___erroremail_text'></span></td>
		    </tr>
	    </table> 
    </div>
    <h3><%= InternalTranslate("/edit/editform/buttonproperties")%></h3>
    <div class="epi-size10">
        <div>
            <label><%= InternalTranslate("/edit/editform/buttoncaption")%></label>
            <input type="text" class="inputtext" id="__buttonlabel" maxlength="255" onmousedown="setControlFocus(this);" >
        </div>
		<div>
		    <label><%= InternalTranslate("/edit/editform/tooltipcaption")%></label>
		    <input type="text" class="inputtext" id="__buttontooltip" onmousedown="setControlFocus(this);" />
		</div>
	    <div>
	        <label><%= InternalTranslate("/edit/editform/classcaption")%></label>
	        <input type="text" class="inputtext" id="__buttonclass" maxlength="255" onmousedown="setControlFocus(this);" > 
	    </div>
		<div>
		    <label><EPiServer:Translate text="/edit/editform/postresultcaption" runat="server" /></label>
		    <select onchange="formActionChange(this)" id="SubmitAction" runat="server" style="width: auto;" />
		</div>
		<table>
		<tr id="EmailRecipientRow" runat="server">
		    <td><label><EPiServer:Translate text="/edit/editform/sendemailtoadresscaption" runat="server" /></label></td>
		    <td><input type="text" id="FormEmailRecipient" class="inputtext" onmousedown="setControlFocus(this);" /><span id="requiredEmail1" style="color: red" /></td>
		</tr>
	    
	    <tr id="EmailSenderRow" runat="server">
	        <td><label><EPiServer:Translate text="/edit/editform/sendemailfromadresscaption" runat="server" /></label></td>
	        <td><input type="text" id="FormEmailSender" class="inputtext" onmousedown="setControlFocus(this);" /><span id="requiredEmail2" style="color: red" /></td>
	    </tr>
	    <tr id="EmailSubjectRow" runat="server">
	        <td><label><EPiServer:Translate text="/edit/editform/sendemailsubjectcaption" runat="server" /></label></td>
	        <td><input type="text" id="FormEmailSubject" class="inputtext" onmousedown="setControlFocus(this);" /><span id="requiredEmail3" style="color: red" /></td>
	    </tr>
	    <tr id="CustomUrlRow" runat="server">
	        <td><label><EPiServer:Translate text="/edit/editform/sendformtourlcaption" runat="server" /></label></td>
	        <td><input type="text" id="FormCustomUrl" class="inputtext" onmousedown="setControlFocus(this);" /></td>
	    </tr>
	    </table>
    </div>
	<div class="epi-buttonContainer">
	    <EPiServerUI:ToolButton id="ButtonSaveButton"  Text="<%$ Resources: EPiServer, button.save %>" runat="server" OnClientClick="if( validateEmail( 'FormEmailRecipient', '___erroremail', true ) && validateEmail( 'FormEmailSender', '___erroremail' ) ){fieldPropertiesSubmitSave();}"  GeneratesPostBack="false" /><EPiServerUI:ToolButton id="ButtonDeleteButton"  Text="<%$ Resources: EPiServer, button.delete %>" runat="server" OnClientClick="ClearError( '___erroremail' ); fieldPropertiesDelete('1')" GeneratesPostBack="false"/><EPiServerUI:ToolButton id="ButtonCancelButton"  Text="<%$ Resources: EPiServer, button.cancel %>" runat="server" OnClientClick="ClearError( '___erroremail' ); fieldPropertiesHideAll()" GeneratesPostBack="false" />
    </div>
</div>

<!-- Properties for Heading -->
<div id="id_propertiesspan" style="display: none;" onpropertychange="ClearError( '___errorspan' );">
    <div id="___errorspan" class="EP-systemMessage">
	    <table>
		    <tr>
			    <td><EPiServer:ThemeImage runat="server" ImageUrl="Tools/Warning.gif" /></td>
			    <td><span id='___errorspan_text'></span></td>
		    </tr>
	    </table> 
    </div>
    <h3><%= InternalTranslate("/edit/editform/descriptionproperties")%></h3>
    <div class="epi-size10">
        <div>
            <label><%= InternalTranslate("/edit/editform/textcaption")%></label>
            <input type="text" class="inputtext" id="__spanvalue" maxlength="255" onmousedown="setControlFocus(this);" >
        </div>
        
        <div>
            <label><%= InternalTranslate("/edit/editform/classcaption")%></label>
            <input type="text" class="inputtext" id="__spanclass" maxlength="255" onmousedown="setControlFocus(this);" >
        </div>
	</div>
	<div class="epi-buttonContainer">
	    <EPiServerUI:ToolButton id="SpanSaveButton"  Text="<%$ Resources: EPiServer, button.save %>" runat="server" OnClientClick="if( validateSpan( '__spanvalue', '___errorspan' ) ) { fieldPropertiesSpanSave();}" GeneratesPostBack="false" /><EPiServerUI:ToolButton id="SpanDeleteButton"  Text="<%$ Resources: EPiServer, button.delete %>" runat="server" OnClientClick="fieldPropertiesDelete('1')" GeneratesPostBack="false"/><EPiServerUI:ToolButton id="SpanCancelButton"  Text="<%$ Resources: EPiServer, button.cancel %>" runat="server" OnClientClick="fieldPropertiesHideAll()"  GeneratesPostBack="false" />
	</div>
</div>

<!-- Properties for HR -->
<div id="id_propertieshr" style="display: none;">
    <div id="___errorhr" class="EP-systemMessage">
	    <table>
		    <tr>
			    <td><EPiServer:ThemeImage runat="server" ImageUrl="Tools/Warning.gif" /></td>
			    <td><span id='___errorhr_text'></span></td>
		    </tr>
	    </table> 
    </div>
    <h3><%= InternalTranslate("/edit/editform/descriptionhrproperties")%></h3>
    <div class="epi-size10">
        <div>
            <label><%= InternalTranslate("/edit/editform/classcaption")%></label>
            <input type="text" class="inputtext" id="__hrclass" maxlength="255" onmousedown="setControlFocus(this);" >
        </div>
        <div>
            <label><%= InternalTranslate("/edit/editform/tooltipcaption")%></label>
            <input type="text" class="inputtext" id="__hrtooltip" onmousedown="setControlFocus(this);" />
        </div>
    </div>
    <div class="epi-buttonContainer">
        <EPiServerUI:ToolButton id="HrSaveButton"  Text="<%$ Resources: EPiServer, button.save %>" runat="server" OnClientClick="fieldPropertiesHrSave();" GeneratesPostBack="false" /><EPiServerUI:ToolButton id="HrDeleteButton"  Text="<%$ Resources: EPiServer, button.delete %>" runat="server" OnClientClick="fieldPropertiesDelete('1')" GeneratesPostBack="false"/><EPiServerUI:ToolButton id="HrCancelButton"  Text="<%$ Resources: EPiServer, button.cancel %>" runat="server" OnClientClick="fieldPropertiesHideAll()"  GeneratesPostBack="false" />
    </div>	
</div>


<script type="text/javascript">
    function setControlFocus(elem)
    {
        elem.focus();
    }
</script>  
