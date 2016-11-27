<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IndexViewData> " %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.XFormsViewer" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Shell.Web" %>
<div class="epi-formArea">
    <%= Html.AutoUpdate(1000 * (int)Model.AutoupdateLevel, "Index")%>
    <div class="cms-XFormsViewer-FormTitle">
        <%=Model.XFormName%>
    </div>
    <div class="cms-XFormsViewer-FormTable">
        <table class="epi-simple">
            <thead>
                <tr>
                    <%if (Model.ShowDate)
                      { %>
                    <th scope="col">
                        <%= Html.Translate("/shell/cms/XFormsViewer/TableColumnPostedTime")%>
                    </th>
                    <% } %>
                    <% foreach (string key in Model.Fields)
                       {%>
                    <th scope="col">
                        <%=Html.Encode(key)%>
                    </th>
                    <% } %>
                </tr>
            </thead>
            <% if (Model.TableData.Count() > 0)
               { %>
            <tbody>
                <% foreach (PostData data in Model.TableData)
                   {            
                %>
                <tr>
                    <%if (Model.ShowDate)
                      { %>
                    <td scope="col">
                        <span class="cms-XFormsViewer-TableItem">
                            <%= data.Date.ToFriendlyDateTimeString()%>
                        </span>
                        <% Html.RenderToolTip(data.ToolTip); %>
                    </td>
                    <% }
                      foreach (string key in Model.Fields)
                      {   
                    %>
                    <td scope="col">
                        <span class="cms-XFormsViewer-TableItem">
                            <%= Html.Encode(data[key])%>
                        </span>
                    </td>
                    <% } %>
                </tr>
                <% } %>
            </tbody>
            <% } %>
        </table>
    </div>
    <% if (Model.ShowChart && !string.IsNullOrEmpty(Model.XFormName))
       {
           Html.RenderPartial("FormViewGadget", Model);
       } %>
</div>
