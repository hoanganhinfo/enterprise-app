package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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




import tms.backend.domain.AssetPermission;
import tms.backend.service.AssetPermissionService;

@Controller
public class AssetPermissionWS extends MultiActionController {
	@Autowired
	private AssetPermissionService assetPermissionService;

	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssetPermission")
	public void saveAssetPermission(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssetPermission");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    AssetPermission assetPerm = new AssetPermission();
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("PermissionList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject assetPermObj = iter.next();
					assetPerm = new AssetPermission();
					Long id =  (Long) assetPermObj.get("id");
					if (id != null){
						assetPerm.setId(id);
					}
					Long userId = (Long) assetPermObj.get("userId");
					assetPerm.setUserId(userId.longValue());
					String userName = (String) assetPermObj.get("userName");
					assetPerm.setUserName(userName);
					Long orgId = (Long) assetPermObj.get("orgId");
					assetPerm.setOrganizationId(orgId.longValue());
					Long permissionId = (Long) assetPermObj.get("permissionId");
					assetPerm.setPermissionId(permissionId.byteValue());
					String permissionName = (String) assetPermObj.get("permissionName");
					assetPerm.setPermissionName(permissionName);
					assetPerm = assetPermissionService.saveOrUpdate(assetPerm);
				}
			}else{
				JSONObject assetPermObj = (JSONObject)obj;
				assetPerm = new AssetPermission();
				Long id =  (Long) assetPermObj.get("id");
				if (id != null){
					assetPerm.setId(id);
				}
				Long userId = (Long) assetPermObj.get("userId");
				assetPerm.setUserId(userId.longValue());
				String userName = (String) assetPermObj.get("userName");
				assetPerm.setUserName(userName);
				Long orgId = (Long) assetPermObj.get("orgId");
				assetPerm.setOrganizationId(orgId.longValue());
				Long permissionId = (Long) assetPermObj.get("permissionId");
				assetPerm.setPermissionId(permissionId.byteValue());
				String permissionName = (String) assetPermObj.get("permissionName");
				assetPerm.setPermissionName(permissionName);
				assetPerm = assetPermissionService.saveOrUpdate(assetPerm);		
				
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", assetPerm.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveAssetPermission");
	}

	@RequestMapping("/deleteAssetPermission")
	public void deleteAssetPermission(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssetPermission");
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
			Object obj =  rootObj.get("PermissionList");
			
				JSONObject permJson = (JSONObject)obj;
				Long id =  (Long) permJson.get("id");
				AssetPermission perm  = assetPermissionService.findById(id);
				assetPermissionService.delete(perm);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssetPermission");
	}

	@RequestMapping("/getAssetPermissionList")
	public void getAssetPermissionList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String departmentId = request.getParameter("departmentId");
		try {
			List<AssetPermission> list = null;
			Criterion cOrgId = Restrictions.eq("organizationId", Long.parseLong(departmentId));
			list = assetPermissionService.getByCriteria(cOrgId);
			JSONObject jsonPerm;
			for (AssetPermission perm : list) {
				jsonPerm = new JSONObject();
				jsonPerm.put("id", perm.getId());
				jsonPerm.put("userId", perm.getUserId());
				jsonPerm.put("userName", perm.getUserName());
				jsonPerm.put("orgId", perm.getOrganizationId());
				jsonPerm.put("permissionId", perm.getPermissionId());
				jsonPerm.put("permissionName", perm.getPermissionName());
				array.add(jsonPerm);
			}
			obj.put("PermissionList", array);
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
