package tms.web.service;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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

import com.liferay.portal.kernel.util.StringUtil;

import tms.backend.domain.Asset;
import tms.backend.domain.AssetHistory;
import tms.backend.domain.InjMold;
import tms.backend.domain.InjRegrindorder;
import tms.backend.service.AssetCategoryService;
import tms.backend.service.AssetHistoryService;
import tms.backend.service.AssetService;
import tms.backend.service.InjMoldService;
import tms.backend.service.InjRegrindorderService;
import tms.utils.CalendarUtil;
import tms.utils.StatusType;

@Controller
public class InjRegrindOrderWS extends MultiActionController {
	@Autowired
	
	private InjRegrindorderService injRegrindorderService;
	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveRegrindOrder")
	public void saveRegrindOrder(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		//System.out.println("/n----Begin injRegrindorder save -----/n");
		
		logger.info("EWI : START METHOD - saveRegrindOrder");
		response.setContentType("text/html; charset=UTF-8");
		//System.out.println("/n----Begin 1a -----/n");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		//System.out.println("/n----Begin 1b -----/n");
		out = response.getWriter();
		//System.out.println("/n----Begin 1c -----/n");
		//--------------varies---------------
		Double runner_weight = Double.parseDouble(request.getParameter("runner_weight"));
		Double product_weight = Double.parseDouble(request.getParameter("product_weight"));
		//-----------------------------
		
		
		 Date orderDate = getCurrentDate();
		 String moldCode = request.getParameter("moldCode");//select
		 String color = request.getParameter("color");//select
		 String partCode = request.getParameter("partCode") ;//select
		 String partName = request.getParameter("partName");//select

		 Double cavity = Double.parseDouble(request.getParameter("cavity"));
		 Double preparedPartQty =Double.parseDouble(request.getParameter("preparedPartQty"));	
		 
		 String virginMaterialCode = request.getParameter("virginMaterialCode");
		 String virginMaterialName = request.getParameter("virginMaterialName");
		 Double virginMaterialWeight = Double.parseDouble(request.getParameter("virginMaterialWeight"));

		 String regrindMaterialCode = request.getParameter("regrindMaterialCode");
		 String regrindMaterialName = request.getParameter("regrindMaterialName");
		 Double regrindMaterialWeight = Double.parseDouble(request.getParameter("regrindMaterialWeight"));
		 
		 String masterbatchCode = request.getParameter("masterbatchCode");
		 String masterbatchName = request.getParameter("masterbatchName");
		 Double masterbatchWeight = Double.parseDouble(request.getParameter("masterbatchWeight"));
		 
		 String mixedMaterialCode = request.getParameter("mixedMaterialCode");
		 String mixedMaterialName = request.getParameter("mixedMaterialName");
		 Double mixedMaterialWeight = Double.parseDouble(request.getParameter("mixedMaterialWeight"));
		 Long   regrindShortage = Long.parseLong(request.getParameter("regrind_shortage"));
		 String  operatorName = request.getParameter("userName");
		
//		 operatorName;userName
		 
		 Double runnerRatio = runner_weight /(product_weight * cavity + runner_weight);						//caculator
		 Double theoreticalRegrindWeight = runner_weight * runnerRatio / cavity;							//caculator
		 Double regrindPercentage = regrindMaterialWeight/(virginMaterialWeight+regrindMaterialWeight); 	//caculator
		 Double masterbatchPercentage = masterbatchWeight/(virginMaterialWeight+regrindMaterialWeight);		//caculator
		 
		 //--------------------Set InjRegrindorder----------------
		 InjRegrindorder _injRegrindorder = new InjRegrindorder();
		 
		_injRegrindorder.setRunnerRatio(runnerRatio);
		_injRegrindorder.setTheoreticalRegrindWeight(theoreticalRegrindWeight);
		_injRegrindorder.setPreparedPartQty(preparedPartQty);
		_injRegrindorder.setMixedMaterialWeight(mixedMaterialWeight);
		_injRegrindorder.setMixedMaterialName(mixedMaterialName);
		_injRegrindorder.setMixedMaterialCode(mixedMaterialCode);
		
		_injRegrindorder.setMasterbatchPercentage(masterbatchPercentage);
		_injRegrindorder.setMasterbatchWeight(masterbatchWeight);
		_injRegrindorder.setMasterbatchName(masterbatchName);
		_injRegrindorder.setMasterbatchCode(masterbatchCode);
		
		_injRegrindorder.setRegrindPercentage(regrindPercentage);
		_injRegrindorder.setRegrindMaterialWeight(regrindMaterialWeight);
		_injRegrindorder.setRegrindMaterialName(regrindMaterialName);
		_injRegrindorder.setRegrindMaterialCode(regrindMaterialCode);
		
		_injRegrindorder.setVirginMaterialWeight(virginMaterialWeight);
		_injRegrindorder.setVirginMaterialName(virginMaterialName);
		_injRegrindorder.setVirginMaterialCode(virginMaterialCode);
		
		_injRegrindorder.setMoldCode(moldCode);
		_injRegrindorder.setCavity(cavity);
		_injRegrindorder.setPartCode(partCode);
		_injRegrindorder.setPartName(partName);
		_injRegrindorder.setColor(color);
		_injRegrindorder.setPreparedPartQty(preparedPartQty);
		_injRegrindorder.setOrderDate(orderDate);
		_injRegrindorder.setOrderStatus(Byte.parseByte("1"));
		_injRegrindorder.setRegrindShortage(regrindShortage);
		_injRegrindorder.setOperatorName(operatorName);
		
		injRegrindorderService.save(_injRegrindorder);
		System.out.println("/n----Success injRegrindorder save-----/n");
		 
		//obj.put("message", mold.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveInjMold");
	}
	
	

