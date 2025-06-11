<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Asset Category</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>

<%
	JSONArray objDepartment  = (JSONArray)mapParam.get("orgJsonData");
	JSONArray objUser  = (JSONArray)mapParam.get("userJsonData");
	JSONArray objPermission  = (JSONArray)mapParam.get("permissionJsonData");


%>
<script  language="javascript">
var departmentJsonData = '<%=objDepartment.toString()%>';
var myOrgs = '<%=mapParam.get("myOrgs").toString()%>';
var myOrgEmail = '<%=mapParam.get("myOrgEmail").toString()%>';

</script>
	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/couriershipment/couriershipment.css" />
	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!-- Model -->

	<script type="text/javascript" src="/enterprise-app/js/app/model/PermissionModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/CourierShipmentModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/CourierSampleModel.js"></script>

	<!-- View -->
	<script type="text/javascript" src="/enterprise-app/js/app/couriershipment/CourierShipmentForm.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/couriershipment/CourierShipmentGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/couriershipment/CourierSampleGrid.js"></script>

	<!-- Entry point -->
	<script type="text/javascript" src="/enterprise-app/js/app/couriershipment/couriershipment.js"></script>
</head>
<body>
    <div id="CourierShipmentPanel"></div>
</body>
</html>
