<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable<LinkCommonData>>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.ExternalLinks" %>
<table class="epi-simple cms-externalLinks-table">
    <thead>
        <tr>
            <th class="epi-width30" scope="col">
                <%= Html.Translate("/shell/cms/externallinks/common/host")%>
            </th>
            <th class="epi-width10" scope="col">
                <%= Html.Translate("/shell/cms/externallinks/common/hits")%>
            </th>
        </tr>
    </thead>
    <% if (Model.Count() > 0)
       { %>
    <tbody>
        <% foreach (var item in Model)
           { %>
        <tr>
            <td>
                <a href="<%= item.Url %>" title="<%= item.Url %>" target="_blank">
                    <%= item.Host %>
                </a>
            </td>
            <td>
                <%= item.Hits %>
            </td>
        </tr>
        <% } %>
    </tbody>
    <% } %>
</table>
