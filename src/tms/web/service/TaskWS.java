package tms.web.service;

import java.io.DataInputStream;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import javax.mail.MessagingException;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.SessionFactoryUtils;
import org.springframework.orm.hibernate3.SessionHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.Asset;
import tms.backend.domain.AssetCategory;
import tms.backend.domain.Task;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetService;
import tms.backend.service.TaskService;
import tms.utils.CalendarUtil;
import tms.utils.Email;
import tms.utils.PriorityType;
import tms.utils.ScopeType;
import tms.utils.StatusType;
import tms.utils.TaskActionType;
import tms.utils.TaskRequestType;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.HttpUtil;
import com.liferay.portal.kernel.util.MimeTypesUtil;
import com.liferay.portal.model.EmailAddress;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.User;
import com.liferay.portal.service.EmailAddressLocalServiceUtil;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.service.ServiceContext;
import com.liferay.portal.service.UserLocalServiceUtil;
import com.liferay.portlet.documentlibrary.service.DLAppLocalServiceUtil;
import com.liferay.portlet.documentlibrary.service.DLFileEntryLocalServiceUtil;

@Controller
public class TaskWS extends MultiActionController {
	@Autowired
	private TaskService taskService;
	@Autowired
	private AssetService assetService;
	@Autowired
	private AssetCategoryService assetCategoryService;
	@Autowired
	private SessionFactory sessionFactory;
	/**
	 * Save/Update information of task
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 * @throws ParseException
	 */
	@RequestMapping("/saveTask")
	public void saveTask(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException, ParseException {
		logger.info("EWI : START METHOD - saveTask");
		response.setContentType("text/html; charset=UTF-8");
		// request.
		String requesterId = request.getParameter("requesterId");// from
		String requesterName = request.getParameter("requesterName"); // ten nguoi gui
		String departmentId = request.getParameter("departmentId");// id depart
		String assigneeId = request.getParameter("assigneeId");// to
		String assigneeEmail = request.getParameter("assigneeEmail");
		//String scopeId = request.getParameter("scopeId");
		String taskId = request.getParameter("taskId");
		String taskname = request.getParameter("taskname");
		String desc = request.getParameter("desc");
		String priorityId = request.getParameter("priorityId");
		String statusId = request.getParameter("statusId");
		String taskActionId = request.getParameter("taskActionId");
		String requestTypeId = request.getParameter("requestTypeId");

		String requestDate = request.getParameter("requestDate");
		String targetDate = request.getParameter("targetDate");
		String planDate = request.getParameter("planDate");
		String actualDate = request.getParameter("actualDate");
		String confirmedDate = request.getParameter("confirmedDate");
		String email = request.getParameter("email");// cc
		String assetId = request.getParameter("assetId");
		String resolution = request.getParameter("resolution");

		//String assetCategoryId = request.getParameter("assetCategoryId");


		Byte oldTaskStatus = null;
		Task task;
		User user = null;
		if (StringUtils.isBlank(taskId)) {

			task = new Task();
			// send email when have new task

		} else {

			task = taskService.findById(Long.valueOf(taskId));
			oldTaskStatus = task.getStatus();
		}
		task.setRequesterId(Integer.parseInt(requesterId));
		task.setDepartment(departmentId);
		task.setAssignee(assigneeId);
		task.setAssigneeEmail(assigneeEmail);
		task.setScope(ScopeType.COMPANY.getValue());
		task.setTaskname(taskname);
		task.setDescription(desc);
		task.setResolution(resolution);
		task.setPriority(Byte.valueOf(priorityId));
		task.setStatus(Byte.valueOf(statusId));
		if (StringUtils.isNotBlank(taskActionId)){
			task.setTaskAction(Byte.valueOf(taskActionId));
		}
		if (StringUtils.isNotBlank(requestTypeId)){
			task.setRequestType(Byte.valueOf(requestTypeId));
		}

		if (StringUtils.isNotBlank(requestTypeId)){
			task.setRequestType(Byte.valueOf(requestTypeId));
		}
		if (StringUtils.isNotBlank(requestDate)){
			task.setRequestDate(CalendarUtil.stringToDateTime(requestDate));
		}
		if (StringUtils.isNotBlank(targetDate)){
			task.setTargetdate(CalendarUtil.stringToDateTime(targetDate));
		}
		if (StringUtils.isNotBlank(confirmedDate)){
			task.setActualCompletedDate(CalendarUtil.stringToDateTime(confirmedDate));
		}
		if (StringUtils.isNotBlank(planDate)){
			task.setPlanCompletedDate(CalendarUtil.stringToDateTime(planDate));
		}
		if (StringUtils.isNotBlank(actualDate)){
			task.setActualCompletedDate(CalendarUtil.stringToDateTime(actualDate));
		}
		if (StringUtils.isNotBlank(assetId)){
			task.setAssetId(Long.valueOf(assetId));
		}

		task.setEmail(email);
		taskService.saveOrUpdate(task);
		if (StringUtils.isNotBlank(assetId)){
			Criterion cAsset = Restrictions.eq("assetId", Long.valueOf(assetId));
			Criterion cStatus = Restrictions.or(Restrictions.eq("status", StatusType.OPEN.getValue()),
					Restrictions.or(Restrictions.eq("status", StatusType.PROCESSING.getValue()),
							Restrictions.or(Restrictions.eq("status", StatusType.ON_SCHEDULE.getValue()),
									Restrictions.eq("status", StatusType.COMPLETED.getValue()))));
			List<Task> pendingTasks = taskService.getByCriteria("requestType", "asc",cAsset,cStatus);
			Asset asset =  assetService.findById(Long.valueOf(assetId));
			if (pendingTasks.size() > 0){
				Task pendingTask = pendingTasks.get(0);
				asset.setRequestType(pendingTask.getRequestType());

			}else{
				asset.setRequestType(TaskRequestType.BLANK.getValue());

			}
			assetService.update(asset);
		}
		// email
		if (StringUtils.isNotBlank(email)) {
			email = email.replaceAll(";", ",");
		}
		Organization org = null;
		try {
			org = OrganizationLocalServiceUtil.getOrganization(Long
					.valueOf(departmentId.replaceAll(",", "")));
			user = UserLocalServiceUtil.getUserById(Long.valueOf(requesterId));
			List<EmailAddress> emailList = EmailAddressLocalServiceUtil
					.getEmailAddresses(user.getCompanyId(),
							"com.liferay.portal.model.Organization",
							org.getOrganizationId());
			for (EmailAddress e : emailList) {
				email = email + "," + e.getAddress();
			}
			if (StringUtils.isNotBlank(assigneeEmail)) {
				email = email +"," +assigneeEmail;
			}
		} catch (NumberFormatException e1) {
			// TODO Auto-generated catch block
			//System.out.println(e.pr);
			e1.printStackTrace();
		} catch (PortalException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (SystemException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		/*
		if (StringUtils.isBlank(taskId)) {
			// send email when have new task
			try {
				String subject = "[Task alert] - " + org.getName()
						+ " has a new task on portal from " + requesterName;
				StringBuffer body = new StringBuffer();
				body.append("<B>" + org.getName() + " has a new task</B>");
				body.append("<br>Task name: " + taskname);
				body.append("<br>Requested by: " + requesterName);
				body.append("<br>Priority: "
						+ PriorityType.forValue(Integer.parseInt(priorityId))
								.getLabel());
				body.append("<br>Target date: " + targetDate);
				body.append("<br>");
				body.append("<br>Description:");
				body.append("<br>" + desc);
				body.append("<br><br><br>");
				body.append("<br>=================================================");
				body.append("<br>This is automated mail. Please don't reply.Thanks");
				body.append("<br>=================================================");
				Email.postMail(email, subject, body.toString());
			} catch (MessagingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		} else {
			// email when have change Status
			if (Byte.valueOf(statusId) != oldTaskStatus
					&& Byte.valueOf(statusId) == StatusType.COMPLETED
							.getValue()) {

				try {

					String subject = "[Task alert] - Task "
							+ task.getTaskname() + " on portal is completed";
					StringBuffer body = new StringBuffer();
					body.append("Task <B>" + task.getTaskname()
							+ "</B> on portal is completed");
					body.append("<br><br><br>");
					body.append("<br>=================================================");
					body.append("<br>This is automated mail. Please don't reply.Thanks");
					body.append("<br>=================================================");
					Email.postMail(user.getEmailAddress(), subject, body.toString());
				} catch (MessagingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
		}
		*/
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("success", true);
		obj.put("taskId", task.getId());
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveTask");
	}
	/**
	 * Delete selected task with attachment
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	@RequestMapping("/deleteTask")
	public void deleteTask(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteTask");
		String taskId = request.getParameter("taskId");
		String repositoryId = request.getParameter("repositoryId");
		String taskImageFolderId = request.getParameter("taskImageFolderId");
		Task task = taskService.findById(Long.valueOf(taskId));
		taskService.delete(task);
		if (task.getAssetId() != null){
			Criterion cAsset = Restrictions.eq("assetId", task.getAssetId());
			Criterion cStatus = Restrictions.or(Restrictions.eq("status", StatusType.OPEN.getValue()),
					Restrictions.or(Restrictions.eq("status", StatusType.PROCESSING.getValue()),
							Restrictions.or(Restrictions.eq("status", StatusType.ON_SCHEDULE.getValue()),
									Restrictions.eq("status", StatusType.COMPLETED.getValue()))));
			List<Task> pendingTasks = taskService.getByCriteria("requestType", "asc",cAsset,cStatus);
			Asset asset =  assetService.findById(task.getAssetId());
			if (pendingTasks.size() > 0){
				Task pendingTask = pendingTasks.get(0);
				asset.setRequestType(pendingTask.getRequestType());

			}else{
				asset.setRequestType(TaskRequestType.BLANK.getValue());

			}
			assetService.update(asset);
		}
		List<FileEntry> fileList;
		// delete attachment files of task
		/*try {
			fileList = DLAppLocalServiceUtil
					.getFileEntries(Long.valueOf(repositoryId),
							Long.valueOf(taskImageFolderId));
			for (FileEntry file : fileList) {
				if (StringUtils.equals(taskId, file.getDescription())) {
					DLAppLocalServiceUtil
							.deleteFileEntry(file.getFileEntryId());
				}
			}

		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (PortalException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SystemException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("success", true);
		obj.put("taskId", task.getId());
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteTask");
	}
	/**
	 * Get list of assigned tasks
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 * @throws ParseException
	 */
	@RequestMapping("/getAssignedTask")
	public void getAssignedTask(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException, ParseException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy hh:mm a");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String myOrgs = request.getParameter("myOrgs");
		String userId = request.getParameter("userId");
		String userEmail = request.getParameter("userEmail");
		String departmentId = request.getParameter("departmentId");
		String priorityId = request.getParameter("priorityId");
		String statusId = request.getParameter("statusId");
		String taskActionId = request.getParameter("taskActionId");
		String requestDateFrom = request.getParameter("requestDateFrom");
		String requestDateTo = request.getParameter("requestDateTo");
		String repositoryId = request.getParameter("repositoryId");
		String taskImageFolderId = request.getParameter("taskImageFolderId");
		String assetId = request.getParameter("assetId");
		List<AssetCategory> assetCategoryList = assetCategoryService.getAll();
		List<Asset> assetList = assetService.getAll();
		HashMap<Long, AssetCategory>  assetCategoryMap = new HashMap<>();
		HashMap<Long, Asset>  assetMap = new HashMap<>();
		for (Asset asset : assetList) {
			assetMap.put(asset.getId(), asset);
		}
		for (AssetCategory assetCat : assetCategoryList) {
			assetCategoryMap.put(assetCat.getId(), assetCat);
		}
		Criterion cDepartment = null;
		if (StringUtils.isNotBlank(departmentId)
				&& !StringUtils.equals(departmentId, "-1")) {
			String[] orgs = departmentId.split(",");
			cDepartment = Restrictions.in("department", orgs);
		}

		Criterion cPriority = null;
		if (StringUtils.isNotBlank(priorityId)
				&& !StringUtils.equals(priorityId, "0")) {
			cPriority = Restrictions.eq("priority", Byte.valueOf(priorityId));
		}
		Criterion cStatus = null;
		if (StringUtils.isNotBlank(statusId)
				&& !StringUtils.equals(statusId, "0")) {
			cStatus = Restrictions.eq("status", Byte.valueOf(statusId));
		}
		Criterion cTaskAction = null;
		if (StringUtils.isNotBlank(taskActionId)
				&& !StringUtils.equals(taskActionId, "0")) {
			cTaskAction = Restrictions.eq("taskAction", Byte.valueOf(taskActionId));
		}

		Criterion cFromdate = null;
		if (StringUtils.isNotBlank(requestDateFrom)) {
			cFromdate = Restrictions.ge("requestDate",
					CalendarUtil.stringToDate(requestDateFrom));
		}
		Criterion cTodate = null;
		if (StringUtils.isNotBlank(requestDateTo)) {
			cTodate = Restrictions.le("requestDate",
					CalendarUtil.stringToDate(requestDateTo));

		}
		Criterion cAssetId = null;
		if (StringUtils.isNotBlank(assetId)) {
			cTodate = Restrictions.eq("assetId", Long.valueOf(assetId));

		}
		// Criterion cRequestDate = Restrictions.and(cFromdate, cTodate);
		try {
			Session session = SessionFactoryUtils.getSession(sessionFactory,
					true);
			TransactionSynchronizationManager.bindResource(sessionFactory,
					new SessionHolder(session));
			// List<Task> list = taskService.getTaskByDepartment(map,myOrgs);
			List<Task> list = taskService.getTaskByCriteria(cDepartment,
					cPriority, cStatus, cTaskAction, cFromdate, cTodate, cAssetId);
			JSONObject jsonTask;
			for (Task task : list) {
				if (task.getRequesterId().toString().equals(userId)
						|| task.getScope() == ScopeType.COMPANY.getValue()
						|| StringUtils.contains(task.getEmail(),userEmail)
						|| (task.getScope() == ScopeType.DEPARTMENT.getValue()  && StringUtils.contains(myOrgs, task.getDepartment()))
						|| (task.getScope() == ScopeType.ASSIGNEE.getValue()) && StringUtils.contains(task.getAssignee(),userId)) {
					jsonTask = new JSONObject();
					jsonTask.put("id", task.getId());
					jsonTask.put("taskname", task.getTaskname());
					jsonTask.put("description", task.getDescription());
					jsonTask.put("resolution", task.getResolution());
					jsonTask.put("requesterId", task.getRequesterId());
					try{
						User user = UserLocalServiceUtil.getUserById(task
								.getRequesterId());
						if (user != null) {
							jsonTask.put("requester", user.getScreenName());
						} else {
							jsonTask.put("requester", "");
						}
					}catch (Exception e) {
						// TODO: handle exception
					}

					if (task.getRequestDate() != null) {
						jsonTask.put("requestdate",
								fmt.format(task.getRequestDate()));
					} else {
						jsonTask.put("requestdate", "");
					}
					if (task.getTargetdate() != null) {
						jsonTask.put("targetdate",
								fmt.format(task.getTargetdate()));
					} else {
						jsonTask.put("targetdate", "");
					}
					if (task.getPlanCompletedDate() != null) {
						jsonTask.put("plandate",
								fmt.format(task.getPlanCompletedDate()));
					} else {
						jsonTask.put("plandate", "");
					}
					if (task.getActualCompletedDate() != null) {
						jsonTask.put("actualdate",
								fmt.format(task.getActualCompletedDate()));
					} else {
						jsonTask.put("actualdate", "");
					}
					if (task.getConfirmDate() != null) {
						jsonTask.put("confirmedDate",
								fmt.format(task.getConfirmDate()));
					} else {
						jsonTask.put("actualdate", "");
					}
					if (task.getStatus() != null){
						jsonTask.put("status", StatusType
								.forValue(task.getStatus()).getLabel());
						jsonTask.put("statusId", task.getStatus());
					}

					if (task.getTaskAction() != null){
						jsonTask.put("taskAction", TaskActionType
							.forValue(task.getTaskAction()).getLabel());
						jsonTask.put("taskActionId", task.getTaskAction());
					}

					jsonTask.put("priority",
							PriorityType.forValue(task.getPriority())
									.getLabel());
					jsonTask.put("priorityId", task.getPriority());
					jsonTask.put("departmentId", task.getDepartment());
					if (StringUtils.isNotBlank(task.getDepartment())) {
						try{
						Organization org = OrganizationLocalServiceUtil
								.getOrganization(Long.valueOf(task
										.getDepartment()));

						jsonTask.put("department", org.getName());
						}catch(Exception e){

						}
					} else {
						jsonTask.put("department", "");
					}
					jsonTask.put("email", task.getEmail());
					jsonTask.put("assigneeId", StringUtils.isBlank(task.getAssignee())?-1:Long.parseLong(task.getAssignee()));
					jsonTask.put("assigneeEmail", task.getAssigneeEmail());
					jsonTask.put("assigneeName", task.getAssigneeName());
					//jsonTask.put("scopeId", task.getScope());
					if (task.getAssetId() != null){
						jsonTask.put("assetId", task.getAssetId());
						jsonTask.put("assetCode", assetMap.get(task.getAssetId()).getCode());
						jsonTask.put("assetName", assetMap.get(task.getAssetId()).getName());
					}
					if (task.getRequestType() != null){
						jsonTask.put("requestType", TaskRequestType.forValue(task.getRequestType()).getLabel());
						jsonTask.put("requestTypeId", task.getRequestType());

					}

					System.out.println("get attachment file");
					// Get attachment file of task
					/*try{
					List<FileEntry> fileList = DLAppLocalServiceUtil
							.getFileEntries(Long.valueOf(repositoryId),
									Long.valueOf(taskImageFolderId));
					boolean hasAttachmentFile = false;
					for (FileEntry file : fileList) {
						if (StringUtils.equals(task.getId().toString(),
								file.getDescription())) {
							hasAttachmentFile = true;
							break;
						}
					}
					if (hasAttachmentFile) {
						jsonTask.put("hasAttachmentFile", true);
					} else {
						jsonTask.put("hasAttachmentFile", false);
					}
					}catch(Exception e){
						jsonTask.put("hasAttachmentFile", false);
					}*/
					array.add(jsonTask);
				}
			}

			obj.put("taskList", array);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		} finally {
			TransactionSynchronizationManager.unbindResource(sessionFactory);
		}
		out.print(obj);
		out.flush();
	}
	/**
	 * Get list of personal tasks
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 * @throws ParseException
	 */
	@RequestMapping("/getPersonalTask")
	public void getPersonalTask(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException, ParseException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String userId = request.getParameter("userId");
		String departmentId = request.getParameter("departmentId");
		String priorityId = request.getParameter("priorityId");
		String statusId = request.getParameter("statusId");
		String requestDateFrom = request.getParameter("requestDateFrom");
		String requestDateTo = request.getParameter("requestDateTo");
		String repositoryId = request.getParameter("repositoryId");
		String taskImageFolderId = request.getParameter("taskImageFolderId");
		Criterion cDepartment = null;
		if (StringUtils.isNotBlank(departmentId)
				&& !StringUtils.equals(departmentId, "-1")) {
			String[] orgs = departmentId.split(",");
			cDepartment = Restrictions.in("department", orgs);
		}
		Criterion cRequesterId = Restrictions.eq("requesterId",
				Integer.parseInt(userId));
		Criterion cPriority = null;
		if (StringUtils.isNotBlank(priorityId)
				&& !StringUtils.equals(priorityId, "0")) {
			cPriority = Restrictions.eq("priority", Byte.valueOf(priorityId));
		}
		Criterion cStatus = null;
		if (StringUtils.isNotBlank(statusId)
				&& !StringUtils.equals(statusId, "0")) {
			cStatus = Restrictions.eq("status", Byte.valueOf(statusId));
		}
		Criterion cFromdate = null;
		if (StringUtils.isNotBlank(requestDateFrom)) {

			cFromdate = Restrictions.ge("requestDate",
					CalendarUtil.stringToDate(requestDateFrom));

		}
		Criterion cTodate = null;
		if (StringUtils.isNotBlank(requestDateTo)) {
			cTodate = Restrictions.le("requestDate",
					CalendarUtil.stringToDate(requestDateTo));

		}

		try {
			Session session = SessionFactoryUtils.getSession(sessionFactory,
					true);
			TransactionSynchronizationManager.bindResource(sessionFactory,
					new SessionHolder(session));
			// List<Task> list =
			// taskService.getTaskByRequester(map,Integer.valueOf(userId));
			List<Task> list = taskService.getTaskByCriteria(cDepartment,
					cRequesterId, cPriority, cStatus, cFromdate, cTodate);

			JSONObject jsonTask;
			for (Task task : list) {
				jsonTask = new JSONObject();
				jsonTask.put("id", task.getId());
				jsonTask.put("taskname", task.getTaskname());
				jsonTask.put("description", task.getDescription());
				jsonTask.put("assetId", task.getAssetId());
				jsonTask.put("assetCategoryId", task.getAssetCategoryId());
				jsonTask.put("requesterId", task.getRequesterId());
				try{
				User user = UserLocalServiceUtil.getUserById(task
						.getRequesterId());
				if (user != null) {
					jsonTask.put("requester", user.getScreenName());
				} else {
					jsonTask.put("requester", "");
				}
				}catch(Exception e){}
				if (task.getRequestDate() != null) {
					jsonTask.put("requestdate",
							fmt.format(task.getRequestDate()));
				} else {
					jsonTask.put("requestdate", "");
				}
				if (task.getTargetdate() != null) {
					jsonTask.put("targetdate", fmt.format(task.getTargetdate()));
				} else {
					jsonTask.put("targetdate", "");
				}
				if (task.getPlanCompletedDate() != null) {
					jsonTask.put("plandate",
							fmt.format(task.getPlanCompletedDate()));
				} else {
					jsonTask.put("plandate", "");
				}
				if (task.getActualCompletedDate() != null) {
					jsonTask.put("actualdate",
							fmt.format(task.getActualCompletedDate()));
				} else {
					jsonTask.put("actualdate", "");
				}
				jsonTask.put("status", StatusType.forValue(task.getStatus())
						.getLabel());
				jsonTask.put("statusId", task.getStatus());
				jsonTask.put("priority",
						PriorityType.forValue(task.getPriority()).getLabel());
				jsonTask.put("priorityId", task.getPriority());
				jsonTask.put("departmentId", task.getDepartment());
				if (StringUtils.isNotBlank(task.getDepartment())) {
					try{
					Organization org = OrganizationLocalServiceUtil
							.getOrganization(Long.valueOf(task.getDepartment()));

					jsonTask.put("department", org.getName());
					}catch(Exception e){

					}
				} else {
					jsonTask.put("department", "");
				}
				jsonTask.put("email", task.getEmail());
				jsonTask.put("assigneeId", StringUtils.isBlank(task.getAssignee())?-1:Long.parseLong(task.getAssignee()));
				jsonTask.put("assigneeEmail", task.getAssigneeEmail());
				jsonTask.put("assigneeName", task.getAssigneeName());
				jsonTask.put("assetId", task.getAssetId());
				jsonTask.put("assetCategoryId", task.getAssetCategoryId());
				/*List<FileEntry> fileList = DLAppLocalServiceUtil
						.getFileEntries(Long.valueOf(repositoryId),
								Long.valueOf(taskImageFolderId));
				boolean hasAttachmentFile = false;
				try{
				for (FileEntry file : fileList) {
					if (StringUtils.equals(task.getId().toString(),
							file.getDescription())) {
						hasAttachmentFile = true;
						break;
					}
				}
				if (hasAttachmentFile) {
					jsonTask.put("hasAttachmentFile", true);
				} else {
					jsonTask.put("hasAttachmentFile", false);
				}
				}catch(Exception e){

				}*/
				array.add(jsonTask);
			}
			obj.put("taskList", array);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		} finally {
			TransactionSynchronizationManager.unbindResource(sessionFactory);
		}
		out.print(obj);
		out.flush();
	}

	@RequestMapping("/getPriorityList")
	public void getPriorityList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();

		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();

		try {
			List<PriorityType> list = PriorityType.getPriorityList();
			JSONObject jsonPriority;
			for (PriorityType priority : list) {
				jsonPriority = new JSONObject();
				jsonPriority.put("id", priority.getValue());
				jsonPriority.put("taskname", priority.getLabel());
				array.add(jsonPriority);
			}
			obj.put("priorityList", array);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}
	/**
	 * Get list of task status
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	@RequestMapping("/getStatusList")
	public void getStatusList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();

		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();

		try {
			List<StatusType> list = StatusType.getTaskStatusList();
			JSONObject jsonStatus;
			for (StatusType status : list) {
				jsonStatus = new JSONObject();
				jsonStatus.put("id", status.getValue());
				jsonStatus.put("taskname", status.getLabel());
				array.add(jsonStatus);
			}
			obj.put("statusList", array);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}
	/**
	 * Uploading attachment file of task to server
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	@RequestMapping("/upload")
	public void upload(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("upload photo");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		String taskId = request.getParameter("taskId");
		String repositoryId = request.getParameter("repositoryId");
		String userId = request.getParameter("userId");
		String taskImageFolderId = request.getParameter("taskImageFolderId");

		try {

			final CommonsMultipartFile attachmentFile = (CommonsMultipartFile) multipartRequest
					.getFile("attachmentFile");
			if (attachmentFile == null) {
				System.out.println("attachmentFile is null");
			}
			ServiceContext serviceContext = new ServiceContext();
			serviceContext.setUserId(Long.valueOf(userId));
			serviceContext.setAddCommunityPermissions(true);
			serviceContext.setAddGuestPermissions(true);
			serviceContext.setAddGroupPermissions(true);
			String filename = attachmentFile.getOriginalFilename().replaceAll(
					" ", "_");
			// byte[] b = new byte[attachmentFile.getInputStream().available()];
			DLAppLocalServiceUtil.addFileEntry(Long.valueOf(userId),
					Long.valueOf(repositoryId),
					Long.valueOf(taskImageFolderId), filename,
					MimeTypesUtil.getContentType(filename), filename, taskId,
					"", attachmentFile.getInputStream(),
					attachmentFile.getSize(), serviceContext);
			// DLFileEntryLocalServiceUtil.addFileEntry(Long.valueOf(userId),
			// Long.valueOf(repositoryId),Long.valueOf(repositoryId),
			// Long.valueOf(taskImageFolderId),
			// filename, MimeTypesUtil.getContentType(filename), filename,
			// filename, "",Long.valueOf(fileEntryTypeId),fieldsMap,
			// file,attachmentFile.getInputStream(),attachmentFile.getSize(),serviceContext);

			obj.put("success", true);

		} catch (Exception e) {
			e.printStackTrace();
			obj.put("success", false);
		} finally {
			out.print(obj);
			out.flush();
		}
	}
	/**
	 * Get attachment files of selected task
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	@RequestMapping("/getAttachmentFiles")
	public void getAttachmentFiles(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		System.out.println("getAttachmentFiles");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();

		String taskId = request.getParameter("taskId");
		String repositoryId = request.getParameter("repositoryId");
		String userId = request.getParameter("userId");
		String taskImageFolderId = request.getParameter("taskImageFolderId");
		String fileUrl = request.getParameter("fileUrl");

		try {
			/*List<FileEntry> fileList = DLAppLocalServiceUtil
					.getFileEntries(Long.valueOf(repositoryId),
							Long.valueOf(taskImageFolderId));
			System.out.println("fileList size:" + fileList.size());
			JSONObject jsonFile;
			for (FileEntry file : fileList) {
				System.out.println("filename : " + file.getDescription());
				if (StringUtils.equals(taskId, file.getDescription())) {
					jsonFile = new JSONObject();
					jsonFile.put("id", file.getFileEntryId());
					jsonFile.put("filename", file.getTitle());
					// HttpUtil.decodeURL(HtmlUtil.unescape(html))
					jsonFile.put(
							"src",
							fileUrl
									+ "//"
									+ taskImageFolderId
									+ "//"
									+ HttpUtil.encodeURL(HtmlUtil.unescape(file
											.getTitle())));
					// DLFileEntryLocalServiceUtil.
					array.add(jsonFile);
				}
			}*/
			obj.put("fileList", array);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			e.printStackTrace();
			obj.put("success", false);
		} finally {
			out.print(obj);
			out.flush();
		}
	}
	/**
	 * Download attachment to user
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	@RequestMapping("/downloadPhoto")
	public void downloadPhoto(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("APPLICATION/OCTET-STREAM");
		ServletOutputStream outputStream = response.getOutputStream();
		String fileEntryId = request.getParameter("fileEntryId");
		int length = 0;
		try {
			FileEntry fileEntry = DLAppLocalServiceUtil.getFileEntry(Long
					.valueOf(fileEntryId));
			InputStream inputStream = DLFileEntryLocalServiceUtil
					.getFileAsStream(fileEntry.getUserId(),
							fileEntry.getFileEntryId(), fileEntry.getVersion());
			response.setHeader("Content-Disposition",
					"filename=" + fileEntry.getTitle());
			// response.setHeader("Content-Type", fileEntry.getMimeType());
			byte[] byteBuffer = new byte[4096];
			DataInputStream in = new DataInputStream(inputStream);
			// reads the file's bytes and writes them to the response stream
			while ((in != null) && ((length = in.read(byteBuffer)) != -1)) {
				outputStream.write(byteBuffer, 0, length);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			outputStream.flush();
			outputStream.close();
		}
		System.out.println("ccc");

	}
	/**
	 * Delete selected attachment file
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	@RequestMapping("/deletePhoto")
	public void deletePhoto(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("APPLICATION/OCTET-STREAM");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String fileEntryId = request.getParameter("fileEntryId");
		try {
			DLAppLocalServiceUtil.deleteFileEntry(Long.valueOf(fileEntryId));
			obj.put("success", true);

		} catch (Exception e) {
			e.printStackTrace();
			obj.put("success", false);
		} finally {
			out.print(obj);
			out.flush();
		}

	}

	@RequestMapping("/exportTaskToExcel")
	public void exportTaskToExcel(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("APPLICATION/OCTET-STREAM");
		response.setHeader("Content-Disposition", "filename=tasklist.xls");
		response.setHeader("Content-Type", "application/vnd.ms-excel");
		ServletOutputStream outputStream = response.getOutputStream();
		try {
			InputStream tmplStream = getClass()
					.getClassLoader()
					.getResourceAsStream("tms/backend/conf/report/TaskList.xls");
			POIFSFileSystem xlsInputStream = new POIFSFileSystem(tmplStream);
			HSSFWorkbook wb = new HSSFWorkbook(xlsInputStream);
			HSSFSheet sheet0 = wb.getSheetAt(0);
			exportDepartmentTaskToExcel(sheet0, request, response);
			HSSFSheet sheet1 = wb.getSheetAt(1);
			exportPersonalTaskToExcel(sheet1, request, response);
			wb.write(outputStream);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			outputStream.flush();
			outputStream.close();
		}
	}

	private void exportDepartmentTaskToExcel(HSSFSheet sheet,
			HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, ParseException {
		System.out.println("exportDepartmentTaskToExcel");
		String departmentId = request.getParameter("departmentId");
		String priorityId = request.getParameter("priorityId");
		String statusId = request.getParameter("statusId");
		String requestDateFrom = request.getParameter("requestDateFrom");
		String requestDateTo = request.getParameter("requestDateTo");
		Criterion cDepartment = null;
		if (StringUtils.isNotBlank(departmentId)
				&& !StringUtils.equals(departmentId, "-1")) {
			String[] orgs = departmentId.split(",");
			cDepartment = Restrictions.in("department", orgs);
		}
		Criterion cPriority = null;
		if (StringUtils.isNotBlank(priorityId)
				&& !StringUtils.equals(priorityId, "0")) {
			cPriority = Restrictions.eq("priority", Byte.valueOf(priorityId));
		}
		Criterion cStatus = null;
		if (StringUtils.isNotBlank(statusId)
				&& !StringUtils.equals(statusId, "0")) {
			cStatus = Restrictions.eq("status", Byte.valueOf(statusId));
		}
		Criterion cFromdate = null;
		if (StringUtils.isNotBlank(requestDateFrom)) {
			cFromdate = Restrictions.ge("requestDate",
					CalendarUtil.stringToDate(requestDateFrom));
		}
		Criterion cTodate = null;
		if (StringUtils.isNotBlank(requestDateTo)) {
			cTodate = Restrictions.le("requestDate",
					CalendarUtil.stringToDate(requestDateTo));

		}
		List<Task> list = taskService.getTaskByCriteria(cDepartment, cPriority,
				cStatus, cFromdate, cTodate);
		// SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
		Row row = null;
		CreationHelper createHelper = sheet.getWorkbook().getCreationHelper();
		CellStyle dateStyle = sheet.getWorkbook().createCellStyle();
		dateStyle.setDataFormat(createHelper.createDataFormat().getFormat(
				"dd/mm/yyyy"));
		try {
			row = sheet.getRow(2);
			// //print date
			Cell ePrintDate = row.createCell(2);
			ePrintDate.setCellValue(CalendarUtil.dateToString(Calendar
					.getInstance().getTime()));
			row = sheet.getRow(3);
			Cell eDepart = row.createCell(2);
			if (StringUtils.isNotBlank(departmentId)
					&& !StringUtils.equals(departmentId, "-1")) {
				Organization org = OrganizationLocalServiceUtil
						.getOrganization(Long.valueOf(departmentId.replaceAll(
								",", "")));
				eDepart.setCellValue(org.getName());
			} else {
				eDepart.setCellValue("All");
			}

			int rowCount = 4;
			for (Task task : list) {
				rowCount++;
				row = sheet.createRow(rowCount);

				int col = 0;
				Cell eTaskCode = row.createCell(col++);
				System.out.println("taskId:" + task.getId());
				eTaskCode.setCellValue(task.getId());
				Cell eTaskName = row.createCell(col++);
				eTaskName.setCellValue(task.getTaskname());
				Cell eDesc = row.createCell(col++);
				HSSFRichTextString textString = new HSSFRichTextString(task
						.getDescription().replaceAll("\\<[^\\>]*\\>", ""));
				eDesc.setCellValue(textString);
				Cell eRequester = row.createCell(col++);
				User user = UserLocalServiceUtil.getUserById(task
						.getRequesterId());
				eRequester.setCellValue(user.getScreenName());

				if (task.getRequestDate() != null) {
					Cell eRequestDate = row.createCell(col++);
					// eRequestDate.setCellValue(CalendarUtil.dateToString(task
					// .getRequestDate()));
					eRequestDate.setCellValue(task.getRequestDate());
					eRequestDate.setCellStyle(dateStyle);
				} else {
					col++;
				}
				if (task.getTargetdate() != null) {
					Cell eTargetDate = row.createCell(col++);
					// eTargetDate
					// .setCellValue(CalendarUtil.dateToString(task.getTargetdate()));
					eTargetDate.setCellValue(task.getTargetdate());
					eTargetDate.setCellStyle(dateStyle);
				} else {
					col++;
				}
				if (task.getPlanCompletedDate() != null) {
					Cell ePlanDate = row.createCell(col++);
					// ePlanDate.setCellValue(CalendarUtil.dateToString(task
					// .getPlanCompletedDate()));
					ePlanDate.setCellValue(task.getPlanCompletedDate());
					ePlanDate.setCellStyle(dateStyle);
				} else {
					col++;
				}
				if (task.getActualCompletedDate() != null) {
					Cell eActualDate = row.createCell(col++);
					// eActualDate.setCellValue(CalendarUtil.dateToString(task
					// .getActualCompletedDate()));
					eActualDate.setCellValue(task.getActualCompletedDate());
					eActualDate.setCellStyle(dateStyle);
				} else {
					col++;
				}

				Cell ePriority = row.createCell(col++);
				ePriority.setCellValue(PriorityType
						.forValue(task.getPriority()).getLabel());
				Cell eStatus = row.createCell(col++);
				eStatus.setCellValue(StatusType.forValue(task.getStatus())
						.getLabel());

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void exportPersonalTaskToExcel(HSSFSheet sheet,
			HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, ParseException {
		System.out.println("exportPersonalTaskToExcel");
		String userId = request.getParameter("userId");
		String departmentId = request.getParameter("departmentId");
		String priorityId = request.getParameter("priorityId");
		String statusId = request.getParameter("statusId");
		String requestDateFrom = request.getParameter("requestDateFrom");
		String requestDateTo = request.getParameter("requestDateTo");
		Criterion cRequesterId = Restrictions.eq("requesterId",
				Integer.parseInt(userId));
		Criterion cDepartment = null;
		if (StringUtils.isNotBlank(departmentId)
				&& !StringUtils.equals(departmentId, "-1")) {
			String[] orgs = departmentId.split(",");
			cDepartment = Restrictions.in("department", orgs);
		}
		Criterion cPriority = null;
		if (StringUtils.isNotBlank(priorityId)
				&& !StringUtils.equals(priorityId, "0")) {
			cPriority = Restrictions.eq("priority", Byte.valueOf(priorityId));
		}
		Criterion cStatus = null;
		if (StringUtils.isNotBlank(statusId)
				&& !StringUtils.equals(statusId, "0")) {
			cStatus = Restrictions.eq("status", Byte.valueOf(statusId));
		}
		Criterion cFromdate = null;
		if (StringUtils.isNotBlank(requestDateFrom)) {

			cFromdate = Restrictions.ge("requestDate",
					CalendarUtil.stringToDate(requestDateFrom));

		}
		Criterion cTodate = null;
		if (StringUtils.isNotBlank(requestDateTo)) {
			cTodate = Restrictions.le("requestDate",
					CalendarUtil.stringToDate(requestDateTo));

		}

		List<Task> list = taskService.getTaskByCriteria(cDepartment,
				cRequesterId, cPriority, cStatus, cFromdate, cTodate);
		SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
		Row row = null;
		CreationHelper createHelper = sheet.getWorkbook().getCreationHelper();
		CellStyle dateStyle = sheet.getWorkbook().createCellStyle();
		dateStyle.setDataFormat(createHelper.createDataFormat().getFormat(
				"dd/mm/yyyy"));
		try {
			row = sheet.getRow(2);
			// //print date
			Cell ePrintDate = row.createCell(2);
			ePrintDate.setCellValue(format.format(Calendar.getInstance()
					.getTime()));
			row = sheet.getRow(3);
			Cell eUser = row.createCell(2);
			User user = UserLocalServiceUtil.getUserById(Long.valueOf(userId));
			eUser.setCellValue(user.getScreenName());
			int rowCount = 4;

			for (Task task : list) {
				System.out.println("taskId:" + task.getId());
				rowCount++;
				row = sheet.createRow(rowCount);
				int col = 0;
				Cell eTaskCode = row.createCell(col++);
				eTaskCode.setCellValue(task.getId());
				Cell eTaskName = row.createCell(col++);
				eTaskName.setCellValue(task.getTaskname());
				Cell eDesc = row.createCell(col++);
				HSSFRichTextString textString = new HSSFRichTextString(task
						.getDescription().replaceAll("\\<[^\\>]*\\>", ""));
				eDesc.setCellValue(textString);
				if (task.getRequestDate() != null) {
					Cell eRequestDate = row.createCell(col++);
					// eRequestDate.setCellValue(format.format(task
					// .getRequestDate()));
					eRequestDate.setCellValue(task.getRequestDate());
					eRequestDate.setCellStyle(dateStyle);
				} else {
					col++;
				}
				if (task.getTargetdate() != null) {
					Cell eTargetDate = row.createCell(col++);
					// eTargetDate.setCellValue(format.format(task.getTargetdate()));
					eTargetDate.setCellValue(task.getTargetdate());
					eTargetDate.setCellStyle(dateStyle);
				} else {
					col++;
				}
				if (task.getPlanCompletedDate() != null) {
					Cell ePlanDate = row.createCell(col++);
					// ePlanDate.setCellValue(format.format(task
					// .getPlanCompletedDate()));
					ePlanDate.setCellValue(task.getPlanCompletedDate());
					ePlanDate.setCellStyle(dateStyle);
				} else {
					col++;
				}
				if (task.getActualCompletedDate() != null) {
					Cell eActualDate = row.createCell(col++);
					// eActualDate.setCellValue(format.format(task
					// .getActualCompletedDate()));
					eActualDate.setCellValue(task.getActualCompletedDate());
					eActualDate.setCellStyle(dateStyle);
				} else {
					col++;
				}
				Cell ePriority = row.createCell(col++);
				ePriority.setCellValue(PriorityType
						.forValue(task.getPriority()).getLabel());
				Cell eStatus = row.createCell(col++);
				eStatus.setCellValue(StatusType.forValue(task.getStatus())
						.getLabel());

				Cell eDepartment = row.createCell(col++);
				Organization org = OrganizationLocalServiceUtil
						.getOrganization(Long.valueOf(task.getDepartment()));
				eDepartment.setCellValue(org.getName());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public TaskService getTaskService() {
		return taskService;
	}

	public void setTaskService(TaskService taskService) {
		this.taskService = taskService;
	}

}
