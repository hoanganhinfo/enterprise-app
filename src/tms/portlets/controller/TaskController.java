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

import tms.backend.domain.Asset;
import tms.backend.domain.AssetCategory;
import tms.backend.domain.AssetLocation;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetLocationService;
import tms.backend.service.AssetService;
import tms.backend.service.TaskService;
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
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.service.UserGroupLocalServiceUtil;
import com.liferay.portal.service.UserLocalServiceUtil;
import com.liferay.portal.theme.ThemeDisplay;
import com.liferay.portlet.documentlibrary.model.DLFolderConstants;
import com.liferay.portlet.documentlibrary.service.DLAppLocalServiceUtil;

@org.springframework.stereotype.Controller
public class TaskController implements Controller, InitializingBean {
	@Autowired
	private TaskService taskService;
	@Autowired
	private AssetService assetService;
	@Autowired
	private AssetCategoryService assetCategoryService;
	@Autowired
	private AssetLocationService assetLocationService;
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
		String fileUrl = themeDisplay.getPortalURL() + themeDisplay.getPathContext() + "/documents/" + themeDisplay.getScopeGroupId();

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
		JSONArray aPriority = new JSONArray();
		JSONArray aStatus = new JSONArray();
		JSONArray aScope = new JSONArray();
		JSONArray aTaskAction = new JSONArray();
		JSONArray aAssetCategory = new JSONArray();
		JSONArray aAsset = new JSONArray();
		JSONArray aLocation = new JSONArray();
		JSONArray aTaskRequestType = new JSONArray();
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

		List<PriorityType> priorityList = PriorityType.getAllPriorityList();
		for (PriorityType priority : priorityList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", priority.getValue());
			jsonOrg.put("name", priority.getLabel());
			aPriority.add(jsonOrg);
		}
		List<StatusType> statusList = StatusType.getAllTaskStatusList();
		for (StatusType status : statusList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", status.getValue());
			jsonOrg.put("name", status.getLabel());
			aStatus.add(jsonOrg);
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
		List<TaskRequestType> taskStatusRequestTypes = TaskRequestType.getTaskRequestList();
		for (TaskRequestType obj : taskStatusRequestTypes) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", obj.getValue());
			jsonOrg.put("name", obj.getLabel());
			aTaskRequestType.add(jsonOrg);
		}
		/*
		List<AssetCategory> assetCategoryList = assetCategoryService.getAll();
		for (AssetCategory obj : assetCategoryList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("id", obj.getId());
			jsonOrg.put("departmentId", obj.getDepartmentId());
			jsonOrg.put("categoryname", obj.getCategoryName());
			aAssetCategory.add(jsonOrg);
		}
		List<Asset> assetList = assetService.getAll();
		for (Asset obj : assetList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("id", obj.getId());
			jsonOrg.put("assetCode", obj.getCode());
			jsonOrg.put("assetName", obj.getName());
			jsonOrg.put("categoryId", obj.getCategory());
			aAsset.add(jsonOrg);
		}*/
		List<AssetLocation> locations = assetLocationService.getAll();
		for (AssetLocation location : locations) {
			jsonOrg = new JSONObject();
			jsonOrg.put("id", location.getId());
			jsonOrg.put("locationCode", location.getLocationCode());
			aLocation.add(jsonOrg);
		}
		HashMap map = new HashMap<String, String>();
		map.put("fileUrl", fileUrl);
		map.put("sessionId", httpRequest.getSession().getId());
		map.put("companyId", user.getCompanyId());
		map.put("userId", user.getUserId());
		map.put("userName", user.getScreenName());
		map.put("userEmail", user.getEmailAddress().toLowerCase());
		map.put("orgJsonData", aDepartment);
		map.put("employeeJsonData", aEmployee);
		map.put("myOrgs", orgs);
		System.out.println("myOrgs: "+ orgs);
		map.put("priorityJsonData", aPriority);
		map.put("statusJsonData", aStatus);
		map.put("scopeJsonData", aScope);
		map.put("taskActionJsonData", aTaskAction);
		map.put("assetCategoryJsonData", aAssetCategory);
		map.put("assetJsonData", aAsset);
		map.put("locationDataJsonData", aLocation);
		map.put("taskRequestTypeJsonData", aTaskRequestType);
		try{
			System.out.println("themeDisplay.getScopeGroupId(): "+ themeDisplay.getScopeGroupId());
			System.out.println("DLFolderConstants.DEFAULT_PARENT_FOLDER_ID: "+ DLFolderConstants.DEFAULT_PARENT_FOLDER_ID);
		long repositoryId = DLFolderConstants.getDataRepositoryId(themeDisplay.getScopeGroupId(), DLFolderConstants.DEFAULT_PARENT_FOLDER_ID);
		map.put("repositoryId", repositoryId);
		System.out.println("repositoryId: "+ repositoryId);
//		long fileEntryTypeId = DLFileEntryTypeLocalServiceUtil.getFileEntryType(user.getGroupId(), "Task photo").getFileEntryTypeId();
//		System.out.println("fileEntryTypeId: "+ fileEntryTypeId);
//		map.put("fileEntryTypeId", fileEntryTypeId);
		Folder taskImageFolderId =   DLAppLocalServiceUtil.getFolder( repositoryId, DLFolderConstants.DEFAULT_PARENT_FOLDER_ID, "Task Photo" ) ;
		map.put("taskImageFolderId", taskImageFolderId.getFolderId());
		System.out.println("taskImageFolderId: "+ taskImageFolderId.getFolderId());


		}catch(Exception e){
			e.printStackTrace();
		}
		if (themeDisplay.isSignedIn()) {
			return new ModelAndView("app/Task", "param", map);
		}
		return new ModelAndView("unauthorized");
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
