package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.math.NumberUtils;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.AssyProductModel;
import tms.backend.domain.AssyProductStationPrerequisite;
import tms.backend.service.AssyProductModelService;
import tms.backend.service.AssyProductStationPrerequisiteService;
import tms.backend.service.AssyProductTypeService;
import tms.utils.CalendarUtil;

@Controller
public class AssyProductStationPrerequisiteWS extends MultiActionController {
	@Autowired
	private AssyProductStationPrerequisiteService assyProductStationPrerequisiteService;
	@Autowired
	private AssyProductTypeService assyProductTypeService;
	@Autowired
	private AssyProductModelService assyProductModelService;
	@Autowired
	private SessionFactory sessionFactory;
	private final static double VENT_PRESSURE_6 = 1.62;
	private final static double VENT_PRESSURE_DIFFERENCE_6 = 0.02;
	private final static double TAP_PRESSURE_6 = -0.55;
	private final static double TAP_PRESSURE_DIFFERENCE_6 = 0.02;
	private final static double VENT_PRESSURE_7 = 1.7;
	private final static double VENT_PRESSURE_DIFFERENCE_7 = 0.02;
	private final static double TAP_PRESSURE_7 = -0.5;
	private final static double TAP_PRESSURE_DIFFERENCE_7 = 0.02;
	
	private static double MIN_VENT = 0.08;
	private static double MAX_VENT = 0.05;
	private static double MAX_TAP = 0.05;
	private static double MIN_TAP = 0.05;
	
	private static double MIN_VENT_PDV = 0.08;
	private static double MAX_VENT_PDV = 0.05;
	private static double MAX_TAP_PDV = 0.05;
	private static double MIN_TAP_PDV = 0.05;
	
