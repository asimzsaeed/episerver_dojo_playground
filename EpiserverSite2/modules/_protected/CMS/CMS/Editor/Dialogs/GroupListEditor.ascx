<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="GroupListEditor.ascx.cs" Inherits="EPiServer.UI.Editor.Dialogs.GroupListEditor" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Framework.Web.Resources"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Shell" %>

<%= Page.DojoConfig(true, true, false) %>
<script type="text/javascript" src="<%= Paths.ToShellClientResource("ClientResources/dojo/dojo.js") %>"></script>
<%= Page.ClientResources("DijitWidgets", new[] { ClientResourceType.Style })%>
<link type="text/css" rel="stylesheet" href="<%= Paths.ToClientResource("CMS", "ClientResources/epi-cms/epi.css")%>" />

<script type="text/javascript">

    (function() {
        dojo.require("dojo.parser");
        dojo.require("dojo.data.ItemFileWriteStore");
        dojo.require("dijit.Dialog");
        dojo.require("dijit.Tooltip");
        dojo.require("dijit.TooltipDialog");
        dojo.require("dijit.layout.BorderContainer");
        dojo.require("dijit.layout.ContentPane");
        dojo.require("dijit.form.ComboBox");
        dojo.require("dijit.form.DropDownButton");
        dojo.require("dojox.grid.DataGrid");
        dojo.require("epi-cms.form.SearchTextBox");
        dojo.require("dojox.html.entities");

        var dialogCreated = false;
        var isPostBack = <%= IsPostBack?"true":"false" %>;

        //Visitor group data, as a dojo store
        var visitorGroupData = {
          "identifier": "name",
          "items": <%=CreateVisitorGroupJson() %>
        }
        var visitorGroupStore = new dojo.data.ItemFileWriteStore({ data: visitorGroupData });

        //Content group data
        var contentGroupData = new Array();

        /**
        * Update selected visitor groups
        *
        */
        function updateGroups() {

            //Callback for processing a returned list of items.
            function gotItems(items, request) {
                var arr = dojo.map(items, function(item){
                    return visitorGroupStore.getValue(item, "id");
                });

                var results = arr.join(",");
                var groupValue = document.getElementById('<%=Groups.ClientID %>');
                groupValue.value = results;
                writeGroupList(items);
            }

            //Fetch the data.
            visitorGroupStore.fetch({
                query: {selected: "true"},
                onComplete: gotItems
            });
        }

        /**
        * Close a popup dialog
        *
        * @param {string} id Id of the corresponding dropdown button.
        * @param {Function} onClose callback function to be called.
        */
        function closePopupDialog(id, onClose) {
            dijit.byId(id).closeDropDown();
            if (onClose) {
                onClose();
            }
        }

        /**
        * Write out all selected visitor groups. Callback function when visitor group store is updated
        *
        * @param {Array} items Store's items.
        */
        function writeGroupList(items){
            var results;

            // Clean out anything that is currently in groupNames
            dojo.byId('groupNames').innerHTML = '';

            if(items.length > 0){
                dojo.forEach(items, function(item){
                    var div = dojo.create('div', { 'class': 'epi_vg epi_vg_removable'});

                    if (!item.unremovable)
                    {
                        dojo.place(dojo.create('div', { 'class': 'epi_vg_remove', 'onclick': function() { removeVisitorGroup(visitorGroupStore.getValue(item, "name")) }, innerHTML: 'x' }), div);
                    }

                    dojo.place(dojo.create('span', { innerHTML: dojox.html.entities.encode(visitorGroupStore.getValue(item, "name")) }), div);
                    dojo.place(div, 'groupNames');
                });

                dojo.place(dojo.create('div', { 'class': 'epi-hidden-clear' }), 'groupNames');
            }
            else if(dojo.byId('<%= noContentGroup.ClientID %>').checked) {
                dojo.place(dojo.create('span', { innerHTML: '<%=TranslateForScript("/edit/grouplisteditor/nogroupsselectedwithcontentgroup")%>' }), 'groupNames');
            }
            else{
                dojo.place(dojo.create('span', { innerHTML: '<%=TranslateForScript("/edit/grouplisteditor/nogroupsselected")%>' }), 'groupNames');
            }
        }

        /**
        * Initialize content group list, received from server.
        *
        */
        function initContentGroupList() {
            var contentGroups = dojo.attr("<%= AllContentGroupsControl.ClientID %>", "value");
            var selectedContentGroup = dojo.attr("<%= ContentGroupControl.ClientID %>", "value");

            if (contentGroups) {
                // Split and remove empty entries (where entries are null or only whitespace)
                var validEntries = dojo.filter(contentGroups.split(","), function(item) { return item && !(/^\s*$/).test(item); } );

                // Project content group names into an array with objects for each item
                contentGroupData = dojo.map(validEntries,
                    function(name, index) {
                        return {
                            name: name,
                            removable: false,
                            selected: (name === selectedContentGroup)
                        };
                    });
            } else {
                contentGroupData = [];
            }
        }

        /**
        * Write all content groups to a dropdown list.
        *
        * @param {Array} items Items list.
        */
        function writeContentGroupList(items){
            var selectedValue = '';
            var optionElements = [dojo.create("option", {value: "", innerHTML: "&nbsp;", disabled:true})];

            dojo.forEach(items, function(item) {
                var attributes = {
                    value: item.name,
                    innerHTML:  dojox.html.entities.encode(item.name),
                    selected: item.selected
                }

                optionElements.push(dojo.create("option", attributes));

                //keep the selected content group in another textbox for processing on the server side
                if (item.selected) {
                    selectedValue = item.name;
                    if (!isPostBack) {
                        dojo.byId('<%= noContentGroup.ClientID %>').checked = true;
                    }
                }
            });

            var contentGroups = dojo.byId('contentGroups');

            dojo.attr(contentGroups, 'disabled', optionElements.length <= 1);

            // Re-populate the select list with our new select items
            dojo.empty(contentGroups);
            dojo.forEach(optionElements, function(element) { dojo.place(element, contentGroups); });

            var contentGroupNames = dojo.map(contentGroupData, function(item) { return item.name; });
            dojo.attr("<%= AllContentGroupsControl.ClientID %>", "value", contentGroupNames.join(","));
            dojo.attr("<%= ContentGroupControl.ClientID %>", "value", selectedValue);
        }

        /**
        * Open visitor groups selection dialog.
        *
        */
        function openGroupEditDialog(){
            dijit.byId('editGroupDialog').show();
            dijit.byId('groupGrid').filter({name: '*'});
        }

        /**
        * De-select a visitor group.
        *
        * @param {string} name Visitor group name.
        */
        function removeVisitorGroup(name) {
            visitorGroupStore.fetch({
                query: {name: name},
                onComplete: function(items) {
                    dojo.forEach(items, function(item) {
                        visitorGroupStore.setValue(item, 'selected', false);
                    });
                }
            });
            updateGroups();
        }

        /**
        * Remove a content group.
        *
        * @param {string} item Content group name.
        */
        function removeContentGroup(item) {
            var i;
            for (i = 0; i < contentGroupData.length; i++) {
                if (item == contentGroupData[i].name) {
                    break;
                }
            }

            if (!item.unremovable) {
                contentGroupData.splice(i, 1);
                writeContentGroupList(contentGroupData);
            }
        }

        /**
        * Select a content group as active.
        *
        */
        function selectContentGroup() {
            var item = dojo.byId('contentGroups').value;
            var i;
            for (i = 0; i < contentGroupData.length; i++) {
                if (item == contentGroupData[i].name) {
                    contentGroupData[i].selected = !contentGroupData[i].selected;
                }
                else {
                    contentGroupData[i].selected = false;
                }
            }
            writeContentGroupList(contentGroupData);
        }

        /**
        * Enable/disable content group check box 's change handler.
        *
        */
        function noContentGroupCheckChange() {
            var noContentGroup = !dojo.byId('<%= noContentGroup.ClientID %>').checked;
            dijit.byId('dropdownLG').set('disabled', noContentGroup);
            if (noContentGroup){
                dojo.attr(dojo.byId('contentGroups'), 'disabled', 'true');
                document.getElementById('<%= ContentGroupControl.ClientID %>').value = '';
            }
            else {
                dojo.removeAttr(dojo.byId('contentGroups'), 'disabled');
                document.getElementById('<%= ContentGroupControl.ClientID %>').value = dojo.byId('contentGroups').value;
            }

            updateGroups();
        }

        /**
        * Add new content group.
        *
        */
        function addContentGroup() {
            var newContentGroup = dojo.trim(dojo.byId('newContentGroup').value);

            // Forbidden characters in content group names (reflected by the error message)
            var pattern = /^[^,]{1,255}$/i;
            var isValid = pattern.test(newContentGroup);

            if (isValid) {
                dojo.byId('newContentGroup').value = '';
                var foundIndex = -1;
                for (i = 0; i < contentGroupData.length; i++) {
                    if (newContentGroup == contentGroupData[i].name) {
                        contentGroupData[i].selected = true;
                        foundIndex = i;
                    }
                    else {
                        contentGroupData[i].selected = false;
                    }
                }

                if (foundIndex == -1) {
                    contentGroupData.push({name: newContentGroup, selected: true });
                }

                writeContentGroupList(contentGroupData);
                closePopupDialog("dropdownLG");
            }
            else {
                var message = "<%= TranslateForScript("/edit/grouplisteditor/invalidcontentgroupname") %>";
                dijit.showTooltip(message, dojo.byId('newContentGroup'), ['below']);
            }
        }

        /**
        * Select a visitor group in selection list.
        *
        * @param {int} rowIndex The row index.
        */
        function selectVG(rowIndex) {
            visitorGroupStore.fetch({
                query: {name: visitorGroupStore.getValue(dijit.byId('groupGrid').getItem(rowIndex),'name')},
                onComplete: function(items) {
                    dojo.forEach(items, function(item) {
                        visitorGroupStore.setValue(item, 'selected', !visitorGroupStore.getValue(item, 'selected'));
                    });
                }
            });

            //In FF, focus may be lost when we update the grid. We need to grab it.
            setTimeout(function() {
                dijit.byId('groupGrid').focus.focusGrid();
            }, 1);
        }

        /**
        * Set up the visitor group selection dialog.
        *
        */
        function setupVisitorGroupDialog() {
            var groupGrid = dijit.byId('groupGrid');
            groupGrid.setStore(visitorGroupStore);
            groupGrid.layout.cells[0].formatter = function(selected) {
                //IE has some problem focusing on a checkbox which included in an invisible div. Therefore we use images instead of checkboxes
                //ARIA-WAI attibutes (role, aria-checked) are set as our knowledge at the moment
                var pathToImages = '<%= EPiServer.UriSupport.ResolveUrlBySettings("~/App_Themes/Default/Images/General/") %>';
                var stateImage = selected ? pathToImages + "checkbox_checked.png" : pathToImages + "checkbox_unchecked.png";
                return '<img role="checkbox" aria-checked="' + selected + '" src="' + stateImage + '" style="padding: 3px 3px;" />';
            };
            groupGrid.layout.cells[2].formatter = function(notesValue) {
                if(!notesValue){
                    return notesValue;
                }
                return '<img src="<%= EPiServer.UriSupport.ResolveUrlBySettings("~/App_Themes/Default/Images/General/noteIcon.gif") %>" title="' + notesValue + '" style="padding: 3px 3px;" />';
            };

            //focus handlers
            dojo.connect(groupGrid, 'onFocus', function(e) {
                setTimeout(function() {
                    groupGrid.selection.select(0);
                    groupGrid.focus.setFocusCell(0,0);
                }, 1);
            });
            dojo.connect(groupGrid, 'onBlur', function(e) {
                setTimeout(function() {
                    groupGrid.selection.clear();
                }, 1);
            });

            //key handlers
            dojo.connect(groupGrid, 'onKeyDown', function(e) {
                switch (e.keyCode) {
                    case 32: //Space
                        selectVG(groupGrid.selection.selectedIndex);
                        e.stopPropagation();
                        break;
                    case 38: //Up
                        if (groupGrid.selection.selectedIndex > 0) {
                            groupGrid.selection.select(groupGrid.selection.selectedIndex - 1);
                        }
                        e.stopPropagation();
                        break;
                    case 40: //Down
                        if (groupGrid.selection.selectedIndex < groupGrid.rowCount - 1) {
                            groupGrid.selection.select(groupGrid.selection.selectedIndex + 1);
                        }
                        e.stopPropagation();
                        break;
                    case 9: //Tab
                        if (e.shiftKey) {
                            setTimeout(function() { dijit.byId('search').focus(); }, 1);
                            e.stopPropagation();
                        }
                        break;
                }
            });

            //row click handler
            dojo.connect(groupGrid, 'onRowClick', function(e) {
                selectVG(e.rowIndex);
            });

            //This will fix the focusing issue that makes the popup suddenly closed in IE. Because our header is hidden, focusing on it must be disabled.
            var isNavHeaderFnc = groupGrid.focus.isNavHeader;
            groupGrid.focus.isNavHeader = function() {
                if (isNavHeaderFnc.apply(this, arguments)) {
                    groupGrid.focus.blurHeader();
                }
                return false;
            }

            dojo.connect(dojo.byId('editGroupDialog'), 'onkeydown', function(e) {
                if (e.keyCode == 13) { //Enter
                    closePopupDialog("dropdownVG", updateGroups);
                    e.stopPropagation();
                    return false;
                }
            });

            //Filter textbox keyup handler
            dojo.connect(dijit.byId('search'), 'onTextChange', function() {
                groupGrid.filter({
                    name: dijit.byId('search').get('value') + '*'
                });
            });
        }

        /**
        * Set up content group editing dialog.
        *
        */
        function setupContentGroupDialog() {
            // Always hide the tool tip when the add pop-up is closed
            dojo.connect(dijit.byId("dropdownLGAddDialog"), "onClose", function() {
                dijit.hideTooltip(dojo.byId('newContentGroup'));
            });

            dojo.connect(dojo.byId('newContentGroup'), 'onkeydown', function(e) {
                if (e.keyCode == 13) {
                    addContentGroup();
                    e.stopPropagation();
                    return false;
                }
            });
        }

        // Bootstrap, setting up everything after the DOM is reader
        dojo.addOnLoad(function(){
            if (!dojo.byId("<%= VisitorGroupSelection.ClientID %>"))
            {
                // This indicates that there are no visitor groups available, so we do not need to execute the init code
                return;
            }

            //Just parse the dijit nodes, do not parse the whole DOM
            dojo.parser.parse(dojo.byId('quickAddVG'));
            dojo.parser.parse(dojo.byId('quickAddLG'));

            //setup dialogs
            setupVisitorGroupDialog();
            setupContentGroupDialog();

            //Setup event handlers

            //Link-group dropdown button click handler
            dojo.connect(dijit.byId('dropdownLG'), "onClick", function() {
                dijit.focus(dojo.byId('newContentGroup'));
            });
            //Visitor-group dropdown button click handler
            dojo.connect(dijit.byId('dropdownVG'), "onClick", function() {
                dijit.focus(dojo.byId('search'));
            });
            dojo.connect(dojo.byId('contentGroups'), 'onchange', selectContentGroup);
            dojo.connect(dojo.byId('<%= noContentGroup.ClientID %>'), 'onclick', noContentGroupCheckChange);
            dojo.connect(dojo.byId('<%= addContentGroup.ClientID %>'), 'onclick', addContentGroup);
            dojo.connect(dojo.byId('<%= vgPopupOK.ClientID %>'), 'onclick', function() {
                closePopupDialog('dropdownVG', updateGroups);
            });
            dojo.connect(dojo.byId('<%= vgPopupCancel.ClientID %>'), 'onclick', function() {
                closePopupDialog('dropdownVG');
            });

            //Fetch data when the intepreter idle
            setTimeout(function() {
                visitorGroupStore.fetch({
                    query: {selected: 'true'},
                    onComplete: writeGroupList
                });

                initContentGroupList();
                writeContentGroupList(contentGroupData);
                noContentGroupCheckChange();
            }, 1);
        });
    })();
