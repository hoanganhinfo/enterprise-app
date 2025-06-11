package tms.portlets.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.ArrayUtils;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.mvc.Controller;

import tms.backend.domain.AssetPermission;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetPermissionService;
import tms.backend.service.AssetService;
import tms.utils.Config;
import tms.utils.PermissionType;
import tms.utils.PriorityType;
import tms.utils.ResourceUtil;
import tms.utils.ScopeType;
import tms.utils.StatusType;
import tms.utils.TaskActionType;
import tms.utils.TaskRequestType;

import com.liferay.portal.kernel.repository.model.Folder;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.User;
import com.liferay.portal.model.UserGroup;
import com.liferay.portal.security.permission.PermissionChecker;
import com.liferay.portal.security.permission.PermissionThreadLocal;
import com.liferay.portal.service.ClassNameLocalServiceUtil;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.service.UserGroupLocalServiceUtil;
import com.liferay.portal.service.UserLocalServiceUtil;
import com.liferay.portal.theme.ThemeDisplay;
import com.liferay.portlet.documentlibrary.model.DLFolderConstants;
import com.liferay.portlet.documentlibrary.service.DLAppLocalServiceUtil;
import com.liferay.portlet.expando.model.ExpandoColumn;
import com.liferay.portlet.expando.model.ExpandoTable;
import com.liferay.portlet.expando.model.ExpandoValue;
import com.liferay.portlet.expando.service.ExpandoColumnLocalServiceUtil;
import com.liferay.portlet.expando.service.ExpandoTableLocalServiceUtil;
import com.liferay.portlet.expando.service.ExpandoValueLocalServiceUtil;

@org.springframework.stereotype.Controller
public class AssetController implements Controller, InitializingBean {
	@Autowired
	private AssetService assetService;
	@Autowired
	private AssetPermissionService assetPermissionService;
	@Autowired
	private Environment env;
	public void afterPropertiesSet() throws Exception {

	}

