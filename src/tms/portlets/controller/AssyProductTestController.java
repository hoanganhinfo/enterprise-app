package tms.portlets.controller;

import java.util.HashMap;
import java.util.List;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.context.PortletApplicationContextUtils;
import org.springframework.web.portlet.mvc.Controller;

import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.Role;
import com.liferay.portal.model.User;
import com.liferay.portal.theme.ThemeDisplay;

public class AssyProductTestController implements Controller, InitializingBean {

	public void afterPropertiesSet() throws Exception {

	}

	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) throws Exception {
		HttpServletRequest httpRequest = com.liferay.portal.util.PortalUtil
				.getOriginalServletRequest(com.liferay.portal.util.PortalUtil
						.getHttpServletRequest(request));
		ThemeDisplay themeDisplay = (ThemeDisplay) request
				.getAttribute(WebKeys.THEME_DISPLAY);
		User user = themeDisplay.getUser();
		
		String homeURL = (themeDisplay.getURLPortal() +themeDisplay.getPathFriendlyURLPublic()+themeDisplay.getScopeGroup().getFriendlyURL()+"/home");
		System.out.println(themeDisplay.getScopeGroup().getFriendlyURL());
		boolean hasFunctionTestRole = true;
		List<Role> roles = user.getRoles();
		for (Role role :  roles){
//			if (RoleConstant.FUNCTION_TEST.equals(role.getName())){
//				hasFunctionTestRole = true;
//				break;
//			}
		}
		
		//httpRequest.getP
//		try{
//		ServletContext servletContext = httpRequest.getSession().getServletContext();
//		// getting WebApplicationContext
//	    WebApplicationContext webApplicationContext = WebApplicationContextUtils
//	                .getRequiredWebApplicationContext(servletContext);
//	      WebApplicationContext springContext =  (WebApplicationContext) request.getPortletSession().getPortletContext().getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
//	        
//	    ApplicationContext applicationContext = PortletApplicationContextUtils.getWebApplicationContext(request.getPortletSession().getPortletContext());
//	    String [] beans = applicationContext.getBeanDefinitionNames();
//	    for(String str : beans){
//	    	System.out.println(str);
//	    }
		//instance = ((DefectService) beans.values().iterator().next());
			
//	    // getting settings as object
	 //   DefectService defectService = (DefectService)applicationContext.getBean("defectService");
//	    if (defectService == null){
//	    	System.out.println("defectService is null");
//	    }else{
//	    	System.out.println("defectService is not null");
//	    }
		
		if (themeDisplay.isSignedIn()) {
			response.setTitle("Product Test");
			HashMap map = new HashMap<String, String>();
			map.put("companyId", user.getCompanyId());
			map.put("userId", user.getUserId());
			map.put("userName", user.getScreenName());
			map.put("userEmail", user.getEmailAddress().toLowerCase());
			
			if (hasFunctionTestRole){
				 System.out.println(themeDisplay.getPortletDisplay().getId());
				map.put("instanceId", themeDisplay.getPortletDisplay().getInstanceId());
//				Pumpline pumpline = pumpLineService.getPumpLineByAddress(httpRequest.getRemoteAddr());
//				if (pumpline != null){
//				map.put("lineNo", pumpLineService.getPumpLineByAddress(httpRequest.getRemoteAddr()).getCode());
//				}else{
//					map.put("lineNo", "");
//				}
				map.put("sessionId", httpRequest.getSession().getId());
				map.put("operatorName", user.getFirstName());
				request.setAttribute("homeUrl", homeURL);
				return new ModelAndView("app/ProductTest", "param", map);
			}else{
				return new ModelAndView("invalidRole");
			}
		}
		return new ModelAndView("unauthorized");
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}



}
