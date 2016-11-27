<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable<EPiServer.Shell.UI.Controllers.FileVersionMetaData>>" %>
<%@ Assembly Name="EPiServer.Shell.UI" %>

<link rel="stylesheet" type="text/css" href="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.0/css/jquery.dataTables.css" />
<script type="text/javascript" language="javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.min.js"></script>
<script src="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.0/jquery.dataTables.min.js" type="text/javascript"></script>

<h1>Assemblies Information View</h1>
<p>Number of Assemblies: <strong><%:Model.Count()%></strong></p>

<table cellpadding="0" cellspacing="0" border="0" class="display" id="theList">
	<thead>
		<tr>
			<th align="left">Qualify Assembly Name</th>
			<th align="left">FileVersion</th>
			<th align="left">AssemblyVersion</th>
			<th align="left">Location</th>
			
		</tr>
	</thead>
	<tbody>
<% foreach (var m in Model.OrderByDescending(a => a.Name)){%>
    <tr>
    <td><%:m.Name%></td>
    <td><%: m.FileVersion %></td>
    <td><%: m.AssemblyVersion%></td>
    <td><%: m.Location%></td>
    </tr>
    <%}%>

</tbody>
</table>
<script>
    $(document).ready(function () {
        $('#theList').dataTable(
        {
            "aaSorting": [[2, "desc"]],
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "bSort": true,
            "bInfo": false,
            "bAutoWidth": true
        });
    });
</script>