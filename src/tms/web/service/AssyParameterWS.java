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
import tms.backend.domain.AssyParameter;
import tms.backend.domain.AssyParameter;
import tms.backend.domain.InjMold;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.backend.service.AssyParameterService;
import tms.backend.service.InjMoldService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

@Controller
public class AssyParameterWS extends MultiActionController {
	@Autowired 
	private AssyParameterService assyParameterService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssyParameter")
	public void saveAssyParameter(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssyParameter");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	   
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    AssyParameter _assyParameter = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyParameterList");
			
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						_assyParameter = assyParameterService.findById(id);
					}else{
						_assyParameter = new AssyParameter();
					}
					
					String parameter_code = (String) assetCategoryObj.get("parameter_code");
					_assyParameter.setParameterCode(parameter_code);
					
					String parameter_name = (String) assetCategoryObj.get("parameter_name");
					_assyParameter.setParameterName(parameter_name);
					String parameter_value = (String) assetCategoryObj.get("parameter_value");
					_assyParameter.setParameterValue(parameter_value);
					String validateUrl = (String) assetCategoryObj.get("validateUrl");
					_assyParameter.setValidateUrl(validateUrl);
					
					
					Long parameter_size = (Long) assetCategoryObj.get("parameter_size");
					_assyParameter.setParameterSize(parameter_size.intValue());
					Long parameter_colspan = (Long) assetCategoryObj.get("parameter_colspan");
					_assyParameter.setParameterColspan(parameter_colspan.intValue());
					Long parameter_width = (Long) assetCategoryObj.get("parameter_width");
					_assyParameter.setParameterWidth(parameter_width.intValue());
					Boolean active = (Boolean) assetCategoryObj.get("negative_value");
					if (active.booleanValue()){
						_assyParameter.setNegativeValue(new Byte("1"));
					}else{
						_assyParameter.setNegativeValue(new Byte("0"));
					}
					
					_assyParameter = assyParameterService.saveOrUpdate(_assyParameter);
					
				}
			}else{
				
				JSONObject assetCategoryObj = (JSONObject)obj;
				Long id =  (Long) assetCategoryObj.get("id");
				
				if (id != null){
					_assyParameter = assyParameterService.findById(id);
					
				}else{
					_assyParameter = new AssyParameter();
				}
				String parameter_code = (String) assetCategoryObj.get("parameter_code");
				_assyParameter.setParameterCode(parameter_code);
				
				String parameter_name = (String) assetCategoryObj.get("parameter_name");
				_assyParameter.setParameterName(parameter_name); 
				String parameter_value = (String) assetCategoryObj.get("parameter_value");
				_assyParameter.setParameterValue(parameter_value);
				String validateUrl = (String) assetCategoryObj.get("validateUrl");
				_assyParameter.setValidateUrl(validateUrl);
				
				Long parameter_size = (Long) assetCategoryObj.get("parameter_size");
				_assyParameter.setParameterSize(parameter_size.intValue());
				Long parameter_colspan = (Long) assetCategoryObj.get("parameter_colspan");
				_assyParameter.setParameterColspan(parameter_colspan.intValue());
				Long parameter_width = (Long) assetCategoryObj.get("parameter_width");
				_assyParameter.setParameterWidth(parameter_width.intValue());
				Boolean active = (Boolean) assetCategoryObj.get("negative_value");
				if (active.booleanValue()){
					_assyParameter.setNegativeValue(new Byte("1"));
				}else{
					_assyParameter.setNegativeValue(new Byte("0"));
				}
				
				_assyParameter = assyParameterService.saveOrUpdate(_assyParameter);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", _assyParameter.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - AssyParameter");
	}

	@RequestMapping("/deleteAssyParameter")
	public void deleteAssyParameter(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssyParameter");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyParameterList");
			
				JSONObject moldObj = (JSONObject)obj;
				AssyParameter assyParameter = new AssyParameter();
				Long id =  (Long) moldObj.get("id");
				assyParameter = assyParameterService.findById(id);
				assyParameterService.delete(assyParameter);				
				
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssyParameter");
	}

	

	@RequestMapping("/getAssyParameterList")
	public void getAssyParameterList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			
			List<AssyParameter> list = assyParameterService.getAll();
			
			JSONObject jsonAssyParameter;
			for (AssyParameter _assP : list) 
			{
				
				jsonAssyParameter = new JSONObject();
				jsonAssyParameter.put("id", _assP.getId());
				jsonAssyParameter.put("parameter_code", _assP.getParameterCode());
				jsonAssyParameter.put("parameter_name", _assP.getParameterName());
				jsonAssyParameter.put("parameter_size", _assP.getParameterSize());
				jsonAssyParameter.put("parameter_colspan", _assP.getParameterColspan());
				jsonAssyParameter.put("parameter_width", _assP.getParameterWidth());
				jsonAssyParameter.put("parameter_value", _assP.getParameterValue());
				jsonAssyParameter.put("negative_value", _assP.getNegativeValue().intValue()==1?true:false);
				jsonAssyParameter.put("validateUrl", _assP.getValidateUrl());
				
				
				array.add(jsonAssyParameter);
				
			}
			
			obj.put("AssyParameterList", array);
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
