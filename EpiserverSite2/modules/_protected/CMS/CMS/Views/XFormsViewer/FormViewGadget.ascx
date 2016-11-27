<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IndexViewData> " %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.XFormsViewer" %>
<%@ Import Namespace="System.IO"%>

<div id="outside" class="cms-XFormsViewer-Outside" >
    <div id="inside" class="cms-XFormsViewer-Inside">                     
        <img  src="<%=Url.Action("ShowChart", new {gadgetId=Model.GadgetID, stamp=Guid.NewGuid() }) %>" alt="" class="cms-XFormsViewer-ChartImage" />
    </div>
</div>
 