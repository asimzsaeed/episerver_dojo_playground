<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Settings>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%@ Import Namespace="EPiServer.Shell.UI.Models.VisitorGroupsStatistics" %>
<a class="epi-visitorGroupStatistics-chart" href="<%=Url.Action("GenerateChart", new {gadgetId=Model.GadgetId, stamp=Guid.NewGuid() }) %>">Loading image...</a>

