package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.joda.time.Days;
import org.joda.time.LocalDate;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.Asset;
import tms.backend.domain.AssetHistory;
import tms.backend.domain.PmProject;
import tms.backend.domain.PmProjectTask;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.utils.CalendarUtil;
import tms.utils.ResourceUtil;
import tms.utils.StatusType;
import tms.utils.TaskRequestType;

@Controller
public class AssetWS extends MultiActionController {
	@Autowired
	private AssetCategoryService assetCategoryService;
	@Autowired
	private AssetService assetService;
	@Autowired
	private AssetHistoryService assetHistoryService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAsset")
	public void saveAsset(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAsset");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }
	    Asset asset= null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("assetTree");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject assetObj = iter.next();

					Long id =  (Long) assetObj.get("id");
					if (id != null){
						asset = assetService.findById(id);
					}else{
						asset = new Asset();
						asset.setStatus(StatusType.AVAILABLE.getValue());
					}

					String assetCode = (String) assetObj.get("assetCode");
					asset.setCode(assetCode);
					String assetName = (String) assetObj.get("assetName");
					asset.setName(assetName);
					if (assetObj.get("parentId") != null){
						Long parentId = (Long) assetObj.get("parentId");
						asset.setParentId(Long.valueOf(parentId));
					}else{
						asset.setParentId(Long.valueOf("0"));
					}
					Boolean leaf = (Boolean) assetObj.get("leaf");
					if (leaf == true){
						asset.setLeaf(new Byte("1"));
					}else{
						asset.setLeaf(new Byte("0"));
					}
					Long categoryId = (Long) assetObj.get("categoryId");
//					asset.setCategoryId(categoryId);
					asset.setCategory(assetCategoryService.findById(categoryId));
					String desc = (String) assetObj.get("description");
					asset.setDescription(desc);
					String distributor = (String) assetObj.get("distributor");
					asset.setDistributor(distributor);
					String expiredDate = (String) assetObj.get("expiredDate");
					if (StringUtils.isNotBlank(expiredDate)){
						asset.setExpiredDate(CalendarUtil.stringToDate(expiredDate));
					}else{
						asset.setExpiredDate(null);
					}
					String manufacturer = (String) assetObj.get("manufacturer");
					asset.setManufacturer(manufacturer);
					String model = (String) assetObj.get("model");
					asset.setModel(model);
					String purchasedDate = (String) assetObj.get("purchasedDate");
					if (StringUtils.isNotBlank(purchasedDate)){
						asset.setPurchasedDate(CalendarUtil.stringToDate(purchasedDate));
					}else{
						asset.setPurchasedDate(null);
					}
					String serial = (String) assetObj.get("serial");
					asset.setSerial(serial);
					String store = (String) assetObj.get("store");
					asset.setStore(store);
					String storeAddress = (String) assetObj.get("storeAddress");
					asset.setStoreAddress(storeAddress);
					String warranty = (String) assetObj.get("warranty");
					asset.setWarranty(warranty);
					String employee = (String) assetObj.get("employee");
					asset.setEmployee(employee);
					String employeeNo = (String) assetObj.get("employeeNo");

					asset.setEmployeeCode(employeeNo);
					String department = (String) assetObj.get("department");
					asset.setDepartment(department);
					String locationCode = (String) assetObj.get("locationCode");
					asset.setLocationCode(locationCode);
					String owner = (String) assetObj.get("owner");
					asset.setOwner(owner);
					asset = assetService.saveOrUpdate(asset);
				}
			}else{
				JSONObject assetObj = (JSONObject)obj;
				Long id =  (Long) assetObj.get("id");
				if (id != null){
					asset = assetService.findById(id);
				}else{
					asset = new Asset();
					asset.setStatus(StatusType.AVAILABLE.getValue());
				}
				if (assetObj.get("parentId") != null){
					Long parentId = (Long) assetObj.get("parentId");
					asset.setParentId(Long.valueOf(parentId));
				}else{
					asset.setParentId(Long.valueOf("0"));
				}
				String assetCode = (String) assetObj.get("assetCode");
				asset.setCode(assetCode);
				String assetName = (String) assetObj.get("assetName");
				asset.setName(assetName);
				Boolean leaf = (Boolean) assetObj.get("leaf");
				if (leaf == true){
					asset.setLeaf(new Byte("1"));
				}else{
					asset.setLeaf(new Byte("0"));
				}
				Long categoryId = (Long) assetObj.get("categoryId");

				asset.setCategory(assetCategoryService.findById(categoryId));
				String desc = (String) assetObj.get("description");
				asset.setDescription(desc);
				String distributor = (String) assetObj.get("distributor");
				asset.setDistributor(distributor);
				String expiredDate = (String) assetObj.get("expiredDate");
				if (StringUtils.isNotBlank(expiredDate)){
					asset.setExpiredDate(CalendarUtil.stringToDate(expiredDate));
				}else{
					asset.setExpiredDate(null);
				}
				asset.setExpiredDate(CalendarUtil.stringToDate(expiredDate));
				String manufacturer = (String) assetObj.get("manufacturer");
				asset.setManufacturer(manufacturer);
				String model = (String) assetObj.get("model");
				asset.setModel(model);
				String purchasedDate = (String) assetObj.get("purchasedDate");
				if (StringUtils.isNotBlank(purchasedDate)){
					asset.setPurchasedDate(CalendarUtil.stringToDate(purchasedDate));
				}else{
					asset.setPurchasedDate(null);
				}
				String serial = (String) assetObj.get("serial");
				asset.setSerial(serial);
				String store = (String) assetObj.get("store");
				asset.setStore(store);
				String storeAddress = (String) assetObj.get("storeAddress");
				asset.setStoreAddress(storeAddress);
				String warranty = (String) assetObj.get("warranty");
				asset.setWarranty(warranty);
				String employee = (String) assetObj.get("employee");
				asset.setEmployee(employee);
				String employeeNo = (String) assetObj.get("employeeNo");
				asset.setEmployeeCode(employeeNo);
				String department = (String) assetObj.get("department");
				asset.setDepartment(department);
				String locationCode = (String) assetObj.get("locationCode");
				asset.setLocationCode(locationCode);
				String owner = (String) assetObj.get("owner");
				asset.setOwner(owner);
				asset = assetService.saveOrUpdate(asset);

			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", asset.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveAsset");
	}

	@RequestMapping("/deleteAsset")
	public void deleteAsset(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAsset");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String isDelete = request.getParameter("isDelete");
	    System.out.println("isDelete: "+ isDelete);
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }
	    try {
	    	if(isDelete.equals("yes")){
				JSONObject rootObj = (JSONObject) JSONValue.parse(sb.toString());
				Object obj = rootObj.get("assetTree");

				JSONObject motorObj = (JSONObject) obj;
				Asset asset = new Asset();
				Long id = (Long) motorObj.get("id");
				Long parentId = (Long) motorObj.get("parentId");

				asset = assetService.findById(id);
				asset.setStatus(StatusType.DELETED.getValue());
				asset.setUpdatedDate(Calendar.getInstance().getTime());
						assetService.update(asset);
					//assetService.delete(asset);
					//assetHistoryService.deleteByAssetId(id);
	    	}


		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAsset");
	}

	@RequestMapping("/getAsset")
	public void getAsset(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		System.out.println("START METHOD - getAsset");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// String myOrgs = request.getParameter("myOrgs");
		String ownerName = request.getParameter("ownerName");
		String departmentId = request.getParameter("departmentId");
		String departmentName = request.getParameter("departmentName");
		String categoryId = request.getParameter("categoryId");
		String locationCode = request.getParameter("locationCode");
		String requestType = request.getParameter("requestType");
		String name = request.getParameter("name");
		Criterion cOwner = null;
		Criterion cCategoryId = null;
		Criterion cDepartment = null;
		Criterion cLocationCode = null;
		Criterion cRequestType = null;
		Criterion cAssetCode = null;
		Criterion cAssetName = null;
		Criterion cName = null;
		Criterion cDesc = null;
		List<Asset> list = null;
		try {
			if (StringUtils.isNotBlank(ownerName)){
				cOwner = Restrictions.eq("owner", ownerName);
			}
			if (StringUtils.isNotBlank(departmentName)){
				cDepartment = Restrictions.eq("department", departmentName);
			}
			if (StringUtils.isNotBlank(categoryId)){
				cCategoryId = Restrictions.eq("category.id",Long.valueOf(categoryId));
			}
			if (StringUtils.isNotBlank(locationCode)){
				cLocationCode = Restrictions.eq("locationCode",locationCode);
			}
			if (StringUtils.isNotBlank(requestType)){
				cRequestType = Restrictions.eq("requestType",Byte.valueOf(requestType));
			}
			if (StringUtils.isNotBlank(name)){

				cAssetCode = Restrictions.ilike("code",name, MatchMode.ANYWHERE);
				cAssetName = Restrictions.ilike("name",name, MatchMode.ANYWHERE);
				cDesc = Restrictions.ilike("description",name, MatchMode.ANYWHERE);
				cName = Restrictions.or(cAssetCode, Restrictions.or(cAssetName, cDesc));
			}

			list =	assetService.getByCriteria(cOwner,cDepartment, cCategoryId, cLocationCode, cRequestType,cName);
			/*
			if (StringUtils.isNotBlank(categoryId)){
				list = assetService.getByCategory(assetCategoryService.findById(Long.valueOf(categoryId)));
			}else{
				if (StringUtils.isBlank(departmentId)){
					list = assetService.getAll();
				}else{
					list = assetService.getByDepartment(departmentId);
				}
			}
			*/
			System.out.println("Count: " + list.size());
			JSONObject jsonAsset;
			for (Asset asset : list) {
				jsonAsset = new JSONObject();
				jsonAsset.put("id", asset.getId());
				jsonAsset.put("parentId", asset.getParentId());
				jsonAsset.put("leaf",asset.getLeaf().intValue() == 1?true:false);
				jsonAsset.put("assetCode", asset.getCode());
				jsonAsset.put("assetName", asset.getName());
				jsonAsset.put("description", asset.getDescription());
				jsonAsset.put("owner", asset.getOwner());
				jsonAsset.put("distributor", asset.getDistributor());
				jsonAsset.put("expiredDate", CalendarUtil.dateToString(asset.getExpiredDate()));
				jsonAsset.put("manufacturer", asset.getManufacturer());
				jsonAsset.put("purchasedDate", CalendarUtil.dateToString(asset.getPurchasedDate()));
				jsonAsset.put("serial", asset.getSerial());
				jsonAsset.put("status", StatusType.forValue(asset.getStatus()).getLabel());
				jsonAsset.put("store", asset.getStore());
				jsonAsset.put("storeAddress", asset.getStoreAddress());
				jsonAsset.put("warranty", asset.getWarranty());
				if (asset.getCategory() != null){
					jsonAsset.put("categoryId",asset.getCategory().getId());
					jsonAsset.put("categoryName",asset.getCategory().getCategoryName());
				}
				jsonAsset.put("locationCode", asset.getLocationCode());
				jsonAsset.put("owner", asset.getOwner());
				if (asset.getRequestType() != null){
					jsonAsset.put("requestTypeId", asset.getRequestType());
					jsonAsset.put("requestType", StatusType.forValue(asset.getRequestType()).getLabel());
				}
				array.add(jsonAsset);
			}
			obj.put("AssetList", array);
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

	@RequestMapping("/getAssetTree")
	public void getAssetTree(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - getAssetTree");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();

		JSONObject rootTree = new JSONObject();
		String ownerName = request.getParameter("ownerName");

		String departmentName = request.getParameter("departmentName");
		String categoryId = request.getParameter("categoryId");
		String node = request.getParameter("node");
		String locationCode = request.getParameter("locationCode");
		String requestType = request.getParameter("requestType");
		String name = request.getParameter("name");

		Criterion cOwner = null;
		Criterion cCategoryId = null;
		Criterion cDepartment = null;
		Criterion cLocationCode = null;
		Criterion cRequestType = null;
		Criterion cAssetCode = null;
		Criterion cAssetName = null;
		Criterion cName = null;
		Criterion cDesc = null;
		//String projectId="-1";
		//JSONArray taskArray = writeTask(Long.valueOf(projectId));
		List<Asset> assetList = null;
		long parentId = 0;
		JSONArray assetArray = new JSONArray();
		JSONObject jsonAsset = null;
		if (StringUtils.isBlank(node) || !NumberUtils.isNumber(node)){
			System.out.println("Load parent node");

			Criterion cParentId = Restrictions.eq("parentId", Long.valueOf("0"));
			Criterion cDeleted = Restrictions.ne("status", StatusType.DELETED.getValue());
			if (StringUtils.isNotBlank(ownerName)){
				cOwner = Restrictions.eq("owner", ownerName);
			}
			if (StringUtils.isNotBlank(departmentName)){
				cDepartment = Restrictions.eq("department", departmentName);
			}
			if (StringUtils.isNotBlank(locationCode)){
				cLocationCode = Restrictions.eq("locationCode",locationCode);
			}
			if (StringUtils.isNotBlank(requestType)){
				cRequestType = Restrictions.eq("requestType",Byte.valueOf(requestType));
			}
			if (StringUtils.isNotBlank(name)){

				cAssetCode = Restrictions.ilike("code",name, MatchMode.ANYWHERE);
				cAssetName = Restrictions.ilike("name",name, MatchMode.ANYWHERE);
				cDesc = Restrictions.ilike("description",name, MatchMode.ANYWHERE);
				cName = Restrictions.or(cAssetCode, Restrictions.or(cAssetName, cDesc));
			}
			if (categoryId != null && NumberUtils.isNumber(categoryId)){
				cCategoryId = Restrictions.eq("category.id",Long.valueOf(categoryId));
				System.out.println("Load parent node - 1");
				parentId = Long.valueOf(categoryId);
				System.out.println("Load parent node - 2");
				 assetList =	assetService.getByCriteria(cDepartment,cCategoryId,cParentId,cDeleted);
				 System.out.println("Load parent node - 3");
			}else{
				//System.out.println("Load parent node - 11");
				 assetList =	assetService.getByCriteria(cDepartment, cParentId,cDeleted);
			}
			assetList =	assetService.getByCriteria(cOwner,cDepartment, cCategoryId, cParentId,cDeleted, cLocationCode, cRequestType,cName);
				for (Asset asset : assetList) {
					System.out.println(asset.getName());
					jsonAsset = new JSONObject();
					jsonAsset.put("id", asset.getId());
					jsonAsset.put("parentId", parentId);
					jsonAsset.put("leaf",asset.getLeaf().intValue() == 1?true:false);
					jsonAsset.put("assetCode", asset.getCode());
					jsonAsset.put("assetName", asset.getName());
					jsonAsset.put("description", asset.getDescription());
					jsonAsset.put("owner", asset.getOwner());
					jsonAsset.put("distributor", asset.getDistributor());
					jsonAsset.put("expiredDate", CalendarUtil.dateToString(asset.getExpiredDate()));
					jsonAsset.put("manufacturer", asset.getManufacturer());
					jsonAsset.put("model", asset.getModel());
					jsonAsset.put("purchasedDate", CalendarUtil.dateToString(asset.getPurchasedDate()));
					jsonAsset.put("serial", asset.getSerial());
					//jsonAsset.put("status", StatusType.forValue(asset.getStatus()).getLabel());
					jsonAsset.put("statusText", StatusType.forValue(asset.getStatus()).getLabel());
					jsonAsset.put("status", asset.getStatus());
					jsonAsset.put("store", asset.getStore());
					jsonAsset.put("storeAddress", asset.getStoreAddress());
					jsonAsset.put("warranty", asset.getWarranty());
					if (asset.getCategory() != null){
						jsonAsset.put("categoryId",asset.getCategory().getId());
						jsonAsset.put("categoryName",asset.getCategory().getCategoryName());
					}
					jsonAsset.put("employee", asset.getEmployee());
					jsonAsset.put("employeeNo", asset.getEmployeeCode());
					jsonAsset.put("department", asset.getDepartment());
					jsonAsset.put("locationCode", asset.getLocationCode());
					if (asset.getRequestType() != null){
						jsonAsset.put("requestTypeId", asset.getRequestType());
						jsonAsset.put("requestType", TaskRequestType.forValue(asset.getRequestType()).getLabel());
					}
					assetArray.add(jsonAsset);
				}
		}else{
			System.out.println("Load child node");
			Criterion cParentId = Restrictions.eq("parentId", Long.valueOf(node));
			Criterion cDeleted = Restrictions.ne("status", StatusType.DELETED.getValue());
			 assetList =	assetService.getByCriteria(cParentId,cDeleted);
			 parentId = Long.valueOf(node);
			 for (Asset asset : assetList) {
				 	jsonAsset = new JSONObject();
				 	jsonAsset.put("id", asset.getId());
					jsonAsset.put("parentId", parentId);
					jsonAsset.put("leaf",asset.getLeaf().intValue() == 1?true:false);
					jsonAsset.put("assetCode", asset.getCode());
					jsonAsset.put("assetName", asset.getName());
					jsonAsset.put("description", asset.getDescription());
					jsonAsset.put("distributor", asset.getDistributor());
					jsonAsset.put("expiredDate", CalendarUtil.dateToString(asset.getExpiredDate()));
					jsonAsset.put("manufacturer", asset.getManufacturer());
					jsonAsset.put("model", asset.getModel());
					jsonAsset.put("purchasedDate", CalendarUtil.dateToString(asset.getPurchasedDate()));
					jsonAsset.put("serial", asset.getSerial());
					jsonAsset.put("statusText", StatusType.forValue(asset.getStatus()).getLabel());
					jsonAsset.put("status", asset.getStatus());
					jsonAsset.put("store", asset.getStore());
					jsonAsset.put("storeAddress", asset.getStoreAddress());
					jsonAsset.put("warranty", asset.getWarranty());
					jsonAsset.put("categoryId",asset.getCategory().getId());
					jsonAsset.put("categoryName",asset.getCategory().getCategoryName());
					jsonAsset.put("employee", asset.getEmployee());
					jsonAsset.put("employeeNo", asset.getEmployeeCode());
					jsonAsset.put("department", asset.getDepartment());
					jsonAsset.put("locationCode", asset.getLocationCode());
					if (asset.getRequestType() != null){
						jsonAsset.put("requestType", StatusType.forValue(asset.getRequestType()).getLabel());
					}
					assetArray.add(jsonAsset);
			 }
		}


		obj.put("assetTree", assetArray);
		obj.put("message", 0);
		obj.put("success", true);

		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - getAssetTree");
	}
	@RequestMapping("/updateAssetRequestType")
	public void updateAssetRequestType(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - updateRequestType");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String assetId = request.getParameter("assetId");
	    String requestTypeId = request.getParameter("requestTypeId");

	    try {
	    	if (StringUtils.isNotBlank(assetId)){
	    		Asset asset = assetService.findById(Long.valueOf(assetId));
	    		if (asset.getRequestType() < Byte.valueOf(requestTypeId)){
		    		asset.setRequestType(Byte.valueOf(requestTypeId));
		    		assetService.update(asset);
	    		}
	    	}




		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAsset");
	}
}
