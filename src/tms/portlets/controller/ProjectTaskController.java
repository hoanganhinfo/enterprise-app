package tms.portlets.controller;

import java.util.HashMap;
import java.util.List;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.math.NumberUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.mvc.Controller;

import tms.backend.domain.PmProject;
import tms.backend.domain.PmProjectTask;
import tms.backend.service.PmProjectService;
import tms.backend.service.PmProjectTaskService;
import tms.utils.CalendarUtil;
import tms.utils.PriorityType;
import tms.utils.ResourceUtil;
import tms.utils.StatusType;

import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.User;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.theme.ThemeDisplay;

@org.springframework.stereotype.Controller
public class ProjectTaskController implements Controller, InitializingBean {
	@Autowired
	private PmProjectTaskService pmProjectTaskService;
	@Autowired
	private PmProjectService pmProjectService;
	public void afterPropertiesSet() throws Exception {

	}

	@RequestMapping("view")
	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) throws Exception {
		HttpServletRequest httpRequest = com.liferay.portal.util.PortalUtil
				.getOriginalServletRequest(com.liferay.portal.util.PortalUtil
						.getHttpServletRequest(request));
		System.out.println("load project task  portlet");
		String projectId = httpRequest.getParameter("projectId");
		System.out.println("loading task of :"+ projectId);
		ThemeDisplay themeDisplay = (ThemeDisplay) request
				.getAttribute(WebKeys.THEME_DISPLAY);
		User user = themeDisplay.getUser();
		// get list of organization
		List<Organization> organizations = OrganizationLocalServiceUtil
				.getOrganizations(user.getCompanyId(), ResourceUtil.INTERNAL_ORGANIZATION);
		List<Organization> myOrg = user.getOrganizations();
		String orgs="";
		for(Organization org : myOrg){
			orgs+=org.getOrganizationId() + ",";
		}
		JSONArray aDepartment = new JSONArray();
		JSONArray aPriority = new JSONArray();
		JSONArray aStatus = new JSONArray();

		
		JSONObject jsonOrg;
		jsonOrg = new JSONObject();
		jsonOrg.put("orgId", "0");
		jsonOrg.put("orgName", "");
		aDepartment.add(jsonOrg);
		for (Organization org : organizations) {
			jsonOrg = new JSONObject();
			jsonOrg.put("orgId", org.getOrganizationId());
			jsonOrg.put("orgName", org.getName());
			aDepartment.add(jsonOrg);
		}
		List<PriorityType> priorityList = PriorityType.getAllPriorityList();
		for (PriorityType priority : priorityList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", priority.getValue());
			jsonOrg.put("name", priority.getLabel());
			aPriority.add(jsonOrg);
		}
		List<StatusType> statusList = StatusType.getAllProjectStatusList();
		for (StatusType status : statusList) {
			jsonOrg = new JSONObject();
			jsonOrg.put("value", status.getValue());
			jsonOrg.put("name", status.getLabel());
			aStatus.add(jsonOrg);
		}
		HashMap map = new HashMap<String, String>();
		map.put("sessionId", httpRequest.getSession().getId());
		map.put("companyId", user.getCompanyId());
		map.put("userId", user.getUserId());
		map.put("userName", user.getScreenName());
		map.put("userEmail", user.getEmailAddress().toLowerCase());		
		map.put("orgJsonData", aDepartment);
		map.put("myOrgs", orgs);
		System.out.println("myOrgs: "+ orgs);
		map.put("priorityJsonData", aPriority);
		map.put("statusJsonData", aStatus);
		
		//String projectId="-1";
		JSONArray taskArray = null;
		if (NumberUtils.isNumber(projectId)){
			taskArray = writeTask(-1*Long.valueOf(projectId));
			map.put("projectId", projectId);
			PmProject pmProject =  pmProjectService.findById(Long.valueOf(projectId));
			System.out.println( CalendarUtil.dateToString(pmProject.getStartDate()));
			map.put("startDate", CalendarUtil.dateToString(pmProject.getStartDate()));					
			map.put("endDate", CalendarUtil.dateToString(pmProject.getEndDate()));
		}else{
			map.put("projectId", "");
		}
		JSONObject obj = new JSONObject();
		obj.put("taskTree", taskArray);
		map.put("taskTreeJsonData", obj);
		
		return new ModelAndView("app/ProjectTask", "param", map);
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}

	private JSONArray writeTask(Long taskId) {
		List<PmProjectTask> taskList = pmProjectTaskService.getByParentId(Long
				.valueOf(taskId));
		JSONObject jsonTask = null;
		JSONArray taskArray = new JSONArray();
		for (PmProjectTask task : taskList) {
			jsonTask = new JSONObject();
			jsonTask.put("Id", task.getId());
			jsonTask.put("Name", task.getProjectTask());
			jsonTask.put("StartDate", CalendarUtil.dateToString(
					task.getStartDate(), "yyyy-MM-dd"));
			jsonTask.put("EndDate",
					CalendarUtil.dateToString(task.getEndDate(), "yyyy-MM-dd"));
			jsonTask.put("children",
					writeTask(task.getId()));
			jsonTask.put("expanded",true);
			jsonTask.put("leaf",false);
			jsonTask.put("parentId",taskId);
			
			// if (room.getBlockid() == null){
			// jsonRoom.put("status", "");
			// jsonRoom.put("leaf", false);
			// jsonRoom.put("parentId", null);
			// }else{
			// jsonRoom.put("status", room.getStatus().getValue());
			// jsonRoom.put("leaf", true);k
			// jsonRoom.put("parentId", room.getBlockid());
			// }
			taskArray.add(jsonTask);
		}
		return taskArray;
	}
}
