package tms.web.service;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.HashMap;
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
import tms.backend.domain.AssetHistory;
import tms.backend.domain.InjMold;
import tms.backend.domain.InjRegrindRate;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.backend.service.InjMoldService;
import tms.backend.service.InjRegrindRateService;
import tms.backend.service.InjRegrindorderService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

@Controller
public class InjRegrindRateWS extends MultiActionController {
	@Autowired
	private InjMoldService injMoldService;
	@Autowired
	private InjRegrindRateService injRegrindRateService;
	@Autowired
	private SessionFactory sessionFactory;
	
	@RequestMapping("/saveInjRegrindRate")
	public void saveInjRegrindRate(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		 System.out.println("\n--------------begin----------------\n");
		
		logger.info("EWI : START METHOD - saveInjMold");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	  
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	  //  InjMold mold= null;
	    InjRegrindRate injRR = null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("InjRegrindRateList");
			  System.out.println("\n--------------get root----------------\n");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				  System.out.println("\n--------------inter----------------\n");
				while(iter.hasNext()){
					
					JSONObject injRegrindRateObj = iter.next();
					
					Long id = (Long) injRegrindRateObj.get("id");
					
					if (id != null){
						injRR = injRegrindRateService.findById(id);
					}else{
						injRR = new InjRegrindRate();
					}
					
					  System.out.println("\n--------------begin while----------------\n");
					
			
					String productCode = (String) injRegrindRateObj.get("product_code");
					injRR.setProductCode(productCode);
					String productName = (String) injRegrindRateObj.get("product_name");
					injRR.setProductName(productName);
					String virginMaterialCode = (String) injRegrindRateObj.get("virgin_material_code");
					injRR.setVirginMaterialCode(virginMaterialCode);
					String virginMaterialName = (String) injRegrindRateObj.get("virgin_material_name");
					injRR.setVirginMaterialName(virginMaterialName);
					String masterbatchCode = (String) injRegrindRateObj.get("masterbatch_code");
					injRR.setMasterbatchCode(masterbatchCode);
					String masterbatchName = (String) injRegrindRateObj.get("masterbatch_name");
					injRR.setMasterbatchName(masterbatchName);
					String regrindResinCode = (String) injRegrindRateObj.get("regrind_resin_code");
					injRR.setRegrindResinCode(regrindResinCode);
					String regrindResinName = (String) injRegrindRateObj.get("regrind_resin_name");
					injRR.setRegrindResinName(regrindResinName);
					
					

					Object _obj0 = (Object) injRegrindRateObj.get("color_rate");
			  		
			  		if(_obj0 != null)
			  		{
			  				String	colorRate =  injRegrindRateObj.get("color_rate").toString();
							if (StringUtils.isNotBlank(colorRate))
							{
								injRR.setColorRate(Double.parseDouble(colorRate));
							}
			  		}
			  		else
			  		{
			  			System.out.println("\n--------------_obj0 = null----------------\n");
			  		}
					
					
			  		System.out.println("\n--------------color----------------\n");
			  		Object _obj1 = (Object) injRegrindRateObj.get("regrind_rate");
			  		
			  		if(_obj1 != null)
			  		{
			  				String	regrindRate =  injRegrindRateObj.get("regrind_rate").toString();
							if (StringUtils.isNotBlank(regrindRate))
							{
								injRR.setRegrindRate(Double.parseDouble(regrindRate));
							}
			  		}
			  		else
			  		{
			  			System.out.println("\n--------------_obj1 = null----------------\n");
			  		}
			  			
				    
				    Object _obj2 = (Object) injRegrindRateObj.get("constant_scrap");
				    if(_obj2!=null)
				    {
						    String constantscrap = injRegrindRateObj.get("constant_scrap").toString();
							if(StringUtils.isNotBlank( constantscrap))
							{
								injRR.setConstantScrap(Double.parseDouble( constantscrap));
							}
				    }
				    else
				    {
				    	System.out.println("\n--------------_obj2 = null----------------\n");
				    }
					
				   // runner_weight,product_weight
					
				    Object _obj3 = (Object) injRegrindRateObj.get("runner_weight");
			  		
			  		if(_obj3 != null)
			  		{
			  				String	runnerweight =  injRegrindRateObj.get("runner_weight").toString();
							if (StringUtils.isNotBlank(runnerweight))
							{
								injRR.setRunnerWeight(Double.parseDouble(runnerweight));
							}
			  		}
			  		else
			  		{
			  			System.out.println("\n--------------_obj3 = null----------------\n");
			  		}
			  		
			  		 Object _obj4 = (Object) injRegrindRateObj.get("product_weight");
				  		
				  		if(_obj4 != null)
				  		{
				  				String	productWeight =  injRegrindRateObj.get("product_weight").toString();
								if (StringUtils.isNotBlank(productWeight))
								{
									injRR.setProductWeight(Double.parseDouble(productWeight));
								}
				  		}
				  		else
				  		{
				  			System.out.println("\n--------------_obj4 = null----------------\n");
				  		}
				 
					injRR = injRegrindRateService.saveOrUpdate(injRR);
				}
			}else{
				  System.out.println("\n--------------begin else----------------\n");
				JSONObject injRegrindRateObj = (JSONObject)obj; 
				
				Long id = (Long) injRegrindRateObj.get("id");
				
				if (id != null)
				{
					
					 System.out.println("\n------------injRegrindRateService 1-------\n");
					injRR = injRegrindRateService.findById(id);
					 System.out.println("\n-------------injRegrindRateService 2-------\n");
					
				}else
				{
					injRR = new InjRegrindRate();
					
				}
				
				String productCode = (String) injRegrindRateObj.get("product_code");
				injRR.setProductCode(productCode);
				String productName = (String) injRegrindRateObj.get("product_name");
				injRR.setProductName(productName);
				 System.out.println("\n--------------partName----------------\n");
				String virginMaterialCode = (String) injRegrindRateObj.get("virgin_material_code");
				injRR.setVirginMaterialCode(virginMaterialCode);
				String virginMaterialName = (String) injRegrindRateObj.get("virgin_material_name");
				injRR.setVirginMaterialName(virginMaterialName);
				String masterbatchCode = (String) injRegrindRateObj.get("masterbatch_code");
				injRR.setMasterbatchCode(masterbatchCode);
				String masterbatchName = (String) injRegrindRateObj.get("masterbatch_name");
				injRR.setMasterbatchName(masterbatchName);
				String regrindResinCode = (String) injRegrindRateObj.get("regrind_resin_code");
				injRR.setRegrindResinCode(regrindResinCode);
				String regrindResinName = (String) injRegrindRateObj.get("regrind_resin_name");
				injRR.setRegrindResinName(regrindResinName);
				
				
				
						Object _obj0 = (Object) injRegrindRateObj.get("color_rate");
				  		
				  		if(_obj0 != null)
				  		{
				  				String	colorRate =  injRegrindRateObj.get("color_rate").toString();
								if (StringUtils.isNotBlank(colorRate))
								{
									injRR.setColorRate(Double.parseDouble(colorRate));
								}
				  		}
				  		else
				  		{
				  			System.out.println("\n--------------_obj0 = null----------------\n");
				  		}
				
				  		System.out.println("\n--------------color----------------\n");
				  		Object _obj1 = (Object) injRegrindRateObj.get("regrind_rate");
				  		
				  		if(_obj1 != null)
				  		{
				  				String	regrindRate =  injRegrindRateObj.get("regrind_rate").toString();
								if (StringUtils.isNotBlank(regrindRate))
								{
									injRR.setRegrindRate(Double.parseDouble(regrindRate));
								}
				  		}
				  		else
				  		{
				  			System.out.println("\n--------------_obj1 = null----------------\n");
				  		}
				  			
					    
					    Object _obj2 = (Object) injRegrindRateObj.get("constant_scrap");
					    if(_obj2!=null)
					    {
							    String constantscrap = injRegrindRateObj.get("constant_scrap").toString();
								if(StringUtils.isNotBlank( constantscrap))
								{
									injRR.setConstantScrap(Double.parseDouble( constantscrap));
								}
					    }
					    else
					    {
					    	System.out.println("\n--------------_obj2 = null----------------\n");
					    }
						
					   // runner_weight,product_weight
						
					    Object _obj3 = (Object) injRegrindRateObj.get("runner_weight");
				  		
				  		if(_obj3 != null)
				  		{
				  				String	runnerweight =  injRegrindRateObj.get("runner_weight").toString();
								if (StringUtils.isNotBlank(runnerweight))
								{
									injRR.setRunnerWeight(Double.parseDouble(runnerweight));
								}
				  		}
				  		else
				  		{
				  			System.out.println("\n--------------_obj3 = null----------------\n");
				  		}
				  		
				  		 Object _obj4 = (Object) injRegrindRateObj.get("product_weight");
					  		
					  		if(_obj4 != null)
					  		{
					  				String	productWeight =  injRegrindRateObj.get("product_weight").toString();
									if (StringUtils.isNotBlank(productWeight))
									{
										injRR.setProductWeight(Double.parseDouble(productWeight));
									}
					  		}
					  		else
					  		{
					  			System.out.println("\n--------------_obj4 = null----------------\n");
					  		}
					 
				injRR = injRegrindRateService.saveOrUpdate(injRR);
					
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter(); 
		obj.put("message",injRR.getId()); 
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveInjMold");
	}


