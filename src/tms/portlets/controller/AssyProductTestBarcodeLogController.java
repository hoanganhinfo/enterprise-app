package tms.portlets.controller;

import java.util.HashMap;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.mvc.Controller;

import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.User;
import com.liferay.portal.theme.ThemeDisplay;

public class AssyProductTestBarcodeLogController implements Controller, InitializingBean {

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
		

		if (themeDisplay.isSignedIn()) {
			response.setTitle("Product Test Log");
			HashMap map = new HashMap<String, String>();
			map.put("companyId", user.getCompanyId());
			map.put("userId", user.getUserId());
			map.put("userName", user.getScreenName());
			map.put("userEmail", user.getEmailAddress().toLowerCase());
			
			return new ModelAndView("app/AssyProductTestBarcodeLog", "param", map);
		}
		return new ModelAndView("unauthorized");
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}



}