	@RequestMapping("/addAOSmithPrerequisite")
	public void addAOSmithPrerequisite(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - addAOSmithPrerequisite");
		response.setContentType("text/html; charset=UTF-8");
		JSONObject obj = new JSONObject();
		PrintWriter out = null;
		out = response.getWriter();
		String productStation = request.getParameter("productStation");
		String productType = request.getParameter("productType");
		String productModel = request.getParameter("productModel");
		String productModelName = request.getParameter("productModelName").trim();
		String strVentPressure1 = request.getParameter("ventPressure1");
		String strVentPressure2 = request.getParameter("ventPressure2"); 
		String strTapPressure1 = request.getParameter("tapPressure1");
		String strTapPressure2 = request.getParameter("tapPressure2");
		String strHumidity = request.getParameter("humidity"); 
		String strTemperature = request.getParameter("temperature");
		String strPressure = request.getParameter("pressure");
		double ventPressure1 = 0,ventPressure2=0,tapPressure1=0,tapPressure2=0,humidity=0,temperature=0,pressure=0;
		try{
		if (NumberUtils.isNumber(strVentPressure1)){
			ventPressure1 = Double.valueOf(strVentPressure1);
		}
		if (NumberUtils.isNumber(strVentPressure2)){
			ventPressure2 = Double.valueOf(strVentPressure2);
		}
		if (NumberUtils.isNumber(strTapPressure1)){
			tapPressure1 = Double.valueOf(strTapPressure1);
		}
		if (NumberUtils.isNumber(strTapPressure2)){
			tapPressure2 = Double.valueOf(strTapPressure2);
		}
		if (NumberUtils.isNumber(strHumidity)){
			humidity = Double.valueOf(strHumidity);
		}
		if (NumberUtils.isNumber(strTemperature)){
			temperature = Double.valueOf(strTemperature);
		}
		if (NumberUtils.isNumber(strPressure)){
			pressure = Double.valueOf(strPressure);
		}
		double ventAVG = (ventPressure1+ventPressure2)/2.0;
		double tapAVG = (tapPressure1+tapPressure2)/2.0;
		AssyProductStationPrerequisite pre = new AssyProductStationPrerequisite();
		pre.setProductType(Long.valueOf(productType));
		pre.setProductModel(Long.valueOf(productModel));
		pre.setProductStation(Long.valueOf(productStation));
		pre.setDatetested(Calendar.getInstance().getTime());
		pre.setInputParameter(String.format("ventMaster1=%.3f;ventMaster2=%.3f;tapMaster1=%.3f;tapMaster2=%.3f;Humidity=%f;Temperature=%.1f;Pressure=%.2f;VentAVG=%.3f;TapAVG=%.3f;VentLow=%.3f;VentHigh=%.3f;TapLow=%.3f;TapHigh=%.3f", 
				ventPressure1,ventPressure2,tapPressure1,tapPressure2,humidity,temperature,pressure,ventAVG,tapAVG,
				Math.min(ventPressure1, ventPressure2)-MIN_VENT,Math.max(ventPressure1, ventPressure2)+MAX_VENT,
				Math.min(tapPressure1, tapPressure2)-MIN_TAP,Math.max(tapPressure1, tapPressure2)+MAX_TAP));
//		if (productModelName.startsWith("6")){
//			double max_vent = VENT_PRESSURE_6+VENT_PRESSURE_DIFFERENCE_6;
//			double min_vent = VENT_PRESSURE_6-VENT_PRESSURE_DIFFERENCE_6;
//			double max_tap = TAP_PRESSURE_6+TAP_PRESSURE_DIFFERENCE_6;
//			double min_tap = TAP_PRESSURE_6-TAP_PRESSURE_DIFFERENCE_6;
//			if (min_vent<=ventAVG && ventAVG <=max_vent &&
//				min_tap<=tapAVG && tapAVG <=max_tap){
//				pre.setActive(true);
//				pre.setStatus(true);
//			}else{
//				pre.setActive(true);
//				pre.setStatus(false);
//				
//			}
//		}else{
//			double max_vent = VENT_PRESSURE_7+VENT_PRESSURE_DIFFERENCE_7;
//			double min_vent = VENT_PRESSURE_7-VENT_PRESSURE_DIFFERENCE_7;
//			double max_tap = TAP_PRESSURE_7+TAP_PRESSURE_DIFFERENCE_7;
//			double min_tap = TAP_PRESSURE_7-TAP_PRESSURE_DIFFERENCE_7;
//			if (min_vent<=ventAVG && ventAVG <=max_vent &&
//				min_tap<=tapAVG && tapAVG <=max_tap){
//				pre.setActive(true);
//				pre.setStatus(true);
//			}else{
//				pre.setActive(true);
//				pre.setStatus(false);
//			}	
//		}
		if (temperature >=25 && temperature <=42
				&& pressure >=28 && pressure <=31
				&& humidity >=40 && humidity <=90
				&& ventPressure1 >=1.2 && ventPressure1 <=1.9
				&& ventPressure2 >=1.2 && ventPressure2 <=1.9
				&& tapPressure1 >= -0.9 && tapPressure1 <= -0.48
				&& tapPressure2 >= -0.9 && tapPressure2 <= -0.48){
			pre.setActive(true);
			pre.setStatus(true);
		}else{
			pre.setActive(true);
			pre.setStatus(false);
		}
	
		pre = assyProductStationPrerequisiteService.save(pre);
		obj.put("success", true);
		obj.put("verified", pre.getStatus());
		
		
		obj.put("prerequisiteId", pre.getId());
		obj.put("prerequisiteLabel", String.format("Ave vent=%.3f;Ave tap=%.3f;Hum=%.0f;Temp=%.1f;BarP=%.2f;Vent Tgt=[%.3f:%.3f]; Tap Tgt=[%.3f:%.3f]", 
				ventAVG,tapAVG,humidity,temperature,pressure,ventAVG-MIN_VENT,ventAVG+MAX_VENT,tapAVG-MIN_TAP,tapAVG+MAX_TAP));
		obj.put("prerequisiteData", String.format("Vend=%.3f;Tap=%.3f", ventAVG,tapAVG));

		}catch(Exception e){
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - addAOSmithPrerequisite");
	}
	@RequestMapping("/addAOSmithPDVPrerequisite")
	public void addAOSmithPDVPrerequisite(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - addAOSmithPDVPrerequisite");
		response.setContentType("text/html; charset=UTF-8");
		JSONObject obj = new JSONObject();
		PrintWriter out = null;
		out = response.getWriter();
		String productStation = request.getParameter("productStation");
		String productType = request.getParameter("productType");
		String productModel = request.getParameter("productModel");
		String productModelName = request.getParameter("productModelName").trim();
		String strVentPressure1 = request.getParameter("ventPressure1");
		String strVentPressure2 = request.getParameter("ventPressure2"); 
		String strTapPressure1 = request.getParameter("tapPressure1");
		String strTapPressure2 = request.getParameter("tapPressure2");
		String strHumidity = request.getParameter("humidity"); 
		String strTemperature = request.getParameter("temperature");
		String strPressure = request.getParameter("pressure");
		String strInTake = request.getParameter("inTake");
		
		double ventPressure1 = 0,ventPressure2=0,tapPressure1=0,tapPressure2=0,humidity=0,temperature=0,pressure=0, intake = 0;
		try{
		if (NumberUtils.isNumber(strVentPressure1)){
			ventPressure1 = Double.valueOf(strVentPressure1);
		}
		if (NumberUtils.isNumber(strVentPressure2)){
			ventPressure2 = Double.valueOf(strVentPressure2);
		}
		if (NumberUtils.isNumber(strTapPressure1)){
			tapPressure1 = Double.valueOf(strTapPressure1);
		}
		if (NumberUtils.isNumber(strTapPressure2)){
			tapPressure2 = Double.valueOf(strTapPressure2);
		}
		if (NumberUtils.isNumber(strHumidity)){
			humidity = Double.valueOf(strHumidity);
		}
		if (NumberUtils.isNumber(strTemperature)){
			temperature = Double.valueOf(strTemperature);
		}
		if (NumberUtils.isNumber(strPressure)){
			pressure = Double.valueOf(strPressure);
		}
		if (NumberUtils.isNumber(strInTake)){
			pressure = Double.valueOf(intake);
		}
		
		double ventAVG = (ventPressure1+ventPressure2)/2.0;
		double tapAVG = (tapPressure1+tapPressure2)/2.0;
		AssyProductStationPrerequisite pre = new AssyProductStationPrerequisite();
		pre.setProductType(Long.valueOf(productType));
		pre.setProductModel(Long.valueOf(productModel));
		pre.setProductStation(Long.valueOf(productStation));
		pre.setDatetested(Calendar.getInstance().getTime());
		pre.setInputParameter(String.format("ventMaster1=%.3f;ventMaster2=%.3f;tapMaster1=%.3f;tapMaster2=%.3f;Humidity=%f;Temperature=%.1f;Pressure=%.2f;VentAVG=%.3f;TapAVG=%.3f;VentLow=%.3f;VentHigh=%.3f;TapLow=%.3f;TapHigh=%.3f;InTake=%.3f", 
				ventPressure1,ventPressure2,tapPressure1,tapPressure2,humidity,temperature,pressure,ventAVG,tapAVG,
				Math.min(ventPressure1, ventPressure2)-MIN_VENT_PDV,Math.max(ventPressure1, ventPressure2)+MAX_VENT_PDV,
				Math.min(tapPressure1, tapPressure2)-MIN_TAP_PDV,Math.max(tapPressure1, tapPressure2)+MAX_TAP_PDV,intake));
//		if (productModelName.startsWith("6")){
//			double max_vent = VENT_PRESSURE_6+VENT_PRESSURE_DIFFERENCE_6;
//			double min_vent = VENT_PRESSURE_6-VENT_PRESSURE_DIFFERENCE_6;
//			double max_tap = TAP_PRESSURE_6+TAP_PRESSURE_DIFFERENCE_6;
//			double min_tap = TAP_PRESSURE_6-TAP_PRESSURE_DIFFERENCE_6;
//			if (min_vent<=ventAVG && ventAVG <=max_vent &&
//				min_tap<=tapAVG && tapAVG <=max_tap){
//				pre.setActive(true);
//				pre.setStatus(true);
//			}else{
//				pre.setActive(true);
//				pre.setStatus(false);
//				
//			}
//		}else{
//			double max_vent = VENT_PRESSURE_7+VENT_PRESSURE_DIFFERENCE_7;
//			double min_vent = VENT_PRESSURE_7-VENT_PRESSURE_DIFFERENCE_7;
//			double max_tap = TAP_PRESSURE_7+TAP_PRESSURE_DIFFERENCE_7;
//			double min_tap = TAP_PRESSURE_7-TAP_PRESSURE_DIFFERENCE_7;
//			if (min_vent<=ventAVG && ventAVG <=max_vent &&
//				min_tap<=tapAVG && tapAVG <=max_tap){
//				pre.setActive(true);
//				pre.setStatus(true);
//			}else{
//				pre.setActive(true);
//				pre.setStatus(false);
//			}	
//		}
		if (temperature >=25 && temperature <=42
				&& pressure >=28 && pressure <=31
				&& humidity >=40 && humidity <=90
				&& ventPressure1 >=1.8 && ventPressure1 <=2.6
				&& ventPressure2 >=1.8 && ventPressure2 <=2.6
				&& tapPressure1 >= -0.8 && tapPressure1 <= -0.4
				&& tapPressure2 >= -0.8 && tapPressure2 <= -0.4){
			pre.setActive(true);
			pre.setStatus(true);
		}else{
			pre.setActive(true);
			pre.setStatus(false);
		}
	
		pre = assyProductStationPrerequisiteService.save(pre);
		obj.put("success", true);
		obj.put("verified", pre.getStatus());
		
		
		obj.put("prerequisiteId", pre.getId());
		obj.put("prerequisiteLabel", String.format("Ave vent=%.3f;Ave tap=%.3f;Hum=%.0f;Temp=%.1f;BarP=%.2f;InTake=%.2f;Vent Tgt=[%.3f:%.3f]; Tap Tgt=[%.3f:%.3f]", 
				ventAVG,tapAVG,humidity,temperature,pressure,intake,ventAVG-MIN_VENT_PDV,ventAVG+MAX_VENT_PDV,tapAVG-MIN_TAP_PDV,tapAVG+MAX_TAP_PDV));
		obj.put("prerequisiteData", String.format("Vend=%.3f;Tap=%.3f", ventAVG,tapAVG));

		}catch(Exception e){
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - addAOSmithPDVPrerequisite");
	}
	@RequestMapping("/saveAssyProductStationPrerequisite")
	public void saveAssyProductStationPrerequisite(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssyProductStationPrerequisite");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	  
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	   
	    AssyProductStationPrerequisite _AssyProductDefect = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductStationPrerequisiteList");
			
			if (obj instanceof JSONArray)
			{
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						_AssyProductDefect = assyProductStationPrerequisiteService.findById(id);
						
					}else{
						_AssyProductDefect = new AssyProductStationPrerequisite();
						_AssyProductDefect.setDatetested(Calendar.getInstance().getTime());
					}
					String productType = String.valueOf(assetCategoryObj.get("productType"));
					_AssyProductDefect.setProductType(Long.valueOf(productType));
					
					String productStation = String.valueOf(assetCategoryObj.get("productStation"));
					_AssyProductDefect.setProductStation(Long.valueOf(productStation));
					
					Object active = assetCategoryObj.get("active");
					String status = (String)assetCategoryObj.get("status");
					_AssyProductDefect.setActive(Boolean.valueOf(active.toString()));
					_AssyProductDefect.setStatus(status.equals("PASS")?true:false);
					_AssyProductDefect = assyProductStationPrerequisiteService.saveOrUpdate(_AssyProductDefect);
					
				}
			}
			else
			{
				
				JSONObject assetCategoryObj = (JSONObject)obj;
				Long id =  (Long) assetCategoryObj.get("id");
				
				if (id != null){
					_AssyProductDefect = assyProductStationPrerequisiteService.findById(id);
					
				}else{
					_AssyProductDefect = new AssyProductStationPrerequisite();
					_AssyProductDefect.setDatetested(Calendar.getInstance().getTime());

				}
				
				String productType = String.valueOf(assetCategoryObj.get("productType"));
				_AssyProductDefect.setProductType(Long.valueOf(productType));
				
				String productStation = String.valueOf(assetCategoryObj.get("productStation"));
				_AssyProductDefect.setProductStation(Long.valueOf(productStation));
				
				Object active = assetCategoryObj.get("active");
				String status = (String)assetCategoryObj.get("status");
				_AssyProductDefect.setActive(Boolean.valueOf(active.toString()));
				_AssyProductDefect.setStatus(status.equals("PASS")?true:false);
				_AssyProductDefect = assyProductStationPrerequisiteService.saveOrUpdate(_AssyProductDefect);
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", _AssyProductDefect.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveAssyProductStationPrerequisite");
	}
	@RequestMapping("/deleteAssyProductStationPrerequisite")
	public void deleteAssyProductStationPrerequisite(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssyProductStationPrerequisite");
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
				AssyProductStationPrerequisite assyProductStationPre = new AssyProductStationPrerequisite();
				Long id =  (Long) moldObj.get("id");
				assyProductStationPre = assyProductStationPrerequisiteService.findById(id);
				assyProductStationPrerequisiteService.delete(assyProductStationPre);				
				
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssyProductStationPrerequisite");
	}

	

