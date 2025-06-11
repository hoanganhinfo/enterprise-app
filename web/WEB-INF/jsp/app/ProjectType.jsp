<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Demo Category</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>
	
<%
	JSONArray objDepartment  = (JSONArray)mapParam.get("orgJsonData");
	

%>
<script  language="javascript">
var departmentJsonData = '<%=objDepartment.toString()%>';

</script>	
	<!-- Application files -->
	<!-- Model -->
	<script type="text/javascript" src="/enterprise-app/js/app/model/ProjectTypeModel.js"></script>
	<!-- View -->
	<script type="text/javascript" src="/enterprise-app/js/app/projecttype/ProjectTypeGrid.js"></script>
	<!-- Entry point -->	
	<script type="text/javascript" src="/enterprise-app/js/app/projecttype/projecttype.js"></script>
	
	
	
	
</head>
<body>
    <div id="projectTypePanel"></div>
</body>
</html>
