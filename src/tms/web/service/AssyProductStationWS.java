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
import tms.backend.domain.AssyProductStation;
import tms.backend.domain.AssyProductType;
import tms.backend.domain.InjMold;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.backend.service.AssyParameterService;
import tms.backend.service.AssyProductStationService;
import tms.backend.service.AssyProductTypeService;
import tms.backend.service.InjMoldService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

@Controller
public class AssyProductStationWS extends MultiActionController {
	@Autowired
	private AssyProductStationService assyProductStationService;
	@Autowired
	private AssyParameterService assyParameterService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssyProductStation")
	public void saveAssyProductStation(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssyProductStation");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	   
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    AssyProductStation assyProductStation = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductStationList");
			
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						assyProductStation = assyProductStationService.findById(id);
					}else{
						assyProductStation = new AssyProductStation();
					}
					String station = (String) assetCategoryObj.get("station");
					assyProductStation.setStation(station);
					
					Long product_type = (Long) assetCategoryObj.get("product_type");
					assyProductStation.setProductType(product_type);
					
					Long step = (Long) assetCategoryObj.get("step");
					assyProductStation.setStep(step.intValue());
					
					String prerequisite = (String) assetCategoryObj.get("prerequisite");
					assyProductStation.setPrerequisite(prerequisite);
					
					String productParams = (String) assetCategoryObj.get("product_params");
					assyProductStation.setProductParams(productParams);
					
					String productDefects = (String) assetCategoryObj.get("product_defects");
					assyProductStation.setProductDefects(productDefects);

					
					assyProductStation = assyProductStationService.saveOrUpdate(assyProductStation);
					
				}
			}else{
				
				JSONObject assetCategoryObj = (JSONObject)obj;
				Long id =  (Long) assetCategoryObj.get("id");
				
				if (id != null){
					assyProductStation = assyProductStationService.findById(id);
				}else{
					assyProductStation = new AssyProductStation();
				}
				String station = (String) assetCategoryObj.get("station");
				assyProductStation.setStation(station);
				
				Long product_type = (Long) assetCategoryObj.get("product_type");
				assyProductStation.setProductType(product_type);
				
				Long step = (Long) assetCategoryObj.get("step");
				assyProductStation.setStep(step.intValue());
				
				String prerequisite = (String) assetCategoryObj.get("prerequisite");
				assyProductStation.setPrerequisite(prerequisite);
				
				String productParams = (String) assetCategoryObj.get("product_params");
				assyProductStation.setProductParams(productParams);
				
				String productDefects = (String) assetCategoryObj.get("product_defects");
				assyProductStation.setProductDefects(productDefects);
				
				assyProductStation = assyProductStationService.saveOrUpdate(assyProductStation);
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", assyProductStation.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveAssyProductStation");
	}

	@RequestMapping("/deleteAssyProductStation")
	public void deleteAssyProductStation(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssyProductStation");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductStationList");
			
				JSONObject moldObj = (JSONObject)obj;
				AssyProductStation assyProductStation = new AssyProductStation();
				Long id =  (Long) moldObj.get("id");
				assyProductStation = assyProductStationService.findById(id);
				assyProductStationService.delete(assyProductStation);				
				
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssyProductStation");
	}

	

	@RequestMapping("/getAssyProductStationList")
	public void getAssyProductStationList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String product_type = request.getParameter("productTypeId");
		
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<AssyParameter> paramList = assyParameterService.getAll();
		
		Map<String,AssyParameter> paramMap= new HashedMap();
		
		for(AssyParameter assyParameter: paramList){
			paramMap.put(assyParameter.getId().toString(), assyParameter);
		}
		
		map.put("productType",product_type);
		
		try {
			List<AssyProductStation> list = assyProductStationService.getByProperty(map, null, true, true);
			
			JSONObject jsonAssyProductType;
			for (AssyProductStation _assPT : list) 
			{
				
				jsonAssyProductType = new JSONObject();
				jsonAssyProductType.put("id", _assPT.getId());
				jsonAssyProductType.put("station", _assPT.getStation());
				
				jsonAssyProductType.put("product_type", _assPT.getProductType());
				
				jsonAssyProductType.put("product_params", _assPT.getProductParams());
				
				String product_params_name = "";
				String product_params_size = "";
				String product_params_colspan = "";
				String product_params_width = "";
				String product_params_value = "";
				String negative_value = "";
				if (StringUtils.isNotBlank(_assPT.getProductParams())){
					
					String[] params = _assPT.getProductParams().split(";");
					
					if(params.length > 0)
					{
						
						for(String s : params)
						{
							product_params_name+=paramMap.get(s).getParameterName()+";"; 
							product_params_size+=paramMap.get(s).getParameterSize()+";";
							product_params_colspan+=paramMap.get(s).getParameterColspan()+";";
							product_params_width +=paramMap.get(s).getParameterWidth()+";";
							product_params_value+=paramMap.get(s).getParameterValue()+";";
							negative_value +=paramMap.get(s).getNegativeValue()==1?"true;":"false;";
						}
					}
					
				}
				
				
				jsonAssyProductType.put("product_params_name", product_params_name);
				jsonAssyProductType.put("product_params_size", product_params_size);
				jsonAssyProductType.put("product_params_colspan", product_params_colspan);
				jsonAssyProductType.put("product_params_width", product_params_width);
				jsonAssyProductType.put("product_params_value", product_params_value);
				jsonAssyProductType.put("negative_value", negative_value);
				
				jsonAssyProductType.put("product_defects", _assPT.getProductDefects());
				//----------
				jsonAssyProductType.put("product_defects_name", _assPT.getProductDefects());
				
				jsonAssyProductType.put("step", _assPT.getStep());
				jsonAssyProductType.put("prerequisite", _assPT.getPrerequisite());
				
				
				
				array.add(jsonAssyProductType);
				
			}
			obj.put("AssyProductStationList", array);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			System.out.println("\n--error hic: "+e.getMessage()+"----\n");
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}


	
}
