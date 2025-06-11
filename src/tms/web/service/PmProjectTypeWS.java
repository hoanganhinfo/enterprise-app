package tms.web.service;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.PmProjectType;
import tms.backend.service.PmProjectTypeService;
import tms.utils.StatusType;

@Controller
public class PmProjectTypeWS extends MultiActionController {
	
	@Autowired
	private PmProjectTypeService pmProjectTypeService;
	
	
	
	@RequestMapping("/getProjectTypeList")
	public void getProjectTypeList(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		
		try {
				List<PmProjectType> list = pmProjectTypeService.getAll();
				
				JSONObject jsonCategory; 
				
				
				for	(PmProjectType _pmProjectType: list)
				{
					jsonCategory = new JSONObject();
					jsonCategory.put("id", _pmProjectType.getId());
					jsonCategory.put("name", _pmProjectType.getName());
					jsonCategory.put("status", _pmProjectType.getStatus() == StatusType.OPEN.getValue()?true:false);
					array.add(jsonCategory);
				}
				
				obj.put("PmProjectTypeList", array);// root---
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
	@RequestMapping("/getActiveProjectTypeList")
	public void getActiveProjectTypeList(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		
		try {
				List<PmProjectType> list = pmProjectTypeService.getActiveProjectTypes();
				
				JSONObject jsonCategory; 
				
				
				for	(PmProjectType _pmProjectType: list)
				{
					jsonCategory = new JSONObject();
					jsonCategory.put("id", _pmProjectType.getId());
					jsonCategory.put("name", _pmProjectType.getName());
					jsonCategory.put("status", _pmProjectType.getStatus() == StatusType.OPEN.getValue()?true:false);
					array.add(jsonCategory);
				}
				
				obj.put("PmProjectTypeList", array);// root---
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
	
	@RequestMapping("/saveProjectType")
	public void saveProjectType(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - /saveProjectType");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null )
	    {
	        sb.append(str);
	    }   
	    PmProjectType itemProject = new PmProjectType();
	    try {
		    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
				Object obj =  rootObj.get("PmProjectTypeList");//--root
				System.out.println("---------------------BEGIN--------------------");
				if (obj instanceof JSONArray)
				{
					JSONArray array = (JSONArray)obj;
					Iterator<JSONObject>  iter = array.iterator();
					
					while(iter.hasNext())
					{
						JSONObject projectTypeObj = iter.next();
						itemProject = new PmProjectType();
						
						Long id = (Long)(projectTypeObj.get("id"));
						
						if (id != null)
						{
							itemProject = pmProjectTypeService.findById(id);
						}
						
						String name = (String)projectTypeObj.get("name");
						itemProject.setName(name);
						
						
						
						Boolean active = (Boolean) projectTypeObj.get("status");
						if (active.booleanValue()){
							itemProject.setStatus(StatusType.OPEN.getValue());
						}else{
							itemProject.setStatus(StatusType.ONHOLD.getValue());
						}
					
						itemProject = pmProjectTypeService.saveOrUpdate(itemProject);
						
																		  
					}
				}
				else
				{
					
					JSONObject projectTypeObj = (JSONObject)obj;
					itemProject = new PmProjectType();
					
					Long id = (Long)(projectTypeObj.get("id"));
					if (id != null){
						itemProject = pmProjectTypeService.findById(id);
						}
					
					String name = (String)projectTypeObj.get("name");
					itemProject.setName(name);
					
					Boolean active = (Boolean) projectTypeObj.get("status");
					if (active.booleanValue()){
						itemProject.setStatus(StatusType.OPEN.getValue());
					}else{
						itemProject.setStatus(StatusType.ONHOLD.getValue());
					}
					
					itemProject = pmProjectTypeService.saveOrUpdate(itemProject);	
					
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
		logger.info("EWI : END METHOD - saveProjectType");
	}
	

	@RequestMapping("/deleteProjectType")
	public void deleteProjectType(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteProjectType");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
		    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
				Object obj =  rootObj.get("PmProjectTypeList");
				JSONObject motorObj = (JSONObject)obj;
				PmProjectType itemPm = new PmProjectType();
				Long id = Long.parseLong(motorObj.get("id").toString());
				itemPm = pmProjectTypeService.findById(id) ;
				pmProjectTypeService.delete(itemPm);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteProjectType");
	}
}
