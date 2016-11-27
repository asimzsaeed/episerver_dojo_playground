<%@ Page Language="C#" AutoEventWireup="false" EnableTheming="false" StylesheetTheme="" Theme="" CodeBehind="system.aspx.cs" Inherits="EPiServer.UI.Javascript.SystemJS" %>

/*
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    The supported version of System.js has been moved to Util/Javascript. 
    This copy remains here for legacy reasons but it is no longer maintained.
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

if (typeof(EPi) == "undefined" || EPi == null)
{
    EPi = {};
}
EPi.ResolveUrlFromUtil = function(url)
{
    return "<%= EPiServer.UriSupport.ResolveUrlFromUtilBySettings("") %>" + url;
}

EPi.ResolveUrlFromUI = function(url)
{
    return "<%= EPiServer.UriSupport.ResolveUrlFromUIBySettings("") %>" + url;
}

EPi.Translations = 
{
    <%= TranslationJson("/util/editor/javascript/quote/noparentquote")%>,
    <%= TranslationJson("/javascript/system/popupsblocked")%>, 
    <%= TranslationJson("/system/editutil/leavepagewarning")%>, 
    <%= TranslationJson("/button/saveandpublish")%>, 
    <%= TranslationJson("/button/cancel")%>
}

EPi.Translate = function(key, fallback)
{
    var translation = EPi.Translations[key];
    return translation || fallback;
}