	@RequestMapping("/saveRegrindOrderWithRemainingMaterial")
	public void saveRegrindOrderWithRemainingMaterial(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		logger.info("EWI : START METHOD - saveRegrindOrder");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		
		 Date orderDate = getCurrentDate();
		 String moldCode = request.getParameter("moldCode");//select
		 String color = request.getParameter("color");//select
		 String partCode = request.getParameter("partCode") ;//select
		 String partName = request.getParameter("partName");//select
		 
		 String virginMaterialCode = request.getParameter("virginMaterialCode");
		 String virginMaterialName = request.getParameter("virginMaterialName");
		 
		 String virginMaterialWeight_str = (String) request.getParameter("virginMaterialWeight");
		 Double virginMaterialWeight = 0.0;
		 if(!StringUtils.isBlank(virginMaterialWeight_str))
		 {
			 virginMaterialWeight = Double.parseDouble(virginMaterialWeight_str);
		 }
		 

		 String regrindMaterialCode = request.getParameter("regrindMaterialCode");
		 String regrindMaterialName = request.getParameter("regrindMaterialName");
		 
		 String mixedMaterialCode = request.getParameter("mixedMaterialCode");
		 String mixedMaterialName = request.getParameter("mixedMaterialName");
		 
		 String _mixedMaterialWeight_str = (String)request.getParameter("mixedMaterialWeight");
		 Double mixedMaterialWeight = 0.0;
		 if(!StringUtils.isBlank(_mixedMaterialWeight_str))
		 {
			  mixedMaterialWeight = Double.parseDouble(_mixedMaterialWeight_str);
		 }
		
		 String _regrindPercentage_str = (String)request.getParameter("regrindPercentage");
		 Double regrindPercentage = 0.0;
		 if(!StringUtils.isBlank(_regrindPercentage_str))
		 {
			 regrindPercentage = Double.parseDouble(_regrindPercentage_str);
		 }
		 
		 String  operatorName = request.getParameter("userName");
		
		 
		 //--------------------Set InjRegrindorder----------------
		 InjRegrindorder _injRegrindorder = new InjRegrindorder();
		 _injRegrindorder.setOperatorName(operatorName);
		_injRegrindorder.setMixedMaterialWeight(mixedMaterialWeight);
		_injRegrindorder.setMixedMaterialName(mixedMaterialName);
		_injRegrindorder.setMixedMaterialCode(mixedMaterialCode);
		
		_injRegrindorder.setRegrindPercentage(regrindPercentage);
		_injRegrindorder.setRegrindMaterialName(regrindMaterialName);
		_injRegrindorder.setRegrindMaterialCode(regrindMaterialCode);
		
		_injRegrindorder.setVirginMaterialWeight(virginMaterialWeight);
		_injRegrindorder.setVirginMaterialName(virginMaterialName);
		_injRegrindorder.setVirginMaterialCode(virginMaterialCode);
		
		_injRegrindorder.setMoldCode(moldCode);
		_injRegrindorder.setPartCode(partCode);
		_injRegrindorder.setPartName(partName);
		_injRegrindorder.setColor(color);
		_injRegrindorder.setOrderDate(orderDate);
		_injRegrindorder.setOrderStatus(Byte.parseByte("1"));
		_injRegrindorder.setRegrindShortage(Long.parseLong("0"));
		
		injRegrindorderService.save(_injRegrindorder);
		System.out.println("/n----Success injRegrindorder save-----/n");
		 
		//obj.put("message", mold.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveInjMold");
	}
	
	private Date getCurrentDate()
	{
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date(); 
		Date _currentDate = new Date(dateFormat.format(date));
		return _currentDate;
	}
	

