package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

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

import tms.backend.domain.AssyProductDefect;
import tms.backend.service.AssyProductDefectService;
import tms.utils.StatusType;

@Controller
public class AssyProductDefectWS extends MultiActionController {
	@Autowired  
	private AssyProductDefectService assyProductDefectService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveAssyProductDefect")
	public void saveAssyProductDefect(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssyProductDefect");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	  
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	   
	    AssyProductDefect _AssyProductDefect = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductDefectList");
			
			if (obj instanceof JSONArray)
			{
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject assetCategoryObj = iter.next();
					
					Long id =  (Long) assetCategoryObj.get("id");
					if (id != null){
						_AssyProductDefect = assyProductDefectService.findById(id);
					}else{
						_AssyProductDefect = new AssyProductDefect();
					}
					String defectCode = String.valueOf(assetCategoryObj.get("defect_code"));
					_AssyProductDefect.setDefectCode(defectCode);
					
					String defectNameEn = String.valueOf(assetCategoryObj.get("defect_name_en"));
					_AssyProductDefect.setDefectNameEn(defectNameEn);
					
					Object status = assetCategoryObj.get("status");
					boolean checkStatus = Boolean.valueOf(status.toString());
					if(checkStatus)
					{
						
						_AssyProductDefect.setStatus(StatusType.OPEN.getValue());//1
					}
					else
					{
						
						_AssyProductDefect.setStatus(StatusType.CLOSE.getValue());//4
					}
					_AssyProductDefect = assyProductDefectService.saveOrUpdate(_AssyProductDefect);
					
				}
			}
			else
			{
				
				JSONObject assetCategoryObj = (JSONObject)obj;
				Long id =  (Long) assetCategoryObj.get("id");
				
				if (id != null){
					_AssyProductDefect = assyProductDefectService.findById(id);
					
				}else{
					_AssyProductDefect = new AssyProductDefect();
				}
				
				String defectCode = String.valueOf(assetCategoryObj.get("defect_code"));
				_AssyProductDefect.setDefectCode(defectCode);
				
				String defectNameEn = String.valueOf(assetCategoryObj.get("defect_name_en"));
				_AssyProductDefect.setDefectNameEn(defectNameEn);
				
				String defectNameVn = String.valueOf(assetCategoryObj.get("defect_name_vn"));
				_AssyProductDefect.setDefectNameVn(defectNameVn);
				
				
				Object status = assetCategoryObj.get("status");
				
				boolean checkStatus = Boolean.valueOf(status.toString());
				if(checkStatus)
				{
					_AssyProductDefect.setStatus(StatusType.OPEN.getValue()); //1
				}
				else
				{
					_AssyProductDefect.setStatus(StatusType.CLOSE.getValue());//4
				}
				
				_AssyProductDefect = assyProductDefectService.saveOrUpdate(_AssyProductDefect);
				
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
		logger.info("EWI : END METHOD - AssyProductDefect");
	}
	
	@RequestMapping("/deleteAssyProductDefect")
	public void deleteAssyProductDefect(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteAssyProductDefect");
		response.setContentType("text/html; charset=UTF-8");
		
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("AssyProductDefectList");
			
				JSONObject moldObj = (JSONObject)obj;
				AssyProductDefect AssyProductDefect = new AssyProductDefect();
				Long id =  (Long) moldObj.get("id");
				AssyProductDefect = assyProductDefectService.findById(id);
				assyProductDefectService.delete(AssyProductDefect);				
				
			
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

	

	@RequestMapping("/getAssyProductDefectList")
	public void getAssyProductDefectList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			List<AssyProductDefect> list = assyProductDefectService.getAll();
			
			JSONObject jsonAssyProductDefect;
			for (AssyProductDefect _assPM : list) 
			{
				
				jsonAssyProductDefect = new JSONObject();
				jsonAssyProductDefect.put("id", _assPM.getId());
				jsonAssyProductDefect.put("defect_code", _assPM.getDefectCode());
				jsonAssyProductDefect.put("defect_name_en", _assPM.getDefectNameEn());
				jsonAssyProductDefect.put("defect_name_vn", _assPM.getDefectNameVn());
				jsonAssyProductDefect.put("status", _assPM.getStatus() == StatusType.OPEN.getValue() ? true : false);
				
				
				array.add(jsonAssyProductDefect);
			}
			obj.put("AssyProductDefectList", array);
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

	@RequestMapping("/getAssyProductDefectActiveList")
	public void getAssyProductDefectActiveList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		Criterion cStatus = Restrictions.eq("status",
				Byte.parseByte("1"));
		
		String defectIds = request.getParameter("defectIds");
		List<AssyProductDefect> list  = null;
		if (StringUtils.isNotBlank(defectIds)){
			String[] str_ids = defectIds.split(";");
			Long ids [] = new Long[str_ids.length];
			for(int i=0;i<str_ids.length;i++){
				ids[i] = Long.parseLong(str_ids[i]);
			}
	
	//		if (StringUtils.isNotBlank(defectIds)){
	//			String[] ids = defectIds.split(",");
	//			for(String defectId : ids){
	//				map.put("id",Long.parseLong(defectId));
	//			}
	//		}
			if (ids.length == 0){
				obj.put("AssyProductDefectList", array);
				obj.put("message", 0);
				obj.put("success", true);
				return;
			}
			Criterion cDefects = Restrictions.in("id", ids);
			list = assyProductDefectService.getByCriteria(cStatus,cDefects);

		}else{
			list = assyProductDefectService.getByCriteria(cStatus);
		}
		
		
		try {
			
			JSONObject jsonAssyProductDefect;
			for (AssyProductDefect _assPM : list) 
			{
				
				jsonAssyProductDefect = new JSONObject();
				jsonAssyProductDefect.put("id", _assPM.getId());
				jsonAssyProductDefect.put("defect_code", _assPM.getDefectCode());
				jsonAssyProductDefect.put("defect_name_en", _assPM.getDefectNameEn());
				jsonAssyProductDefect.put("defect_name_vn", _assPM.getDefectNameVn());
				jsonAssyProductDefect.put("status", _assPM.getStatus() == StatusType.OPEN.getValue() ? true : false);
				
				
				array.add(jsonAssyProductDefect);
			}
			obj.put("AssyProductDefectList", array);
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
