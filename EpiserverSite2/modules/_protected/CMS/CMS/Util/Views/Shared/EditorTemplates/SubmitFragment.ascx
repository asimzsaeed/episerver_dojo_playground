<%@ Import Namespace="EPiServer.XForms.Parsing" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<SubmitFragment>" %>
<div>
    <input type="submit" name="<%: Html.Raw(Model.UniqueName) %>" title="<%: Html.Raw(Model.Title) %>" value="<%: Html.Raw(Model.Value) %>" class="<%: Html.Raw(Model.Class) %>" />
</div>