<%@ Page Language="c#" CodeBehind="Login.aspx.cs" AutoEventWireup="False" Inherits="EPiServer.UI.Util.Login" Title="Login" %>
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
            <episerverui:login CssClass="js-login-wrapper login-wrapper" id="LoginControl" runat="server" failuretext="<%$ Resources: EPiServer, login.loginfailed %>" enableajaxlogin="true">
            <LayoutTemplate>
              <div class="modal">

            <ol class="clearfix">
                <li><img src="images/login/DXC_long.svg" alt="logo" class="logo" /></li>
                <li>
                    <h2 class="text--error"><asp:Literal runat="server" ID="FailureText" /></h2>
                    <asp:ValidationSummary ID="ValidationSummary1" runat="server" DisplayMode="List" EnableClientScript="true" CssClass="text--error" />
                </li>
                <li>
                    <label for="UserName"><asp:Literal runat="server" Text="<%$ Resources: EPiServer, login.username %>" /></label>
                    <asp:TextBox SkinID="Custom" ID="UserName" runat="server" />
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" ErrorMessage="<%$ Resources: EPiServer, login.usernamerequired %>" Text="&#173;" ControlToValidate="UserName" Display="Dynamic" runat="server" />
                </li>
                <li>
                    <label for="Password"><asp:Literal runat="server" Text="<%$ Resources: EPiServer, login.password %>" /></label>
                    <asp:TextBox SkinID="Custom" ID="Password" Text="password" runat="server" TextMode="Password" />
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator2" ErrorMessage="<%$ Resources: EPiServer, login.missingpassword %>" Text="&#173;" ControlToValidate="Password" Display="Dynamic" runat="server" />
                </li>
                <li>
                    <asp:Button ID="Button1" CssClass="epi-button-child-item" CommandName="Login" Text="<%$ Resources: EPiServer, button.login %>" runat="server" />
                </li>
                <li>
                    <p class="text--small">
                        <a href="#" onclick="toggleCookieText(); return false;">
                            <asp:Literal ID="Literal1" Text="<%$ Resources: EPiServer, cookie.logincaption %>" runat="server" />
                        </a>
                    </p>
                    <div id="cookieInfoPanel" class="cookie-information">
                        <p class="text--small">
                            <asp:Literal ID="Literal2" Text="<%$ Resources: EPiServer, cookie.logininfo %>" runat="server" />
                        </p>
                    </div>
                </li>
            </ol>
          </div>
        </div>
        </LayoutTemplate>
        </episerverui:login>
    </form>

    <script>
        var classes = [' img1', ' img2', ' img3'];
        document.getElementById("LoginControl").className += classes[Math.floor(Math.random() * classes.length)]

        function toggleCookieText() {
            document.getElementById("cookieInfoPanel").classList.toggle("is-visible");
            return false;
        }
    </script>
</body>
</html>
