<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="com.liferay.portal.security.permission.PermissionChecker"%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Wellington app</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>
<%
	JSONArray objStatus  = (JSONArray)mapParam.get("statusJsonData");
	long groupId = scopeGroupId;
	String name = portletDisplay.getRootPortletId();
	System.out.println(name);

	String primKey = portletDisplay.getResourcePK();
	System.out.println(primKey);
	String actionId = "IMPORT_DATA";
	String assignShipment = "ASSIGN_SHIPMENT";

	boolean hasImportPermission = permissionChecker.hasPermission(groupId, name, primKey, actionId);
	boolean hasAssignShipmentPermission = permissionChecker.hasPermission(groupId, name, primKey, assignShipment);

%>
<script  language="javascript">

var statusJsonData = '<%=objStatus.toString()%>';
var hasImportPermission ='<%=hasImportPermission%>';
var hasAssignShipmentPermission ='<%=hasAssignShipmentPermission%>';

</script>
	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/assembly/wellington/importer/wellington-importer.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/resources/filterbar/css/uxs.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/resources/filterbar/css/overrides.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/resources/filterbar/css/app.css" />

	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1/examples/ux/FilterRow/FilterRow.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1/examples/ux/form/field/ClearButton.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1/examples/ux/form/field/OperatorButton.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1/examples/ux/grid/column/ActionPro.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1/examples/ux/grid/FilterBar.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1/examples/ux/grid/AutoResizer.js"></script>
	<!-- Model -->

	<script type="text/javascript" src="/enterprise-app/js/app/model/WellingtonMotorModel.js"></script>
	<!-- View -->
	<!-- Entry point -->

	<script type="text/javascript" src="/enterprise-app/js/app/assembly/wellington/importer/ComboBoxPrompt.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/wellington/importer/WellingtonShipmentDialog.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/wellington/importer/WellingtonMotorGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/wellington/importer/WellingtonShipmentGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/wellington/importer/WellingtonImportPanel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/wellington/importer/WellingtonFilterForm.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/wellington/importer/wellington-importer.js"></script>
</head>
<body>
    <div id="fi-form"></div>
    <div id="test-log-grid"></div>
</body>
</html>
