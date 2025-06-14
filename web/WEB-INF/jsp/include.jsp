<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="portlet" uri="http://java.sun.com/portlet" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui"%>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme"%>
<%@ page import="com.liferay.portal.model.User"%>
<%@ page import="java.util.*"%>
<portlet:defineObjects />
<liferay-theme:defineObjects />
<%

	HashMap mapParam = (HashMap)request.getAttribute("param");
%>
<script  language="javascript">
var companyId = '<%=mapParam.get("companyId").toString()%>';
var userId = '<%=mapParam.get("userId").toString()%>';
var userName = '<%=mapParam.get("userName").toString()%>';
var userEmail = '<%=mapParam.get("userEmail").toString()%>';


var department = "aaa";
</script>
<head>
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/app/common/common-styles.css" />

	<script type="text/javascript" src="/enterprise-app/js/app/common/common-functions.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/common/JSONExporter.js"></script>
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1.3/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1.3/examples/ux/css/CheckHeader.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1.3/examples/ux/DataView/DragSelector.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1.3/resources/filterbar/css/uxs.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1.3/resources/filterbar/css/overrides.css" />
	<link rel="stylesheet" type="text/css" href="/enterprise-app/js/extjs4.1.3/resources/filterbar/css/app.css" />

	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/ext-all.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/Penta.view.SearchTrigger.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/downloadify/js/swfobject.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/downloadify/js/downloadify.min.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/common/MessageTip.js"></script>

	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/FilterRow/FilterRow.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/form/field/ClearButton.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/form/field/OperatorButton.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/grid/column/ActionPro.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/grid/FilterBar.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/grid/AutoResizer.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/exporter/Exporter.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/DataView/Animated.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/DataView/Draggable.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/DataView/DragSelector.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/DataView/LabelEditor.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/DateTimeField/DateTimePicker.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/extjs4.1.3/examples/ux/DateTimeField/DateTimeField.js"></script>
	<script type="text/javascript" src="/enterprise-app/js/app/common/ewi-config.js"></script>


	<!-- END COMMON -->
</head>
<script type="text/javascript">
</script>


