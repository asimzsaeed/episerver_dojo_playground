<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Paging>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.ExternalLinks" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<div class="cms-exteranlLinks-pager">
    <div class="cms-exteranlLinks-pager-info">
        <%= Html.TranslateFormat("/shell/cms/externallinks/pager/info", Model.MinIndexOfItem, Model.MaxIndexOfItem, Model.TotalItemsCount)%>
    </div>
    <div class="cms-exteranlLinks-pager-paging">
        <% if (Model.PageNumber > 1)
           { %>
        <a href="#" class="cms-exteranlLinks-pager-prev">
            <%= Html.Translate("/shell/cms/externallinks/pager/prev")%>
        </a>
        <% }
           foreach (int page in Model.Pages)
           {
               if (page == 0)
               { %>
        <span class="cms-exteranlLinks-pager-split">
            <%= Html.Translate("/shell/cms/externallinks/pager/split")%>
        </span>
        <% continue;
               }

               if (page == Model.PageNumber)
               {
                   if (Model.TotalPagesCount > 1)
                   { %>
        <span class="cms-exteranlLinks-pager-current">
            <%= Model.PageNumber%>
        </span>
        <% }
                   continue;
               } %>
        <a href="#" class="cms-exteranlLinks-pager-page">
            <%= page %>
        </a>
        <% }
           if (Model.PageNumber < Model.TotalPagesCount)
           { %>
        <a href="#" class="cms-exteranlLinks-pager-next">
            <%= Html.Translate("/shell/cms/externallinks/pager/next")%>
        </a>
        <% } %>
    </div>
</div>
