<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="default.aspx.cs" Inherits="EPiServer.UI.Report.DefaultPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="FullRegion" runat="server">

    <EPiServerUI:DynamicTable runat="server" NumberOfColumns="4" CellPadding="0" CellSpacing="0" ID="DynamicTable" KeyName="EPReportFramework">
        
        <EPiServerUI:DynamicRow runat="server" ID="DynamicRowHeader">
            
            <EPiServerUI:DynamicCell runat="server" style="height: 28px;" ID="DynamicCellHeader" Colspan="4">
                <!-- Header goes here -->
                <EPiServerUI:SystemIFrame runat="server" id="ReportHeader" SourceFile="ReportFrameworkHeader.aspx" Name="ReportHeader" IsScrollingEnabled="False" />
            </EPiServerUI:DynamicCell>
            
        </EPiServerUI:DynamicRow>
        
        <EPiServerUI:DynamicRow runat="server" ID="DynamicRowContent">
        
            <EPiServerUI:DynamicCell runat="server" Width="170" ID="DynamicCellNavigation">
                <!-- Navigation goes here -->
                <EPiServerUI:SystemIFrame runat="server" id="ReportMenu" SourceFile="menu.aspx" Name="ReportMenu" IsScrollingEnabled="False" />
            </EPiServerUI:DynamicCell>
        
            <EPiServerUI:DynamicResizeCell Width="10" CssClass="EPEdit-CustomDrag" KeyName="ResizeCell" />

            <EPiServerUI:DynamicCell runat="server" Floating="True" ID="DynamiccellReport">
                <!-- Report goes here -->
                <EPiServerUI:SystemIFrame runat="server" id="InfoFrame" SourceFile="Start.aspx" Name="ep_main" />
            </EPiServerUI:DynamicCell>
            
        </EPiServerUI:DynamicRow>

    </EPiServerUI:DynamicTable>
    
</asp:Content>