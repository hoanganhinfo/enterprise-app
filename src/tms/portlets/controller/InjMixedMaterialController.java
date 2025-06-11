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

import tms.backend.service.TaskService;
import tms.utils.ResourceUtil;

import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.User;
import com.liferay.portal.model.UserGroup;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.service.UserGroupLocalServiceUtil;
import com.liferay.portal.service.UserLocalServiceUtil;
import com.liferay.portal.theme.ThemeDisplay;

@org.springframework.stereotype.Controller
public class InjMixedMaterialController implements Controller, InitializingBean {
	@Autowired
	private TaskService taskService;

	public void afterPropertiesSet() throws Exception {

	}
	@RequestMapping("view")
	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) throws Exception {
		HttpServletRequest httpRequest = com.liferay.portal.util.PortalUtil
				.getOriginalServletRequest(com.liferay.portal.util.PortalUtil
						.getHttpServletRequest(request));

		System.out.println("load task portlet");
		ThemeDisplay themeDisplay = (ThemeDisplay) request
				.getAttribute(WebKeys.THEME_DISPLAY);
		
		User user = themeDisplay.getUser();
		UserGroup userGroup =  UserGroupLocalServiceUtil.getUserGroup(user.getCompanyId(), ResourceUtil.OFFICE_GROUP);
		List<User> users = UserLocalServiceUtil.getUserGroupUsers(userGroup.getUserGroupId());
		System.out.println("Numer of users: " + users.size());
		//List<User> users = UserLocalServiceUtil.getGroupUsers(grp.getGroupId())
		// get list of organization
		List<Organization> organizations = OrganizationLocalServiceUtil
				.getOrganizations(user.getCompanyId(), ResourceUtil.INTERNAL_ORGANIZATION);
		List<Organization> myOrg = user.getOrganizations();
		String orgs="";
		for(Organization org : myOrg){
			orgs+=org.getOrganizationId() + ",";
		}
		System.out.println("Numer of organizations: " + organizations.size());
		JSONArray aDepartment = new JSONArray();
		JSONArray aEmployee = new JSONArray();
	
		
		JSONObject jsonOrg;
		jsonOrg = new JSONObject();
		jsonOrg.put("orgId", "-1");
		jsonOrg.put("orgName", "All");
		aDepartment.add(jsonOrg);
		for (Organization org : organizations) {
			jsonOrg = new JSONObject();
			jsonOrg.put("orgId", org.getOrganizationId());
			jsonOrg.put("orgName", org.getName());
			aDepartment.add(jsonOrg);
		}
		jsonOrg = new JSONObject();
		jsonOrg.put("userId", "-1");
		jsonOrg.put("userName", "");
		jsonOrg.put("userEmail", "");	
		aEmployee.add(jsonOrg);
		for (User _user : users) {
				jsonOrg = new JSONObject();
				jsonOrg.put("userId", _user.getUserId());
				jsonOrg.put("userName", _user.getScreenName());
				jsonOrg.put("userEmail", _user.getEmailAddress().toLowerCase());
				aEmployee.add(jsonOrg);
		}
		
		
		HashMap map = new HashMap<String, String>();
		map.put("sessionId", httpRequest.getSession().getId());
		map.put("companyId", user.getCompanyId());
		map.put("userId", user.getUserId());
		map.put("userName", user.getScreenName());
		map.put("userEmail", user.getEmailAddress().toLowerCase());		
		map.put("orgJsonData", aDepartment);
		map.put("employeeJsonData", aEmployee);
		map.put("myOrgs", orgs);
	
	

		return new ModelAndView("app/InjMixedMaterial", "param", map);
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}

	public TaskService getTaskService() {
		return taskService;
	}

	public void setTaskService(TaskService taskService) {
		this.taskService = taskService;
	}

}
