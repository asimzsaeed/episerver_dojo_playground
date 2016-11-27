<%@ Page Language="C#" EnableTheming="false" Inherits="System.Web.Mvc.ViewPage<LinksPageable>" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Framework.Web.Resources"%>
<%@ Import Namespace="EPiServer.Cms.Shell.UI.Models.BrokenLinks" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>

<%@ Register TagPrefix="EPiServerUI" Namespace="EPiServer.UI.WebControls" Assembly="EPiServer.UI" %>

<script runat="server">
    protected override void OnPreInit(EventArgs e)
    {
        base.OnPreInit(e);
    }
</script>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>
        <%= Html.Translate("/shell/cms/brokenlinks/index/name") %>
    </title>
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
    <asp:PlaceHolder runat="server">
        <%= Html.ShellScriptBase() %>
        <%=Page.ClientResources("ShellCore")%>
        <%=Page.ClientResources("ShellCoreLightTheme")%>
        <%= Html.ScriptResource(EPiServer.Shell.Paths.ToClientResource("CMS", "ClientResources/BrokenLinks/BrokenLinks.js"))%>
        <%= Html.CssLink(EPiServer.Shell.Paths.ToClientResource("CMS", "ClientResources/BrokenLinks/BrokenLinks.css"))%>
        <%= Html.CssLink(EPiServer.Web.PageExtensions.ThemeUtility.GetCssThemeUrl(Page, "system.css"))%>
        <%= Html.CssLink(EPiServer.Web.PageExtensions.ThemeUtility.GetCssThemeUrl(Page, "ToolButton.css"))%>
        <%= Html.ScriptResource(EPiServer.Shell.Paths.ToClientResource("CMS", "ClientResources/ReportCenter/ReportCenter.js"))%>
        <%= Html.ScriptResource(EPiServer.UriSupport.ResolveUrlFromUtilBySettings("javascript/episerverscriptmanager.js"))%>
        <%= Html.ScriptResource(EPiServer.UriSupport.ResolveUrlFromUIBySettings("javascript/system.js")) %>
        <%= Html.ScriptResource(EPiServer.UriSupport.ResolveUrlFromUIBySettings("javascript/dialog.js")) %>
        <%= Html.ScriptResource(EPiServer.UriSupport.ResolveUrlFromUIBySettings("javascript/system.aspx")) %>
    </asp:PlaceHolder>
</head>
<body>

    <script type="text/javascript" language="javascript">
        $(document).ready(function() {
            epi.brokenLinks.initialize(
                '<%=EPiServer.UriSupport.ResolveUrlFromUIBySettings("edit/pagebrowser.aspx") %>',
                '<%= Url.Action("GetRunningJobs")%>');
        });
    </script>
<% Html.BeginForm(null, null, FormMethod.Post, new { id = "form" }); %>
<div class="epi-contentContainer epi-padding">

    <div class="epi-contentArea">
        <div class="EP-systemImage" style='background-image: url(<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(Page, "ReportCenter/BrokenLinks.png")%>);'>
            <h1 class="EP-prefix"> 
                <%= Html.Translate("/shell/cms/brokenlinks/index/name")%>
                <EPiServerUI:HelpButton runat="server" />
            </h1>
            <span class="EP-systemInfo">
                <%= Html.Translate("/shell/cms/brokenlinks/index/info") %></span>
        </div>
    </div>
    <div class="epi-formArea">
        <fieldset>
            <legend>
                <%= Html.Translate("/reportcenter/reportcriterias/heading")%></legend>
            <div class="epi-size10">
                <div>
                    <label for="selectPageButton">
                        <%= Html.Translate("/reportcenter/reportcriterias/selectrootpage")%>
                    </label>
                    <%=Html.Hidden("rootPageId", Model.RootPageId)%>
                    <%=Html.TextBox("rootPageName", EPiServer.ServiceLocation.ServiceLocator.Current.GetInstance<EPiServer.IContentLoader>().Get<EPiServer.Core.PageData>(new EPiServer.Core.PageReference(Model.RootPageId)).PageName, new { @readonly = true, @class = "epi-disabledTextBox episize240" })%>
                    <input id="selectPageButton" type="button" value="..." class="epismallbutton" />
                </div>
            </div>
        </fieldset>
        
        <div class="epitoolbuttonrow"><span class="epitoolbutton"><img alt="" src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(this, "Tools/Report.gif") %>" style="*margin-top:5px;" /><input type="submit" value="<%= Html.Translate("/shell/cms/brokenlinks/index/showreport") %>" onmouseover="EPi.ToolButton.MouseDownHandler(this)" onmouseout="EPi.ToolButton.ResetMouseDownHandler(this)" style="_padding-left:20px;" /></span></div>
            <div class="epi-floatRight epi-marginVertical-small">
                <%= Html.Translate("/shell/cms/brokenlinks/index/itemsperpage") %>
                <%= Html.DropDownList("pageSize", Html.SelectList(Model.Pages.PageSize, 10, 25, 50, 100)) %>
            </div>
            <div class="epi-floatLeft epi-marginVertical-small"><%= Html.TranslateFormat("/reportcenter/numberofhits", Model.Pages.TotalItemsCount) %></div>
        <% if (Model.Pages.TotalItemsCount > 0)
           {
               Html.RenderPartial("LinksTable", Model);
           } 
        %>
    </div>

    
    </div>
    <% Html.EndForm(); %>
</body>
</html>
