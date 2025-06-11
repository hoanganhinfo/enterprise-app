package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.math.NumberUtils;
import org.hibernate.SessionFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.WellingtonMotor;
import tms.backend.service.WellingtonMotorService;

@Controller
public class WellingtonMotorWS extends MultiActionController {
	@Autowired
	private WellingtonMotorService wellingtonMotorService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveWellingtonMotor")
	public void saveWellingtonMotor(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveWellingtonMotor");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	   
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }   
	    WellingtonMotor motor= null;
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("WellingtonMotorList");
			
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				
				while(iter.hasNext()){
					JSONObject moldObj = iter.next();
					
					Long id =  (Long) moldObj.get("id");
					if (id != null){
						motor = wellingtonMotorService.findById(id);
					}else{
						motor = new WellingtonMotor();
					}
					String motorId = (String) moldObj.get("code");
					motor.setMotorId(motorId);
					String motorName = (String) moldObj.get("name");
					motor.setMotorName(motorName);
					Boolean active = (Boolean) moldObj.get("active");
					motor.setActive(active);
					Boolean hasFinalTest = (Boolean) moldObj.get("hasFinalTest");
					motor.setHasFinalTest(hasFinalTest);
					
					Object maxQty = (Object)moldObj.get("maxQty");
					if (maxQty != null && NumberUtils.isNumber(maxQty.toString())){
						motor.setMaxQty(Integer.parseInt(maxQty.toString()));
					}
					
					
					motor = wellingtonMotorService.saveOrUpdate(motor);
					
				}
			}else{
				
				JSONObject moldObj = (JSONObject)obj;
				Long id =  (Long) moldObj.get("id");
				
				if (id != null){
					motor = wellingtonMotorService.findById(id);
					
				}else{
					motor = new WellingtonMotor();
					
					
				}
				
				String motorId = (String) moldObj.get("code");
				motor.setMotorId(motorId);
				String motorName = (String) moldObj.get("name");
				motor.setMotorName(motorName);
				Boolean active = (Boolean) moldObj.get("active");
				motor.setActive(active);
				Boolean hasFinalTest = (Boolean) moldObj.get("hasFinalTest");
				motor.setHasFinalTest(hasFinalTest);
				Object maxQty = (Object)moldObj.get("maxQty");
				if (maxQty != null && NumberUtils.isNumber(maxQty.toString())){
					motor.setMaxQty(Integer.parseInt(maxQty.toString()));
				}
				motor = wellingtonMotorService.saveOrUpdate(motor);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", motor.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveWellingtonMotor");
	}

	@RequestMapping("/deleteWellingtonMotor")
	public void deleteWellingtonMotor(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteWellingtonMotor");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("WellingtonMotorList");
			
				JSONObject moldObj = (JSONObject)obj;
				WellingtonMotor motor;
				Long id =  (Long) moldObj.get("id");
				motor = wellingtonMotorService.findById(id);
				wellingtonMotorService.delete(motor);				
				
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteWellingtonMotor");
	}

	

	@RequestMapping("/getWellingtonMotorList")
	public void getWellingtonMotorList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			List<WellingtonMotor> list = wellingtonMotorService.getAll(); 
			Collections.sort(list);
			System.out.println(list.size());
			JSONObject jsonInjMold;
			for (WellingtonMotor motor : list) 
			{
				
				jsonInjMold = new JSONObject();
				jsonInjMold.put("id", motor.getId());
				jsonInjMold.put("code", motor.getMotorId());
				jsonInjMold.put("name",motor.getMotorName());
				jsonInjMold.put("active",motor.getActive());
				jsonInjMold.put("maxQty",motor.getMaxQty());
				jsonInjMold.put("hasFinalTest",motor.getHasFinalTest());
				
				array.add(jsonInjMold);
			}
			obj.put("WellingtonMotorList", array);
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
	@RequestMapping("/getActiveWellingtonMotorList")
	public void getActiveWellingtonMotorList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("active",true);
		try {
			List<WellingtonMotor> list = wellingtonMotorService.getByProperty(map, "motorName ASC", true, true);
			System.out.println(list.size());
			JSONObject jsonInjMold;
			
			for (WellingtonMotor motor : list) 
			{
				if (motor.getActive() == true){
					jsonInjMold = new JSONObject();
					jsonInjMold.put("id", motor.getId());
					jsonInjMold.put("code", motor.getMotorId());
					jsonInjMold.put("name",motor.getMotorName());
					jsonInjMold.put("active",motor.getActive());
					jsonInjMold.put("maxQty",motor.getMaxQty());
					jsonInjMold.put("hasFinalTest",motor.getHasFinalTest());
					array.add(jsonInjMold);
				}
			}
			obj.put("WellingtonMotorList", array);
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
