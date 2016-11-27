<%@ Page Language="c#" Codebehind="EditContentType.aspx.cs" AutoEventWireup="False" Inherits="EPiServer.UI.Admin.EditContentType"  Title="Edit Page Type" %>

<asp:Content ContentPlaceHolderID="HeaderContentRegion" runat="server">
    <script type="text/javascript" src="<%=EPiServer.Shell.Paths.ToClientResource("cms", "ClientResources/jquery.tablednd.js")%>"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainRegion" runat="server">
    <EPiServerUI:RefreshFrame ID="frameUpdater" FrameName="AdminMenu" runat="server" />
    <div class="epi-formArea epi-paddingHorizontal">
        <fieldset>
            <legend><span><%: Translate("/admin/contenttypeinformation/informationheading") %></span></legend>
            <dl>
                <asp:PlaceHolder ID="CodeInfo" runat="server" Visible="<%# ShouldShowCodeInfo %>">
                    <dt><%: Translate("/admin/editcontenttype/fromcode") %></dt>
                    <dd><%: Translate("/button/yes") %></dd>
                </asp:PlaceHolder>
                <dt><%: Translate("/admin/editpagetypesettings/namecaption") %></dt>
                <dd><%: ContentTypeModel != null ? ContentTypeModel.Name : ""%></dd>
                <dt><%: Translate("/admin/contenttypeinformation/displaynamecaption") %></dt>
                <dd><%: ContentTypeModel != null ? ContentTypeModel.DisplayName : "" %></dd>
            </dl>
            <div class="floatright">
                <EPiServerUI:ToolButton ID="SettingsButton" runat="server" Text="<%$ Resources: EPiServer, button.settings %>" ToolTip="<%$ Resources: EPiServer, button.settings %>" SkinID="File" OnClick="SettingsButton_Click" />
            </div>
        </fieldset>
    </div>
    <div class="epi-buttonDefault">
        <EPiServerUI:ToolButton ID="NewDefinitionButton" runat="server" Text="<%$ Resources: EPiServer, admin.editcontenttype.addproperty %>" ToolTip="<%$ Resources: EPiServer, admin.editcontenttype.addproperty %>" SkinID="Add" OnClick="NewDefinitionButton_Click" />
    </div>
    <script type="text/javascript">
        function hideSortButtons()
        {
            $(".epi-table-sortable .epi-sort-increase, .epi-table-sortable .epi-sort-decrease").show();
            $(".epi-table-sortable tr:first-child .epi-sort-increase").hide();
            $(".epi-table-sortable tr:last-child .epi-sort-decrease").hide();
        }

        $(document).ready(function () {
            hideSortButtons();

            // Initialise the table
            $(".epi-table-sortable").tableDnD(
                {
                    onDragClass: "epi-table-sortableRow-drag",
                    onDrop: function (table, row) {
                        var rows = table.tBodies[0].rows;
                        var newpropertyOrder = "";
                        for (var i = 0; i < rows.length; i++) {
                            if (i > 0) { newpropertyOrder += "," }
                            newpropertyOrder += rows[i].id;
                        }
                        $.ajax({
                            type: 'POST',
                            data: 'newPropertyOrder=' + newpropertyOrder,
                            dataType: 'json',
                            processData: false,
                            success: function (e) {
                                hideSortButtons();
                            }
                        });
                    }
                });
        });
