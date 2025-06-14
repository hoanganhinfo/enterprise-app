<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Asset Master</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>

<%
	JSONArray objDepartment  = (JSONArray)mapParam.get("orgJsonData");
	JSONArray objUserRoles  = (JSONArray)mapParam.get("userRoles");

	JSONArray objAssetDepartment  = (JSONArray)mapParam.get("assetOrgJsonData");
	JSONArray objUser  = (JSONArray)mapParam.get("userJsonData");
	JSONArray objPermission  = (JSONArray)mapParam.get("permissionJsonData");

	JSONArray objScope  = (JSONArray)mapParam.get("scopeJsonData");
	JSONArray objPriority  = (JSONArray)mapParam.get("priorityJsonData");
	JSONArray objStatus  = (JSONArray)mapParam.get("statusJsonData");
	JSONArray objTaskAction  = (JSONArray)mapParam.get("taskActionJsonData");
	JSONArray objTaskRequestType  = (JSONArray)mapParam.get("taskRequestTypeJsonData");
	JSONArray objMyOrgs  = (JSONArray)mapParam.get("myOrgs");

	String userName = (String)mapParam.get("userName");
	String fileUrl = (String)mapParam.get("fileUrl");

	Long repositoryId = (Long)mapParam.get("repositoryId");
	Long taskImageFolderId = (Long)mapParam.get("taskImageFolderId");


%>
<script  language="javascript">
var isAdmin = '<%=mapParam.get("isAdmin").toString()%>';
var departmentJsonData = '<%=objDepartment.toString()%>';
var assetDepartmentJsonData = '<%=objAssetDepartment.toString()%>';
var userJsonData = '<%=objUser.toString()%>';
var permissionJsonData = '<%=objPermission.toString()%>';

var scopeJsonData = '<%=objScope.toString()%>';
var priorityJsonData = '<%=objPriority.toString()%>';
var statusJsonData = '<%=objStatus.toString()%>';
var taskActionJsonData = '<%=objTaskAction.toString()%>';
var taskRequestTypeJsonData = '<%=objTaskRequestType.toString()%>';
var userName = '<%=userName%>';
var userRolesData = '<%=objUserRoles%>';
var myOrgs = '<%=objMyOrgs%>';
var repositoryId = '<%=repositoryId%>';
var taskImageFolderId = '<%=taskImageFolderId%>';
var fileUrl = '<%=fileUrl%>';
console.log(userJsonData);


</script>
	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/asset/asset.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/task/task.css" />
	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!-- Model -->

	<script type="text/javascript" src="/enterprise-app/js/app/model/PermissionModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssetCategoryModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssetLocationModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssetModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssetHistoryModel.js"></script>

	<script type="text/javascript" src="/enterprise-app/js/app/model/PermissionModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/TaskModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AttachmentModel.js"></script>

	<!-- View -->
	<script type="text/javascript" src="/enterprise-app/js/app/asset/AssetPermissionGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/asset/AssetCategoryGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/asset/AssetLocationGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/asset/AssetHistoryGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/task/AssignedTaskGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/asset/AssetButtonView.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/asset/AssetTreeGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/asset/AssetView.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/asset/MovementAssetTreeGrid.js"></script>

	<!-- Entry point -->
	<script type="text/javascript" src="/enterprise-app/js/app/asset/asset.js"></script>
</head>
<body>
    <div id="assetPanel"></div>
</body>
</html>
