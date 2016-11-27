<%@ Page Language="C#" EnableTheming="false" Inherits="System.Web.Mvc.ViewPage<IEnumerable<VisitorGroup>>" MasterPageFile="../Shared/VisitorGroup.Master" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>

<%@ Register TagPrefix="EPiServerUI" Namespace="EPiServer.UI.WebControls" Assembly="EPiServer.UI" %>

<asp:Content ContentPlaceHolderID="HeaderContentRegion" ID="HeaderRegion" runat="server">
<script type="text/javascript">
    function copyVisitorGroup(groupId) {
        dojo.xhrPost({
            url: '<%= Url.Action("Copy", "VisitorGroups") %>',
            handleAs: 'json',
            preventCache: true, // We need fresh data. Turning on this flag to avoid IE cache on XHR requests
            content: { groupId: groupId, __RequestVerificationToken: dojo.query("[name^='__RequestVerificationToken']")[0].value },
            error: function(error) { alert(error); },
            load: function (data) {
                if (data.success) {
                    document.location = '<%= Url.Action("Index", "VisitorGroups") %>'; 
                }
                else {
                    writeErrors(data.generalErrors);
                }
            }
        });
        return false;
    }

    function deleteVisitorGroup(groupId, groupName, isSecurityRole) {
        if (isSecurityRole) {
            OpenDialogMembershipDeleteUserOrRole(groupName, '<%: EPiServer.Security.SecurityEntityType.VisitorGroup %>', '', reloadPage, null, null, groupId);
        }
        else {
            if (confirm('<%= Html.TranslateForScript("/shell/cms/visitorgroups/index/table/deleteconfirmation") %>')) {
                dojo.xhrPost({
                    url: '<%= Url.Action("Delete", "VisitorGroups") %>',
                    handleAs: 'json',
                    preventCache: true, // We need fresh data. Turning on this flag to avoid IE cache on XHR requests
                    content: { groupId: groupId, __RequestVerificationToken: dojo.query("[name^='__RequestVerificationToken']")[0].value },
                    error: function (error) { alert(error); },
                    load: function (data) {
                        if (data.success) {
                            document.location = '<%= Url.Action("Index", "VisitorGroups") %>';
                        }
                        else {
                            writeErrors(data.generalErrors);
                        }
                    }
                });
            }
            return false;
        }
    }

    function deleteVisitorGroupStatistics(groupId) {
        if (confirm('<%= Html.TranslateForScript("/shell/cms/visitorgroups/index/table/resetstatisticsconfirmation") %>')) {
            dojo.xhrPost({
                url: '<%= Url.Action("DeleteStatistics", "VisitorGroups") %>',
                handleAs: 'json',
                preventCache: true, // We need fresh data. Turning on this flag to avoid IE cache on XHR requests
                content: { groupId: groupId, __RequestVerificationToken: dojo.query("[name^='__RequestVerificationToken']")[0].value },
                error: function(error) { alert(error); },
                load: function(data) {
                    document.location = '<%= Url.Action("Index", "VisitorGroups") %>';
                }
            });
        }
        return false;
    }

    function reloadPage(returnValue) {
        if (returnValue) {
            document.location.href = '<%= Url.Action("Index", "VisitorGroups") %>';
        }
    }

    // Writes error messages to validation summary
    function writeErrors(errors) {
        if (errors && errors.length > 0) {
            var validationSummary = dojo.byId('validationSummary');
            dojo.style(validationSummary, 'display', 'block');
            dojo.forEach(errors, function (error) {
                dojo.place('<li>' + error + '</li>', validationSummary);
            });
        }
    }

    require(["dojo/ready"], function (ready) {
        ready(function () {
            var sessionDisabled = <%= HttpContext.Current.Session == null ? "true" : "false" %>;
            if (sessionDisabled) {
                writeErrors(['<%= Html.TranslateForScript("/shell/cms/visitorgroups/index/sessionstatewarning")%>']);
            }
        });
    });
</script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainRegion" ID="MainRegion" runat="server">
<div class="epi-contentContainer epi-fullWidth">

    <div class="epi-contentArea">
        <h1 class="EP-prefix">
            <%= Html.Translate("/shell/cms/visitorgroups/index/name")%>
            <EPiServerUI:HelpButton runat="server" NavigateUrl="VisitorGroupsIndex" />
        </h1>
        <p><span class="EP-systemInfo">
            <%= Html.Translate("/shell/cms/visitorgroups/index/info")%></span></p>
    </div>
    <ul id="validationSummary" class="EP-validationSummary" style="display: none;">
    </ul>
    <div class="epi-formArea">
        <div class="epitoolbuttonrow">
            <span class="epi-cmsButton">
                <input type="button" 
                    value="<%= Html.Translate("/button/create") %>" 
                    onclick="document.location='<%= Url.Action("Create", "VisitorGroups") %>';"
                    onmouseover="EPi.ToolButton.MouseDownHandler(this)" 
                    onmouseout="EPi.ToolButton.ResetMouseDownHandler(this)" 
                    class="epi-cmsButton-text epi-cmsButton-tools epi-cmsButton-Add" />
            </span>
        </div>

        <table class="epi-default">
            <tr>
                <th class="episize300"><%= Html.Translate("/shell/cms/visitorgroups/index/table/name")%></th>
                <th><%= Html.Translate("/shell/cms/visitorgroups/index/table/notes")%></th>
                <th class="episize100"><%= Html.Translate("/shell/cms/visitorgroups/index/table/action")%></th>
            </tr>
            <% foreach (VisitorGroup group in Model)
                { %>
            <tr>
                <td><a href="<%= Url.Action("Edit", "VisitorGroups", new { groupId = group.Id }, null) %>"><%= Html.Encode(group.Name) %></a></td>
                <td><%= Html.Encode(group.Notes) %></td>
                <td>
                    <a href="<%= Url.Action("Edit", "VisitorGroups", new { groupId = group.Id }, null) %>" title="<%= Html.Translate("/shell/cms/visitorgroups/index/table/actions/edit") %>">
                        <img border="0" alt="<%= Html.Translate("/shell/cms/visitorgroups/index/table/actions/edit") %>" src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(Page, "Tools/Edit.gif") %>">
                    </a>

                    <a href="#" onclick="return copyVisitorGroup('<%= group.Id %>');" title="<%= Html.Translate("/shell/cms/visitorgroups/index/table/actions/copy") %>">
                        <img border="0" alt="<%= Html.Translate("/shell/cms/visitorgroups/index/table/actions/copy") %>" src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(Page, "Tools/Copy.gif") %>" />
                    </a>
                    
                    <a href="#" onclick="return deleteVisitorGroupStatistics('<%= group.Id %>');" title="<%= Html.Translate("/shell/cms/visitorgroups/index/table/actions/resetstatistics") %>">
                        <img border="0" alt="<%= Html.Translate("/shell/cms/visitorgroups/index/table/actions/resetstatistics") %>" src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(Page, "Tools/ResetStatistics.gif") %>">
                    </a>
                    
                    <a href="#" onclick="return deleteVisitorGroup('<%: group.Id %>', '<%: EPiServer.ClientScript.ClientScriptUtility.ToScriptSafeString(group.Name) %>', <%: group.IsSecurityRole ? "true" : "false" %>);" title="<%= Html.Translate("/shell/cms/visitorgroups/index/table/actions/delete") %>">
                        <img border="0" alt="<%= Html.Translate("/shell/cms/visitorgroups/index/table/actions/delete") %>" src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(Page, "Tools/Delete.gif") %>">
                    </a>
                </td>
            </tr>
            <% } %>
        </table>
    </div>
</div>
</asp:Content>
