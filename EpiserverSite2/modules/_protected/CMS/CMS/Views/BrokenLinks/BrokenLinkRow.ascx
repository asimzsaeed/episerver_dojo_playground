<%@ Import Namespace="System.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.BrokenLinks" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<LinkingPageViewData>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<script runat="server">
    protected override void OnLoad(EventArgs e)
    {
        // If we don't do this the GetImageThemeUrl won't work.
        Page.AppRelativeTemplateSourceDirectory = HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath;
    }
</script>

<tr>
    <td rowspan="<%= Model.BrokenLinks.Count %>">
        <%= Html.Anchor(Model.EditUrl, "EPiServerMainUI", Model.ToolTip, Model.PageName, 50)%>
    </td>
    <td rowspan="<%= Model.BrokenLinks.Count %>">
        <img class="epi-ajaxLoader" src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(Page, "General/AjaxLoader.gif")%>"
            alt="<%= Html.Translate("/shell/cms/brokenlinks/index/working") %>" />
        <a class="epi-recheckLink" id="<%=Model.ClientId %>" href="<%= Url.Action("Recheck", new { page = Model.PageLink } ) %>"
            title="Re-check page">
            <img src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(Page, "Tools/Refresh.gif")%>"
                alt="<%= Html.Translate("/shell/cms/brokenlinks/index/recheck") %>" />
        </a>
    </td>
    <% if (Model.BrokenLinks.Count > 0)
           Html.RenderPartial("BrokenLinkCells", Model.BrokenLinks[0]); %>
</tr>
<% foreach (LinkViewData brokenLink in Model.BrokenLinks.Skip(1))
   { %>
        <tr><% Html.RenderPartial("BrokenLinkCells", brokenLink); %></tr>
<% } %>