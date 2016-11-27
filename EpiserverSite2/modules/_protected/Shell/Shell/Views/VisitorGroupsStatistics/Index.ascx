<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IndexViewData>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%@ Import Namespace="EPiServer.Shell.UI.Models.VisitorGroupsStatistics" %>
<%@ Import Namespace="EPiServer.Shell.Web.Routing" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<div class="epi-padding-small epi-formArea">
    <h3 class="epi-floatLeft" id="label_<%=Model.GadgetID %>"></h3>

    <%= Html.DisplayFor(model => model.Settings.ViewStatisticSettings) %>
    
    <div id="outside" class="epi-floatLeft cms-visitorGroupsStatisticsGadget-Outside" >
        <div id="inside" class="cms-visitorGroupsStatisticsGadget-Inside">
            <% if (Model.StatisticResult.Items.Count() > 0)
               {
                   Html.RenderPartial("Chart", Model.Settings);
               }
               else
               {
                   %>
                   <div class="epi-marginVertical">
                   <%
                       string noChartData = Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/NoChartData");
                       string editChartData = Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/EditGadget");
                       Response.Write(noChartData + " " + Html.ViewLink(editChartData, "", "Settings", "editMode", null));
                   %>
                   </div>
                   <%
               } 
            %>
       </div>
   </div>
    <input type="hidden" id="GadgetContext_<%=Model.GadgetID %>" />
</div>
    