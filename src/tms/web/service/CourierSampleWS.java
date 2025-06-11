package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

import tms.backend.domain.CourierSample;
import tms.backend.service.CourierSampleService;

@Controller
public class CourierSampleWS extends MultiActionController {
	@Autowired
	private CourierSampleService courierSampleService;

	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveCourierSample")
	public void saveCourierSample(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveCourierSample");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    CourierSample courierSample = new CourierSample();
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("CourierSampleList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					courierSample = new CourierSample();
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						courierSample.setId(id);
					}
					Long courier_shipment_id = (Long) assetCategoryObj.get("courier_shipment_id");
					courierSample.setCourierShipmentId(courier_shipment_id);
					
					String sample_name = (String) assetCategoryObj.get("sample_name");
					courierSample.setSampleName(sample_name);
					
					Object sample_quantity = (Object) assetCategoryObj.get("sample_quantity");
					if (sample_quantity != null && NumberUtils.isDigits(sample_quantity.toString())){
						courierSample.setSampleQuantity(Float.valueOf(sample_quantity.toString()));
					}
					
					Object sample_value = (Object) assetCategoryObj.get("sample_value");
					if (sample_value != null && NumberUtils.isNumber(sample_value.toString())){
						courierSample.setSampleValue(Float.valueOf(sample_value.toString()));
					}
					
					Object sample_weight = (Object) assetCategoryObj.get("sample_weight");
					if (sample_weight != null && NumberUtils.isNumber(sample_weight.toString())){
						courierSample.setSampleWeight(Float.valueOf(sample_weight.toString()));
					}
					
					Boolean invoiced = (Boolean) assetCategoryObj.get("invoiced");
					courierSample.setInvoiced(invoiced);
					Boolean posted_PS = (Boolean) assetCategoryObj.get("posted_PS");
					courierSample.setPostedPs(posted_PS);
					String PS_no = (String) assetCategoryObj.get("PS_no");
					courierSample.setPsNo(PS_no);
					
					courierSample = courierSampleService.saveOrUpdate(courierSample);
				}
			}else{
				JSONObject assetCategoryObj = (JSONObject)obj;
				courierSample = new CourierSample();
				Long id =  (Long) assetCategoryObj.get("id");
				if (id != null){
					courierSample.setId(id);
				}
				Long courier_shipment_id = (Long) assetCategoryObj.get("courier_shipment_id");
				courierSample.setCourierShipmentId(courier_shipment_id);
				
				String sample_name = (String) assetCategoryObj.get("sample_name");
				courierSample.setSampleName(sample_name);
				
				Object sample_quantity = (Object) assetCategoryObj.get("sample_quantity");
				if (sample_quantity != null && NumberUtils.isDigits(sample_quantity.toString())){
					courierSample.setSampleQuantity(Float.valueOf(sample_quantity.toString()));
				}
				
				Object sample_value = (Object) assetCategoryObj.get("sample_value");
				if (sample_value != null && NumberUtils.isNumber(sample_value.toString())){
					courierSample.setSampleValue(Float.valueOf(sample_value.toString()));
				}
				
				Object sample_weight = (Object) assetCategoryObj.get("sample_weight");
				if (sample_weight != null && NumberUtils.isNumber(sample_weight.toString())){
					courierSample.setSampleWeight(Float.valueOf(sample_weight.toString()));
				}
				
				Boolean invoiced = (Boolean) assetCategoryObj.get("invoiced");
				courierSample.setInvoiced(invoiced);
				Boolean posted_PS = (Boolean) assetCategoryObj.get("posted_PS");
				courierSample.setPostedPs(posted_PS);
				String PS_no = (String) assetCategoryObj.get("PS_no");
				courierSample.setPsNo(PS_no);
				
				courierSample = courierSampleService.saveOrUpdate(courierSample);		
				
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", courierSample.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveCourierSample");
	}

	@RequestMapping("/deleteCourierSample")
	public void deleteCourierSample(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteCourierSample");
		/*
		String assetCategoryId = request.getParameter("assetCategoryId");
		AssetCategory assetCategory = assetCategoryService.findById(Long.valueOf(assetCategoryId));
		assetCategoryService.delete(assetCategory);

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("id", assetCategory.getId());
		out.print(obj);
		out.flush();*/
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("CourierSampleList");
			
				JSONObject courierSampleJson = (JSONObject)obj;
				Long id =  (Long) courierSampleJson.get("id");
				CourierSample courierSample  = courierSampleService.findById(id);
				courierSampleService.delete(courierSample);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteCourierShipment");
	}

	@RequestMapping("/getCourierSampleList")
	public void getCourierSampleList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// String myOrgs = request.getParameter("myOrgs");
		String shipmentId = request.getParameter("shipmentId");


		// Criterion cRequestDate = Restrictions.and(cFromdate, cTodate);
		try {
			List<CourierSample> list = null;
			Criterion cShipmentId = Restrictions.eq("courierShipmentId", Long.valueOf(shipmentId));
			list = courierSampleService.getByCriteria(cShipmentId);
			JSONObject jsonCourierShipment;
			for (CourierSample sample : list) {
				jsonCourierShipment = new JSONObject();
				jsonCourierShipment.put("id", sample.getId());
				jsonCourierShipment.put("sample_name", sample.getSampleName());
				jsonCourierShipment.put("sample_quantity", sample.getSampleQuantity());
				jsonCourierShipment.put("sample_weight", sample.getSampleWeight());
				jsonCourierShipment.put("sample_value", sample.getSampleValue());
				jsonCourierShipment.put("courier_shipment_id", sample.getCourierShipmentId());
				jsonCourierShipment.put("PS_no", sample.getPsNo());
				jsonCourierShipment.put("invoiced", sample.getInvoiced());
				jsonCourierShipment.put("posted_PS", sample.getPostedPs());
				array.add(jsonCourierShipment);
			}
			obj.put("CourierSampleList", array);
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
