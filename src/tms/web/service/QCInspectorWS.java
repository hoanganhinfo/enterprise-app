package tms.web.service;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
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

import tms.backend.domain.QcInspectionLine;
import tms.backend.domain.QcInspectionTable;
import tms.backend.service.QcInspectionLineService;
import tms.backend.service.QcInspectionTableService;
import tms.utils.CalendarUtil;
import tms.utils.ResourceUtil;
import tms.utils.StatusType;
import tms.utils.TransType;

@Controller
public class QCInspectorWS extends MultiActionController {
	@Autowired
	private QcInspectionTableService qcInspectionTableService;
	@Autowired
	private QcInspectionLineService qcInspectionLineService;

	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveQcInspectorTable")
	public void saveQcInspectorTable(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveQcInspectorTable");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    QcInspectionTable inspectionTable = new QcInspectionTable();
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("InspectionTableList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject inspectorObj = iter.next();
					inspectionTable = new QcInspectionTable();
					Long id =  (Long) inspectorObj.get("id");
					if (id != null){
						inspectionTable.setId(id);
					}
					String inspectedDate = (String) inspectorObj.get("inspectedDate");
					if (StringUtils.isNotBlank(inspectedDate)){
						inspectionTable.setInspectionDate(CalendarUtil.stringToDate(inspectedDate));
					}else{
						inspectionTable.setInspectionDate(null);
					}
					String receivedDate = (String) inspectorObj.get("receiveDate");
					if (StringUtils.isNotBlank(inspectedDate)){
						inspectionTable.setReceivedDate(CalendarUtil.stringToDate(receivedDate));
					}else{
						inspectionTable.setReceivedDate(null);
					}
					
					String productId = (String) inspectorObj.get("itemId");
					inspectionTable.setProductId(productId);
					String productName = (String) inspectorObj.get("itemName");
					inspectionTable.setProductName(productName);
					String vendorId = (String) inspectorObj.get("vendorId");
					inspectionTable.setVendor(vendorId);
					String vendorName = (String) inspectorObj.get("vendorName");
					inspectionTable.setVendorName(vendorName);
					String orderNo = (String) inspectorObj.get("orderNo");
					inspectionTable.setOrderNo(orderNo);
					Long partQty = (Long) inspectorObj.get("partQty");
					inspectionTable.setTransQty(partQty.doubleValue());
					Long checkedQty = (Long) inspectorObj.get("checkedQty");
					inspectionTable.setInspectionQty(checkedQty.doubleValue());
					Long criticalQty = (Long) inspectorObj.get("criticalQty");
					inspectionTable.setCritialDefect(criticalQty.intValue());
					Long majorQty = (Long) inspectorObj.get("majorQty");
					inspectionTable.setMajorDefect(majorQty.intValue());
					Long minorQty = (Long) inspectorObj.get("minorQty");
					inspectionTable.setMinorDefect(minorQty.intValue());
					Boolean accepted = (Boolean) inspectorObj.get("accepted");
					if (accepted.booleanValue()){
						inspectionTable.setIsAccept(new Byte("1"));
					}else{
						inspectionTable.setIsAccept(new Byte("0"));
					}
					Long transTypeId = (Long) inspectorObj.get("transTypeId");
					inspectionTable.setTransType(Byte.valueOf(transTypeId.byteValue()));
					inspectionTable = qcInspectionTableService.saveOrUpdate(inspectionTable);
				}
			}else{
				JSONObject inspectorObj = (JSONObject)obj;
				inspectionTable = new QcInspectionTable();
				Long id =  (Long) inspectorObj.get("id");
				if (id != null){
					inspectionTable.setId(id);
				}
				String inspectedDate = (String) inspectorObj.get("inspectedDate");
				if (StringUtils.isNotBlank(inspectedDate)){
					inspectionTable.setInspectionDate(CalendarUtil.stringToDate(inspectedDate));
				}else{
					inspectionTable.setInspectionDate(null);
				}
				String receivedDate = (String) inspectorObj.get("receiveDate");
				if (StringUtils.isNotBlank(inspectedDate)){
					inspectionTable.setReceivedDate(CalendarUtil.stringToDate(receivedDate));
				}else{
					inspectionTable.setReceivedDate(null);
				}
				String productId = (String) inspectorObj.get("itemId");
				inspectionTable.setProductId(productId);
				String productName = (String) inspectorObj.get("itemName");
				inspectionTable.setProductName(productName);
				String vendorId = (String) inspectorObj.get("vendorId");
				inspectionTable.setVendor(vendorId);
				String vendorName = (String) inspectorObj.get("vendorName");
				inspectionTable.setVendorName(vendorName);
				String orderNo = (String) inspectorObj.get("orderNo");
				inspectionTable.setOrderNo(orderNo);
				Long partQty = (Long) inspectorObj.get("partQty");
				inspectionTable.setTransQty(partQty.doubleValue());
				Long checkedQty = (Long) inspectorObj.get("checkedQty");
				inspectionTable.setInspectionQty(checkedQty.doubleValue());
				Long criticalQty = (Long) inspectorObj.get("criticalQty");
				inspectionTable.setCritialDefect(criticalQty.intValue());
				Long majorQty = (Long) inspectorObj.get("majorQty");
				inspectionTable.setMajorDefect(majorQty.intValue());
				Long minorQty = (Long) inspectorObj.get("minorQty");
				inspectionTable.setMinorDefect(minorQty.intValue());
				String result = (String) inspectorObj.get("result");
				if (!StringUtils.isEmpty(result)){
					inspectionTable.setStatus(new Byte(result));
				}
				Boolean accepted = (Boolean) inspectorObj.get("accepted");
				if (accepted.booleanValue()){
					inspectionTable.setIsAccept(new Byte("1"));
				}else{
					inspectionTable.setIsAccept(new Byte("0"));
				}
				Long transTypeId = (Long) inspectorObj.get("transTypeId");
				inspectionTable.setTransType(Byte.valueOf(transTypeId.byteValue()));
				inspectionTable = qcInspectionTableService.saveOrUpdate(inspectionTable);	
				
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", inspectionTable.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveQcInspectorTable");
	}

	@RequestMapping("/deleteQcInspectorTable")
	public void deleteQcInspectorTable(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteQcInspectorTable");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("InspectionTableList");
			
				JSONObject inspectionTableObj = (JSONObject)obj;
				Long id =  (Long) inspectionTableObj.get("id");
				QcInspectionTable qcProductTest = qcInspectionTableService.findById(id);
				qcInspectionTableService.delete(qcProductTest);
				 Criterion cInspectionId = Restrictions.eq("inspectionId", id);
				List<QcInspectionLine> inspectionLineList = qcInspectionLineService.getByCriteria(cInspectionId);
				for(QcInspectionLine line : inspectionLineList){
					qcInspectionLineService.delete(line);
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
		logger.info("EWI : END METHOD - deleteQcInspectorTable");
	}

	@RequestMapping("/getQcInspectorTableList")
	public void getQcInspectorTableList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException, ParseException {
		response.setContentType("text/html; charset=UTF-8");
		String start = request.getParameter("start");
		String limit = request.getParameter("limit");
		String paramItemId = request.getParameter("itemId");
		String paramItemName = request.getParameter("itemName");
		String dateinspectedFrom = request.getParameter("dateinspectedFrom");
		String dateinspectedTo = request.getParameter("dateinspectedTo");
		String transType = request.getParameter("transType");
		
		if (StringUtils.isBlank(paramItemId)) {
			paramItemId = "*";
		}
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		Criterion cTransType = null;
		if (StringUtils.isNotBlank(transType)
				&& Long.valueOf(transType).byteValue() != TransType.ALL.getValue()){
			cTransType = Restrictions.eq("transType", Byte.valueOf(transType));
		}
		Criterion cItemId;
		Criterion cItemName = null;
		if (StringUtils.isNotBlank(paramItemName)){
			if (paramItemName.contains("*")){
				cItemName = Restrictions.like("productName", paramItemName.replace("*", "%"));
			}else{
				cItemName = Restrictions.eq("productName", paramItemName);
			}
		}
		Criterion cInspectedDate =Restrictions.between("inspectionDate", CalendarUtil
				.startOfDay(CalendarUtil.stringToDate(dateinspectedFrom,
						ResourceUtil.isoDateFormat)), CalendarUtil
				.endOfDay(CalendarUtil.stringToDate(dateinspectedTo,
						ResourceUtil.isoDateFormat)));


		System.out.println("load test data ...");
		Set<QcInspectionTable> testSet = new HashSet<QcInspectionTable>();
		if (StringUtils.isNotBlank(paramItemId)) {
			String[] keywords = paramItemId.split(";");
			List<String> serialList = new ArrayList<String>();
			for (String itemId : keywords) {
				if (!itemId.contains("*")) {
					serialList.add(itemId);
				}
			}

			List<QcInspectionTable> list = null;
			if (!serialList.isEmpty()) {
				cItemId = Restrictions.in("productId", serialList);

				list = qcInspectionTableService.getByCriteria(cItemId, cItemName,cInspectedDate,cTransType);
				for (QcInspectionTable test : list) {
					testSet.add(test);
				}
			}
			System.out.println("load  data with like");
			for (String itemId : keywords) {
				if (itemId.contains("*")) {
					cItemId = Restrictions.like("productId",
							itemId.replace("*", "%"));
					list = qcInspectionTableService.getByCriteria(cItemId,cItemName,cInspectedDate,cTransType);
					for (QcInspectionTable test : list) {
						testSet.add(test);
					}
				}
			}
		} else {
			List<QcInspectionTable> list = null;
			list = qcInspectionTableService.getByCriteria(cItemName,cInspectedDate,cTransType);
			for (QcInspectionTable test : list) {
				testSet.add(test);
			}
		}
		try {
			List<QcInspectionTable> list = new ArrayList<QcInspectionTable>(testSet);
			//list = qcInspectionTableService.getByCriteria(cInspectedDate);
			Collections.sort(list, new Comparator<QcInspectionTable>(){

				@Override
				public int compare(QcInspectionTable o1, QcInspectionTable o2) {
					if (o1.getInspectionDate() != null && o2.getInspectionDate() != null){
						if (!o2.getInspectionDate().equals(o1.getInspectionDate())){ 
							return o2.getInspectionDate().compareTo(o1.getInspectionDate());
						}else{
							return o2.getId().compareTo(o1.getId());
						}
							
					}
//					if (o1.getInspectionDate() != null && o2.getInspectionDate() != null){
//						return o2.getInspectionDate().compareTo(o1.getInspectionDate());
//					}
					return -1;
					
				}
		          
		       });
			int count = 0;
			int startNum = Integer.parseInt(start);//Integer.parseInt(start)*Integer.parseInt(limit) - (Integer.parseInt(limit) + 1);
			int maxNum = startNum + Integer.parseInt(limit) - 1;
			if (startNum == -1){
				maxNum = list.size();
			}
			JSONObject jsonCategory;
			for (QcInspectionTable product : list) {
				if (count > maxNum){
					break;
				}
				
				if (count >=startNum && count <=maxNum){
				LinkedHashMap jsonLinkMap = new LinkedHashMap();
				//jsonCategory = new JSONObject();
				if (startNum != -1){
				jsonLinkMap.put("id", product.getId());
				}
				jsonLinkMap.put("receiveDate", CalendarUtil.dateToString(product.getReceivedDate()));
				if (startNum == -1){
					jsonLinkMap.put("inspectedDate", CalendarUtil.dateToString(product.getInspectionDate()));
				}else{
					jsonLinkMap.put("inspectedDate", CalendarUtil.dateToString(product.getInspectionDate()));	
				}
				jsonLinkMap.put("itemId", product.getProductId());
				System.out.println("Itemid: " + product.getProductId());
				jsonLinkMap.put("itemName", product.getProductName()==null?"":product.getProductName().replaceAll(","," "));
				jsonLinkMap.put("vendorId", product.getVendor());
				jsonLinkMap.put("vendorName", product.getVendorName()==null?"":product.getVendorName().replaceAll(","," "));
				jsonLinkMap.put("orderNo", product.getOrderNo()==null?"":product.getOrderNo().replaceAll(","," "));
				jsonLinkMap.put("partQty", product.getTransQty()==null?"":product.getTransQty());
				jsonLinkMap.put("checkedQty", product.getInspectionQty()==null?"":product.getInspectionQty());
				jsonLinkMap.put("criticalQty", product.getCritialDefect()==null?"":product.getCritialDefect());
				if (product.getInspectionQty()!= null &&  product.getInspectionQty()!= 0){
					jsonLinkMap.put("%Critical", product.getCritialDefect()==null?"":product.getCritialDefect()/product.getInspectionQty());
				}else{
					jsonLinkMap.put("%Critical", "");
				}
				jsonLinkMap.put("majorQty", product.getMajorDefect()==null?"":product.getMajorDefect());
				if (product.getInspectionQty()!= null &&  product.getInspectionQty()!= 0){
					jsonLinkMap.put("%Major", product.getMajorDefect()==null?"":product.getMajorDefect()/product.getInspectionQty());
				}else{
					jsonLinkMap.put("%Major","");
				}
				jsonLinkMap.put("minorQty", product.getMinorDefect()==null?"":product.getMinorDefect());
				if (product.getInspectionQty()!= null &&  product.getInspectionQty()!= 0){
					jsonLinkMap.put("%Minor", product.getMinorDefect()==null?"":product.getMinorDefect()/product.getInspectionQty());
				}else{
					jsonLinkMap.put("%Minor", "");
				}
				if (startNum != -1){
					jsonLinkMap.put("accepted", (product.getIsAccept()==null || product.getIsAccept()==0)?false:true);
				}else{
					jsonLinkMap.put("accepted", (product.getIsAccept()==null || product.getIsAccept()==0)?"No":"Yes");
				}
				if (startNum != -1){
					jsonLinkMap.put("result", (product.getStatus()!=null?product.getStatus().toString():""));
					jsonLinkMap.put("resultName", (product.getStatus()!=null?StatusType.forValue(product.getStatus().byteValue()).getLabel():""));
				}else{
					jsonLinkMap.put("result", (product.getStatus()!=null?StatusType.forValue(product.getStatus().byteValue()).getLabel():""));
				}
				if (startNum == -1){
					 Criterion cInspectionId = Restrictions.eq("inspectionId",product.getId());
					 List<QcInspectionLine> inspectionLineList = qcInspectionLineService.getByCriteria(cInspectionId);
					 String defectname = "";
					 String memo = "";
					 for (QcInspectionLine inspectionLine : inspectionLineList) {
						 defectname+=inspectionLine.getDefectName().replaceAll(",", " ")+" ; ";
						 memo+=inspectionLine.getMemo().replaceAll(",", " ")+" ; ";
					 }
					 jsonLinkMap.put("defectName", defectname);
					 jsonLinkMap.put("memo", memo);
				}
				
				if (startNum != -1){
				jsonLinkMap.put("transDate", CalendarUtil.dateToString(product.getTransDate()));
				
				
				jsonLinkMap.put("inspector", "");
				jsonLinkMap.put("transType",  TransType.forValue(product.getTransType()).getLabel());
				jsonLinkMap.put("transTypeId",  product.getTransType());
				}
				//array.add(jsonCategory);
				String s = JSONValue.toJSONString(jsonLinkMap);
				jsonCategory =  new JSONObject(jsonLinkMap);
				if (startNum == -1){
					array.add(s.replaceAll("null", "\"\""));
				}else{
					array.add(jsonCategory);	
				}
				}
				count++;
			}
			obj.put("InspectionTableList", array);
			obj.put("totalCount", testSet.size());
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

	@RequestMapping("/saveQcInspectorLine")
	public void saveQcInspectorLine(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveQcInspectorLine");
		response.setContentType("text/html; charset=UTF-8");
		
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    QcInspectionLine inspectionLine = new QcInspectionLine();
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("InspectionLineList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject inspectorLineObj = iter.next();
					inspectionLine = new QcInspectionLine();
					Long id =  (Long) inspectorLineObj.get("id");
					if (id != null){
						inspectionLine.setId(id);
					}
					Long inspectorId = (Long) inspectorLineObj.get("inspectorId");
					inspectionLine.setInspectionId(inspectorId);
					String defectCode = (String) inspectorLineObj.get("defectCode");
					inspectionLine.setDefectCode(defectCode);
					String defectName = (String) inspectorLineObj.get("defectName");
					inspectionLine.setDefectName(defectName);
					Long defectQty = (Long) inspectorLineObj.get("defectQty");
					inspectionLine.setDefectQty(defectQty.intValue());
					String defectLevel = (String) inspectorLineObj.get("defectLevel");
					inspectionLine.setDefectLevel(defectLevel);
					String memo = (String) inspectorLineObj.get("memo");
					inspectionLine.setMemo(memo);
//					Long defectLevel = (Long) inspectorLineObj.get("defectLevel");
//					inspectionLine.setDefectLevel(defectLevel);
					inspectionLine = qcInspectionLineService.saveOrUpdate(inspectionLine);
				}
			}else{
				JSONObject inspectorLineObj = (JSONObject)obj;
				inspectionLine = new QcInspectionLine();
				Long id =  (Long) inspectorLineObj.get("id");
				if (id != null){
					inspectionLine.setId(id);
				}
				Long inspectorId = (Long) inspectorLineObj.get("inspectorId");
				inspectionLine.setInspectionId(inspectorId);
				String defectCode = (String) inspectorLineObj.get("defectCode");
				inspectionLine.setDefectCode(defectCode);
				String defectName = (String) inspectorLineObj.get("defectName");
				inspectionLine.setDefectName(defectName);
				Long defectQty = (Long) inspectorLineObj.get("defectQty");
				inspectionLine.setDefectQty(defectQty.intValue());
				String defectLevel = (String) inspectorLineObj.get("defectLevel");
				inspectionLine.setDefectLevel(defectLevel);
				String memo = (String) inspectorLineObj.get("memo");
				inspectionLine.setMemo(memo);
//				Long defectLevel = (Long) inspectorLineObj.get("defectLevel");
//				inspectionLine.setDefectLevel(defectLevel);
				inspectionLine = qcInspectionLineService.saveOrUpdate(inspectionLine);
				
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", inspectionLine.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveQcInspector");
	}
	@RequestMapping("/deleteQcInspectorLine")
	public void deleteQcInspectorLine(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteQcInspectorLine");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("InspectionLineList");
			
				JSONObject inspectionLineObj = (JSONObject)obj;
				Long id =  (Long) inspectionLineObj.get("id");
				QcInspectionLine line = qcInspectionLineService.findById(id);
				qcInspectionLineService.delete(line);
				
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteQcInspectorLine");
	}

	@RequestMapping("/getQcInspectorLineList")
	public void getQcInspectorLineList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String inspectorId = request.getParameter("inspectorId");


		 Criterion cInspectionId = Restrictions.eq("inspectionId", Long.valueOf(inspectorId));
		try {
			List<QcInspectionLine> list = qcInspectionLineService.getByCriteria(cInspectionId);
			JSONObject jsonCategory;
			for (QcInspectionLine inspectionLine : list) {
				jsonCategory = new JSONObject();
				jsonCategory.put("id", inspectionLine.getId());
				jsonCategory.put("inspectorId", inspectionLine.getInspectionId());
				jsonCategory.put("defectCode", inspectionLine.getDefectCode());
				jsonCategory.put("defectName", inspectionLine.getDefectName());
				jsonCategory.put("defectQty", inspectionLine.getDefectQty());
				jsonCategory.put("defectLevel", inspectionLine.getDefectLevel());
				jsonCategory.put("memo", inspectionLine.getMemo());
				array.add(jsonCategory);
			}
			obj.put("InspectionLineList", array);
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