</script>
<asp:Panel runat="server" ID="VisitorGroupSelection">
    <span><%=Translate("/edit/grouplisteditor/vgtopheading")%></span>
    <div class="epi-panel-container">
        <div id="quickAddVG" class="rightarea">
            <div dojoType="dijit.form.DropDownButton" id="dropdownVG">
                <span></span>
                <div dojoType="dijit.TooltipDialog" id="editGroupDialog" draggable="false" closable="false">
                    <div dojoType="dijit.layout.BorderContainer" gutters="false" class="epi-vglist-popup-layout">
                        <div dojoType="dijit.layout.ContentPane" region="top" splitter="false">
                            <label for="groupGrid"><%=Translate("/edit/grouplisteditor/vgselecttitle")%></label>
                            <input dojoType="epi-cms.form.SearchTextBox" id="search" type="text" class="searchBox" />
                        </div>
                        <div dojoType="dijit.layout.ContentPane" region="center">
                            <table id="groupGrid" dojoType="dojox.grid.DataGrid" cansort="false" clientSort="false" selectionMode="single" queryOptions="{ignoreCase: true}" region="center">
                                <thead>
                                    <tr>
                                        <th field="selected" noresize="true" width="22px" cellStyles="padding: 0px;"></th>
                                        <th field="name" noresize="true" width="100%"></th>
                                        <th field="notes" noresize="true" width="22px" cellStyles="padding: 0px;"></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div dojoType="dijit.layout.ContentPane" region="bottom" class="epi-align-right" splitter="false">
                            <EPiServerUI:ToolButton ID="vgPopupOK" runat="server" GeneratesPostBack="false" Text="<%$ Resources: EPiServer, button.ok %>" />
                            <EPiServerUI:ToolButton ID="vgPopupCancel" runat="server" GeneratesPostBack="false" Text="<%$ Resources: EPiServer, button.cancel %>" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="groupNames" class="leftarea"></div>
        <div class="epi-hidden-clear"></div>
    </div>
    <span class="epi-helpText"><%=Translate("/edit/grouplisteditor/vgbottomheading")%></span>

    <fieldset class="epi-panel-container">
        <legend><asp:CheckBox runat="server" ID="noContentGroup" Text="<%$ Resources: EPiServer, edit.grouplisteditor.lgtopheading %>" /></legend>
        <div id="quickAddLG" class="epi-paddingVertical-small">
            <select id="contentGroups" class="episize240"></select>
            <div dojoType="dijit.form.DropDownButton" id="dropdownLG">
                <span></span>
                <div dojoType="dijit.TooltipDialog" id="dropdownLGAddDialog">
                    <span style="white-space: nowrap"><input type="text" id="newContentGroup" />&nbsp;<EPiServerUI:ToolButton ID="addContentGroup" runat="server" GeneratesPostBack="false" OnClientClick="" Text="<%$ Resources: EPiServer, button.add %>" /></span>
                </div>
            </div>
        </div>
        <div class="epi-hidden-clear"></div>
        <span class="epi-helpText"><%=Translate("/edit/grouplisteditor/lgbottomheading")%></span>
    </fieldset>

    <asp:HiddenField runat="server" ID="Groups" />
    <asp:HiddenField runat="server" ID="ContentGroupControl" />
    <asp:HiddenField runat="server" ID="AllContentGroupsControl" />

</asp:Panel>

<asp:Literal runat="server" ID="NoVisitorGroupsMessage" Text="<%$ Resources: EPiServer, edit.grouplisteditor.novisitorgroupsdefined %>" />
