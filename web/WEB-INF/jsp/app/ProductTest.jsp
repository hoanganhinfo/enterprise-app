<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ include file="/WEB-INF/jsp/include.jsp" %>
<%@ page import="java.util.*"%>
<%@ page import="com.liferay.portal.kernel.util.*" %>
<%@ page import="com.liferay.portal.kernel.util.*" %>
<%@ page import="com.liferay.portlet.*" %>
 
<%@ page import="javax.portlet.*" %>
<%
	HashMap mapCriteria = (HashMap)request.getAttribute("param");
	PortletPreferences prefs = renderRequest.getPreferences();
	String direction = (String)prefs.getValue("direction","");
	String portletId = (String)prefs.getValue("portletId","");
	
	
%>
<script  language="javascript">
var isBottomPos = true;
var sessionId = '<%=mapCriteria.get("sessionId").toString()%>';
var operatorName = '<%=mapCriteria.get("operatorName").toString()%>';
var instanceId = '<%=mapCriteria.get("instanceId").toString()%>';
var direction = '<%=direction%>';
var _portletId =  '<%=portletId%>';
</script>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Product Test</title>


	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/assembly/product_test/product-test.css" />
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssyProductTypeModel.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssyProductStationModel.js"></script>
	
	
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/PrerequisiteAOSmith.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/PrerequisiteAOSmithPDV.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/ValidationClient.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/ParamInfo.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/ActionPanel.js"></script>	
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/DefectCodeGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/LastedTestGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/AssemblylineCombo.js"></script>
   	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product_test/product-test.js"></script>	
	
</head>
<body>
    <script type="text/javascript">
    	var isAdmin = <%=request.isUserInRole("administrator")%>;
    </script>
    <input type="hidden" name='hd_<%=mapCriteria.get("instanceId").toString()%>' value='<%=direction%>' id='hd_<%=mapCriteria.get("instanceId").toString()%>'>
    <div id="mainPanel"></div>
    <div id='<%=mapCriteria.get("instanceId").toString()%>_product'></div>
    <div id='<%=mapCriteria.get("instanceId").toString()%>_param'></div>
    <div id='<%=mapCriteria.get("instanceId").toString()%>_action'></div>
    <div id='<%=mapCriteria.get("instanceId").toString()%>_defects'></div>


</body>
<script type="text/javascript">

	window.onload=toBottom;
function toBottom()
{
	if (isBottomPos == true){
		window.scrollTo(0, document.body.scrollHeight);
	}
}
</script>
<applet code="vn.ewi.applet.AOSmithApplet.class"
 id="AOSmithTester" 
 name="AOSmithTester"
 archive="ewi-applet.jar,pi4j-core.jar"
 codebase="/enterprise-app/applet"  width="320" height="120"
 style="width: 1px; height: 1px; float: left;" >
 <param name="cache_option" value="no">
</applet>
</html>
