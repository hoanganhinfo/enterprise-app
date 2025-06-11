package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collections;
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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.AssyProductType;
import tms.backend.service.AssyProductTypeService;

@Controller
public class AssyProductTypeWS extends MultiActionController {
	@Autowired
	private AssyProductTypeService assyProductTypeService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssyProductType")
	public void saveAssyProductType(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssyProductType");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	   
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    AssyProductType _assyProductType = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductTypeList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						_assyProductType = assyProductTypeService.findById(id);
					}else{
						_assyProductType = new AssyProductType();
					}
					String productType = (String) assetCategoryObj.get("product_type");
					_assyProductType.setProductTypeCode(productType);
					String productTypeName = (String) assetCategoryObj.get("product_type_name");
					_assyProductType.setProductTypeName(productTypeName);
					String prefixFunction = (String) assetCategoryObj.get("prefix_function");
					_assyProductType.setPrefixFunction(prefixFunction);
					String padding = (String) assetCategoryObj.get("padding");
					_assyProductType.setPadding(padding);
					if (StringUtils.isNotBlank(assetCategoryObj.get("serial_size").toString())){
						Long serialSize = (Long) assetCategoryObj.get("serial_size");
						_assyProductType.setSerialSize(serialSize.intValue());	
					}
					if (StringUtils.isNotBlank(assetCategoryObj.get("autoresult").toString())){
						Long autoresult = (Long) assetCategoryObj.get("autoresult");
						_assyProductType.setAutoresult(autoresult.byteValue());	
					}
					if (StringUtils.isNotBlank(assetCategoryObj.get("tester").toString())){
						Long tester = (Long) assetCategoryObj.get("tester");
						_assyProductType.setTester(tester.byteValue());	
					}
					String reportUrl = (String) assetCategoryObj.get("reportUrl");
					_assyProductType.setReportUrl(reportUrl);
					
					
					_assyProductType = assyProductTypeService.saveOrUpdate(_assyProductType);
					
				}
			}else{
				
				JSONObject assetCategoryObj = (JSONObject)obj;
				Long id =  (Long) assetCategoryObj.get("id");
				if (id != null){
					_assyProductType = assyProductTypeService.findById(id);
					
				}else{
					_assyProductType = new AssyProductType();
				}
				String productType = (String) assetCategoryObj.get("product_type");
				_assyProductType.setProductTypeCode(productType);
				String productTypeName = (String) assetCategoryObj.get("product_type_name");
				_assyProductType.setProductTypeName(productTypeName);
				String prefixFunction = (String) assetCategoryObj.get("prefix_function");
				_assyProductType.setPrefixFunction(prefixFunction);
				String padding = (String) assetCategoryObj.get("padding");
				_assyProductType.setPadding(padding);
				if (StringUtils.isNotBlank(assetCategoryObj.get("serial_size").toString())){
					Integer serialSize = Integer.parseInt(assetCategoryObj.get("serial_size").toString());
					_assyProductType.setSerialSize(serialSize.intValue());	
				}
				Boolean active = (Boolean) assetCategoryObj.get("autoresult");
				if (active.booleanValue()){
					_assyProductType.setAutoresult(new Byte("1"));
				}else{
					_assyProductType.setAutoresult(new Byte("0"));
				}
				if (StringUtils.isNotBlank(assetCategoryObj.get("tester").toString())){
					Long tester = (Long) assetCategoryObj.get("tester");
					_assyProductType.setTester(tester.byteValue());	
				}
				String reportUrl = (String) assetCategoryObj.get("reportUrl");
				_assyProductType.setReportUrl(reportUrl);
				_assyProductType = assyProductTypeService.saveOrUpdate(_assyProductType);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", _assyProductType.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - AssyProductType");
	}

	@RequestMapping("/deleteAssyProductType")
	public void deleteAssyProductType(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssyProductType");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductTypeList");
			
				JSONObject moldObj = (JSONObject)obj;
				AssyProductType assyProductType = new AssyProductType();
				Long id =  (Long) moldObj.get("id");
				assyProductType = assyProductTypeService.findById(id);
				assyProductTypeService.delete(assyProductType);				
				
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssyProductType");
	}

	

	@RequestMapping("/getAssyProductTypeList")
	public void getAssyProductTypeList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			List<AssyProductType> list = assyProductTypeService.getAll();
			Collections.sort(list);
			JSONObject jsonAssyProductType;
			for (AssyProductType _assPT : list) 
			{
				
				jsonAssyProductType = new JSONObject();
				jsonAssyProductType.put("id", _assPT.getId());
				jsonAssyProductType.put("product_type", _assPT.getProductTypeCode());
				jsonAssyProductType.put("product_type_name", _assPT.getProductTypeName());
				jsonAssyProductType.put("prefix_function", _assPT.getPrefixFunction());
				jsonAssyProductType.put("serial_size", _assPT.getSerialSize());
				jsonAssyProductType.put("padding", _assPT.getPadding());
				jsonAssyProductType.put("autoresult", _assPT.getAutoresult());
				jsonAssyProductType.put("tester", _assPT.getTester());
				
				jsonAssyProductType.put("reportUrl", _assPT.getReportUrl());
				
				array.add(jsonAssyProductType);
			}
			obj.put("AssyProductTypeList", array);
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
