package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.PmCalendar;
import tms.backend.domain.PmProject;
import tms.backend.service.PmCalendarService;
import tms.backend.service.PmProjectService;
import tms.backend.service.PmProjectTypeService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

@Controller
public class PmProjectWS extends MultiActionController {
	
	@Autowired
	private PmProjectService pmProjectService;
	@Autowired
	private PmProjectTypeService pmProjectTypeService;
	@Autowired
	private PmCalendarService pmCalendarService;
	
	@RequestMapping("/getProjectList")
	public void getProjectList(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String departmentId = request.getParameter("departmentId");
		String projectTypeId = request.getParameter("projectTypeId");
		String statusId = request.getParameter("statusId");
		Criterion cDepartment = null;
		if (StringUtils.isNotBlank(departmentId)
				&& !StringUtils.equals(departmentId, "0")) {
			cDepartment = Restrictions.eq("departmentId", Long.valueOf(departmentId));
		}
		Criterion cProjectType = null;
		if (StringUtils.isNotBlank(projectTypeId)
				&& !StringUtils.equals(projectTypeId, "0")) {
			cProjectType = Restrictions.eq("projectType", Byte.valueOf(projectTypeId));
		}
		Criterion cStatus = null;
		if (StringUtils.isNotBlank(statusId)
				&& !StringUtils.equals(statusId, "0")) {
			cStatus = Restrictions.eq("status", Byte.valueOf(statusId));
		}
		try {
				List<PmProject> list = pmProjectService.getByCriteria(cDepartment,cProjectType,cStatus);
				
				JSONObject jsonCategory; 
				for (PmProject _pmProject : list) 
				{
					jsonCategory = new JSONObject();
					jsonCategory.put("id", _pmProject.getId());
					jsonCategory.put("name", _pmProject.getName());
					jsonCategory.put("projectTypeId", _pmProject.getProjectType()==null?0: _pmProject.getProjectType());
					jsonCategory.put("projectType",_pmProject.getProjectType()==null?"":pmProjectTypeService.findById(Long.valueOf(_pmProject.getProjectType())).getName());
					jsonCategory.put("department_id", _pmProject.getDepartmentId()==null?0:_pmProject.getDepartmentId());
					jsonCategory.put("departmentName", _pmProject.getDepartmentName());
					jsonCategory.put("clientname", _pmProject.getClientname());
					jsonCategory.put("manager", _pmProject.getManager()==null?"":_pmProject.getManager());
					jsonCategory.put("start_date", CalendarUtil.dateToString(_pmProject.getStartDate()));
					jsonCategory.put("end_date", CalendarUtil.dateToString(_pmProject.getEndDate()));
					jsonCategory.put("status",StatusType.forValue(_pmProject.getStatus()).getLabel());
					array.add(jsonCategory);
				}
				
				obj.put("PmProjectList", array);// root---
				obj.put("message", 0);
				obj.put("success", true);
			} catch (Exception e) 
			{
				
				obj.put("message: ",1);
				obj.put("success", false);
				e.printStackTrace();
			}
				out.print(obj);
				out.flush();
	}
	
