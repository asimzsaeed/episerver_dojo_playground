<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html"%>

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
    <h1 class="EP-prefix"><%= Html.Translate("/EPiServer/Shell/UI/Views/Licensing/Resources/Title") %></h1>
    <div class="epi-paddingVertical">
        <%: ViewData["Error"] %>
    </div>
    <p></p>
    </div>
    </div>
</div>
</body>
</html>