<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="com.liferay.portal.security.permission.PermissionChecker"%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Production planning</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>
<%

%>
<script  language="javascript">


</script>
	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/app/productionplan/production-plan.css" />
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

		<script type="text/javascript" src="/enterprise-app/js/app/productionplan/ProductPlanGrid.js"></script>
		<script type="text/javascript" src="/enterprise-app/js/app/productionplan/production-plan.js"></script>
</head>
<body>
    <div id="ProductionPlanPanel"></div>

</body>
</html>
