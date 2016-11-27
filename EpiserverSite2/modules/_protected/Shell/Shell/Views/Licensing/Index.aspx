<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<EPiServer.Licensing.LicenseDataCollection>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Licensing"%>
<%@ Import Namespace="EPiServer.Shell.UI" %> 


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <%--    
        Need a container control around everything that uses Response.Write in the head, 
        since WebForm pages modifies the control collection in the head control
    --%>    
    <title>Licenses</title>
        
        <!-- Shell -->
        <%=Page.ClientResources("ShellCore")%>
             
         <!-- LightTheme -->
        <%=Page.ClientResources("ShellCoreLightTheme")%>
        
</head>
<body>
<div class="epi-contentContainer epi-padding">
    <div class="epi-contentArea epi-paddingHorizontal">
    <h1 class="EP-prefix">
        <%= Html.Translate("/EPiServer/Shell/UI/Views/Licensing/Resources/Title") %>
        <%= Html.HelpButton()%>
    </h1>
    <div class="epi-paddingVertical">
    <% foreach (var license in Model)
       { %>
            <h2><%: license.Name%></h2>
            <p>
            <% foreach (string key in license.MetaData.Keys)
               { %>
                    <%: key%>: <%: license.MetaData[key]%><br/>
            <% } %>
            </p>
            <p>
                <% foreach (var restriction in license.Restrictions)
                   { %>
                        <% foreach (var entry in restriction.Entries)
                           { %>
                            <%: entry.Description%><br/>
                <% } %>
            <% } %>
            </p>
            <div></div>
    <%} %>
    </div>
    </div>
</div>
</body>
</html>