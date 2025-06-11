package tms.web.service;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SessionFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.Asset;
import tms.backend.domain.AssetHistory;
import tms.backend.domain.InjMold;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.backend.service.InjMoldService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

@Controller
public class InjMoldWS extends MultiActionController {
	@Autowired
	private InjMoldService injMoldService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveInjMold")
	public void saveInjMold(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveInjMold");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	   
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    InjMold mold= null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("InjMoldList");
			
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject moldObj = iter.next();
					
					Long id =  (Long) moldObj.get("id");
					if (id != null){
						mold = injMoldService.findById(id);
					}else{
						mold = new InjMold();
					}
					String projectName = (String) moldObj.get("projectName");
					mold.setProjectName(projectName);
					String moldCode = (String) moldObj.get("moldCode");
					mold.setMoldCode(moldCode);
					String productCode = (String) moldObj.get("productCode");
					mold.setProductCode(productCode);
					String productName = (String) moldObj.get("productName");
					mold.setProductName(productName);
					String color = (String) moldObj.get("color");
					mold.setColor(color);
					Integer cavity = (Integer) moldObj.get("cavity");
					mold.setCavity(cavity);
					mold = injMoldService.saveOrUpdate(mold);
					
				}
			}else{
				
				JSONObject moldObj = (JSONObject)obj;
				Long id =  (Long) moldObj.get("id");
				
				if (id != null){
					mold = injMoldService.findById(id);
					
				}else{
					mold = new InjMold();
					
					
				}
				
				//String.valueOf(assetCategoryObj.get("moldCode")) ;
				String projectName = (String) moldObj.get("projectName");
				mold.setProjectName(projectName);
				String moldCode = (String) moldObj.get("moldCode"); 
				mold.setMoldCode(moldCode);
				String productCode = (String) moldObj.get("productCode");
				mold.setProductCode(productCode);
				String productName = (String) moldObj.get("productName");
				mold.setProductName(productName);
				
				String color = (String) moldObj.get("color");
				mold.setColor(color);
				
				Integer cavity =  Integer.valueOf(String.valueOf(moldObj.get("cavity")));
				mold.setCavity(cavity);
				mold = injMoldService.saveOrUpdate(mold);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", mold.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveInjMold");
	}

	@RequestMapping("/deleteInjMold")
	public void deleteInjMold(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteInjMold");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("InjMoldList");
			
				JSONObject moldObj = (JSONObject)obj;
				InjMold mold = new InjMold();
				Long id =  (Long) moldObj.get("id");
				mold = injMoldService.findById(id);
				injMoldService.delete(mold);				
				
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteInjMold");
	}

	

	@RequestMapping("/getMoldList")
	public void getMoldList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			List<InjMold> list = injMoldService.getAll(); 
			
			JSONObject jsonInjMold;
			for (InjMold _injMold : list) 
			{
				
				jsonInjMold = new JSONObject();
				jsonInjMold.put("id", _injMold.getId());
				jsonInjMold.put("moldCode", _injMold.getMoldCode());
				jsonInjMold.put("productCode",_injMold.getProductCode());
				jsonInjMold.put("productName", _injMold.getProductName());
				jsonInjMold.put("color", _injMold.getColor());
				jsonInjMold.put("cavity", _injMold.getCavity());
				jsonInjMold.put("projectName", _injMold.getProjectName());
				
				
				//System.out.println("\n------------"+_injMold.getColor()+"-----------------\n");
				array.add(jsonInjMold);
			}
			obj.put("InjMoldList", array);
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
	
	
	@RequestMapping("/getMoldListByColor")
	public void getMoldListByColor(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		//System.out.println("\n--------------------begin now---------------------\n");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		
		String moldCode = request.getParameter("moldCode");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("moldCode",moldCode);
		
		//System.out.println("\n--------------------get color by id---------------------\n");
		try {
			List<InjMold> list = injMoldService.getByProperty(map, null, true, true);
			
			JSONObject jsonInjMold;
			for (InjMold _injMold : list) 
			{
				
				jsonInjMold = new JSONObject();
				jsonInjMold.put("id", _injMold.getId());
				jsonInjMold.put("moldCode", _injMold.getMoldCode());
				jsonInjMold.put("productCode",_injMold.getProductCode());
				jsonInjMold.put("productName", _injMold.getProductName());
				jsonInjMold.put("projectName", _injMold.getProjectName());
				jsonInjMold.put("color", _injMold.getColor());
				jsonInjMold.put("cavity", _injMold.getCavity());
				
				//System.out.println("\n------------"+_injMold.getColor()+"-----------------\n");
				array.add(jsonInjMold);
			}
			obj.put("InjMoldList", array);
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


	@RequestMapping("/getMoldListByColorAndMold")
	public void getMoldListByColorAndMold(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		//System.out.println("\n--------------------begin now 1---------------------\n");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String moldCode = request.getParameter("moldCode");
		String _color = request.getParameter("color");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("moldCode",moldCode);
		map.put("color",_color);
		//System.out.println("\n--------------------get color by id 1---------------------\n");
		try {
			List<InjMold> list = injMoldService.getByProperty(map, null, true, true);
			
			JSONObject jsonInjMold;
			for (InjMold _injMold : list) 
			{
				
				jsonInjMold = new JSONObject();
				jsonInjMold.put("id", _injMold.getId());
				jsonInjMold.put("moldCode", _injMold.getMoldCode());
				jsonInjMold.put("productCode",_injMold.getProductCode());
				jsonInjMold.put("productName", _injMold.getProductName());
				jsonInjMold.put("projectName", _injMold.getProjectName());
				jsonInjMold.put("color", _injMold.getColor());
				jsonInjMold.put("cavity", _injMold.getCavity());
				
				//System.out.println("\n------------"+_injMold.getColor()+"-----------------\n");
				array.add(jsonInjMold);
			}
			obj.put("InjMoldList", array);
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
	
}