	@RequestMapping("view")
	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) throws Exception {
		HttpServletRequest httpRequest = com.liferay.portal.util.PortalUtil
				.getOriginalServletRequest(com.liferay.portal.util.PortalUtil
						.getHttpServletRequest(request));
		System.out.println("Loading asset master");
		JSONArray aDepartment = new JSONArray();
		JSONArray assetDepartment = new JSONArray();
		JSONArray aEmployee = new JSONArray();
		JSONArray aPriority = new JSONArray();
		JSONArray aTaskStatus = new JSONArray();
		JSONArray aTaskRequestType = new JSONArray();
		JSONArray aScope = new JSONArray();
		JSONArray aTaskAction = new JSONArray();
		JSONArray aMyOrgs = new JSONArray();
		JSONObject jsonOrg;
		jsonOrg = new JSONObject();
		ThemeDisplay themeDisplay = (ThemeDisplay) request
				.getAttribute(WebKeys.THEME_DISPLAY);

		User user = themeDisplay.getUser();
		List<User> userList = UserLocalServiceUtil.getUsers(0, UserLocalServiceUtil.getUsersCount());
		JSONObject jsonUser;
		JSONArray aUser = new JSONArray();
		for(User _user : userList){
			if (_user.isActive()){
				jsonUser= new JSONObject();
				jsonUser.put("userId", _user.getUserId());
				jsonUser.put("userEmail", _user.getEmailAddress());
				jsonUser.put("fullName", _user.getFullName());
				jsonUser.put("userName", _user.getScreenName());
				aUser.add(jsonUser);
			}
		}


		// get list of organization

		List<Organization> organizations = null;
		try{
			System.out.println(Config.getInstance().getProperty("INTERNAL_ORGANIZATION"));
			organizations = OrganizationLocalServiceUtil
				.getOrganizations(user.getCompanyId(), Long.valueOf(Config.getInstance().getProperty("INTERNAL_ORGANIZATION")));
		}catch(Exception e){
			e.printStackTrace();
		}
		List<Organization> myOrg = user.getOrganizations();
		String myOrgs="";
		long orgClassNameId = ClassNameLocalServiceUtil.getClassNameId(Organization.class.getName());
		for(Organization org : myOrg){
			myOrgs+=org.getOrganizationId() + ",";
			jsonOrg = new JSONObject();
			jsonOrg.put("value", org.getOrganizationId());
			jsonOrg.put("name", org.getName());
			aMyOrgs.add(jsonOrg);
		}


		System.out.println(organizations.size());




//		ExpandoTable table = ExpandoTableLocalServiceUtil.getDefaultTable(user.getCompanyId(), orgClassNameId );
//		ExpandoColumn column = ExpandoColumnLocalServiceUtil.getColumn(table.getTableId(), "Asset-admin");

		Criterion cUserId = Restrictions.eq("userId", user.getUserId());
		List<AssetPermission> permUserList = assetPermissionService.getByCriteria(cUserId);
		Map<Long,Byte> permMap = new HashMap<>();
		for(AssetPermission perm : permUserList){
			System.out.println(perm.getId());
			Byte permId = permMap.get(perm.getOrganizationId());
			if (permId == null){
				permMap.put(perm.getOrganizationId(), perm.getPermissionId());
			}else{
				if (permId.intValue() > perm.getPermissionId().intValue()){
					permMap.put(perm.getOrganizationId(), perm.getPermissionId());
				}
			}

		}
		for (Organization org : organizations) {

			jsonOrg = new JSONObject();
			jsonOrg.put("orgId", org.getOrganizationId());
			jsonOrg.put("orgName", org.getName());
			jsonOrg.put("assetManagement", false);
			if (org.getExpandoBridge().getAttribute("Asset Management") != null){
				jsonOrg.put("assetManagement", (Boolean)org.getExpandoBridge().getAttribute("Asset Management"));
			}

			Byte permId = permMap.get(org.getOrganizationId());
			if (permId != null){
				jsonOrg.put("permissionId", permId);
			}else{
				jsonOrg.put("permissionId", -1);
			}
//			ExpandoValue customValue =  ExpandoValueLocalServiceUtil.getValue(table.getTableId(), column.getColumnId(), org.getOrganizationId());
//			if (customValue != null){
//				jsonOrg.put("assetAdmin", customValue.getString().toLowerCase());
//				String assetAdmin[] =  customValue.getString().toLowerCase().split(";");
//				if (ArrayUtils.contains(assetAdmin, user.getEmailAddress().toLowerCase())){
//					jsonOrg.put("isAdmin", true);
//				}else{
//					jsonOrg.put("isAdmin", false);
//				}
//			}else{
//				jsonOrg.put("assetAdmin", "");
//				jsonOrg.put("isAdmin", false);
//			}
			aDepartment.add(jsonOrg);
			if(jsonOrg.get("assetManagement") == Boolean.TRUE){
				assetDepartment.add(jsonOrg);
			}
		}
		ArrayList<PermissionType> permList = PermissionType.getPermissionList();
		JSONObject jsonPerm;
		JSONArray aPermission = new JSONArray();
		for(PermissionType perm : permList){
			jsonPerm = new JSONObject();
			jsonPerm.put("permissionId", perm.getValue());
			jsonPerm.put("permissionName", perm.getLabel());
			aPermission.add(jsonPerm);
		}
		HashMap map = new HashMap<String, String>();
		PermissionChecker permissionChecker = PermissionThreadLocal.getPermissionChecker();

		List<PriorityType> priorityList = PriorityType.getAllPriorityList();
		for (PriorityType priority : priorityList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", priority.getValue());
			jsonOrg.put("name", priority.getLabel());
			aPriority.add(jsonOrg);
		}
		List<StatusType> taskStatusList = StatusType.getAllTaskStatusList();
		for (StatusType obj : taskStatusList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", obj.getValue());
			jsonOrg.put("name", obj.getLabel());
			aTaskStatus.add(jsonOrg);
		}
		List<TaskRequestType> taskStatusRequestTypes = TaskRequestType.getTaskRequestList();
		for (TaskRequestType obj : taskStatusRequestTypes) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", obj.getValue());
			jsonOrg.put("name", obj.getLabel());
			aTaskRequestType.add(jsonOrg);
		}
		List<ScopeType> scopeList = ScopeType.getScopeTaskList();
		for (ScopeType scope : scopeList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", scope.getValue());
			jsonOrg.put("name", scope.getLabel());
			aScope.add(jsonOrg);
		}
		List<TaskActionType> taskActionList = TaskActionType.getAllTaskActionList();
		for (TaskActionType taskAction : taskActionList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", taskAction.getValue());
			jsonOrg.put("name", taskAction.getLabel());
			aTaskAction.add(jsonOrg);
		}


		map.put("companyId", user.getCompanyId());
		map.put("userId", user.getUserId());
		map.put("userName", user.getScreenName());
		map.put("isAdmin", true);
		map.put("userEmail", user.getEmailAddress().toLowerCase());
		map.put("orgJsonData", aDepartment);
		map.put("assetOrgJsonData", assetDepartment);
		//map.put("employeeJsonData", aUser);
		map.put("myOrgs", aMyOrgs);
		map.put("userJsonData", aUser);
		map.put("permissionJsonData", aPermission);
		map.put("priorityJsonData", aPriority);
		map.put("statusJsonData", aTaskStatus);
		map.put("taskRequestTypeJsonData", aTaskRequestType);
		map.put("scopeJsonData", aScope);
		map.put("taskActionJsonData", aTaskAction);

		return new ModelAndView("app/Asset", "param", map);
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}



}
