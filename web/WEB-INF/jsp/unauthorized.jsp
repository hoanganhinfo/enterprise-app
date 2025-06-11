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
<style>
.portlet-topper-left-toolbar {
    display: none !important;
}
#sign-in {
   display: none !important;
}
</style>
<h2>You need to <a href="<%= themeDisplay.getURLSignIn() %>">login</a> for accessing this application</h2>

