package tms.portlets.controller;

import java.util.HashMap;
import java.util.List;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.mvc.Controller;

import tms.backend.service.AssetService;
import tms.utils.ResourceUtil;
import tms.utils.StatusType;

import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.User;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.theme.ThemeDisplay;

@org.springframework.stereotype.Controller
public class ProjectListController implements Controller, InitializingBean {
	@Autowired
	private AssetService assetService;

	public void afterPropertiesSet() throws Exception {

	}

	@RequestMapping("view")
	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) throws Exception {
		HttpServletRequest httpRequest = com.liferay.portal.util.PortalUtil
				.getOriginalServletRequest(com.liferay.portal.util.PortalUtil
						.getHttpServletRequest(request));

		System.out.println("load asset");
		ThemeDisplay themeDisplay = (ThemeDisplay) request
				.getAttribute(WebKeys.THEME_DISPLAY);
		
		User user = themeDisplay.getUser();
		// get list of internal organization
		List<Organization> organizations = OrganizationLocalServiceUtil
				.getOrganizations(user.getCompanyId(), ResourceUtil.INTERNAL_ORGANIZATION);
		List<Organization> myOrg = user.getOrganizations();
		String orgs="";
		for(Organization org : myOrg){
			orgs+=org.getOrganizationId() + ",";
		}
		JSONArray aDepartment = new JSONArray();
		JSONArray aStatus = new JSONArray();
		JSONObject jsonOrg;
		jsonOrg = new JSONObject();
		
		List<StatusType> statusList = StatusType.getAllProjectStatusList();
		for (StatusType status : statusList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", status.getValue());
			jsonOrg.put("name", status.getLabel());
			aStatus.add(jsonOrg);
		}		
		
		jsonOrg = new JSONObject();
		jsonOrg.put("orgId", "0");
		jsonOrg.put("orgName", "");
		for (Organization org : organizations) {
			jsonOrg = new JSONObject();
			jsonOrg.put("orgId", org.getOrganizationId());
			jsonOrg.put("orgName", org.getName());
			aDepartment.add(jsonOrg);
		}

		HashMap map = new HashMap<String, String>();
		map.put("companyId", user.getCompanyId());
		map.put("userId", user.getUserId());
		map.put("userName", user.getScreenName());
		map.put("userEmail", user.getEmailAddress().toLowerCase());
		System.out.println("aDepartment: "+aDepartment);
		map.put("orgJsonData", aDepartment); 
		map.put("statusJsonData", aStatus);
		
		return new ModelAndView("app/ProjectList", "param", map);
		
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}



}