	@RequestMapping("/getRegrindOrderList")
	public void getRegrindOrderList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
//		System.out.println("\n------------get all-11----------------\n");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		SimpleDateFormat formatDate = new SimpleDateFormat("dd/MM/yyyy");
		
		 String movementType = request.getParameter("movementType");//.toUpperCase();
		 String approve = request.getParameter("approved");//.toUpperCase();
		 
		try {
			
		
			
			Criterion cMovementType = null;
			if (StringUtils.isNotBlank(movementType) ) 
			{
				if (movementType.equals("IN"))
				{
					cMovementType = Restrictions.ge("mixedMaterialWeight",0.0);
				}
				else
				{
					cMovementType = Restrictions.le("mixedMaterialWeight",0.0);
				}

			}
			Criterion cApproved = null;
			if (StringUtils.isNotBlank(approve) ) 
			{
				if (approve.equals("TRUE"))
				{
					cApproved = Restrictions.eq("orderStatus",StatusType.APPROVED.getValue());
				}
				else if (approve.equals("FALSE"))
				{
					cApproved = Restrictions.eq("orderStatus",StatusType.OPEN.getValue());
				}

			}
			
			
			List<InjRegrindorder> list = injRegrindorderService.getByCriteria(cMovementType,cApproved);
			
			JSONObject jsonInjMold;
			for (InjRegrindorder _injRO : list) 
			{
				
				jsonInjMold = new JSONObject();
				jsonInjMold.put("id",_injRO.getId() );
				
				if(_injRO.getOrderDate()!= null)
				jsonInjMold.put("order_date",formatDate.format(_injRO.getOrderDate()));
				
				jsonInjMold.put("mold_code", _injRO.getMoldCode());
				jsonInjMold.put("part_name", _injRO.getPartName());
				jsonInjMold.put("color", _injRO.getColor());
				jsonInjMold.put("cavity", _injRO.getCavity());
				jsonInjMold.put("runner_ratio",_injRO.getRunnerRatio() );
				jsonInjMold.put("weight_regrind_theorically", _injRO.getTheoreticalRegrindWeight());
				jsonInjMold.put("part_qty_prepared", _injRO.getPreparedPartQty());
				
				jsonInjMold.put("virgin_material_name",_injRO.getVirginMaterialName() );
				jsonInjMold.put("virgin_material_weight", _injRO.getVirginMaterialWeight());
				
				jsonInjMold.put("regrind_material_name", _injRO.getRegrindMaterialName());
				jsonInjMold.put("regrind_material_weight", _injRO.getRegrindMaterialWeight());
				jsonInjMold.put("regrind_rate", _injRO.getRegrindPercentage());
				
				jsonInjMold.put("masterbatch_name", _injRO.getMasterbatchName());
				jsonInjMold.put("masterbatch_weight", _injRO.getMasterbatchWeight());
				jsonInjMold.put("masterbatch_rate", _injRO.getMasterbatchPercentage());
				
				jsonInjMold.put("mixed_material_code", _injRO.getMixedMaterialCode());
				jsonInjMold.put("mixed_material_name", _injRO.getMixedMaterialName());
				
				jsonInjMold.put("mixed_material_weight", _injRO.getMixedMaterialWeight());
				
				jsonInjMold.put("order_status", _injRO.getOrderStatus() == StatusType.APPROVED.getValue()?true:false);
				//----------------suppport infomation--------------
				jsonInjMold.put("virgin_material_code", _injRO.getVirginMaterialCode());
				jsonInjMold.put("regrind_material_code", _injRO.getRegrindMaterialCode());
				jsonInjMold.put("part_code", _injRO.getPartCode());
				jsonInjMold.put("regrind_shortage", _injRO.getRegrindShortage());
				jsonInjMold.put("userName", _injRO.getOperatorName());
				
				array.add(jsonInjMold);
	             
//				System.out.println("\n------------get all 28/5-----------------\n");
				
			}
			obj.put("InjROList", array);
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
	

	@RequestMapping("/updateRegrindOrderWithStatus")
	public void updateRegrindOrderWithStatus(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		
		
		logger.info("EWI : START METHOD - upadteRegrindOrder");
		response.setContentType("text/html; charset=UTF-8");
		
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		
		 Long _id = Long.parseLong(request.getParameter("id"));
		 Byte orderStatus = Byte.parseByte(request.getParameter("orderStatus"));
		 
		 InjRegrindorder _injRegrindorder = new InjRegrindorder();
		 _injRegrindorder = injRegrindorderService.findById(_id);
		 _injRegrindorder.setOrderStatus(orderStatus);
		 injRegrindorderService.update(_injRegrindorder);
		 
		
		System.out.println("/n----Success injRegrindorder update-----/n");
		 
		
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveInjMold");
	}

}
