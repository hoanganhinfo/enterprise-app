package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.hibernate.SessionFactory;
import org.joda.time.Days;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.PmCalendar;
import tms.backend.domain.PmProject;
import tms.backend.domain.PmProjectTask;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.PmCalendarService;
import tms.backend.service.PmProjectService;
import tms.backend.service.PmProjectTaskService;
import tms.utils.CalendarUtil;
import tms.utils.ResourceUtil;
import tms.utils.StatusType;

@Controller
public class PmProjectTaskWS extends MultiActionController {
	@Autowired
	private PmProjectTaskService pmProjectTaskService;
	@Autowired
	private PmProjectService pmProjectService;
	@Autowired
	private AssetHistoryService assetHistoryService;
	@Autowired
	private PmCalendarService pmCalendarService;
	
	@Autowired
	private SessionFactory sessionFactory;
	public final static int ROOT = 0;

	@RequestMapping("/saveProjectTask")
	public void saveProjectTask(HttpServletRequest request,

	HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveProjectTask");
		response.setContentType("text/html; charset=UTF-8");
		String projectId = request.getParameter("projectId");
		StringBuilder sb = new StringBuilder();
		BufferedReader br = request.getReader();
		String str;
		while ((str = br.readLine()) != null) {
			sb.append(str);
		}
		PmProjectTask task = new PmProjectTask();
		Long taskId = null;
		try {
			JSONObject rootObj = (JSONObject) JSONValue.parse(sb.toString());
			Object obj = rootObj.get("taskTree");
			if (obj instanceof JSONArray) {
				JSONArray array = (JSONArray) obj;
				Iterator<JSONObject> iter = array.iterator();
				while (iter.hasNext()) {
					
					JSONObject taskObj = iter.next();
					
					taskId = (Long) taskObj.get("Id");
					if (taskId != null && taskId < 0){
						// update project data
						//taskId = Long.valueOf("-1");
						PmProject project =  pmProjectService.findById(taskId*-1);
						String taskName = (String) taskObj.get("Name");
						project.setName(taskName);
						String startDate = (String) taskObj.get("StartDate");
						DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss");
						project.setStartDate(CalendarUtil.startOfDay(formatter.parseDateTime(startDate).toDate()));
						String endDate = (String) taskObj.get("EndDate");
						project.setEndDate(CalendarUtil.endOfDay(formatter.parseDateTime(endDate).toDate()));
						pmProjectService.update(project);
						
						//update main calendar
						PmCalendar pmCalendar = pmCalendarService.getMaincalendarByProjectId(project.getId());
						if (pmCalendar == null){
							pmCalendar = new PmCalendar();
							pmCalendar.setProjectId(project.getId());
							pmCalendar.setCalendarWeekday(Byte.parseByte("-1"));
							pmCalendar.setOverrideStartDate(project.getStartDate());
							pmCalendar.setOverrideEndDate(project.getEndDate());
							pmCalendar.setName("Main calendar");
							pmCalendar.setType("WEEKDAYOVERRIDE");
						}else{
							pmCalendar.setOverrideStartDate(project.getStartDate());
							pmCalendar.setOverrideEndDate(project.getEndDate());
						}
						
						pmCalendarService.saveOrUpdate(pmCalendar);

					}else{
						if (taskId == null) {
							task = new PmProjectTask();
						}else{
							task = pmProjectTaskService.findById(taskId);
						}
						String taskName = (String) taskObj.get("Name");
						task.setProjectTask(taskName);
						Long parentId = (Long) taskObj.get("parentId");
						task.setParentTaskId(parentId);
						task.setProjectId(1);
						String startDate = (String) taskObj.get("StartDate");
						DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss");
						task.setStartDate(CalendarUtil.startOfDay(formatter.parseDateTime(startDate).toDate()));
						String endDate = (String) taskObj.get("EndDate");
						task.setEndDate(CalendarUtil.endOfDay(formatter.parseDateTime(endDate).toDate()));
						// taskName.setStatus(Room.getEnumStatus(Integer.parseInt(status)));
						Boolean leaf = (Boolean) taskObj.get("leaf");
						if (leaf == true){
							task.setLeaf(new Byte("1"));
						}else{
							task.setLeaf(new Byte("0"));
						}
						Long PercentDone = (Long) taskObj.get("PercentDone");
						if (PercentDone != null){
							task.setCompletedPercent(PercentDone.byteValue());
						}else{
							task.setCompletedPercent(Byte.parseByte("0"));
						}
						task = pmProjectTaskService.saveOrUpdate(task);
						taskId = task.getId();
					}
				}
			} else {
				JSONObject taskObj = (JSONObject) obj;
				taskId = (Long) taskObj.get("Id");
				if (taskId != null && taskId < 0){
					// update project data
					PmProject project =  pmProjectService.findById(taskId*-1);
					String taskName = (String) taskObj.get("Name");
					project.setName(taskName);
					String startDate = (String) taskObj.get("StartDate");
					DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss");
					project.setStartDate(CalendarUtil.startOfDay(formatter.parseDateTime(startDate).toDate()));
					String endDate = (String) taskObj.get("EndDate");
					project.setEndDate(CalendarUtil.endOfDay(formatter.parseDateTime(endDate).toDate()));
					pmProjectService.update(project);
					//update main calendar
					PmCalendar pmCalendar = pmCalendarService.getMaincalendarByProjectId(project.getId());
					if (pmCalendar == null){
						pmCalendar = new PmCalendar();
						pmCalendar.setProjectId(project.getId());
						pmCalendar.setCalendarWeekday(Byte.parseByte("-1"));
						pmCalendar.setOverrideStartDate(project.getStartDate());
						pmCalendar.setOverrideEndDate(project.getEndDate());
						pmCalendar.setName("Main calendar");
						pmCalendar.setType("WEEKDAYOVERRIDE");
					}else{
						pmCalendar.setOverrideStartDate(project.getStartDate());
						pmCalendar.setOverrideEndDate(project.getEndDate());
					}
					
					pmCalendarService.saveOrUpdate(pmCalendar);
				}else{
					if (taskId == null) {
						task = new PmProjectTask();
					}else{
						task = pmProjectTaskService.findById(taskId);
					}
					String taskName = (String) taskObj.get("Name");
					task.setProjectTask(taskName);
					Long parentId = (Long) taskObj.get("parentId");
					task.setParentTaskId(parentId);
					task.setProjectId(1);
					// if (!parentId.equals(ROOT)){
					// room.setBlockid(Long.valueOf(parentId));
					// }
					//String status = (String) taskObj.get("Status");
					DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss");
					String startDate = (String) taskObj.get("StartDate");
					task.setStartDate(CalendarUtil.startOfDay(formatter.parseDateTime(startDate).toDate()));
					String endDate = (String) taskObj.get("EndDate");
					task.setEndDate(CalendarUtil.endOfDay(formatter.parseDateTime(endDate).toDate()));
					// taskName.setStatus(Room.getEnumStatus(Integer.parseInt(status)));
					Boolean leaf = (Boolean) taskObj.get("leaf");
					if (leaf == true){
						task.setLeaf(new Byte("1"));
					}else{
						task.setLeaf(new Byte("0"));
					}
					Long PercentDone = (Long) taskObj.get("PercentDone");
					if (PercentDone != null){
						task.setCompletedPercent(PercentDone.byteValue());
					}else{
						task.setCompletedPercent(Byte.parseByte("0"));
					}
					task = pmProjectTaskService.saveOrUpdate(task);
					taskId = task.getId();
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", taskId);
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("VFM : END METHOD - saveProjectTask");
	}

	@RequestMapping("/deleteProjectTask")
	public void deleteProjectTask(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteProjectTask");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
		BufferedReader br = request.getReader();
		String str;
		while ((str = br.readLine()) != null) {
			sb.append(str);
		}
		try {
			JSONObject rootObj = (JSONObject) JSONValue.parse(sb.toString());
			Object obj = rootObj.get("taskTree");

			JSONObject taskObj = (JSONObject) obj;
			Long id = (Long) taskObj.get("Id");
			PmProjectTask task = pmProjectTaskService.findById(id);
			pmProjectTaskService.delete(task);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", "-1");
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("VFM : END METHOD - deleteProjectTask");
	}

	@RequestMapping("/getTaskTree")
	public void getTaskTree(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - getTaskTree");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();

		JSONObject rootTree = new JSONObject();
		String projectId = request.getParameter("projectId");
		String node = request.getParameter("node");
		
		//String projectId="-1";
		//JSONArray taskArray = writeTask(Long.valueOf(projectId));
		List<PmProjectTask> taskList = null;
		long parentId;
		JSONArray taskArray = new JSONArray();
		JSONObject jsonTask = null;
		if (StringUtils.isBlank(node)){
			if (NumberUtils.isNumber(projectId)){
				Calendar cal = Calendar.getInstance();
				cal.set(2013, Calendar.JANUARY, 01, 0, 0, 0);
				taskList =	pmProjectTaskService.getByParentId(Long.valueOf(projectId));
				PmProject project = pmProjectService.findById(Long.valueOf(projectId));
				parentId = Long.valueOf(projectId);
				jsonTask = new JSONObject();
				jsonTask.put("Id", project.getId()*-1);
				jsonTask.put("Name", project.getName());
				cal.set(2013, 0, 01, 0, 0, 0);
				jsonTask.put("StartDate", CalendarUtil.dateToString(
						project.getStartDate(), ResourceUtil.isoDateFormat));
				cal.set(2013, Calendar.FEBRUARY, 26, 23, 59, 59);
				jsonTask.put("EndDate", CalendarUtil.dateToString(
						project.getEndDate(), ResourceUtil.isoDateFormat));
				jsonTask.put("expanded",true);
				jsonTask.put("leaf",false);
				taskArray.add(jsonTask);
			}
		}else{
			 taskList =	pmProjectTaskService.getByParentId(Long.valueOf(node));
			 parentId = Long.valueOf(node);
			 for (PmProjectTask task : taskList) {
				 	jsonTask = new JSONObject();
					jsonTask.put("Id", task.getId());
					jsonTask.put("Name", task.getProjectTask());
					jsonTask.put("StartDate", CalendarUtil.dateToString(
							task.getStartDate(), ResourceUtil.isoDateFormat));
					jsonTask.put("EndDate",
							CalendarUtil.dateToString(task.getEndDate(), ResourceUtil.isoDateFormat));
					jsonTask.put("parentId",parentId);
					jsonTask.put("leaf",task.getLeaf().intValue() == 1?true:false);
					if (task.getLeaf().intValue() == 1){
						jsonTask.put("expanded",false);
					}else{
						jsonTask.put("expanded",true);
					}
					int durationDays = 0;
					if (task.getDuration() != null){
						durationDays = task.getDuration();
					}else{
						durationDays = Days.daysBetween(new LocalDate(task.getStartDate()),new LocalDate(task.getEndDate())).getDays(); 
					}
					jsonTask.put("Duration",durationDays);
					Calendar cal = Calendar.getInstance();
					Date today = CalendarUtil.startOfDay(cal.getTime());
					//int PercentDone = 0;
					int percentDone = task.getCompletedPercent()==null?0:task.getCompletedPercent();
					if (percentDone == 100){
						jsonTask.put("Status",StatusType.COMPLETED.getLabel());
					}else{
						if (task.getStartDate().compareTo(today) > 0){
							jsonTask.put("Status",StatusType.OPEN.getLabel());
						}else if(task.getStartDate().compareTo(today) ==0){
							jsonTask.put("Status",StatusType.ON_SCHEDULE.getLabel());
						}else{
							int spentDays = Days.daysBetween(new LocalDate(task.getStartDate()),new LocalDate(today.getTime())).getDays();
							double finishedPercent = (spentDays*100)/durationDays;
							if (finishedPercent> 100){
								finishedPercent = 100;
							}
							if (percentDone < finishedPercent ){
								jsonTask.put("Status",StatusType.LATE.getLabel());
							}else{
								jsonTask.put("Status",StatusType.ON_SCHEDULE.getLabel());
							}
							
						}
					}
					jsonTask.put("PercentDone",percentDone);
					jsonTask.put("parentId",parentId);
					taskArray.add(jsonTask);
			 }
		}
		
		
		obj.put("taskTree", taskArray);
		obj.put("message", 0);
		obj.put("success", true);

		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - getTaskTree");
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
			jsonTask.put("TempDate",
					CalendarUtil.dateToString(task.getEndDate(), "yyyy-MM-dd"));			
			jsonTask.put("children",
					writeTask(task.getId()));
			jsonTask.put("expanded",false);
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
