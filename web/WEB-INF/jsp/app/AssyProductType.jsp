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
	

%>
<script  language="javascript">
var departmentJsonData = '<%=objDepartment.toString()%>';

</script>	
	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="/ewi-theme/js/extjs4.1/examples/ux/css/CheckHeader.css" />	
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product/assyProductType/assy_product_type.css"></script>
	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!-- Model -->
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssyProductTypeModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssyProductStationModel.js"></script>
	<!-- View -->
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product/assyProductType/AssyProductTypeGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product/assyProductType/AssyProductStationGrid.js"></script>
	<!-- Entry point -->
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product/assyProductType/assy_product_type.js"></script>	
</head>
<body>
    <div id="AssyProductType"></div>
    <br />
    <div id="AssyProductStation"></div>    
</body>
</html>
