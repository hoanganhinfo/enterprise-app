<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ page import="java.util.*"%>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Product barcode test</title>

	<%@ include file="/WEB-INF/jsp/include.jsp" %>
	
	
	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="/ewi-theme/js/extjs4.1/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/assembly/product-test-log/product-test-log.css" />
		
	<!-- Utils -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/utils/jsDate.js"></script>
	<!-- View -->
	<script type="text/javascript" src="/enterprise-app/js/app/common/GridExporter.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/model/AssyProductTypeModel.js"></script>
	
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product-test-log/ProductTestLogGrid.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product-test-log/ProductFilterForm.js"></script>
	<!-- Entry point -->
	
	<script type="text/javascript" src="/enterprise-app/js/app/assembly/product-test-log/product-test-barcode-log.js"></script>	
</head>
<body>
	<div id="test-log-filter"></div>
    <div id="test-log-grid"></div>
    <a href="#" id="downloadLink"></a>
</body>
</html>
