<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="Logout.aspx.cs" Inherits="EPiServer.Util.Logout" Title="Logout" %>

<%@ Import Namespace="System.Threading" %>
<%@ OutputCache Location="None" %>


<!DOCTYPE html>
<html>
    <head id="Head1" runat="server">
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title id="Title1" runat="server" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex,nofollow" />
        <link type="text/css" rel="stylesheet" href="styles/login.css" />
    </head>
    <body>
    <div class="top-bar"><img src="images/episerver-white.svg" alt="logo" class="logo" /></div>
    <form id="aspnetForm" runat="server">
        <div class="js-login-wrapper login-wrapper" id="LoginControl">
            <div class="modal">
                <ol class="clearfix">
                    <li><h2><asp:Label runat="server" ID="LogOutLabel" /></h2></li>
                    <li><asp:Button runat="server" ID="LinkToLogin" Visible="True"/></li>
                </ol>
            </div>
        </div>
    </form>

    <script>
        var classes = [' img1', ' img2', ' img3'];
        document.getElementById("LoginControl").className += classes[Math.floor(Math.random() * classes.length)]
    
        function toggleCookieText() {
            var cookieInfoPanel = document.getElementById("cookieInfoPanel");
            cookieInfoPanel.style.display = (cookieInfoPanel.style.display == "block" ? "none" : "block");
            return false;
        }
    </script>
</body>
</html>
