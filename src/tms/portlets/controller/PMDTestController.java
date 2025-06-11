package tms.portlets.controller;

import java.util.HashMap;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.mvc.Controller;

import tms.utils.ResourceUtil;

import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.User;
import com.liferay.portal.model.UserGroup;
import com.liferay.portal.service.UserGroupLocalServiceUtil;
import com.liferay.portal.theme.ThemeDisplay;

@org.springframework.stereotype.Controller
public class PMDTestController implements Controller, InitializingBean {

	public void afterPropertiesSet() throws Exception {

	}

	@RequestMapping("view")
	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) throws Exception {
		HttpServletRequest httpRequest = com.liferay.portal.util.PortalUtil
				.getOriginalServletRequest(com.liferay.portal.util.PortalUtil
						.getHttpServletRequest(request));

		System.out.println("load pmd test portlet");
		ThemeDisplay themeDisplay = (ThemeDisplay) request
				.getAttribute(WebKeys.THEME_DISPLAY);
		
		User user = themeDisplay.getUser();
		UserGroup userGroup =  UserGroupLocalServiceUtil.getUserGroup(user.getCompanyId(), ResourceUtil.OFFICE_GROUP);
	
		

		HashMap map = new HashMap<String, String>();

		map.put("sessionId", httpRequest.getSession().getId());
		map.put("companyId", user.getCompanyId());
		map.put("userId", user.getUserId());
		map.put("userName", user.getScreenName());
		map.put("userEmail", user.getEmailAddress().toLowerCase());		

		


		return new ModelAndView("app/PMDTest", "param", map);
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}



}
