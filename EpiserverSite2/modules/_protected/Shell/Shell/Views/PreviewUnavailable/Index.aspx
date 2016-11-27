<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<!DOCTYPE html>
<html>
    <head>
        <style type="text/css">
            body {
                font-family: Verdana,Arial,Helvetica,sans-serif;
            }
            .wrapper {
                display:flex !important;
                align-items:center;
                justify-content:center;
                margin-top: 100px;
            }
            .wrapper__text {
                text-align:center;
                max-width:500px;
            }

        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="wrapper__text">
                <h2><%= Html.Translate("/EPiServer/Shell/UI/Views/Previewunavailable/Resources/Title") %></h2>
                <p><%= Html.Translate("/EPiServer/Shell/UI/Views/Previewunavailable/Resources/Description") %></p>
            </div>
        </div>
    </body>
</html>
