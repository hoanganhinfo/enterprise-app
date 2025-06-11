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
import tms.backend.service.PmCalendarService;
import tms.backend.service.PmProjectService;
import tms.backend.service.PmProjectTypeService;
import tms.utils.CalendarUtil;

@Controller
public class PmCalendarWS extends MultiActionController {
	
	@Autowired
	private PmProjectService pmProjectService;
	@Autowired
	private PmProjectTypeService pmProjectTypeService;
	@Autowired
	private PmCalendarService pmCalendarService;
	
	@RequestMapping("/getCalendarByProject")
	public void getCalendarByProject(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String projectId = request.getParameter("projectId");
		Criterion cProject = null;
		if (StringUtils.isNotBlank(projectId)) {
			cProject = Restrictions.eq("projectId", Long.valueOf(projectId));
		}
	
		try {
				List<PmCalendar> list = pmCalendarService.getByCriteria(cProject);
				
				
				JSONObject jsonCalendar; 
				for (PmCalendar _pmCalendar : list) 
				{
					jsonCalendar = new JSONObject();
					jsonCalendar.put("Id", _pmCalendar.getId());
					jsonCalendar.put("Type", _pmCalendar.getType());
					jsonCalendar.put("Date", _pmCalendar.getCalendarDate());
					jsonCalendar.put("Weekday",_pmCalendar.getCalendarWeekday());
					jsonCalendar.put("OverrideStartDate", _pmCalendar.getOverrideStartDate());
					jsonCalendar.put("OverrideEndDate", _pmCalendar.getOverrideEndDate());
					jsonCalendar.put("Name", _pmCalendar.getName());
					jsonCalendar.put("IsWorkingDay", _pmCalendar.getIsWorkingDay().byteValue()==0?false:true);
					jsonCalendar.put("Availability", _pmCalendar.getAvailability());
					jsonCalendar.put("projectTypeId", _pmCalendar.getProjectId());
					array.add(jsonCalendar);
				}
				
				obj.put("PmCalendarList", array);// root---
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
	
	@RequestMapping("/saveCalendar")
	public void saveCalendar(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveCalendar");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null )
	    {
	        sb.append(str);
	    }   
	    PmCalendar pmCalendar = null;
	    try {
		    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
				Object obj =  rootObj.get("PmCalendarList");//--root
				
				if (obj instanceof JSONArray){
					JSONArray array = (JSONArray)obj;
					Iterator<JSONObject>  iter = array.iterator();
					
					while(iter.hasNext()){
						JSONObject pmCalendarObj = iter.next();
						
						
						Long id = (Long)(pmCalendarObj.get("Id"));
						
						if (id != null)
						{
							pmCalendar = pmCalendarService.findById(id);
						}else{
							pmCalendar = new PmCalendar();
						}
						
						String str_Type = (String)(pmCalendarObj.get("Type"));
						pmCalendar.setType(str_Type);
						
						String str_Date = String.valueOf(pmCalendarObj.get("Date"));
						if (StringUtils.isNotBlank(str_Date)){
							Date _date  = CalendarUtil.stringToDate(str_Date);
							pmCalendar.setCalendarDate(_date);
						}
						Long str_Weekday = (Long)(pmCalendarObj.get("Weekday"));
						if (str_Weekday != null){
							pmCalendar.setCalendarWeekday(Byte.parseByte(str_Weekday.toString()));
						}
						
						String str_OverrideStartDate = String.valueOf(pmCalendarObj.get("OverrideStartDate"));
						if (StringUtils.isNotBlank(str_OverrideStartDate)){
							Date overrideStartDate  = CalendarUtil.stringToDate(str_OverrideStartDate);
							pmCalendar.setOverrideStartDate(overrideStartDate);
						}
						
						String str_OverrideEndDate = String.valueOf(pmCalendarObj.get("OverrideEndDate"));
						if (StringUtils.isNotBlank(str_OverrideEndDate)){
							Date overrideEndDate  = CalendarUtil.stringToDate(str_OverrideEndDate);
							pmCalendar.setOverrideEndDate(overrideEndDate);
						}						
						
						String name = (String)pmCalendarObj.get("Name");
						pmCalendar.setName(name);
						
						Boolean isWorkingDay =(Boolean)pmCalendarObj.get("IsWorkingDay");
						pmCalendar.setIsWorkingDay(isWorkingDay==true?Byte.parseByte("1"):Byte.parseByte("0"));

						String availability = (String)pmCalendarObj.get("Availability");
						pmCalendar.setAvailability(availability);
						
						Long projectTypeId = (Long)pmCalendarObj.get("projectTypeId");
						if (projectTypeId != null){
							pmCalendar.setProjectId(projectTypeId);
						}
						
						pmCalendar = pmCalendarService.saveOrUpdate(pmCalendar);
						
					}
				}
				else
				{
					JSONObject pmCalendarObj = (JSONObject)obj;
					
					
					Long id = (Long)(pmCalendarObj.get("Id"));
					
					if (id != null)
					{
						pmCalendar = pmCalendarService.findById(id);
					}else{
						pmCalendar = new PmCalendar();
					}
					
					String str_Type = (String)(pmCalendarObj.get("Type"));
					pmCalendar.setType(str_Type);
					
					String str_Date = String.valueOf(pmCalendarObj.get("Date"));
					if (StringUtils.isNotBlank(str_Date)){
						Date _date  = CalendarUtil.stringToDate(str_Date);
						pmCalendar.setCalendarDate(_date);
					}
					Long str_Weekday = (Long)(pmCalendarObj.get("Weekday"));
					if (str_Weekday != null){
						pmCalendar.setCalendarWeekday(Byte.parseByte(str_Weekday.toString()));
					}
					
					String str_OverrideStartDate = String.valueOf(pmCalendarObj.get("OverrideStartDate"));
					if (StringUtils.isNotBlank(str_OverrideStartDate)){
						Date overrideStartDate  = CalendarUtil.stringToDate(str_OverrideStartDate);
						pmCalendar.setOverrideStartDate(overrideStartDate);
					}
					
					String str_OverrideEndDate = String.valueOf(pmCalendarObj.get("OverrideEndDate"));
					if (StringUtils.isNotBlank(str_OverrideEndDate)){
						Date overrideEndDate  = CalendarUtil.stringToDate(str_OverrideEndDate);
						pmCalendar.setOverrideEndDate(overrideEndDate);
					}						
					
					String name = (String)pmCalendarObj.get("Name");
					pmCalendar.setName(name);
					
					Boolean isWorkingDay =(Boolean)pmCalendarObj.get("IsWorkingDay");
					pmCalendar.setIsWorkingDay(isWorkingDay==true?Byte.parseByte("1"):Byte.parseByte("0"));

					String availability = (String)pmCalendarObj.get("Availability");
					pmCalendar.setAvailability(availability);
					
					Long projectTypeId = (Long)pmCalendarObj.get("projectTypeId");
					if (projectTypeId != null){
						pmCalendar.setProjectId(projectTypeId);
					}
					
					pmCalendar = pmCalendarService.saveOrUpdate(pmCalendar);
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
		obj.put("message",pmCalendar.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveCalendar");
	}

	@RequestMapping("/deleteCalendar")
	public void deleteCalendar(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteCalendar");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
		    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
				Object obj =  rootObj.get("PmCalendarList");
				JSONObject motorObj = (JSONObject)obj;
				PmCalendar itemPm = new PmCalendar();
				Long id =  (Long) motorObj.get("Id");
				itemPm = pmCalendarService.findById(id) ;
				pmCalendarService.delete(itemPm);
			
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

	public PmCalendarService getPmCalendarService() {
		return pmCalendarService;
	}

	public void setPmCalendarService(PmCalendarService pmCalendarService) {
		this.pmCalendarService = pmCalendarService;
	}	
}