	@RequestMapping("/saveProject")
	public void saveProject(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - /saveProject");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null )
	    {
	        sb.append(str);
	    }   
	    PmProject itemProject = new PmProject();
	    try {
		    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
				Object obj =  rootObj.get("PmProjectList");//--root
				
				if (obj instanceof JSONArray){
					JSONArray array = (JSONArray)obj;
					Iterator<JSONObject>  iter = array.iterator();
					
					while(iter.hasNext()){
						JSONObject assetPMObj = iter.next();
						itemProject = new PmProject();
						
						Long id = (Long)(assetPMObj.get("id"));
						
						if (id != null)
						{
							itemProject = pmProjectService.findById(id);
						}else{
							itemProject.setStatus(StatusType.OPEN.getValue());
						}
						
						String name = (String)assetPMObj.get("name");
						itemProject.setName(name);
						Long str_projectType = (Long)assetPMObj.get("projectTypeId");
						if (str_projectType != null && str_projectType.intValue() > 0){
							itemProject.setProjectType(Byte.parseByte(str_projectType.toString()));
						}else{
							itemProject.setProjectType(null);
						}
						Long str_departmentID = (Long)(assetPMObj.get("department_id"));
						if (str_departmentID != null && str_departmentID.intValue() > 0){
							itemProject.setDepartmentId(str_departmentID);
						}else{
							itemProject.setDepartmentId(null);
						}
						
						String strDepartmentName =String.valueOf(assetPMObj.get("departmentName"));
						itemProject.setDepartmentName(strDepartmentName);

						String clientName = (String)assetPMObj.get("clientname");
						itemProject.setClientname(clientName);
						String str_manager = String.valueOf(assetPMObj.get("manager"));
						if (StringUtils.isNotBlank(str_manager)){
							//Integer manager = Integer.valueOf(str_manager);
							//itemProject.setManager(str_manager);
						}
						String str_startDate = String.valueOf(assetPMObj.get("start_date"));
						if (StringUtils.isNotBlank(str_startDate)){
							Date startDate  = CalendarUtil.stringToDate(str_startDate);
							itemProject.setStartDate(startDate);
						}
						
						String str_endDate = String.valueOf(assetPMObj.get("end_date"));
						if (StringUtils.isNotBlank(str_endDate)){
							Date endDate = CalendarUtil.stringToDate(str_endDate);
							itemProject.setEndDate(endDate);
						}
						
						
						
						itemProject = pmProjectService.saveOrUpdate(itemProject);
						PmCalendar pmCalendar = pmCalendarService.getMaincalendarByProjectId(itemProject.getId());
						if (pmCalendar == null){
							pmCalendar = new PmCalendar();
							pmCalendar.setProjectId(itemProject.getId());
							pmCalendar.setCalendarWeekday(Byte.parseByte("-1"));
							pmCalendar.setOverrideStartDate(itemProject.getStartDate());
							pmCalendar.setOverrideEndDate(itemProject.getEndDate());
							pmCalendar.setName("Main calendar");
							pmCalendar.setType("WEEKDAYOVERRIDE");
							pmCalendar.setIsWorkingDay(Byte.parseByte("1"));
						}else{
							pmCalendar.setOverrideStartDate(itemProject.getStartDate());
							pmCalendar.setOverrideEndDate(itemProject.getEndDate());
						}
						
						pmCalendarService.saveOrUpdate(pmCalendar);
					}
				}
				else
				{
					JSONObject assetPMObj = (JSONObject)obj;
					itemProject = new PmProject();
					
					Long id = (Long)(assetPMObj.get("id"));
					if (id != null){
						itemProject = pmProjectService.findById(id);
					}else{
						itemProject.setStatus(StatusType.OPEN.getValue());
					}
					
					String name = (String)assetPMObj.get("name");
					itemProject.setName(name);
					Long str_projectType = (Long)assetPMObj.get("projectTypeId");
					if (str_projectType != null && str_projectType.intValue() > 0){
						itemProject.setProjectType(Byte.parseByte(str_projectType.toString()));
					}else{
						itemProject.setProjectType(null);
					}
					Long str_departmentID = (Long)(assetPMObj.get("department_id"));
					if (str_departmentID != null  && str_departmentID.intValue() > 0){
						itemProject.setDepartmentId(str_departmentID);
					}else{
						itemProject.setDepartmentId(null);
					}
					String strDepartmentName = String.valueOf(assetPMObj.get("departmentName"));
					itemProject.setDepartmentName(strDepartmentName);
					
					String clientName = (String)assetPMObj.get("clientname");
					itemProject.setClientname(clientName);
					String str_manager = String.valueOf(assetPMObj.get("manager"));
					if (StringUtils.isNotBlank(str_manager)){
						//Integer manager = Integer.valueOf(str_manager);
						//itemProject.setManager(str_manager);
					}
					String str_startDate = String.valueOf(assetPMObj.get("start_date"));
					if (StringUtils.isNotBlank(str_startDate)){
						Date startDate  = CalendarUtil.stringToDate(str_startDate);
						itemProject.setStartDate(startDate);
					}
					
					String str_endDate = String.valueOf(assetPMObj.get("end_date"));
					if (StringUtils.isNotBlank(str_endDate)){
						Date endDate = CalendarUtil.stringToDate(str_endDate);
						itemProject.setEndDate(endDate);
					}
					
					
					itemProject = pmProjectService.saveOrUpdate(itemProject);
					PmCalendar pmCalendar = pmCalendarService.getMaincalendarByProjectId(itemProject.getId());
					if (pmCalendar == null){
						pmCalendar = new PmCalendar();
						pmCalendar.setProjectId(itemProject.getId());
						pmCalendar.setCalendarWeekday(Byte.parseByte("-1"));
						pmCalendar.setOverrideStartDate(itemProject.getStartDate());
						pmCalendar.setOverrideEndDate(itemProject.getEndDate());
						pmCalendar.setName("Main calendar");
						pmCalendar.setType("WEEKDAYOVERRIDE");
						pmCalendar.setIsWorkingDay(Byte.parseByte("1"));
					}else{
						pmCalendar.setOverrideStartDate(itemProject.getStartDate());
						pmCalendar.setOverrideEndDate(itemProject.getEndDate());
					}
					
					pmCalendarService.saveOrUpdate(pmCalendar);
				}
			}
	    	catch (Exception e) 
	    	{
			// TODO Auto-generated catch block
	    		e.printStackTrace();
	    	}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message",itemProject.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveProject");
	}

	@RequestMapping("/deleteProject")
	public void deleteProject(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteProject");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
		    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
				Object obj =  rootObj.get("PmProjectList");
				JSONObject motorObj = (JSONObject)obj;
				PmProject itemPm = new PmProject();
				Long id =  (Long) motorObj.get("id");
				itemPm = pmProjectService.findById(id) ;
				pmProjectService.delete(itemPm);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteProject");
	}
	@RequestMapping("/setStatusForProject")
	public void setStatusForProject(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - setStatusForProject");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    String statusCode = request.getParameter("statusCode");
	    String projectId =  (String) request.getParameter("projectId");
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
		    	PmProject itemPm = new PmProject();
				itemPm = pmProjectService.findById(Long.valueOf(projectId));
				itemPm.setStatus(Byte.valueOf(statusCode));
				pmProjectService.update(itemPm);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - setStatusForProject");
	}	
}
