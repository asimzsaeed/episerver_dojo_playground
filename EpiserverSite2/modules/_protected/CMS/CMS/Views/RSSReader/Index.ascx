<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<ViewModel>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Globalization" %>
<%@ Import Namespace="System.ServiceModel.Syndication" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.RssReader" %>


<div class="epi-rssReaderContent">
     <div class="epi-padding">
        <h3><%= Html.Encode(Model.Title) %></h3>
        <ul class="epi-articleList">
            <% foreach (SyndicationItem item in Model.Items) {%>
            <li>
                <h4><a href="<%= Html.Encode(item.Links.Count > 0 ? item.Links[0].Uri : null) %>"><%= Html.Encode(HttpUtility.HtmlDecode(item.Title.Text)) %></a></h4>
                <span class="epi-articleDate"><%= item.PublishDate.ToString("g") %></span>
                <p><a href="<%= Html.Encode(item.Links.Count > 0 ? item.Links[0].Uri : null) %>"><%= Html.Encode(HttpUtility.HtmlDecode(item.Summary != null ? item.Summary.Text : ""))%></a></p>
            </li>
            <%}%>
        </ul>
    </div>
</div>
