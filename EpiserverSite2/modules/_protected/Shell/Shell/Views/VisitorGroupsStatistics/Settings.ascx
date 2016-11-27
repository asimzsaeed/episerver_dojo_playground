<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<Settings>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%@ Import Namespace="EPiServer.Shell.UI.Models.VisitorGroupsStatistics" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>
<%= Html.ShellValidationSummary()%>
<div class="epi-paddingHorizontal-small epi-formArea">
    <fieldset>
        <legend><%= Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/StatisticView") %></legend>
        <div class="epi-size10">
            <% Html.BeginGadgetForm("SelectView"); %>
                <%= Html.LabeledDropDownList("SelectedView", Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/SelectView"), 
                Model.AllStatisticViews, new { @class = "epi-size10" }, null)%>
            <% Html.EndForm(); %>
        </div>
    </fieldset>
    
   <% Html.BeginGadgetForm("Settings"); %>
    <%= Html.AntiForgeryToken()%>

    <div class="epi-noMargin">
        <span class="error" htmlFor="SelectedVisitorGroupIds" style="display:none">
        <%= Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/SelectFormFields") %></span>
        <fieldset>
            <legend>
                <%= Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/VisitorGroups") %>
            </legend>
            
            <a href="#" onclick="return false;" class="selectAllVisitorGroups"><%= Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/SelectAll") %></a> | 
            <a href="#" onclick="return false;" class="unselectAllVisitorGroups"><%= Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/UnselectAll") %></a>
            <br /><br />
            
            <div class="cms-visitorGroupsStatisticsGadget-VisitorGroups">                        
                <% if (Model.AllVisitorGroups != null && Model.AllVisitorGroups.Count() > 0)
                   {
                %>
                <ul class="visitorGroupList">
                    <% foreach (var visitorGroup in Model.AllVisitorGroups)
                      {
                          string checkboxId = "vgCheckbox" + visitorGroup.Id.ToString(); %>
                        <li class="visitorGroupListItem">
                            <input type="checkbox" 
                                id="<%= checkboxId %>"
                                value="<%= visitorGroup.Id.ToString() %>" 
                                name="SelectedVisitorGroupIds" 
                                <%= (Model.ViewStatisticSettings != null && Model.ViewStatisticSettings.VisitorGroupIdentities != null) ? (Model.ViewStatisticSettings.VisitorGroupIdentities.Contains(visitorGroup.Id) ? "checked='checked'" : String.Empty) : String.Empty %>
                                />
                            <label for="<%= checkboxId %>"><%= Html.Encode(visitorGroup.Name) %></label>
                        </li>
                    <%} %>
                </ul>
                <%} %>
                <%= (Model.AllVisitorGroups != null && Model.AllVisitorGroups.Count() == 0) ? 
                    Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/NoVisitorGroupAvailable") : String.Empty%>
            </div>
        </fieldset>
    </div>
    
    <%= Html.Hidden("SelectedView", Model.SelectedView)%>
    <%= Html.Hidden("StatisticViewId", Model.ViewStatisticSettings.Id)%>
    <%= Html.Hidden("ViewStatisticSettingsType", Model.ViewStatisticSettings.GetType().FullName)%>

     
    <div class="epi-buttonContainer-simple">
        <%= Html.AcceptButton(new { @class = "epi-button-small" })%>
        <%= Html.CancelButton(new { @class = "epi-button-small" })%>
    </div>
    <% Html.EndForm(); %>
</div>
