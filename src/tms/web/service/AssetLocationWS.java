package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Calendar;
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

import tms.backend.domain.Asset;
import tms.backend.domain.AssetCategory;
import tms.backend.domain.AssetLocation;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetLocationService;
import tms.utils.StatusType;

@Controller
public class AssetLocationWS extends MultiActionController {
	@Autowired
	private AssetLocationService assetLocationService;

	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssetLocation")
	public void saveAssetLocation(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssetLocation");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }
	    AssetLocation assetLocation = new AssetLocation();
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssetLocationList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					assetLocation = new AssetLocation();
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						assetLocation.setId(id);
					}
					String code = (String) assetCategoryObj.get("locationCode");
					assetLocation.setLocationCode(code);
					String locationName = (String) assetCategoryObj.get("locationName");
					assetLocation.setLocationName(locationName);

					assetLocation = assetLocationService.saveOrUpdate(assetLocation);
				}
			}else{
				JSONObject assetCategoryObj = (JSONObject)obj;
				assetLocation = new AssetLocation();
				Long id =  (Long) assetCategoryObj.get("id");
				if (id != null){
					assetLocation.setId(id);
				}
				String code = (String) assetCategoryObj.get("locationCode");
				assetLocation.setLocationCode(code);
				String locationName = (String) assetCategoryObj.get("locationName");
				assetLocation.setLocationName(locationName);

				assetLocation = assetLocationService.saveOrUpdate(assetLocation);

			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", assetLocation.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveAssetLocation");
	}

	@RequestMapping("/deleteAssetLocation")
	public void deleteAssetLocation(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssetLocation");
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
			Object obj =  rootObj.get("AssetLocationList");

				JSONObject assetLocationJson = (JSONObject)obj;
				Long id =  (Long) assetLocationJson.get("id");
				AssetLocation assetLocation  = assetLocationService.findById(id);
				assetLocationService.delete(assetLocation);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssetLocation");
	}

	@RequestMapping("/getAssetLocationList")
	public void getAssetLocationList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// String myOrgs = request.getParameter("myOrgs");



		// Criterion cRequestDate = Restrictions.and(cFromdate, cTodate);
		try {
			List<AssetLocation> list = null;
			list = assetLocationService.getAll();
			JSONObject jsonLocation;
			for (AssetLocation loc : list) {
				jsonLocation = new JSONObject();
				jsonLocation.put("id", loc.getId());
				jsonLocation.put("locationCode", loc.getLocationCode());
				jsonLocation.put("locationName", loc.getLocationName());
				array.add(jsonLocation);
			}
			obj.put("AssetLocationList", array);
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
