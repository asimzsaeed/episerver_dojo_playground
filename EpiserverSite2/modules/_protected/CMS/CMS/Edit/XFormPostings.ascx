<%@ Control Language="c#" AutoEventWireup="False" Codebehind="XFormPostings.ascx.cs" Inherits="EPiServer.UI.Edit.XFormPostings" TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<%@ Register TagPrefix="EPiServer" Namespace="EPiServer.Web.WebControls" Assembly="EPiServer" %>

<script type="text/javascript">
    //<![CDATA[
    function selectGridRow() {
        var i;
        var id_selectAll = document.getElementById('hidisAllSelected');
        var id_selectAllHeading = document.getElementById('selectallHeading');
        var iSelected = id_selectAll.value;
        var sMarkAll = '<%= TranslateForScript("/admin/security/markall") %>'
        var sUnMarkAll = '<%= TranslateForScript("/admin/security/unmarkall") %>'
        var gridNode = document.getElementById("<%= Grid.ClientID %>");
        var checkBoxArray = EPi.GetElementsByAttribute("input", "type", "checkbox", gridNode);
        var boolCheck = false;

        if (iSelected == "0") {
            boolCheck = true;
        }
        else if (iSelected == "0") {
            boolCheck = false;
        }

        for (i = 0; i < checkBoxArray.length; i++) {
            checkBoxArray[i].checked = boolCheck;
        }

        if (boolCheck == true) {
            id_selectAll.value = "1";
            id_selectAllHeading.innerHTML = sUnMarkAll;
        }
        else if (boolCheck == false) {
            id_selectAll.value = "0";
            id_selectAllHeading.innerHTML = sMarkAll;
        }
        OnCheckBoxClicked();
    }

    function OnCheckBoxClicked(e) {
        var i;
        var isAnyChecked = false;
        var gridNode = document.getElementById("<%= Grid.ClientID %>");
        var checkBoxArray = EPi.GetElementsByAttribute("input", "type", "checkbox", gridNode);

        for (i = 0; i < checkBoxArray.length; i++) {
            if (checkBoxArray[i].checked == true) {
                isAnyChecked = true;
                break;
            }
        }

        var deleteButton = document.getElementById("<%=DeleteButton.ClientID %>");
        if (isAnyChecked) {
            EPi.ToolButton.SetEnabled(deleteButton, true);
        }
        else {
            EPi.ToolButton.SetEnabled(deleteButton, false);
        }
    }


    //]]>
</script>

<div class="epi-formArea epi-contentContainer epi-padding-small">
    <div class="epi-size15">
        <div>
            <asp:Label AssociatedControlID="SelectForm" Translate="/edit/editxformdata/selectform" runat="server" />
            <asp:DropDownList ID="SelectForm" runat="server" />
        </div>
        <div>
            <asp:Label AssociatedControlID="BeginDate" Translate="/edit/editxformdata/fromdate" runat="server" />
            <EPiServer:InputDate DisplayName="<%$ Resources: EPiServer, edit/editxformdata/fromdate %>" ID="BeginDate" style="display:inline;" runat="server" />            
        </div>
        <div>
            <asp:Label AssociatedControlID="EndDate" Translate="/edit/editxformdata/todate" runat="server"  />
            <EPiServer:InputDate DisplayName="<%$ Resources: EPiServer, edit/editxformdata/todate %>" ID="EndDate" style="display:inline;" runat="server" />            
        </div>
        <div class="epi-indent">
            <asp:CheckBox ID="ShowResultFromAllPages" runat="server" />
            <asp:Label AssociatedControlID="ShowResultFromAllPages" Translate="/edit/editxformdata/allpages" runat="server" />
        </div>
        <div>
            <asp:Label AssociatedControlID="PagingSize" Translate="/edit/editformdata/pagingsize" runat="server" CssClass="EP-requiredField" />
            <asp:TextBox ID="PagingSize" runat="server" Text="50" Columns="5" />
            <asp:RangeValidator ID="HitsPerPageRangeValidator" Type="Integer" MinimumValue="1" MaximumValue="9999" runat="server" ControlToValidate="PagingSize" Text="*" />
            <asp:RequiredFieldValidator ID="HitsPerPageRequiredValidator" ControlToValidate="PagingSize" runat="server" Text="*" />
        </div>  
        <div class="epi-indent">
            <EPiServerUI:toolbutton runat="server" ID="SearchButton" SkinId="Search" text="<%$ Resources: EPiServer, button.search %>" OnClick="Search_Click" />
        </div>
    </div>
    <p><asp:Literal ID="HitsCount" runat="server" /></p>
    <asp:DataGrid ID="Grid" AllowSorting="True" runat="server" 
        DataKeyField="PostingID"
        AllowPaging="True" ShowFooter="False" PageSize="50" 
        DataSource='<%#Statistics.Posts%>' 
        OnSortCommand="Grid_Sort" 
        OnPageIndexChanged="Grid_PageIndexChanged" 
        AutoGenerateColumns="False" 
        OnDataBinding="Grid_DataBind"
        UseAccessibleHeader="True">
        <Columns>
            <asp:TemplateColumn>
               <ItemTemplate>
                    <EPiServerScript:ScriptEvent ID="ScriptEvent1" runat="server" EventTargetID="chkGridRow" EventType="Click" EventHandler="OnCheckBoxClicked" />
                    <asp:CheckBox id="chkGridRow"  runat="server"></asp:CheckBox>
                </ItemTemplate> 
            </asp:TemplateColumn> 
        </Columns> 
         <PagerStyle Mode=NumericPages CSSClass="epipager" Visible="true" />  
    </asp:DataGrid>
    <div class="epi-buttonContainer-small">
        <div>
            <EPiServerUI:ToolButtonContainer ID="ToolButtonContainer1" runat="server">
                <EPiServerUI:ToolButton runat="server" SkinID="Export" text="<%$ Resources: EPiServer, edit.editformdata.excelexport %>"  ID="ExportToExcelButton" onclick="ExportToExcelButton_Click"/>
                <EPiServer:XFormPostings runat="server" ID="Statistics" Visible="false" />                    
                <EPiServerUI:ToolButton ID="ExportasXML" SkinID="Export" runat="server" Text="<%$ Resources: EPiServer, button.exportasxml %>" onclick="ExportasXMLButton_Click" />
            </EPiServerUI:ToolButtonContainer>
        </div> 
        <div>
            <EPiServerUI:ToolButtonContainer ID="ToolButtonContainer2" runat="server">
                <EPiServerUI:ToolButton ID="DeleteButton" runat="server" SkinID="Delete" Text="<%$ Resources: EPiServer, button.deleteselected %>" Enabled="false" onclick="DeleteButton_Click" />
                <EPiServerUI:ToolButton ID="DeleteFoundPostings" SkinID="Delete" runat="server" Text="<%$ Resources: EPiServer, button.deletefoundposting %>" onclick="DeleteFoundPostingsButton_Click" />
            </EPiServerUI:ToolButtonContainer> 
        </div>
    </div>
</div>
<input type="hidden" name='hidisAllSelected' id='hidisAllSelected' value='0' /> 