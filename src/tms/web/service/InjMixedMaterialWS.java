package tms.web.service;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.util.SystemOutLogger;
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

import tms.backend.domain.Asset;
import tms.backend.domain.AssetHistory;
import tms.backend.domain.InjMixedMaterialJournal;
import tms.backend.domain.InjMold;
import tms.backend.domain.InjRegrindorder;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.backend.service.InjMixedMaterialJournalService;
import tms.backend.service.InjMoldService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

@Controller
public class InjMixedMaterialWS extends MultiActionController {
	@Autowired
	private InjMixedMaterialJournalService injMixedMaterialJournalService;
	@Autowired
	private SessionFactory sessionFactory;

	

	@RequestMapping("/getMixedMaterialByCode")
	public void getMixedMaterialByCode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		

		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
			
		String _virgin_material_name = request.getParameter("virgin_material_name");
//		System.out.println("\n-----------idhn----------"+_virgin_material_name+"--------------\n");
		String _regrind_material_name =request.getParameter("regrind_material_name");
//		System.out.println("\n-----------idhn----------"+_regrind_material_name+"--------------\n");
		String _regrind_rate =request.getParameter("regrind_rate");
//		System.out.println("\n---------ihnd-------"+_regrind_rate+"-----------------\n");
		String _color =request.getParameter("color");
//		System.out.println("\n-----------idhn----------"+_color+"--------------\n");
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("virginMaterialName",_virgin_material_name);
		map.put("regrindMaterialName",_regrind_material_name);
		map.put("regrindRate",Double.parseDouble(_regrind_rate));
		map.put("color",_color);
		//map.put("mixedMaterialCode","MX01");
		//System.out.println("\n-----------0--------------\n");
		
