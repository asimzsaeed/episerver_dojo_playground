<%@ Page Language="C#" MasterPageFile="../Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<Dashboard>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%@ Import Namespace="EPiServer.Shell.Web"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>
<%@ Import Namespace="System.Threading" %>
<%@ Import Namespace="EPiServer.Shell.Dashboard" %>

<asp:Content ContentPlaceHolderID="HeaderContent" runat="server">
    <script type="text/javascript" src="<%= ResolveClientUrl("../../ClientResources/EPi/Views/Debug/Dashboard.Admin.js") %>"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <script type="text/javascript">
        $(document).ready(function() {
            epi.shell.layout.initScrollableArea({ area: "#epi-applicationBodyMain" });
            epi.dashboard.admin.init();
        });
    </script>
        <div id="epi-applicationBodyMain">
    <div class="epi-contentArea epi-padding">
        <h1>Dashboard Administration</h1>
        <p>If you have problems with your dashboard you can use this view to remove tabs and gadgets.</p>
            <%Html.BeginForm(); %>
            <table class="epi-default">
                <thead>
                        <tr>
                            <th>Name</th>
                            <th class="epi-alignCenter">Delete</th>
                        </tr>
                </thead>
                <tbody>
            <%foreach (var tab in Model.Tabs)
              {
                   %>
                <tr id="tabRow_<%=tab.Id %>">
                    <th title="Id: <%=tab.Id %>"><%=tab.Name.Ellipsis(80)%></th>
                    <th class="epi-alignCenter"> <%=Html.CheckBox("tab_" + tab.Id.ToString(), tab.IsDeleted)%></th>
                </tr>
                <%foreach (var gadget in tab.Containers.SelectMany(c => c.Gadgets))
                  {
                       %>
                <tr>
                    <td title="<%= string.Format("GadgetId: {0}, Controller: {1}", gadget.Id, gadget.ControllerTypeName) %>"><%=gadget.Title.Ellipsis(100) %></td>
                    <td class="epi-alignCenter">
                        <%if (!gadget.IsDeleted)
                          { %>
                            <%= Html.CheckBox("gadget_" + gadget.Id, gadget.IsDeleted)%>
                        <%}
                          else { %>
                            <%= Html.CheckBox("gadget_" + gadget.Id, gadget.IsDeleted, new { disabled = "disabled" })%>
                        <%}%>
                    </td>
                </tr>
                <%} %>
            <%} %>
            </tbody>
        </table>
        <div class="epi-buttonContainer">
            <%= Html.ShellSubmitButton(null, "Delete", new { onclick = "return confirm('This will permanently remove any selected tabs and gadgets from your dashboard. Do you want to continue?');" })%>
            <%= Html.ShellButton("ResetDashboard", "Reset dashboard", null)%>
        </div>
        <% Html.EndForm(); %>
    </div>
    </div>
</asp:Content>
