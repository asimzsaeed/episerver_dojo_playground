<%@ Control Language="c#" AutoEventWireup="False" Codebehind="XFormToolbox.ascx.cs" Inherits="EPiServer.UI.Edit.XFormToolbox" TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<%@ Import Namespace="EPiServer.Core" %>
<%@ Import Namespace="EPiServer.Web.PageExtensions" %>

<EPiServerUI:ToolButton ID="ButtonTextField" ImageUrl='<%# ThemeUtility.GetImageThemeUrl(this.Page, "Xform/Text.gif")%>' Text="<%$ Resources: EPiServer, edit.editform.inputtext %>" runat="server" OnClientClick="AddField(this,event,id_matrix);" GeneratesPostBack="False" />
<EPiServerScript:ScriptSettings runat="server" TargetControlID="ButtonTextField" type="text" />
<EPiServerScript:ScriptEvent EventType="mousedown" EventHandler="fieldStartDrag" EventTargetID="ButtonTextField" runat="server" />

<EPiServerUI:ToolButton ID="ButtonTextArea" ImageUrl='<%# ThemeUtility.GetImageThemeUrl(this.Page, "Xform/Textarea.gif")%>' Text="<%$ Resources: EPiServer, edit.editform.inputtextarea %>" runat="server" OnClientClick="AddField(this,event,id_matrix);" GeneratesPostBack="False" />
<EPiServerScript:ScriptSettings runat="server" TargetControlID="ButtonTextArea" type="textarea" />
<EPiServerScript:ScriptEvent EventType="mousedown" EventHandler="fieldStartDrag" EventTargetID="ButtonTextArea" runat="server" />

<EPiServerUI:ToolButton ID="ButtonSelect" ImageUrl='<%# ThemeUtility.GetImageThemeUrl(this.Page, "Xform/Select.gif")%>' Text="<%$ Resources: EPiServer, edit.editform.inputselectbox %>" runat="server" OnClientClick="AddField(this,event,id_matrix);" GeneratesPostBack="False" />
<EPiServerScript:ScriptSettings runat="server" TargetControlID="ButtonSelect" type="select" />
<EPiServerScript:ScriptEvent EventType="mousedown" EventHandler="fieldStartDrag" EventTargetID="ButtonSelect" runat="server" />

<EPiServerUI:ToolButton ID="ButtonRadio" ImageUrl='<%# ThemeUtility.GetImageThemeUrl(this.Page, "Xform/Radio.gif")%>' Text="<%$ Resources: EPiServer, edit.editform.inputradiobutton %>" runat="server" OnClientClick="AddField(this,event,id_matrix);" GeneratesPostBack="False" />
<EPiServerScript:ScriptSettings runat="server" TargetControlID="ButtonRadio" type="radio" />
<EPiServerScript:ScriptEvent EventType="mousedown" EventHandler="fieldStartDrag" EventTargetID="ButtonRadio" runat="server" />

<EPiServerUI:ToolButton ID="ButtonCheckbox" ImageUrl='<%# ThemeUtility.GetImageThemeUrl(this.Page, "Xform/Checkbox.gif")%>' Text="<%$ Resources: EPiServer, edit.editform.inputcheckbox %>" runat="server" OnClientClick="AddField(this,event,id_matrix);" GeneratesPostBack="False" />
<EPiServerScript:ScriptSettings runat="server" TargetControlID="ButtonCheckbox" type="checkbox" />
<EPiServerScript:ScriptEvent EventType="mousedown" EventHandler="fieldStartDrag" EventTargetID="ButtonCheckbox" runat="server" />

<EPiServerUI:ToolButton ID="ButtonSubmit" ImageUrl='<%# ThemeUtility.GetImageThemeUrl(this.Page, "Xform/Button.gif")%>' Text="<%$ Resources: EPiServer, edit.editform.inputsubmit %>" runat="server" OnClientClick="AddField(this,event,id_matrix);" GeneratesPostBack="False" />
<EPiServerScript:ScriptSettings runat="server" TargetControlID="ButtonSubmit" type="submit" />
<EPiServerScript:ScriptEvent EventType="mousedown" EventHandler="fieldStartDrag" EventTargetID="ButtonSubmit" runat="server" />

<EPiServerUI:ToolButton ID="ButtonCaption" ImageUrl='<%# ThemeUtility.GetImageThemeUrl(this.Page, "Xform/Caption.gif")%>' Text="<%$ Resources: EPiServer, edit.editform.inputdescription %>" runat="server" OnClientClick="AddField(this,event,id_matrix);" GeneratesPostBack="False" />
<EPiServerScript:ScriptSettings runat="server" TargetControlID="ButtonCaption" type="span" />
<EPiServerScript:ScriptEvent EventType="mousedown" EventHandler="fieldStartDrag" EventTargetID="ButtonCaption" runat="server" />

<EPiServerUI:ToolButton ID="ButtonHr" ImageUrl='<%# ThemeUtility.GetImageThemeUrl(this.Page, "Xform/HorizontalRule.gif")%>' Text="<%$ Resources: EPiServer, edit.editform.horizontalrule %>" runat="server" OnClientClick="AddField(this,event,id_matrix);" GeneratesPostBack="False" />
<EPiServerScript:ScriptSettings runat="server" TargetControlID="ButtonHr" type="hr" />
<EPiServerScript:ScriptEvent EventType="mousedown" EventHandler="fieldStartDrag" EventTargetID="ButtonHr" runat="server" />