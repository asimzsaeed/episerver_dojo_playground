<%@ Page language="c#" AutoEventWireup="false" Codebehind="DynamicContentPreview.aspx.cs" Inherits="EPiServer.UI.Editor.Dialogs.DynamicContentPreview" %>
<%@ Import Namespace="EPiServer.Shell"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>Preview Dynamic Content</title>
        
        <style type="text/css">
            html {
                background-color:#fff;
                overflow:auto;
            }
            html, body {
                margin:0;
                height:100%;
            }
            form {
                padding-left:3px;
            }
        </style>
        <asp:PlaceHolder runat="server">
            <script type="text/javascript" src="<%=Paths.ToShellClientResource("ClientResources/EPiJQuery.js")%>"></script>
        </asp:PlaceHolder>
    </head>
    <body id="content" class="mceContentBody">
        <form runat="server">
            <input type="hidden" id="DynamicContent" runat="server"/>
        </form>
    </body>
</html>