	@RequestMapping("/deleteInjRegrindRate")
	public void deleteInjRegrindRate(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteInjMold");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("InjRegrindRateList");
			
				//JSONObject moldObj = (JSONObject)obj;
				JSONObject regrindRateListObj = (JSONObject)obj;
				InjRegrindRate regrindratelist = new InjRegrindRate();
				Long id =  (Long) regrindRateListObj.get("id");
				System.out.println("\n-----SELECT ID ---- "+id+"-----\n");
				regrindratelist = injRegrindRateService.findById(id);
				injRegrindRateService.delete(regrindratelist);				
				
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteInjMold");
	}

	
	
	@RequestMapping("/getMoldRegrindRate")
	public void getMoldRegrindRate(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// System.out.println("\n--------------begin-load---------------\n");
		try {
			//System.out.println("\n------begin 0 ----\n");
			List<InjRegrindRate> list = injRegrindRateService.getAll(); 
			//System.out.println("\n------begin 1----\n");
			JSONObject jsonRegrindRate;
			//System.out.println("\n----begin load----\n");
			for (InjRegrindRate _injRs : list) 
			{
				//System.out.println("\n----no 1----\n");
				jsonRegrindRate = new JSONObject();
				jsonRegrindRate.put("id", _injRs.getId());
				//System.out.println("\n------no 2----\n");
				jsonRegrindRate.put("product_code", _injRs.getProductCode());
				jsonRegrindRate.put("product_name",_injRs.getProductName());
				jsonRegrindRate.put("virgin_material_code", _injRs.getVirginMaterialCode());
				jsonRegrindRate.put("virgin_material_name", _injRs.getVirginMaterialName());
				jsonRegrindRate.put("masterbatch_code",_injRs.getMasterbatchCode());
				//System.out.println("\n------success 1----\n");
				jsonRegrindRate.put("masterbatch_name", _injRs.getMasterbatchName());
				jsonRegrindRate.put("regrind_resin_code", _injRs.getRegrindResinCode());
				jsonRegrindRate.put("regrind_resin_name",_injRs.getRegrindResinName());
				jsonRegrindRate.put("color_rate", _injRs.getColorRate());
			//	System.out.println("------------------kakaka-----------------");
				
			
				jsonRegrindRate.put("regrind_rate", _injRs.getRegrindRate());		
				jsonRegrindRate.put("constant_scrap", _injRs.getConstantScrap());
				
				jsonRegrindRate.put("runner_weight", _injRs.getRunnerWeight());		
				jsonRegrindRate.put("product_weight", _injRs.getProductWeight());
				
				array.add(jsonRegrindRate);
	
				
			}
			obj.put("InjRegrindRateList", array);
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
	

	@RequestMapping("/getMoldRegrindRateByProductCode")
	public void getMoldRegrindRateByProductCode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// System.out.println("\n--------------begin-load---------------\n");
		
		String productCode = request.getParameter("product_code");
		System.out.println("\n---productCode---"+productCode+" ----\n");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("productCode",productCode);
		
		
		try {
			
			List<InjRegrindRate> list = injRegrindRateService.getByProperty(map, null, true, true); 
			//System.out.println("\n------begin 1----\n");
			JSONObject jsonRegrindRate;
			//System.out.println("\n----begin load----\n");
			for (InjRegrindRate _injRs : list) 
			{
				//System.out.println("\n----no 1----\n");
				jsonRegrindRate = new JSONObject();
				jsonRegrindRate.put("id", _injRs.getId());
				//System.out.println("\n------no 2----\n");
				jsonRegrindRate.put("product_code", _injRs.getProductCode());
				jsonRegrindRate.put("product_name",_injRs.getProductName());
				jsonRegrindRate.put("virgin_material_code", _injRs.getVirginMaterialCode());
				jsonRegrindRate.put("virgin_material_name", _injRs.getVirginMaterialName());
				jsonRegrindRate.put("masterbatch_code",_injRs.getMasterbatchCode());
				//System.out.println("\n------success 1----\n");
				jsonRegrindRate.put("masterbatch_name", _injRs.getMasterbatchName());
				jsonRegrindRate.put("regrind_resin_code", _injRs.getRegrindResinCode());
				jsonRegrindRate.put("regrind_resin_name",_injRs.getRegrindResinName());
				jsonRegrindRate.put("color_rate", _injRs.getColorRate());
			//	System.out.println("------------------kakaka-----------------");
				
			
				jsonRegrindRate.put("regrind_rate", _injRs.getRegrindRate());		
				jsonRegrindRate.put("constant_scrap", _injRs.getConstantScrap());
				
				jsonRegrindRate.put("runner_weight", _injRs.getRunnerWeight());		
				jsonRegrindRate.put("product_weight", _injRs.getProductWeight());
				
				array.add(jsonRegrindRate);
	
				
			}
			obj.put("InjRegrindRateList", array);
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
