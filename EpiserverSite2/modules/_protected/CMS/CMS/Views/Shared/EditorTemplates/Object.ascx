<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>
<%@ Import Namespace="EPiServer.Cms.Shell" %>

<div>
<%  
    Type modelType = ViewData.ModelMetadata.ModelType;
    foreach (ModelMetadata mm in ViewData.ModelMetadata.Properties)
    {
        string name = mm.PropertyName;
        string label = null;
        System.Reflection.PropertyInfo pi = modelType.GetProperty(name);  
        
        object[] attrs = pi.GetCustomAttributes(typeof(DojoWidgetAttribute), true);
        DojoWidgetAttribute attr = attrs.Length > 0 ? (DojoWidgetAttribute)attrs[0] : null;

        //If the property should be ignored, do not create an editor for it
        if (attr != null && attr.Ignore)
        {
            continue;
        }
        
        string widgetType = attr == null ? null : attr.WidgetType;
        Type selectionFactoryType = attr == null ? null : attr.SelectionFactoryType;
        
        bool isHidden = (!String.IsNullOrEmpty(widgetType) && widgetType.Equals("epi-cms.form.Hidden", StringComparison.OrdinalIgnoreCase)) ||
                        (String.IsNullOrEmpty(widgetType) && selectionFactoryType == null &&
                            (pi.PropertyType.FullName == "System.Guid" || pi.PropertyType.FullName == "EPiServer.Data.Identity"));

        if (!isHidden)
        {
            label = (attr == null || String.IsNullOrEmpty(attr.LabelTranslationKey)) ? pi.Name : Html.Translate(attr.LabelTranslationKey);
        }
                      
        %>
        <div>
            <%= Html.DojoEditorFor(pi, null, label, "episize200", DojoHtmlExtensions.LabelPosition.Left) %>
        </div>
        <%
    }
%>
</div>