	@RequestMapping("/getAssyProductStationPrerequisiteList")
	public void getAssyProductStationPrerequisiteList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String product_type = request.getParameter("productTypeId");
		String product_station = request.getParameter("productStationId");
		
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("productType",product_type);
		map.put("productStation",product_station);
		
		try {
			List<AssyProductStationPrerequisite> list = assyProductStationPrerequisiteService.getByProperty(map, null, true, true);
			List<AssyProductModel> productModels = assyProductModelService.getAll();
			Map<String,String> productModelMap = new HashedMap();
			for(AssyProductModel model : productModels){
				productModelMap.put(model.getId().toString(), model.getProductModelName());
			}
			JSONObject jsonAssyProductType;
			for (AssyProductStationPrerequisite _assPT : list) 
			{
				
				jsonAssyProductType = new JSONObject();
				jsonAssyProductType.put("id", _assPT.getId());
				jsonAssyProductType.put("productStation", _assPT.getProductStation());
				jsonAssyProductType.put("productType", _assPT.getProductType());
				if (_assPT.getProductModel() != null){
					jsonAssyProductType.put("productTypeName", productModelMap.get(_assPT.getProductModel().toString()));
				}else{
					jsonAssyProductType.put("productTypeName", "");
				}
				jsonAssyProductType.put("active", _assPT.getActive());
				jsonAssyProductType.put("status", _assPT.getStatus()==true?"PASS":"FAIL");
				jsonAssyProductType.put("inputParams", _assPT.getInputParameter());
				jsonAssyProductType.put("transdate", CalendarUtil.dateToString(_assPT.getDatetested(),"dd/MM/yyyy hh:mm a"));
				
				array.add(jsonAssyProductType);
				
			}
			obj.put("AssyProductStationPrerequisiteList", array);
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
	@RequestMapping("/verifyAssyProductStationPrerequisiteList")
	public void verifyAssyProductStationPrerequisiteList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		String product_type = request.getParameter("productTypeId");
		String product_model = request.getParameter("productModel");
		String product_station = request.getParameter("productStationId");
		String param1 = request.getParameter("param1");
		
		
		Criterion cProductType = Restrictions.eq("productType", Long.valueOf(product_type));
		Criterion cProductModel = Restrictions.eq("productModel", Long.valueOf(product_model));
		Criterion cProductStation = Restrictions.eq("productStation", Long.valueOf(product_station));
		Criterion cActive = Restrictions.eq("active", true);
		Criterion cStatus = Restrictions.eq("status", true);
		Criterion cDatetested = null;
		if (param1.equals("day")){
			cDatetested = Restrictions.between("datetested", CalendarUtil.startOfDay(Calendar.getInstance().getTime()),
					CalendarUtil.endOfDay(Calendar.getInstance().getTime()));
		}
		
		try {
			List<AssyProductStationPrerequisite> list = assyProductStationPrerequisiteService.getByCriteria(cProductType,cProductModel,cProductStation,cActive,cDatetested,cStatus);
			
			if (list != null && !list.isEmpty()){
				AssyProductStationPrerequisite pre = list.get(list.size()-1);
				String inputParams = pre.getInputParameter();
				String[] params = inputParams.split(";");
				Map<String,Double> map = new HashedMap();
				for(String st : params){
					String[] values = st.split("=");
					map.put(values[0], Double.valueOf(values[1]));
				}
				Double vent = (map.get("ventMaster1")+map.get("ventMaster2"))/2.0;
				Double tap = (map.get("tapMaster1")+map.get("tapMaster2"))/2.0;
				Double humidity = map.get("Humidity");
				Double temperature = map.get("Temperature");
				Double pressure = map.get("Pressure");
				obj.put("prerequisiteId", pre.getId());
				obj.put("prerequisiteLabel", String.format("Ave vent=%.3f;Ave tap=%.3f;Hum=%.0f;Temp=%.1f;BarP=%.2f;Vent Tgt=[%.3f:%.3f]; Tap Tgt=[%.3f:%.3f]", 
						vent,tap,humidity,temperature,pressure,vent-MIN_VENT,vent+MAX_VENT,tap-MIN_TAP,tap+MAX_TAP));
				obj.put("prerequisiteData", String.format("Vend=%.3f;Tap=%.3f", vent,tap));
				
				obj.put("verified", true);
			}else{
				obj.put("verified", false);
			}
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			System.out.println("\n--error: "+e.getMessage()+"----\n");
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}

	
}
