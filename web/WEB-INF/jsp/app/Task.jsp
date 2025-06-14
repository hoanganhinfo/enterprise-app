<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Manage contract</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>
<%
	JSONArray objDepartment  = (JSONArray)mapParam.get("orgJsonData");
	JSONArray objUsersInGroup  = (JSONArray)mapParam.get("usersInGroup");
	JSONArray objScope  = (JSONArray)mapParam.get("scopeJsonData");
	JSONArray objPriority  = (JSONArray)mapParam.get("priorityJsonData");
	JSONArray objStatus  = (JSONArray)mapParam.get("statusJsonData");
	JSONArray objTaskAction  = (JSONArray)mapParam.get("taskActionJsonData");
	JSONArray objLocation  = (JSONArray)mapParam.get("locationDataJsonData");
	JSONArray objTaskRequestType  = (JSONArray)mapParam.get("taskRequestTypeJsonData");
	JSONArray objUsersJsonData  = (JSONArray)mapParam.get("usersJsonData");

	//JSONArray objAssetCategory  = (JSONArray)mapParam.get("assetCategoryJsonData");
	//JSONArray objAsset  = (JSONArray)mapParam.get("assetJsonData");
	String userName = (String)mapParam.get("userName");
	String myOrgs = (String)mapParam.get("myOrgs");
	String fileUrl = (String)mapParam.get("fileUrl");

	Long repositoryId = (Long)mapParam.get("repositoryId");
	Long taskImageFolderId = (Long)mapParam.get("taskImageFolderId");



%>
<script  language="javascript">
var departmentJsonData = '<%=objDepartment.toString()%>';
var employeeJsonData = '<%=objUsersInGroup.toString()%>';
var usersJsonData = '<%=objUsersJsonData.toString()%>';
var scopeJsonData = '<%=objScope.toString()%>';
var priorityJsonData = '<%=objPriority.toString()%>';
var statusJsonData = '<%=objStatus.toString()%>';
var taskActionJsonData = '<%=objTaskAction.toString()%>';
var taskRequestTypeJsonData = '<%=objTaskRequestType.toString()%>';
var locationData = '<%=objLocation.toString()%>';
var userName = '<%=userName%>';
var myOrgs = '<%=myOrgs%>';
var repositoryId = '<%=repositoryId%>';
var taskImageFolderId = '<%=taskImageFolderId%>';
var fileUrl = '<%=fileUrl%>';
console.log(usersJsonData);
</script>
	<!-- Style sheet -->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/fonts/font-awesome-4.7.0/css/font-awesome.min.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/task/task.css" />
	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!-- Model -->
	<script type="text/javascript" src="/enterprise-app/js/app/model/PermissionModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssetCategoryModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssetModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssetHistoryModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/TaskModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AttachmentModel.js"></script>
	<!-- View -->
	<script type="text/javascript" src="/enterprise-app/js/app/task/TaskFilterForm.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/task/TaskDialog.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/task/AttachmentGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/task/AttachmentDialog.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/task/PersonalTaskGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/task/AssignedTaskGrid.js"></script>
	<!-- Entry point -->
	<script type="text/javascript" src="/enterprise-app/js/app/task/task.js"></script>
</head>

<body>
    <div id="mainPanel"></div>
</body>
</html>