</script>
    <asp:Repeater ID="PropertyList" runat="server">
        <HeaderTemplate>
            <table class="epi-default epi-table-sortable">
                <thead>
                <tr class="nodrop nodrag"> <!-- The header should not be dragable nor droppable -->
                    <th><!-- Move up --></th>
                    <th><!-- Move down --></th>
                    <th><EPiServer:Translate runat="server" Text="/admin/editpropertydefinition/namecaption" /></th>
                    <th><EPiServer:Translate runat="server" Text="/admin/editpropertydefinition/editcaption" /></th>
                    <th><EPiServer:Translate runat="server" Text="/admin/editpropertydefinition/typecaption" /></th>
                    <th><EPiServer:Translate runat="server" Text="/admin/editcontenttype/propertyrequired" /></th>
                    <th><EPiServer:Translate runat="server" Text="/admin/editcontenttype/propertylocalized" /></th>
                    <th><EPiServer:Translate runat="server" Text="/admin/editcontenttype/propertysearchable" /></th>
                    <th><EPiServer:Translate runat="server" Text="/admin/editpropertydefinition/advancedcaption" /></th>
                    <asp:PlaceHolder runat="server" Visible="<%# !String.IsNullOrEmpty(ContentTypeModel.ModelTypeString) %>">
                        <th><EPiServer:Translate runat="server" Text="/admin/editcontenttype/fromcode" /></th>
                    </asp:PlaceHolder>
                </tr>
                </thead>
                <tbody>
        </HeaderTemplate>
        <ItemTemplate>
            <tr id='<%#DataBinder.Eval(Container.DataItem, "ID") %>'>
                <td align="center">
                    <asp:ImageButton OnCommand="MoveUp_Click" CommandName='<%#DataBinder.Eval(Container.DataItem, "ID") %>' runat="server" ID="Imagebutton1" NAME="Imagebutton1" class="epi-sort-increase" style="cursor:pointer;"/>
                </td>
                <td align="center">
                    <asp:ImageButton OnCommand="MoveDown_Click" CommandName='<%#DataBinder.Eval(Container.DataItem, "ID") %>' runat="server" ID="Imagebutton2" class="epi-sort-decrease" style="cursor:pointer;"/>
                </td>
                <td>
                    <a href="EditPropertyDefinition.aspx?typeId=<%# DataBinder.Eval(Container.DataItem, "ID") %>" 
                           title='<%# Server.HtmlEncode(((EPiServer.DataAbstraction.PropertyDefinition)Container.DataItem).TranslateDescription())%>'>
                        <%# Server.HtmlEncode((string)DataBinder.Eval(Container.DataItem, "Name")) %>
                    </a>
                </td>
                <td >
                    <%#	Server.HtmlEncode(((EPiServer.DataAbstraction.PropertyDefinition)Container.DataItem).TranslateDisplayName())%>
                </td>
                <td>
                    <asp:PlaceHolder runat="server" ID="BlockLinkHolder" Visible="<%# IsBlock(Container.DataItem) %>">
                        <%# Translate("/admin/editpropertydefinition/typeblock")%>
                        (<a href="<%# GetPropertyTypeLinkUrl(Container.DataItem) %>"><%# Server.HtmlEncode(GetPropertyType(Container.DataItem)) %></a>)
                    </asp:PlaceHolder>
                    <asp:PlaceHolder runat="server" ID="PropertyTypeText" Visible="<%# !IsBlock(Container.DataItem) %>">
                        <%# Server.HtmlEncode(GetPropertyType(Container.DataItem)) %>
                    </asp:PlaceHolder>
                </td>
                <td align="center">
                    <%# (bool)DataBinder.Eval(Container.DataItem, "Required") ? Translate("/button/yes") : String.Empty %>
                </td>
                <td align="center">
                    <%# (bool)DataBinder.Eval(Container.DataItem, "LanguageSpecific") ? Translate("/button/yes") : String.Empty%>
                </td>
                <td align="center">
                    <%# (bool)DataBinder.Eval(Container.DataItem, "Searchable") ? Translate("/button/yes") : String.Empty%>
                </td>
                <td>
                    <%# Server.HtmlEncode(((EPiServer.DataAbstraction.TabDefinition)DataBinder.Eval(Container.DataItem, "Tab")).LocalizedName) %>
                </td>
                <asp:PlaceHolder runat="server" Visible="<%# !String.IsNullOrEmpty(ContentTypeModel.ModelTypeString) %>">
                    <td>
                        <asp:Literal runat="server" 
                            Visible="<%# ((EPiServer.DataAbstraction.PropertyDefinition)Container.DataItem).ExistsOnModel && !IsMissingModelProperty(Container.DataItem) %>"
                            Text='<%# Translate("/button/yes") %>' />
                        <asp:Literal runat="server"
                            Visible="<%# IsMissingModelProperty(Container.DataItem) %>"
                            Text='<%# Translate("/admin/editcontenttype/propertymissingonmodel") %>' />
                    </td>
                </asp:PlaceHolder>
            </tr>
        </ItemTemplate>
        <FooterTemplate>
            </tbody></table></FooterTemplate>
    </asp:Repeater>
</asp:Content>
