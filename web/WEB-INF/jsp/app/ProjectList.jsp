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
	JSONArray objStatus  = (JSONArray)mapParam.get("statusJsonData");
	

%>
<script  language="javascript">
var departmentJsonData = '<%=objDepartment.toString()%>';
var statusJsonData = '<%=objStatus.toString()%>';
</script>
<!--Gantt -->
    <link href="/enterprise-app/resources/css/sch-gantt-all.css" rel="stylesheet" type="text/css" />
    <script src="/enterprise-app/js/gnt/gnt.js" type="text/javascript"></script>
    <script src="/enterprise-app/js/moment/moment.min.js" type="text/javascript"></script>
    
	<!-- CSS -->	
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/project/project.css" />
	<!-- Model -->
	<script type="text/javascript" src="/enterprise-app/js/app/model/ProjectModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/DepartmentModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/ProjectTypeModel.js"></script>
	<!-- View -->
	<script type="text/javascript" src="/enterprise-app/js/app/project/CalendarDialog.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/project/ProjectGrid.js"></script>
	<!-- Entry point -->
	<script type="text/javascript" src="/enterprise-app/js/app/project/project.js"></script>
	
	
	
	
</head>
<body>
    <div id="demoPanel"></div>
</body>
</html>
