<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Manage project task</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>

<%
	JSONArray objDepartment  = (JSONArray)mapParam.get("orgJsonData");
	JSONArray objStatus  = (JSONArray)mapParam.get("statusJsonData");
	JSONObject taskTreeJsonData  = (JSONObject)mapParam.get("taskTreeJsonData");
	String projectId = (String)mapParam.get("projectId");
	String _startDate = (String)mapParam.get("startDate");
	String _endDate = (String)mapParam.get("endDate");


%>
<script  language="javascript">
var departmentJsonData = '<%=objDepartment.toString()%>';
var statusJsonData = '<%=objStatus.toString()%>';
var taskTreeJsonData =  '<%=taskTreeJsonData.toString()%>';
var _projectId =  '<%=projectId%>';
var _startDate =  '<%=_startDate%>';
var _endDate =  '<%=_endDate%>';
</script>

    <!--Gantt -->
    <link href="/enterprise-app/resources/css/sch-gantt-all.css" rel="stylesheet" type="text/css" />
    <script src="/enterprise-app/js/gnt/gnt.js" type="text/javascript"></script>
    <script src="/enterprise-app/js/moment/moment.min.js" type="text/javascript"></script>

     <!--Application files-->
     <!--Style sheet-->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/projecttask/projecttask.css" />
	<!--Utils-->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!--Model-->
	<script type="text/javascript" src="/enterprise-app/js/app/model/ProjectModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/DepartmentModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/ProjectTypeModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/ProjectTaskModel.js"></script>
	<!--View-->
	<script type="text/javascript" src="/enterprise-app/js/app/project/ProjectGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/projecttask/ProjectDialog.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/projecttask/ProjectTaskGrid.js"></script>
	<!--Entry point-->
	<script type="text/javascript" src="/enterprise-app/js/app/projecttask/projecttask.js"></script>
</head>
<body>
    <div id="projectTaskPanel"></div>
</body>
</html>
