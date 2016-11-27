<%@ Page Title="" Language="C#" AutoEventWireup="false" CodeBehind="ControlWrapper.aspx.cs" Inherits="EPiServer.Shell.UI.Views.Shared.Wrappers.ControlWrapper" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 
    1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server" >
    <title>Master page title</title>
</head>
<body>
    <form runat="server">
        <asp:PlaceHolder ID="placeHolderControl" Runat="server" />
    </form>
</body>
</html>
