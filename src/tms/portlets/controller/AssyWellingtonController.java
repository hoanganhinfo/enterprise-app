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

import tms.backend.service.AssetCategoryService;
import tms.utils.ResourceUtil;
import tms.utils.StatusType;

import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.Role;
import com.liferay.portal.model.User;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.theme.ThemeDisplay;

@org.springframework.stereotype.Controller
public class AssyWellingtonController implements Controller, InitializingBean {
	@Autowired
	private AssetCategoryService assetCategoryService;

	public void afterPropertiesSet() throws Exception {

	}

	@RequestMapping("view")
	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) throws Exception {
		HttpServletRequest httpRequest = com.liferay.portal.util.PortalUtil
				.getOriginalServletRequest(com.liferay.portal.util.PortalUtil
						.getHttpServletRequest(request));
		ThemeDisplay themeDisplay = (ThemeDisplay) request
				.getAttribute(WebKeys.THEME_DISPLAY);
		
		User user = themeDisplay.getUser();
		// get list of organization
		List<Role> myRoles = user.getRoles();
		List<Organization> organizations = OrganizationLocalServiceUtil
				.getOrganizations(user.getCompanyId(), ResourceUtil.INTERNAL_ORGANIZATION);
		List<Organization> myOrg = user.getOrganizations();
		String orgs="";
		for(Organization org : myOrg){
			orgs+=org.getOrganizationId() + ",";
		}
		System.out.println(organizations.size());
		
		JSONObject jsonObj;
		
		JSONArray aStatus = new JSONArray();
		List<StatusType> statusList = StatusType.getAllProductTest();
		for (StatusType status : statusList) {
			jsonObj = new JSONObject();
			jsonObj.put("value", status.getValue());
			jsonObj.put("name", status.getLabel());
			aStatus.add(jsonObj);
		}
		
//		JSONObject jsonOrg;
//		jsonOrg = new JSONObject();
		JSONArray aDepartment = new JSONArray();
		for (Organization org : organizations) {
			jsonObj = new JSONObject();
			jsonObj.put("orgId", org.getOrganizationId());
			jsonObj.put("orgName", org.getName());
			aDepartment.add(jsonObj);
		}

		JSONArray aMyRoles = new JSONArray();
		
		HashMap map = new HashMap<String, String>();
		map.put("companyId", user.getCompanyId());
		map.put("userId", user.getUserId());
		map.put("userName", user.getScreenName());
		map.put("userEmail", user.getEmailAddress().toLowerCase());
		System.out.println("aDepartment: "+aDepartment);
		map.put("orgJsonData", aDepartment);
		map.put("statusJsonData", aStatus);
		
		return new ModelAndView("app/WellingtonTestImporter", "param", map);
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}



}
