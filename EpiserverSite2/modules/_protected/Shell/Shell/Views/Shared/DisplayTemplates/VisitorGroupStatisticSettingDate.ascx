<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<VisitorGroupStatisticSettingDate>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%@ Import Namespace="EPiServer.Shell.UI.Models.VisitorGroupsStatistics" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>
<%@ Import Namespace="EPiServer.Shell.UI.Models.VisitorGroupsStatistics.Statistics" %>
<%@ Import Namespace="EPiServer.Shell.UI" %>

<% if (Model.Options != null && Model.Options.Count > 0)
   { %>
    <div class="epi-floatRight epi-visitorGroupStatistics-options">  
        <dl>
                <dt> <%= Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/GraphBy") %>:</dt>
        <%
            int i = 0;
            foreach (var option in Model.Options as List<VisitorGroupStatisticSettingTimeSpan>)
            { %>
                <dt class="<%= Model.SelectedOption == option ? "epi-visitorGroupStatistics-options-active epi-visitorGroupStatistics-options-margin" : "epi-visitorGroupStatistics-options-margin" %>">
                    <%= Html.ViewLink(Html.Translate(String.Format("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/{0}", option.ToString())), 
                    "", "ChangeSettingsOption", null, null, new { selectedOption = i++ })%>
                </dt>
            <% } %>

        </dl>
    </div>
<% } %>

<div class="container_daterange">
    <h4 class="epi-floatLeft display_text_margin">
        <%= Model.DisplayText ?? Html.Translate("/EPiServer/Shell/UI/Views/VisitorGroupsStatistics/Resources/Everything") %>
    </h4>  
    <div class="statIntervalPicker"></div>
</div>

<script type="text/javascript">
    require(["epi/shell/widget/DateRangePicker", "dojo/domReady!"], function (DateRangePicker) {
        //instanciate a DateRangePicker object on the div of id statIntervalPicker
        //set the default start date and end date (with server side values)
        var node = dojo.query('#gadget_<%= Html.GetGadgetId() %> .statIntervalPicker')[0];
        var statIntervalPickerWidget = new DateRangePicker({}, node);
        statIntervalPickerWidget.startDate = dojo.date.locale.parse('<%= Html.GetDateTimeGetParamString(Model.FromDate) %>', { datePattern: "yyyy.MM.dd", selector: "date", locale: dojoConfig.locale });
        statIntervalPickerWidget.endDate = dojo.date.locale.parse('<%= Html.GetDateTimeGetParamString(Model.ToDate) %>', { datePattern: "yyyy.MM.dd", selector: "date", locale: dojoConfig.locale });
        //catch the publication of the event intervalHasBeenSet sent by the widget DateRangePicker, 
        //and send to the server the new interval, with the right date format, to load the right statistics
        dojo.subscribe("intervalHasBeenSet", function (datePickerId) {
            if (datePickerId !== statIntervalPickerWidget.id) {
                return;
            }
            var startDate = dojo.date.locale.format(statIntervalPickerWidget.startDate, { datePattern: "yyyy.MM.dd", selector: "date", locale: dojoConfig.locale });
            var endDate = dojo.date.locale.format(statIntervalPickerWidget.endDate, { datePattern: "yyyy.MM.dd", selector: "date", locale: dojoConfig.locale });
            //send the values to the asp controller
            var gadget = epi.gadget.getByElement("#gadget_<%= Html.GetGadgetId() %>");
            gadget.loadView({
                action: "ChangeSettingsDates",
                fromDate: startDate,
                toDate: endDate
            });
        });
    }); 
</script>
