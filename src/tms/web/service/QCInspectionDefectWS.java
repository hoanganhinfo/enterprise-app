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

import tms.backend.domain.QcInspectionDefect;
import tms.backend.service.QcInspectionDefectService;
import tms.utils.StatusType;

@Controller
public class QCInspectionDefectWS extends MultiActionController {
	@Autowired  
	private QcInspectionDefectService qcInspectionDefectService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveQCInspectionDefect")
	public void saveQCInspectionDefect(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveQCInspectionDefect");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	  
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	   
	    QcInspectionDefect _qcInspectionDefect = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("QCInspectionDefectList");
			
			if (obj instanceof JSONArray)
			{
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						_qcInspectionDefect = qcInspectionDefectService.findById(id);
					}else{
						_qcInspectionDefect = new QcInspectionDefect();
					}
					String defectCode = String.valueOf(assetCategoryObj.get("defectCode"));
					_qcInspectionDefect.setDefectCode(defectCode);
					
					String defectNameEn = String.valueOf(assetCategoryObj.get("defectNameEN"));
					_qcInspectionDefect.setDefectNameEn(defectNameEn);
					
					Object status = assetCategoryObj.get("status");
					boolean checkStatus = Boolean.valueOf(status.toString());
					if(checkStatus)
					{
						
						_qcInspectionDefect.setStatus(StatusType.OPEN.getValue());//1
					}
					else
					{
						
						_qcInspectionDefect.setStatus(StatusType.CLOSE.getValue());//4
					}
					_qcInspectionDefect = qcInspectionDefectService.saveOrUpdate(_qcInspectionDefect);
					
				}
			}
			else
			{
				
				JSONObject assetCategoryObj = (JSONObject)obj;
				Long id =  (Long) assetCategoryObj.get("id");
				
				if (id != null){
					_qcInspectionDefect = qcInspectionDefectService.findById(id);
					
				}else{
					_qcInspectionDefect = new QcInspectionDefect();
				}
				
				String defectCode = String.valueOf(assetCategoryObj.get("defectCode"));
				_qcInspectionDefect.setDefectCode(defectCode);
				
				String defectNameEn = String.valueOf(assetCategoryObj.get("defectNameEN"));
				_qcInspectionDefect.setDefectNameEn(defectNameEn);
				
				String defectNameVn = String.valueOf(assetCategoryObj.get("defectnameVN"));
				_qcInspectionDefect.setDefectNameVn(defectNameVn);
				
				
				Object status = assetCategoryObj.get("status");
				
				boolean checkStatus = Boolean.valueOf(status.toString());
				if(checkStatus)
				{
					_qcInspectionDefect.setStatus(StatusType.OPEN.getValue()); //1
				}
				else
				{
					_qcInspectionDefect.setStatus(StatusType.CLOSE.getValue());//4
				}
				
				_qcInspectionDefect = qcInspectionDefectService.saveOrUpdate(_qcInspectionDefect);
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", _qcInspectionDefect.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveQCInspectionDefect");
	}
	
	@RequestMapping("/deleteQcInspectionDefect")
	public void deleteQcInspectionDefect(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteQcInspectionDefect");
		response.setContentType("text/html; charset=UTF-8");
		
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("QCInspectionDefectList");
			
				JSONObject moldObj = (JSONObject)obj;
				QcInspectionDefect qcInspectionDefect = new QcInspectionDefect();
				Long id =  (Long) moldObj.get("id");
				qcInspectionDefect = qcInspectionDefectService.findById(id);
				qcInspectionDefectService.delete(qcInspectionDefect);				
				
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteAssyProductDefect");
	}

	

	@RequestMapping("/getQcInspectionDefectList")
	public void getQcInspectionDefectList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			List<QcInspectionDefect> list = qcInspectionDefectService.getAll();
			
			JSONObject jsonAssyProductDefect;
			for (QcInspectionDefect _defect : list) 
			{
				
				jsonAssyProductDefect = new JSONObject();
				jsonAssyProductDefect.put("id", _defect.getId());
				jsonAssyProductDefect.put("defectCode", _defect.getDefectCode());
				jsonAssyProductDefect.put("defectNameEN", _defect.getDefectNameEn());
				jsonAssyProductDefect.put("defectnameVN", _defect.getDefectNameVn());
				jsonAssyProductDefect.put("status", _defect.getStatus() == StatusType.OPEN.getValue() ? true : false);
				
				
				array.add(jsonAssyProductDefect);
			}
			obj.put("QCInspectionDefectList", array);
			obj.put("totalCount", array.size());
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

	@RequestMapping("/getQcInspectionDefectActiveList")
	public void getQcInspectionDefectActiveList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		Criterion cStatus = Restrictions.eq("status", StatusType.OPEN.getValue());
		try {
			List<QcInspectionDefect> list = qcInspectionDefectService.getByCriteria(cStatus);
			
			JSONObject jsonAssyProductDefect;
			for (QcInspectionDefect _defect : list) 
			{
				
				jsonAssyProductDefect = new JSONObject();
				jsonAssyProductDefect.put("id", _defect.getId());
				jsonAssyProductDefect.put("defectCode", _defect.getDefectCode());
				jsonAssyProductDefect.put("defectNameEN", _defect.getDefectNameEn());
				jsonAssyProductDefect.put("defectnameVN", _defect.getDefectNameVn());
				jsonAssyProductDefect.put("status", _defect.getStatus() == StatusType.OPEN.getValue() ? true : false);
				
				
				array.add(jsonAssyProductDefect);
			}
			obj.put("QCInspectionDefectList", array);
			obj.put("message", 0);
			obj.put("success", true);
			obj.put("totalCount", array.size());
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}

	
}
