<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IndexViewData>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.ExternalLinks" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<div class="cms-externalLinks">
    <% if (Model.ShowDetails)
       {
           Html.RenderPartial("DetailsView", Model.DetailsItems);
       }
       else
       {
           Html.RenderPartial("CommonView", Model.CommonItems);
       }
       Html.RenderPartial("Pager", Paging.GetFromIndexViewData(Model)); %>
</div>
