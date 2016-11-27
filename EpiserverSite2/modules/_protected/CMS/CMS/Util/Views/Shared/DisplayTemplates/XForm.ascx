<%@ Import Namespace="EPiServer.HtmlParsing" %>
<%@ Import Namespace="EPiServer.Web.Mvc.Html" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EPiServer.XForms.XForm>" %>

<% var actionResult = ViewData["XFormActionResult"] as EPiServer.Web.Mvc.XForms.XFormActionBaseResult; %>
<% if (actionResult != null && actionResult.XFormId.ToString() == Model.Id.ToString() && actionResult is EPiServer.Web.Mvc.XForms.XFormSuccessActionResult)
   { %>
    <strong><%: Html.Translate("/xform/formposted") %></strong>
<% } else { %>
    <% using (Html.BeginXForm(Model, htmlAttributes: new { @class = "form xform" })) { %>
        <% if (Model != null){ %>
            <% var fragments = (actionResult != null && actionResult.XFormId.ToString() == Model.Id.ToString()) ? ((IEnumerable<HtmlFragment>)ViewData["XFormFragments"] ?? Model.CreateHtmlFragments()) : Model.CreateHtmlFragments(); %>
            <% foreach (HtmlFragment fragment in fragments) {%>
                <%: Html.Fragment(fragment)%>
            <% } 
           } %>
    <% } %>
<% } %>
