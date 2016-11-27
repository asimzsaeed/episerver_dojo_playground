<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <%--
        Need a container control around everything that uses Response.Write in the head,
        since WebForm pages modifies the control collection in the head control
    --%>
    <title>About EPiServer</title>

        <!-- Shell -->
        <%=Page.ClientResources("ShellCore")%>

         <!-- LightTheme -->
        <%=Page.ClientResources("ShellCoreLightTheme")%>

</head>
<body>
    <div class="epi-contentContainer epi-padding">
        <h1>About EPiServer</h1>
        <p>Copyright &copy; 1996-2016 EPiServer AB. All rights reserved.</p>
        <p>EPiServer&#153; is a registered trademark in USA, European Community, Norway, Switzerland, Australia and other countries.</p>
        <p>EPiServer CMS and EPiServer Framework with supplementary products, packages, connectors and modules are licensed under the EPiServer End User License Agreement.</p>
        <p>By installing, copying, downloading, having access to, or in any other way using the software, you accept all the terms and conditions in the End User License Agreement and this agreement becomes a binding obligation on you.</p>
        <p>EPiServer AB, Sales information: <a href="mailto:sales@episerver.com">sales@episerver.com</a> <br />Visit our web sites: <a href="http://www.episerver.com" target="_blank">www.episerver.com</a> and <a href="http://world.episerver.com" target="_blank">world.episerver.com</a> <br /></p>
    </div>
</body>
</html>
