<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>QC Item Inspection</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>
<%
	JSONArray objStatusType  = (JSONArray)mapParam.get("statusTypeJsonData");
	JSONArray objTransType  = (JSONArray)mapParam.get("transTypeJsonData");
	JSONArray objDefectLevel = (JSONArray)mapParam.get("defectLevelJsonData");
	
%>
<script  language="javascript">
var statusTypeJsonData = '<%=objStatusType.toString()%>';
var transTypeJsonData = '<%=objTransType.toString()%>';
var defectLevelJsonData = '<%=objDefectLevel.toString()%>';


</script>	
	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/qc/product-inspector/product-inspector.css" />
	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!-- Model -->
	<script type="text/javascript" src="/enterprise-app/js/app/model/QcInspectionDefectModel.js"></script>	
	<script type="text/javascript" src="/enterprise-app/js/app/model/QCInspectionTableModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/QCInspectionLineModel.js"></script>
	<!-- View -->
	
	<script type="text/javascript" src="/enterprise-app/js/app/qc/product-inspector/QcInspectionDefectGrid.js"></script>	
	<script type="text/javascript" src="/enterprise-app/js/app/qc/product-inspector/QCInspectionOrderGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/qc/product-inspector/QCInspectionLineGrid.js"></script>
	
	<script type="text/javascript" src="/enterprise-app/js/app/qc/product-inspector/InspectionInputPanel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/qc/product-inspector/QCInspectionOrder.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/qc/product-inspector/QCInspectionReport.js"></script>	
	<!-- Entry point -->
	<script type="text/javascript" src="/enterprise-app/js/app/qc/product-inspector/product-inspector.js"></script>	
</head>
<body>
    <div id="upperPane"></div>
    <div id="lowerPane"></div>    
</body>
</html>
