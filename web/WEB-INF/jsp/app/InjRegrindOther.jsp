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
<%
	String userName = (String)mapParam.get("userName");
	

%>
<script  language="javascript">

var userName = '<%=userName%>';
;
</script>

	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/injection/RegrindOrder/regrindorder.css" />
	
	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!-- Model -->
	<script type="text/javascript" src="/enterprise-app/js/app/model/RegrindOrderModel.js"></script>

	<!-- View -->
	
	
	<script type="text/javascript" src="/enterprise-app/js/app/injection/RegrindOrder/RegrindOrderGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/injection/RegrindOrder/regrindorder.js"></script>
	<!-- Entry point -->
		
</head>
<body>
    <div id="InjRegrindOrder"></div>
</body>
</html>
