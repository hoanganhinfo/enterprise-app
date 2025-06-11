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
import org.hibernate.SessionFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import com.liferay.portal.kernel.util.Converter;
import com.liferay.portlet.asset.model.AssetCategory;

import tms.backend.domain.Asset;
import tms.backend.domain.PmProject;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.backend.service.PmProjectService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

public class Pm extends MultiActionController
{
	@Autowired
	private PmProjectService pmProjectService;
	
	
	@RequestMapping("/getDemoPMProject")
	public void getDemoPMProject(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		
		try {
				List<PmProject> list = pmProjectService.getAll();
				
				JSONObject jsonCategory; 
				for (PmProject _pmProject : list) 
				{
					jsonCategory = new JSONObject();
					jsonCategory.put("id", _pmProject.getId());
					jsonCategory.put("name", _pmProject.getName());
					jsonCategory.put("project_type", _pmProject.getProjectType());
					jsonCategory.put("department_id", _pmProject.getDepartmentId());
					jsonCategory.put("clientname", _pmProject.getClientname());
					jsonCategory.put("manager", _pmProject.getManager());
					jsonCategory.put("start_date", CalendarUtil.dateToString(_pmProject.getStartDate()));
					jsonCategory.put("end_date", CalendarUtil.dateToString(_pmProject.getEndDate()));
					jsonCategory.put("status",_pmProject.getStatus());
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
	
	@RequestMapping("/saveDemoPMProject")
	public void saveDemoPMProject(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveDemoPMProject");
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
				//System.out.println("---------------------try--------------------");
				if (obj instanceof JSONArray)
				{System.out.println("---------------------add--------------------");
					JSONArray array = (JSONArray)obj;
					Iterator<JSONObject>  iter = array.iterator();
					
					while(iter.hasNext())
					{System.out.println("---------------------while--------------------");
						JSONObject assetPMObj = iter.next();
						itemProject = new PmProject();
						
						Long id = (Long)(assetPMObj.get("id"));
						
						if (id != null)
						{
							itemProject = pmProjectService.findById(id);
						}
						
						String name = (String)assetPMObj.get("name");
						itemProject.setName(name);
						
						
						
						String str_projectType = String.valueOf(assetPMObj.get("project_type"));
						Byte projectType = Byte.valueOf(str_projectType);
						itemProject.setProjectType(projectType);
					
						
						
						String str_departmentID = String.valueOf(assetPMObj.get("department_id"));
						Long departmentID = Long.parseLong(str_departmentID);
						itemProject.setDepartmentId(departmentID);
						
						
						
						String clientName = (String)assetPMObj.get("clientname");
						itemProject.setClientname(clientName);
						
						
						
						
						String str_manager = String.valueOf(assetPMObj.get("manager"));
						Integer manager = Integer.valueOf(str_manager);
						itemProject.setManager(manager);
						
						
						
						String str_startDate = String.valueOf(assetPMObj.get("start_date"));
						Date startDate  = CalendarUtil.stringToDate(str_startDate);
						itemProject.setStartDate(startDate);
						
						
						
						String str_endDate = String.valueOf(assetPMObj.get("end_date"));
						Date endDate = CalendarUtil.stringToDate(str_endDate);
						itemProject.setEndDate(endDate);
						
						
						
						String str_status = String.valueOf(assetPMObj.get("status"));
						Byte status = Byte.valueOf(str_status);
						itemProject.setStatus(status);
						
						itemProject = pmProjectService.saveOrUpdate(itemProject);
						
																		  
					}
				}
				else
				{
					
					JSONObject assetPMObj = (JSONObject)obj;
					itemProject = new PmProject();
					
					Long id = (Long)(assetPMObj.get("id"));
						System.out.println("---------------------id 1--------------------");
					if (id != null){
						itemProject = pmProjectService.findById(id);
						}
					
					
					
					
					String name = (String)assetPMObj.get("name");
					itemProject.setName(name);
					
					System.out.println("---------------------name-------("+name+")-------------");
					
					String str_projectType = String.valueOf(assetPMObj.get("project_type"));
					Byte projectType = Byte.valueOf(str_projectType);
					itemProject.setProjectType(projectType);
				
					System.out.println("---------------------project_type-------("+projectType+")-------------");
					
					String str_departmentID = String.valueOf(assetPMObj.get("department_id"));
					Long departmentID = Long.parseLong(str_departmentID);
					itemProject.setDepartmentId(departmentID);
					System.out.println("---------------------department_id--------("+departmentID+")------------");
					
					
					String clientName = (String)assetPMObj.get("clientname");
					itemProject.setClientname(clientName);
					
					System.out.println("---------------------clientname-------("+clientName+")-------------");
					
					
					String str_manager = String.valueOf(assetPMObj.get("manager"));
					Integer manager = Integer.valueOf(str_manager);
					itemProject.setManager(manager);
					
					System.out.println("---------------------manager-------("+manager+")-------------");
					
					String str_startDate = String.valueOf(assetPMObj.get("start_date"));
					Date startDate  = CalendarUtil.stringToDate(str_startDate);
					itemProject.setStartDate(startDate);
					
					System.out.println("---------------------start_date--------("+startDate+")------------");
					
					String str_endDate = String.valueOf(assetPMObj.get("end_date"));
					Date endDate = CalendarUtil.stringToDate(str_endDate);
					itemProject.setEndDate(endDate);
					
					System.out.println("---------------------end_date-----("+endDate+")---------------");
					
					String str_status = String.valueOf(assetPMObj.get("status"));
					Byte status = Byte.valueOf(str_status);
					itemProject.setStatus(status);
					System.out.println("---------------------status-------("+status+")------------");
					
					
					itemProject = pmProjectService.saveOrUpdate(itemProject);	
					
					System.out.println("---------------------FINISH--------------------");
				}
			}
	    	catch (Exception e) 
	    	{
			// TODO Auto-generated catch block
	    		System.out.println("-----error------------------"+e.getMessage()+"------------------");
	    		e.printStackTrace();
	    	}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message",itemProject.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveDemoPMProject");
	}

	@RequestMapping("/deleteDemoPMProject")
	public void deleteDemoPMProject(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteDemoPMProject");
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
				System.out.println("-------------get root--------------------");
				JSONObject motorObj = (JSONObject)obj;
				PmProject itemPm = new PmProject();
				Long id =  (Long) motorObj.get("id");
				System.out.println("-------------get id--------------------");
				itemPm = pmProjectService.findById(id) ;
				System.out.println("-------------find id--------------------");
				pmProjectService.delete(itemPm);
				System.out.println("-------------deleted --------------------");
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("------DELETE ERROR:----"+e.getMessage());
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteDemoPMProject");
	}

}
