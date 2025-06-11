package tms.web.service;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
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

import com.liferay.portal.kernel.webdav.Status;

import tms.backend.domain.Asset;
import tms.backend.domain.AssetHistory;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

@Controller
public class AssetHistoryWS extends MultiActionController {
	@Autowired
	private AssetCategoryService assetCategoryService;
	@Autowired
	private AssetService assetService;
	@Autowired
	private AssetHistoryService assetHistoryService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssetHistoryList")
	public void saveAssetHistoryList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssetHistoryList");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }
	    AssetHistory assetHistory = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssetHistoryList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					assetHistory = new AssetHistory();
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						assetHistory.setId(id);
					}
					Long assetId = (Long) assetCategoryObj.get("assetId");
					assetHistory.setAssetId(assetId);
					String employee = (String) assetCategoryObj.get("employee");
					assetHistory.setEmployee(employee);
					String employeeNo = (String) assetCategoryObj.get("employeeNo");
					assetHistory.setEmployeeCode(employeeNo);
					String department = (String) assetCategoryObj.get("department");
					assetHistory.setDepartment(department);
					String locationCode = (String) assetCategoryObj.get("locationCode");
					assetHistory.setLocationCode(locationCode);
					String description = (String) assetCategoryObj.get("description");
					assetHistory.setDescription(description);
					String memo = (String) assetCategoryObj.get("memo");
					assetHistory.setMemo(memo);
					Long transTypeId = (Long) assetCategoryObj.get("transTypeId");
					assetHistory.setTransType(Byte.valueOf(transTypeId.byteValue()));
					String startDate = (String) assetCategoryObj.get("startDate");
					if (StringUtils.isNotBlank(startDate)){
						assetHistory.setStartDate(CalendarUtil.stringToDate(startDate));
					}else{
						assetHistory.setStartDate(null);
					}
					String endDate = (String) assetCategoryObj.get("endDate");
					if (StringUtils.isNotBlank(endDate)){
						assetHistory.setEndDate(CalendarUtil.stringToDate(endDate));
					}else{
						assetHistory.setEndDate(null);
					}
					assetHistory.setTransDate(Calendar.getInstance().getTime());
					assetHistory.setCreatedDate(Calendar.getInstance().getTime());
					String createdBy = (String) assetCategoryObj.get("createdBy");
					assetHistory.setCreatedBy(createdBy);
					String actionBy = (String) assetCategoryObj.get("actionBy");
					assetHistory.setActionBy(actionBy);
					String actionDate = (String) assetCategoryObj.get("actionDate");
					if (StringUtils.isNotBlank(actionDate)){
						assetHistory.setActionDate(CalendarUtil.stringToDate(actionDate));
					}else{
						assetHistory.setActionDate(null);
					}
					Long actionTypeId = (Long) assetCategoryObj.get("actionStatusId");
					assetHistory.setActionStatus(Byte.valueOf(actionTypeId.byteValue()));
					assetHistory = assetHistoryService.saveOrUpdate(assetHistory);
				}
			}else{
				JSONObject assetCategoryObj = (JSONObject)obj;
				assetHistory = new AssetHistory();
				Long id =  (Long) assetCategoryObj.get("id");
				if (id != null){
					assetHistory.setId(id);
				}
				Long assetId = (Long) assetCategoryObj.get("assetId");
				assetHistory.setAssetId(assetId);
				String employee = (String) assetCategoryObj.get("employee");
				assetHistory.setEmployee(employee);
				String employeeNo = (String) assetCategoryObj.get("employeeNo");
				assetHistory.setEmployeeCode(employeeNo);
				String department = (String) assetCategoryObj.get("department");
				assetHistory.setDepartment(department);
				String locationCode = (String) assetCategoryObj.get("locationCode");
				assetHistory.setLocationCode(locationCode);
				String description = (String) assetCategoryObj.get("description");
				assetHistory.setDescription(description);
				String memo = (String) assetCategoryObj.get("memo");
				assetHistory.setMemo(memo);
				Long transTypeId = (Long) assetCategoryObj.get("transTypeId");
				assetHistory.setTransType(Byte.valueOf(transTypeId.byteValue()));
				String startDate = (String) assetCategoryObj.get("startDate");
				if (StringUtils.isNotBlank(startDate)){
					assetHistory.setStartDate(CalendarUtil.stringToDate(startDate));
				}else{
					assetHistory.setStartDate(null);
				}
				String endDate = (String) assetCategoryObj.get("endDate");
				if (StringUtils.isNotBlank(endDate)){
					assetHistory.setEndDate(CalendarUtil.stringToDate(endDate));
				}else{
					assetHistory.setEndDate(null);
				}
				assetHistory.setTransDate(Calendar.getInstance().getTime());
				assetHistory.setCreatedDate(Calendar.getInstance().getTime());
				String createdBy = (String) assetCategoryObj.get("createdBy");
				assetHistory.setCreatedBy(createdBy);
				String actionBy = (String) assetCategoryObj.get("actionBy");
				assetHistory.setActionBy(actionBy);
				String actionDate = (String) assetCategoryObj.get("actionDate");
				if (StringUtils.isNotBlank(actionDate)){
					assetHistory.setActionDate(CalendarUtil.stringToDate(actionDate));
				}else{
					assetHistory.setActionDate(null);
				}
				Long actionTypeId = (Long) assetCategoryObj.get("actionStatusId");
				assetHistory.setActionStatus(Byte.valueOf(actionTypeId.byteValue()));
				assetHistory = assetHistoryService.saveOrUpdate(assetHistory);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	    Asset asset = assetService.findById(assetHistory.getAssetId());
	    if (asset != null){
	    	if (assetHistory.getTransType() == StatusType.RETURN.getValue()){
	    		asset.setStatus(StatusType.AVAILABLE.getValue());
	    	}else{
	    		asset.setStatus(assetHistory.getTransType());
	    	}
		    assetService.update(asset);
	    }
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", assetHistory.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveAssetHistoryList");
	}

	@RequestMapping("/deleteAssetHistoryList")
	public void deleteAssetHistoryList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssetHistoryList");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssetHistoryList");
				JSONObject assetHistoryObj = (JSONObject)obj;
				Long id =  (Long) assetHistoryObj.get("id");
				AssetHistory assetHistory = assetHistoryService.findById(id);
				assetHistoryService.delete(assetHistory);
				AssetHistory lastedHistory =  assetHistoryService.getLastedHistory(assetHistory.getAssetId());
				if (lastedHistory != null){
					Asset asset = assetService.findById(lastedHistory.getAssetId());
					asset.setStatus(assetHistory.getTransType());
					asset.setEmployee(assetHistory.getEmployee());
					asset.setEmployeeCode(assetHistory.getEmployeeCode());
					asset.setDepartment(assetHistory.getDepartment());
					assetService.update(asset);
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
		logger.info("EWI : END METHOD - deleteAssetHistoryList");
	}


	@RequestMapping("/getAssetHistoryList")
	public void getAssetHistoryList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// String myOrgs = request.getParameter("myOrgs");
		String assetId = request.getParameter("assetId");


		// Criterion cRequestDate = Restrictions.and(cFromdate, cTodate);
		try {
			List<AssetHistory> list = assetHistoryService.getByAsset(Long.valueOf(assetId));

			JSONObject jsonCategory;
			for (AssetHistory his : list) {
				jsonCategory = new JSONObject();
				jsonCategory.put("id", his.getId());
				jsonCategory.put("assetId",  his.getAssetId());
				jsonCategory.put("transType",  StatusType.forValue(his.getTransType()).getLabel());
				jsonCategory.put("transTypeId",  his.getTransType());
				jsonCategory.put("transDate", CalendarUtil.dateToString(his.getTransDate()));
				jsonCategory.put("startDate", CalendarUtil.dateToString(his.getStartDate()));
				jsonCategory.put("endDate", CalendarUtil.dateToString(his.getEndDate()));
				jsonCategory.put("employee", his.getEmployee());
				jsonCategory.put("employeeNo", his.getEmployeeCode());
				jsonCategory.put("department", his.getDepartment());
				jsonCategory.put("locationCode", his.getLocationCode());
				jsonCategory.put("description", his.getDescription());
				jsonCategory.put("memo", his.getMemo());
				jsonCategory.put("createdBy", his.getCreatedBy());
				jsonCategory.put("createdDate", CalendarUtil.dateToString(his.getCreatedDate()));
				jsonCategory.put("actionStatus", StatusType.forValue(his.getActionStatus()).getLabel());
				jsonCategory.put("actionStatusId", his.getActionStatus());
				jsonCategory.put("actionBy", his.getActionBy());
				jsonCategory.put("actionDate",  CalendarUtil.dateToString(his.getActionDate()));

				array.add(jsonCategory);
			}
			obj.put("AssetHistoryList", array);
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
