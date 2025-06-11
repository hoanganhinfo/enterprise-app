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
import tms.backend.service.AssetCategoryService;
import tms.utils.StatusType;

@Controller
public class AssetCategoryWS extends MultiActionController {
	@Autowired
	private AssetCategoryService assetCategoryService;

	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssetCategory")
	public void saveAssetCategory(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssetCategory");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }
	    AssetCategory assetCategory = new AssetCategory();
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssetCategoryList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					assetCategory = new AssetCategory();
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						assetCategory.setId(id);
					}
					String name = (String) assetCategoryObj.get("categoryname");
					assetCategory.setCategoryName(name);
					Long departmentId = (Long) assetCategoryObj.get("departmentId");
					assetCategory.setDepartmentId(departmentId);

					assetCategory = assetCategoryService.saveOrUpdate(assetCategory);
				}
			}else{
				JSONObject assetCategoryObj = (JSONObject)obj;
				assetCategory = new AssetCategory();
				Long id =  (Long) assetCategoryObj.get("id");
				if (id != null){
					assetCategory.setId(id);
				}
				String name = (String) assetCategoryObj.get("categoryname");
				assetCategory.setCategoryName(name);
				Long departmentId = (Long) assetCategoryObj.get("departmentId");
				assetCategory.setDepartmentId(departmentId);
				assetCategory = assetCategoryService.saveOrUpdate(assetCategory);

			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", assetCategory.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveAssetCategory");
	}

	@RequestMapping("/deleteAssetCategory")
	public void deleteAssetCategory(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssetCategory");
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
			Object obj =  rootObj.get("AssetCategoryList");

				JSONObject assetCategoryJson = (JSONObject)obj;
				Long id =  (Long) assetCategoryJson.get("id");
				AssetCategory assetCategory  = assetCategoryService.findById(id);
				assetCategoryService.delete(assetCategory);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssetCategory");
	}

	@RequestMapping("/getAssetCategoryList")
	public void getAssetCategoryList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// String myOrgs = request.getParameter("myOrgs");
		//String departmentId = request.getParameter("departmentId");
		String departmentId ="";

		// Criterion cRequestDate = Restrictions.and(cFromdate, cTodate);
		try {
			List<AssetCategory> list = null;
			if (StringUtils.isNotBlank(departmentId)){
				list = assetCategoryService.getByDepartment(departmentId);
			}else{
				list = assetCategoryService.getAll();
			}
			JSONObject jsonCategory;
			for (AssetCategory cat : list) {
				jsonCategory = new JSONObject();
				jsonCategory.put("id", cat.getId());
				jsonCategory.put("categoryname", cat.getCategoryName());
				jsonCategory.put("departmentId", cat.getDepartmentId());
				array.add(jsonCategory);
			}
			obj.put("AssetCategoryList", array);
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


	@RequestMapping("/getStatusList")
	public void getStatusList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();

		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();

		try {
			List<StatusType> list = StatusType.getTaskStatusList();
			JSONObject jsonStatus;
			for (StatusType status : list) {
				jsonStatus = new JSONObject();
				jsonStatus.put("id", status.getValue());
				jsonStatus.put("taskname", status.getLabel());
				array.add(jsonStatus);
			}
			obj.put("statusList", array);
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
