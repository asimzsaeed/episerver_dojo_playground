<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<LinksPageable>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.BrokenLinks" %>
<table class="epi-default">
    <thead>
        <tr>
            <th>
                <%= Html.Translate("/shell/cms/brokenlinks/index/table/pagename") %>
            </th>
            <th>
            </th>
            <th>
                <%= Html.Translate("/shell/cms/brokenlinks/index/table/brokenurl") %>
            </th>
            <th>
                <%= Html.Translate("/shell/cms/brokenlinks/index/table/linkstatus") %>
            </th>
            <th>
                <%= Html.Translate("/shell/cms/brokenlinks/index/table/brokensince") %>
            </th>
            <th>
                <%= Html.Translate("/shell/cms/brokenlinks/index/table/lastchecked") %>
            </th>
        </tr>
    </thead>
    <% foreach (LinkingPageViewData brokenPage in Model.Items) { %>
        <tbody id="reportdata">
            <% Html.RenderPartial("BrokenLinkRow", brokenPage); %>
        </tbody>     
    <% } %>
    <tbody>
        <tr class="epipager">
            <td colspan="6">
                <%= Html.Paging(Model.Pages, "Index", new { rootPageId = Model.RootPageId})%>
            </td>
        </tr>
    </tbody>
</table>