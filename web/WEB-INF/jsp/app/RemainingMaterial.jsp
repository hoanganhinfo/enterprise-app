<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Material Preparation</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>
<%
	String userName = (String)mapParam.get("userName");


%>
<script  language="javascript">

var userName = '<%=userName%>';
;

</script>
	<!-- Style sheet -->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/injection/RemainingMaterial/remainingmaterial.css" />
	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!-- Model -->

	<!-- View -->

	<script type="text/javascript" src="/enterprise-app/js/app/injection/RemainingMaterial/RemainingMaterialGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/injection/RemainingMaterial/RemainingMaterialSelect.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/injection/RemainingMaterial/RemainingMaterialAction.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/injection/RemainingMaterial/MixedMaterialInput.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/injection/RemainingMaterial/VirginMaterialInput.js"></script>

	<!-- Entry point -->
	<script type="text/javascript" src="/enterprise-app/js/app/injection/RemainingMaterial/remainingmaterial.js"></script>
</head>

<body>
	<div id="RemainingMaterial"></div>
</body>
</html>
