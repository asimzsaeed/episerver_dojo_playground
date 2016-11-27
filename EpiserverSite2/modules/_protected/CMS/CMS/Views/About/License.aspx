<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<asp:Content ContentPlaceHolderID="NavigationContent" runat="server">
</asp:Content>
<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <div id="epi-applicationBody">
        <div id="epi-applicationBodyMain" class="epi-padding">
            <h1><%= Html.Translate("/shell/cms/menu/license") %></h1>
            <hr />
<pre>
<%= ViewData["LicenseText"] %>
</pre>
        </div>
    </div>
</asp:Content>
