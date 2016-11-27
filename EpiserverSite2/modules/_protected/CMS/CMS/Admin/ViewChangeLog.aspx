<%@ Page Language="C#" AutoEventWireup="True" CodeBehind="ViewChangeLog.aspx.cs"
    Inherits="EPiServer.UI.Admin.ViewChangeLog"  %>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="MainRegion">

    <script type="text/javascript">
        function validateLongInt() {
            var value = document.getElementById('StartSeqTextBox');
            var intVal = parseInt(value, 10);
            return intVal != NaN;
        }
	</script>
	
    <EPiServerUI:TabStrip runat="server" ID="Tabs" GeneratesPostBack="False" TargetID="TabViewPanel">
	        <EPiServerUI:Tab Text="#statustablabel" runat="server" ID="StatusTab" />			
	        <EPiServerUI:Tab Text="#viewtablabel" runat="server" ID="ViewLogTab" Sticky="true" />			
    </EPiServerUI:TabStrip>
    
    <asp:Panel runat="server" ID="TabViewPanel">
        <div id="StatusTable" runat="server">
            <div class="epi-padding">
                <div class="epi-formArea">
                    <div class="epi-size15">
                        <strong><asp:Label AssociatedControlID="StateDropdown" ID="StatusTranslate" runat="server" Translate="#status" />
                        <asp:DropDownList runat="server" ID="StateDropdown" />
                        <asp:Label runat="server" ID="StatusLabel" />.</strong>
                    </div>
                </div>
                <div class="epi-contentArea epi-paddingVertical">
                    <asp:Label runat="server" ID="DisableWarningLabel" Text="#disablewarning" Visible="False" />
                    <strong><asp:Label runat="server" ID="DisabledWarningLabel" Text="#disabledwarning" Visible="False" /></strong>
                </div>
            </div>
            <div class="epi-buttonContainer">
                <EPiServerUI:ToolButton ID="SaveButton" OnClick="SaveButton_Click" runat="server" SkinID="Save" Text="<%$ Resources: EPiServer, button.save %>" ToolTip="<%$ Resources: EPiServer, button.save %>" />
            </div>
        </div>
        
        <div ID="ViewTable" runat="server" class="epi-formArea epi-padding">
            <div>
                <h5><EPiServer:Translate ID="ViewLabelTranslate" runat="server" Text="#viewstructions" /></h5>  
                <div class="epi-size20">
                    <div>
                        <asp:Label AssociatedControlID="ChangeFromDate" runat="server" Translate="#changedatefrom" />       
                        <EPiServer:InputDate runat="server" ID="ChangeFromDate" DisplayTime="true" style="display: inline;" DisplayName="<%$ Resources: EPiServer, admin/viewchangelog/changedatefrom %>" ValidateInput="True" />
                    </div>
                    <div>
                        <asp:Label AssociatedControlID="ChangeToDate" runat="server" Translate="#changedateto" />
                        <EPiServer:InputDate runat="server" ID="ChangeToDate" DisplayTime="true" style="display: inline;" DisplayName="<%$ Resources: EPiServer, admin/viewchangelog/changedateto %>" ValidateInput="True" />
                    </div>
                    <div>    
                        <asp:Label AssociatedControlID="CategoryDropDown" runat="server" Translate="#category" />
                        <asp:DropDownList ID="CategoryDropDown" runat="server" OnSelectedIndexChanged="CategoryDropDown_SelectedIndexChanged" AutoPostBack="true" />
                    </div>
                    <div>
                        <asp:Label AssociatedControlID="ActionDropDown" runat="server" Translate="#action" />
                        <asp:DropDownList ID="ActionDropDown" runat="server" />
                    </div>
                    <div>
                        <asp:Label AssociatedControlID="ChangedByTextBox" runat="server" Translate="#changedby" />
                        <asp:TextBox ID="ChangedByTextBox" runat="server" MaxLength="100" />
                    </div>
                    <div>
                        <asp:Label AssociatedControlID="MaxItemsTextBox" runat="server" Translate="#maxitems" />
                        <asp:TextBox ID="MaxItemsTextBox" runat="server" Text="25" MaxLength="4" Width="100" />
                        <asp:RangeValidator ID="MaxItemsRangeValidator" runat="server" ControlToValidate="MaxItemsTextBox" Type="Integer" MinimumValue="1" MaximumValue="9999" Display="Dynamic" Text="*" ErrorMessage="<%$ Resources: EPiServer, admin/viewchangelog/errormsgmaxitems %>" />
                    </div>
                    <div>       
                        <asp:Label AssociatedControlID="StartSeqTextBox" runat="server" MaxLength="15" Translate="#startsequence" />
                        <asp:TextBox ID="StartSeqTextBox" runat="server" MaxLength="19" Width="100" />                               
                        <asp:CustomValidator id="StartSeqCustomValidator" runat="server" ControlToValidate="StartSeqTextBox" Text="*" ErrorMessage="<%$ Resources: EPiServer, admin/viewchangelog/errormsgstartsequence %>" OnServerValidate="StartSeq_Validate" ClientValidationFunction="validateLongInt" Display="Dynamic" />                                                                
                    </div>
                    <div>
                        <asp:Label AssociatedControlID="ReadOrderDropdown" runat="server" Translate="#readdirection" />
                        <asp:DropDownList ID="ReadOrderDropdown" runat="server" />
                    </div>
                    <div class="epi-indent">
                        <EPiServerUI:ToolButton ID="ReadButton" OnClick="ReadButton_Click" runat="server" SkinID="Report" Text="<%$ Resources: EPiServer, admin/viewchangelog/read %>" ToolTip="<%$ Resources: EPiServer, admin/viewchangelog/read %>" />
                        <EPiServerUI:ToolButton ID="PrevButton" OnClick="PrevButton_Click" runat="server" SkinID="ArrowLeft" Text="<%$ Resources: EPiServer, admin/viewchangelog/previous %>" ToolTip="<%$ Resources: EPiServer, admin/viewchangelog/previous %>" />
                        <EPiServerUI:ToolButton ID="NextButton" OnClick="NextButton_Click" runat="server" SkinID="ArrowRight" Text="<%$ Resources: EPiServer, admin/viewchangelog/next %>" ToolTip="<%$ Resources: EPiServer, admin/viewchangelog/next %>" />
                    </div>
                </div> 
                <div ID="TableRow1" runat="server">
                    <div ID="TableCell1" runat="server"></div>
                </div>
            </div>
            
            <p><asp:Label ID="ExecutionTimeLabel" runat="server" /></p>
            
            <table class="epi-default epi-marginVertical" cellpadding="0">
                    <tr>
                        <th>
                            <EPiServer:Translate ID="Col0Translate" runat="server" Text="#colheadingsequencenumber" />
                        </th>
                        <th>
                            <EPiServer:Translate ID="Col1Translate" runat="server" Text="#colheadingdata" />
                        </th>
                        <th>
                            <EPiServer:Translate ID="Col2Translate" runat="server" Text="#colheadingchangedate" />
                        </th>
                        <th>
                            <EPiServer:Translate ID="Col3Translate" runat="server" Text="#colheadingcategory" />
                        </th>
                        <th>
                            <EPiServer:Translate ID="Col4Translate" runat="server" Text="#colheadingaction" />
                        </th>
                        <th>
                            <EPiServer:Translate ID="Col5Translate" runat="server" Text="#colheadingChangedby" />
                        </th>
                    </tr>
                    <tbody>
                    <asp:Repeater ID="DataRepeater" runat="server">
                        <ItemTemplate>
                            <tr>
                                <td>
                                    <%# DataBinder.Eval(Container.DataItem, "SequenceNumber") %>
                                </td>
                                <td>
                                    <%# HttpUtility.HtmlEncode(DataBinder.Eval(Container.DataItem, ("LogData")).ToString()) %>
                                </td>
                                <td>
                                    <%# DataBinder.Eval(Container.DataItem, "ChangeDate") %>
                                </td>
                                <td>
                                    <%# GetCategoryDescription(Container.DataItem) %>
                                </td>
                                <td>
                                    <%# GetActionDescription(Container.DataItem)%>
                                </td>
                                <td>
                                    <%# DataBinder.Eval(Container.DataItem, "ChangedBy") %>
                                </td>
                            </tr>
                        </ItemTemplate>
                    </asp:Repeater>
                </tbody>
            </table>
        </div> 
    </asp:Panel>
</asp:Content>
