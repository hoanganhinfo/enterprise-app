package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.SessionFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.AssyProductModel;
import tms.backend.service.AssyProductModelService;
import tms.utils.StatusType;

@Controller
public class AssyProductModelWS extends MultiActionController {
	@Autowired 
	private AssyProductModelService assyProductModelService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssyProductModel")
	public void saveAssyProductModel(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssyProductModel");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	   
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	   
	    AssyProductModel _assyProductModel = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductModelList");
			
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						_assyProductModel = assyProductModelService.findById(id);
					}else{
						_assyProductModel = new AssyProductModel();
					}
					String productName = String.valueOf(assetCategoryObj.get("product_model"));
					_assyProductModel.setProductModel(productName);
					
					String productModelName = String.valueOf(assetCategoryObj.get("product_model_name"));
					_assyProductModel.setProductModelName(productModelName);
					
					Object status = assetCategoryObj.get("status");
					boolean checkStatus = Boolean.valueOf(status.toString());
					
					
					if(checkStatus)
					{
						
						_assyProductModel.setStatus(StatusType.OPEN.getValue());
					}
					else
					{
						
						_assyProductModel.setStatus(StatusType.CLOSE.getValue());
					}
					
					
					Long productType = (Long) assetCategoryObj.get("product_type");
					_assyProductModel.setProductType(productType);
					
					String validateFnOnClent = String.valueOf(assetCategoryObj.get("validateFnOnClent"));
					_assyProductModel.setValidateFnOnClient(validateFnOnClent);
					String validateFnOnServer = String.valueOf(assetCategoryObj.get("validateFnOnServer"));
					_assyProductModel.setValidateFnOnServer(validateFnOnServer);
					
					Boolean allowDuplicate = (Boolean) assetCategoryObj.get("allowDuplicate");
					_assyProductModel.setAllowDuplicate(allowDuplicate);
					
					_assyProductModel = assyProductModelService.saveOrUpdate(_assyProductModel);
					
				}
			}else{
				
				JSONObject assetCategoryObj = (JSONObject)obj;
				Long id =  (Long) assetCategoryObj.get("id");
				
				if (id != null){
					_assyProductModel = assyProductModelService.findById(id);
					
				}else{
					_assyProductModel = new AssyProductModel();
				}
				
				String productName = String.valueOf(assetCategoryObj.get("product_model"));
				_assyProductModel.setProductModel(productName);
				
				String productModelName = String.valueOf(assetCategoryObj.get("product_model_name"));
				_assyProductModel.setProductModelName(productModelName);
				
				Object status = assetCategoryObj.get("status");
				boolean checkStatus = Boolean.valueOf(status.toString());
				
				if(checkStatus)
				{
					
					_assyProductModel.setStatus(Byte.parseByte("1"));
				}
				else
				{
					
					_assyProductModel.setStatus(Byte.parseByte("0"));
				}
				
				
				Long productType = (Long) assetCategoryObj.get("product_type");
				_assyProductModel.setProductType(productType);
				
				String validateFnOnClent = String.valueOf(assetCategoryObj.get("validateFnOnClent"));
				_assyProductModel.setValidateFnOnClient(validateFnOnClent);
				String validateFnOnServer = String.valueOf(assetCategoryObj.get("validateFnOnServer"));
				_assyProductModel.setValidateFnOnServer(validateFnOnServer);
				Boolean allowDuplicate = (Boolean) assetCategoryObj.get("allowDuplicate");
				_assyProductModel.setAllowDuplicate(allowDuplicate);
				
				_assyProductModel = assyProductModelService.saveOrUpdate(_assyProductModel);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", _assyProductModel.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - AssyProductModel");
	}

	@RequestMapping("/deleteAssyProductModel")
	public void deleteAssyProductModel(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssyProductModel");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductModelList");
			
				JSONObject moldObj = (JSONObject)obj;
				AssyProductModel AssyProductModel = new AssyProductModel();
				Long id =  (Long) moldObj.get("id");
				AssyProductModel = assyProductModelService.findById(id);
				assyProductModelService.delete(AssyProductModel);				
				
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssyProductModel");
	}

	

	@RequestMapping("/getAssyProductModelList")
	public void getAssyProductModelList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			List<AssyProductModel> list = assyProductModelService.getAll();
			Collections.sort(list);
			JSONObject jsonAssyProductModel;
			for (AssyProductModel _assPM : list) 
			{
				
				jsonAssyProductModel = new JSONObject();
				jsonAssyProductModel.put("id", _assPM.getId());
				jsonAssyProductModel.put("product_model", _assPM.getProductModel());
				jsonAssyProductModel.put("product_model_name", _assPM.getProductModelName());
				jsonAssyProductModel.put("status", _assPM.getStatus() == StatusType.OPEN.getValue() ? true : false);
				jsonAssyProductModel.put("product_type", _assPM.getProductType());
				jsonAssyProductModel.put("allowDuplicate", _assPM.getAllowDuplicate());
				jsonAssyProductModel.put("validateFnOnClent", _assPM.getValidateFnOnClient());
				jsonAssyProductModel.put("validateFnOnServer", _assPM.getValidateFnOnServer());
				
				
				array.add(jsonAssyProductModel);
			}
			obj.put("AssyProductModelList", array);
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

	@RequestMapping("/getAssyProductModelListByAPT")
	public void getAssyProductModelListByAPT(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		
		
		String product_type = request.getParameter("product_type");
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		map.put("productType",product_type);
		
		try {
			List<AssyProductModel> list = assyProductModelService.getByProperty(map, null, true, true);
			Collections.sort(list);
			JSONObject jsonAssyProductModel;
			for (AssyProductModel _assPM : list) 
			{
				
				jsonAssyProductModel = new JSONObject();
				jsonAssyProductModel.put("id", _assPM.getId());
				jsonAssyProductModel.put("product_model", _assPM.getProductModel());
				jsonAssyProductModel.put("product_model_name", _assPM.getProductModelName());
				jsonAssyProductModel.put("status", _assPM.getStatus() == StatusType.OPEN.getValue() ? true : false);
				jsonAssyProductModel.put("product_type", _assPM.getProductType());
				jsonAssyProductModel.put("validateFnOnClent", _assPM.getValidateFnOnClient());
				jsonAssyProductModel.put("validateFnOnServer", _assPM.getValidateFnOnServer());
				
				jsonAssyProductModel.put("allowDuplicate", _assPM.getAllowDuplicate());
				array.add(jsonAssyProductModel);
			}
			obj.put("AssyProductModelList", array);
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