		try {
			//System.out.println("\n-----------1--------------\n");
			List<InjMixedMaterialJournal> list = injMixedMaterialJournalService.getByProperty(map, null, true, true);; 
			//System.out.println("\n-----------2--------------\n");
			JSONObject jsonInjMold;
//			System.out.println("\n--hn------list.size()--------"+list.size()+"------\n");
			int _size = list.size();
			Double _sum_weight = 0.0;
			for (InjMixedMaterialJournal _injMixedMaterial : list) 
			{
				//System.out.println("\n-----------4--------------\n");
				jsonInjMold = new JSONObject();
				jsonInjMold.put("id", _injMixedMaterial.getId());
				jsonInjMold.put("transdate", _injMixedMaterial.getTransdate());
				//System.out.println("\n-----------transdate------"+_injMixedMaterial.getTransdate()+"--------\n");
				jsonInjMold.put("mixed_material_code", _injMixedMaterial.getMixedMaterialCode());
				//System.out.println("\n------mixedMaterialCode----"+_injMixedMaterial.getMixedMaterialCode()+"-------------\n");
				jsonInjMold.put("virgin_material_name", _injMixedMaterial.getVirginMaterialName());
				//System.out.println("\n-----------virginMaterialName------"+_injMixedMaterial.getVirginMaterialName()+"--------\n");
				jsonInjMold.put("regrind_material_name", _injMixedMaterial.getRegrindMaterialName());
				//System.out.println("\n-----------regrindMaterialName------"+_injMixedMaterial.getRegrindMaterialName()+"--------\n");
				jsonInjMold.put("regrind_rate", _injMixedMaterial.getRegrindRate());
				//System.out.println("\n-----------regrindRate------"+_injMixedMaterial.getRegrindRate()+"--------\n");
				jsonInjMold.put("color", _injMixedMaterial.getColor());
				//System.out.println("\n-----------color------"+_injMixedMaterial.getColor()+"--------\n");
				jsonInjMold.put("mold_code", _injMixedMaterial.getMoldCode());
				jsonInjMold.put("part_name", _injMixedMaterial.getPartName());
				_sum_weight += _injMixedMaterial.getWeight();
				jsonInjMold.put("weight", _sum_weight);
				array.add(jsonInjMold);
			}
			
			
			obj.put("InjMixedMaterialList", array);
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
	
	
	
	@RequestMapping("/getMixedMaterialList")
	public void getMixedMaterialList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		

		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		SimpleDateFormat formatDate = new SimpleDateFormat("dd/MM/yyyy");
		
		String movementType = request.getParameter("movementType");//.toUpperCase();
		String approve = request.getParameter("approved");//.toUpperCase();
		
		try {
			
			

			Criterion cweightType = null;
			List<InjMixedMaterialJournal> list = new ArrayList<>();
			if (StringUtils.isNotBlank(movementType) ) 
			{
				if (movementType.equals("IN"))
				{
					cweightType = Restrictions.ge("weight",0.0);
					list = injMixedMaterialJournalService.getByCriteria(cweightType);
				}
				else if (movementType.equals("OUT"))
				{
					cweightType = Restrictions.le("weight",0.0);
					list = injMixedMaterialJournalService.getByCriteria(cweightType);
				}
				else if (movementType.equals("IN_STOCK"))
				{
					List<InjMixedMaterialJournal> _list = injMixedMaterialJournalService.getAll();
					HashMap<String, InjMixedMaterialJournal> map = new HashMap<>();
					for(InjMixedMaterialJournal _injMixedMaterial : _list)
					{
						InjMixedMaterialJournal key = map.get(_injMixedMaterial.getMixedMaterialCode());
						if (key == null)
						{
							map.put(_injMixedMaterial.getMixedMaterialCode(), _injMixedMaterial);
						}
						else
						{
							key.setWeight(key.getWeight()+_injMixedMaterial.getWeight());
						}
					}
					Iterator it = map.entrySet().iterator();
					
				    while (it.hasNext()) 
				    {
				        Map.Entry pairs = (Map.Entry)it.next();
				        InjMixedMaterialJournal value = ((InjMixedMaterialJournal)pairs.getValue());
				        if (value.getWeight() > 0)
				        {
				        	list.add(value);
				        }
				        
				    }
				}

			}else
			{
				list = injMixedMaterialJournalService.getAll();
			}
			
			
			
			
			
			JSONObject jsonInjMold = null;
			
			
			
			for (InjMixedMaterialJournal _injMixedMaterial : list) 
			{
				
				jsonInjMold = new JSONObject();
				
				jsonInjMold.put("id", _injMixedMaterial.getId());
				jsonInjMold.put("transdate",formatDate.format(_injMixedMaterial.getTransdate()));
				
				jsonInjMold.put("mixed_material_code", _injMixedMaterial.getMixedMaterialCode());
				
				jsonInjMold.put("virgin_material_name", _injMixedMaterial.getVirginMaterialName());
				
				jsonInjMold.put("regrind_material_name", _injMixedMaterial.getRegrindMaterialName());
			
				jsonInjMold.put("regrind_rate", _injMixedMaterial.getRegrindRate());
				
				jsonInjMold.put("color", _injMixedMaterial.getColor());
				
				jsonInjMold.put("mold_code", _injMixedMaterial.getMoldCode());
				jsonInjMold.put("part_name", _injMixedMaterial.getPartName());
				jsonInjMold.put("weight", _injMixedMaterial.getWeight());
				jsonInjMold.put("userName", _injMixedMaterial.getOperatorName());
				array.add(jsonInjMold);
			}
			
			
			obj.put("InjMixedMaterialList", array);
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

	@RequestMapping("/getMixedMaterialByRateAndVirginCode")
	public void getMixedMaterialByRateAndVirginCode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		

		
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
			
		String _virgin_material_code = (String)request.getParameter("virgin_material_code");
		String _regrind_rate =(String)request.getParameter("regrind_rate");
		
		if(StringUtils.isBlank(_virgin_material_code) || StringUtils.isBlank(_regrind_rate))
		{
			
			System.out.println("\n---_regrind_rate or_virgin_material_code---- is null-\n");
			return;
		}
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		map.put("virginMaterialCode",_virgin_material_code);
		map.put("regrindRate",Double.parseDouble(_regrind_rate));
		
		try {
			
			List<InjMixedMaterialJournal> list = injMixedMaterialJournalService.getByProperty(map, null, true, true);; 
			
			JSONObject jsonInjMold;
			
//			System.out.println("\n---size: --"+list.size()+"--\n");
			
			for (InjMixedMaterialJournal _injMixedMaterial : list) 
			{
				
				jsonInjMold = new JSONObject();
				jsonInjMold.put("id", _injMixedMaterial.getId());
				jsonInjMold.put("transdate", _injMixedMaterial.getTransdate());
				//System.out.println("\n-----------transdate------"+_injMixedMaterial.getTransdate()+"--------\n");
				jsonInjMold.put("mixed_material_code", _injMixedMaterial.getMixedMaterialCode());
				System.out.println("\n--code mixed:  "+_injMixedMaterial.getMixedMaterialCode()+"-----\n");
				//System.out.println("\n------mixedMaterialCode----"+_injMixedMaterial.getMixedMaterialCode()+"-------------\n");
				jsonInjMold.put("virgin_material_name", _injMixedMaterial.getVirginMaterialName());
				System.out.println("\n-----------virginMaterialName------"+_injMixedMaterial.getVirginMaterialName()+"--------\n");
				jsonInjMold.put("regrind_material_name", _injMixedMaterial.getRegrindMaterialName());
				//System.out.println("\n-----------regrindMaterialName------"+_injMixedMaterial.getRegrindMaterialName()+"--------\n");
				jsonInjMold.put("regrind_rate", _injMixedMaterial.getRegrindRate());
				//System.out.println("\n-----------regrindRate------"+_injMixedMaterial.getRegrindRate()+"--------\n");
				jsonInjMold.put("color", _injMixedMaterial.getColor());
				//System.out.println("\n-----------color------"+_injMixedMaterial.getColor()+"--------\n");
				jsonInjMold.put("mold_code", _injMixedMaterial.getMoldCode());
				jsonInjMold.put("part_name", _injMixedMaterial.getPartName());
				jsonInjMold.put("weight", _injMixedMaterial.getWeight());
				
				array.add(jsonInjMold);
			}
			
//			System.out.println("\n---okk-----\n");
			obj.put("InjMixedMaterialList", array);
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

	@RequestMapping("/getMixedMaterialWithMaxMMCode")
	public void getMixedMaterialWithMaxMMCode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		System.out.println("\n--find max number-----\n");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		int _max = 0;
		try {
			
			List<InjMixedMaterialJournal> list = injMixedMaterialJournalService.getAll(); 
			JSONObject jsonInjMold = new JSONObject();;
			String _MixedMaterialCode ;
			for (InjMixedMaterialJournal _injMixedMaterial : list) 
			{
				//jsonInjMold = new JSONObject();
				
				String _tmpStr = _injMixedMaterial.getMixedMaterialCode();
				if(!_tmpStr.isEmpty())
				{
					int _tmpNumber = Integer.parseInt(_tmpStr);
					if(_tmpNumber > _max)
						_max = _tmpNumber;
							
				}
				
				
			}
			_max += 1;
			//System.out.println("\n---max is ---"+_max+"-----\n");
			jsonInjMold.put("mixed_material_code_existing", String.valueOf(_max));
			array.add(jsonInjMold);
			
			obj.put("InjMixedMaterialList", array);
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


	@RequestMapping("/deleteMixedMaterialByIdOrder")
	public void deleteMixedMaterialByIdOrder(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		logger.info("EWI : START METHOD - deleteMixedMaterialByIdOrder");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		
			
		String _idorder = request.getParameter("idorder");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("idOrder",_idorder);
		try {
			
			List<InjMixedMaterialJournal> list = injMixedMaterialJournalService.getByProperty(map, null, true, true);
			
			for(InjMixedMaterialJournal _item: list)
			{
				
				injMixedMaterialJournalService.delete(_item);
				
			}
			
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteMixedMaterialByIdOrder");
	}
	
	
	@RequestMapping("/saveMixedMaterial")
	public void saveMixedMaterial(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		System.out.println("/n----Begin _injMixedMaterial save -----/n");
		
		logger.info("EWI : START METHOD - _injMixedMaterial");
		response.setContentType("text/html; charset=UTF-8");
		
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		
		out = response.getWriter();
		
		Long idorder = Long.parseLong(request.getParameter("idorder"));
		String virginMaterialName =  request.getParameter("virgin_material_name");
		String regrindMaterialName = request.getParameter("regrind_material_name");
		Double regrindRate = Double.parseDouble(request.getParameter("regrind_rate"));
		String color = request.getParameter("color");
		String moldCode =  request.getParameter("mold_code");
		String partName = request.getParameter("part_name");
		Double weight = Double.parseDouble(request.getParameter("weight"));
		Date orderDate = getCurrentDate();
		//--------------------support infor--------------
		String virginMaterialCode =  request.getParameter("virgin_material_code");
		String regrindResinCode =  request.getParameter("regrind_material_code");
		String partCode =  request.getParameter("part_code");
		 String  operatorName = request.getParameter("userName");
		String mixedMaterialCode = CheckExistingID (virginMaterialName, regrindMaterialName, regrindRate, color);
		
		if(mixedMaterialCode == "")
		{
			mixedMaterialCode = String.valueOf(NewID());
		}

		
		 //--------------------Set InjRegrindorder----------------
		 InjMixedMaterialJournal _injMixedMaterialJournal = new InjMixedMaterialJournal();
		_injMixedMaterialJournal.setMixedMaterialCode(mixedMaterialCode);
		 _injMixedMaterialJournal.setTransdate(orderDate);
		 _injMixedMaterialJournal.setVirginMaterialName(virginMaterialName);
		 _injMixedMaterialJournal.setRegrindMaterialName(regrindMaterialName);
		 _injMixedMaterialJournal.setRegrindRate(regrindRate);
		 _injMixedMaterialJournal.setColor(color);
		 _injMixedMaterialJournal.setMoldCode(moldCode);
		 _injMixedMaterialJournal.setPartName(partName);
		 _injMixedMaterialJournal.setWeight(weight);
		 _injMixedMaterialJournal.setIdOrder(idorder);
		//--------------------support infor--------------
		 _injMixedMaterialJournal.setVirginMaterialCode(virginMaterialCode);
		 _injMixedMaterialJournal.setRegrindResinCode(regrindResinCode);
		 _injMixedMaterialJournal.setPartCode(partCode);
		 _injMixedMaterialJournal.setOperatorName(operatorName);
		injMixedMaterialJournalService.save(_injMixedMaterialJournal);
		System.out.println("/n----Success _injMixedMaterial save-----/n");
		 
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveInjMold");
	}
	//-------------------------------------function support----------------------------------
	private Date getCurrentDate()
	{
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date(); 
		Date _currentDate = new Date(dateFormat.format(date));
		return _currentDate;
	}

	public int NewID()
	{
		int _max = 0;
		try {
			
				List<InjMixedMaterialJournal> list = injMixedMaterialJournalService.getAll(); 
				for (InjMixedMaterialJournal _injMixedMaterial : list) 
				{
					String _tmpStr = _injMixedMaterial.getMixedMaterialCode();
					if(!_tmpStr.isEmpty())
					{
						int _tmpNumber = Integer.parseInt(_tmpStr);
						if(_tmpNumber > _max)
							_max = _tmpNumber;
								
					}
				}
				
				_max += 1;
				
		} catch (Exception e) {
			
			e.printStackTrace();
		}
	
		return _max;
		
	}
	public String  CheckExistingID(String _virginmaterialname ,String _regrindmaterialname,Double _regrindrate, String _color) 
	{
		HashMap<String, Object> map = new HashMap<String, Object>();
		
//		System.out.println("\n---r1: "+_virginmaterialname+"---\n");
//		System.out.println("\n---r1: "+_regrindmaterialname+"---\n");
//		System.out.println("\n---r1: "+_regrindrate+"---\n");
//		System.out.println("\n---r1: "+_color+"---\n");
		
		map.put("virginMaterialName",_virginmaterialname);
		map.put("regrindMaterialName",_regrindmaterialname);
		map.put("regrindRate",_regrindrate);
		map.put("color",_color);
		
		String _mixedMC = "";
		
		try 
		{
			
			List<InjMixedMaterialJournal> list = injMixedMaterialJournalService.getByProperty(map, null, true, true);
			
			int _size = list.size();
			
			
			if(_size > 0)
			{
				for (InjMixedMaterialJournal _injMixedMaterial : list) 
				{
					_mixedMC = _injMixedMaterial.getMixedMaterialCode();
				}
				
			}
			
				
			
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		return _mixedMC;
		
	}



}

