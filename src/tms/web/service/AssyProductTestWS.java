//		String status = request.getParameter("status");
//		String defectCode = request.getParameter("defectCode");
//		String sessionId = request.getParameter("sessionId");
//		String qcinspected = request.getParameter("qcinspected");
//		String pumpCode = request.getParameter("cbPumpModel");
//		String pumpversion = request.getParameter("cbPumpVersion");
//		String pcba = request.getParameter("PCBADatecode");
//		String qctest = request.getParameter("qctest");
//		String _3rdParty = request.getParameter("3rdParty");
package tms.web.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import tms.backend.domain.AssyParameter;
import tms.backend.domain.AssyProductDefect;
import tms.backend.domain.AssyProductModel;
import tms.backend.domain.AssyProductStation;
import tms.backend.domain.AssyProductStationPrerequisite;
import tms.backend.domain.AssyProductTest;
import tms.backend.domain.AssyProductTestBarcode;
import tms.backend.domain.AssyProductType;
import tms.backend.service.AssyParameterService;
import tms.backend.service.AssyProductDefectService;
import tms.backend.service.AssyProductModelService;
import tms.backend.service.AssyProductStationPrerequisiteService;
import tms.backend.service.AssyProductStationService;
import tms.backend.service.AssyProductTestBarcodeService;
import tms.backend.service.AssyProductTestService;
import tms.backend.service.AssyProductTypeService;
import tms.utils.CalendarUtil;
import tms.utils.ResourceUtil;
import tms.utils.StatusType;

public class AssyProductTestWS extends MultiActionController {
	@Autowired
	private AssyProductTestService assyProductTestService;
	@Autowired
	private AssyProductTestBarcodeService assyProductTestBarcodeService;
	@Autowired
	private AssyProductDefectService assyProductDefectService;
	@Autowired
	private AssyParameterService assyParameterService;
	@Autowired
	private AssyProductTypeService assyProductTypeService;
	@Autowired
	private AssyProductModelService assyProductModelService;
	@Autowired
	private AssyProductStationService assyProductStationService;
	@Autowired
	private AssyProductStationPrerequisiteService assyProductStationPrerequisiteService;


	@RequestMapping("/saveProductTest")
	public void saveProductTest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveProductTest");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();

		String instanceId = request.getParameter("instanceId");
		String operator = request.getParameter("operator");
		String productType = request.getParameter("productType");
		String productModel = request.getParameter("productModel");
		String station = request.getParameter("station");
		String station_name = request.getParameter("stationName");
		String validateFnOnServer = request.getParameter("validateFnOnServer");
		String strHasRework = request.getParameter("hasRework");
		String allowDuplicate = request.getParameter("allowDuplicate");
		boolean requiredRework = true;
		if (StringUtils.isBlank(strHasRework) || 
				strHasRework.equals("false")){
			requiredRework = false;
		}
		Integer station_step = Integer.parseInt(request
				.getParameter("stationStep"));
		String serial = request.getParameter("serial");
		String prerequisiteId = request.getParameter("prerequisiteId");

		String product_params = request.getParameter("productParams");
		String[] paramIds = product_params.split(";");
		String paramDatas = "";
		for (String paramId : paramIds) {
			if (StringUtils.isNotBlank(paramId)) {
				String value = request.getParameter(instanceId + "_param_"
						+ paramId);
				paramDatas = paramDatas + paramId + "=" + value + ";";
			}

		}
		// validate on Server
		if (StringUtils.isNotBlank(validateFnOnServer)) {
			// String parameter
			// call the printItString method, pass a String param
			Method method;
			// String parameter
			Class[] param = new Class[2];
			param[0] = AssyProductTestService.class;
			param[1] = String.class;
			// load the AppTest at runtime
			Class cls;
			try {
				cls = Class.forName("tms.web.service.AssyProductTestWS");
				Object objClass = cls.newInstance();
				// call the printIt method
				method = cls.getDeclaredMethod(validateFnOnServer, param);
				String rs = (String) method.invoke(objClass,
						assyProductTestService, paramDatas);
				// method = this.getClass().getMethod(validateFn, paramString);
				// String rs = (String) method.invoke(obj, paramDatas);
				if (!rs.equals("")) {
					obj.put("success", false);
					obj.put("error", "9"); // not reworked yet
					obj.put("errorText", rs);
					out.print(obj);
					out.flush();
					return;
				}
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		String status = request.getParameter("status");
		String defectcode = request.getParameter("defectCode");
		String sessionId = request.getParameter("sessionId");

		Criterion cSerial = Restrictions.eq("serial", serial);
		//Criterion cStatus = Restrictions.eq("status", StatusType.PASSED.getValue());
		List<AssyProductTest> list = assyProductTestService
				.getByCriteria(cSerial);
		if (list.size() > 0) {
			AssyProductTest lastedTest = list.get(list.size() - 1);
			if (lastedTest.getStatus().byteValue() == StatusType.FAILED.getValue()) {
				if (requiredRework && lastedTest.getReworkid() == null) {
					obj.put("success", false);
					obj.put("error", "1"); // not reworked yet
					out.print(obj);
					out.flush();
					return;
				}
			}else{
				if (lastedTest.getStationStep() >= station_step) {
					if (StringUtils.isNotBlank(allowDuplicate) &&
							allowDuplicate.equals("true")){
						obj.put("success", false);
						obj.put("error", "2"); // already passed this step
						out.print(obj);
						out.flush();
						return;
					}
				}
//				if (lastedTest.getStationStep() + 1 != station_step) {
//					obj.put("success", false);
//					obj.put("error", "3"); // not passed previous step
//					out.print(obj);
//					out.flush();
//					return;
//				}
			}

		} else {
			if (station_step != 1) {
				obj.put("success", false);
				obj.put("error", "3"); // not passed previous step
				out.print(obj);
				out.flush();
				return;
			}
		}

		AssyProductTest productTest = new AssyProductTest();
		productTest.setProductType(Long.valueOf(productType));
		productTest.setProductModel(Long.valueOf(productModel));
		productTest.setOperator(operator);
		productTest.setStation(Long.valueOf(station));
		productTest.setStationName(station_name);
		productTest.setStationStep(station_step);
		productTest.setSerial(serial);
		productTest.setReworkid(null);
		if (NumberUtils.isNumber(prerequisiteId)) {
			productTest.setPrerequisiteId(Long.valueOf(prerequisiteId));
		}
		productTest.setParamData(paramDatas.replaceAll(";;", ";"));
		Calendar cal = Calendar.getInstance();
		java.sql.Timestamp datetime = new Timestamp(cal.getTimeInMillis());
		productTest.setDatetimetested(datetime);
		if (status.equals("pass")) {
			//productTest.setStatus(Byte.parseByte("1"));
			productTest.setStatus(StatusType.PASSED.getValue());
		} else {
			//productTest.setStatus(Byte.parseByte("0"));
			productTest.setStatus(StatusType.FAILED.getValue());
			productTest.setDefectcode(defectcode);
		}
		productTest.setSessionId(sessionId);
		assyProductTestService.save(productTest);
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveProductTest");
	}

	@RequestMapping("/deleteProductTest")
	public void deleteProductTest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteProductTest");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		String testId = request.getParameter("testId");
		AssyProductTest selectedTest = assyProductTestService.findById(Long
				.valueOf(testId));
		Criterion cSerial = Restrictions.eq("serial", selectedTest.getSerial());
		Criterion cStationStep = Restrictions.gt("stationStep",
				selectedTest.getStationStep());
		List<AssyProductTest> deletedTests = assyProductTestService
				.getByCriteria(cSerial, cStationStep);
		try {
			assyProductTestService.delete(selectedTest);
			for (AssyProductTest deleteTest : deletedTests) {
				assyProductTestService.delete(deleteTest);
			}
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("success", false);
		}
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteProductTest");
	}

	@RequestMapping("/deleteProductTestAllData")
	public void deleteProductTestAllData(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteProductTest");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		String serial = request.getParameter("serial");
		Criterion cSerial = Restrictions.eq("serial", serial);
		List<AssyProductTest> deletedTests = assyProductTestService
				.getByCriteria(cSerial);
		try {
			for (AssyProductTest deleteTest : deletedTests) {
				assyProductTestService.delete(deleteTest);
			}
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("success", false);
		}
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteProductTest");
	}

	@RequestMapping("/getTenProductTestList")
	public void getTenProductTestList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();

		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		List<AssyProductDefect> defectList = assyProductDefectService.getAll();
		HashMap<String, AssyProductDefect> mapDefects = new HashMap<String, AssyProductDefect>();
		for (AssyProductDefect defect : defectList) {
			mapDefects.put(defect.getId().toString(), defect);
		}
		try {

			String sessionId = request.getParameter("sessionId");
			String station = request.getParameter("station");
			if (!NumberUtils.isNumber(station)) {
				return;
			}
			List<AssyProductTest> list = assyProductTestService
					.getTenLastedProductTest(Long.valueOf(station), sessionId);
			JSONObject jsonTest = null;
			SimpleDateFormat df = new SimpleDateFormat("hh:mm a");

			for (AssyProductTest test : list) {

				jsonTest = new JSONObject();
				jsonTest.put("testid", test.getId());
				jsonTest.put("serial", test.getSerial());
				jsonTest.put("datetested", df.format(test.getDatetimetested()));

				String defectCode = "";
				if (test.getDefectcode() != null) {
					String[] defectId = test.getDefectcode().split(";");
					// Defect defect;

					for (String id : defectId) {
						if (mapDefects.get(id) != null) {
							defectCode += mapDefects.get(id).getDefectCode()
									+ ";";
						}
					}
					if (defectCode.length() > 0) {
						defectCode = defectCode.substring(0,
								defectCode.lastIndexOf(";"));
					}
				}
				jsonTest.put("status",   test.getStatus().byteValue() == StatusType.PASSED.getValue() ? "Pass"
						: "Fail (" + defectCode + ")");
				String [] paramData = test.getParamData().split(";");
				for(int i=0;i < paramData.length;i++){
					String [] param = paramData[i].split("=");
					jsonTest.put("param_"+param[0], param[1]);
				}
				
				//jsonTest.put("inputParams", test.getParamData());
				// jsonTest.put("defectcode", defectCode);
				array.add(jsonTest);
			}
			obj.put("testList", array);
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

	@RequestMapping("/getPMDPrefix")
	public void getPMDPrefix(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();

		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {

			Calendar cal = Calendar.getInstance();
			String week = StringUtils.leftPad(
					String.valueOf(cal.get(Calendar.WEEK_OF_YEAR)), 2);
			String year = String.valueOf(cal.get(Calendar.YEAR)).substring(3);

			obj.put("prefix", week + year + "-");
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("prefix", "");
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}

	@RequestMapping("/getNumberOfTest")
	public void getNumberOfTest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		String serial = request.getParameter("serial");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try {

			Criterion cSerial = Restrictions.eq("serial", serial);
			Long testcount = assyProductTestService.getCount(cSerial);
			

			obj.put("testcount", testcount);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("testcount", 0);
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}

	@RequestMapping("/getProductTestLogs")
	public void getProductTestLogs(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException,
			ParseException {

		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray arrayTestData = new JSONArray();
		JSONArray arrayFieldData = new JSONArray();
		JSONArray arrayColumnData = new JSONArray();
		SimpleDateFormat fmtDate = new SimpleDateFormat("dd-MMM-yyyy");
		SimpleDateFormat fmtTime = new SimpleDateFormat("hh:mm a");
		SimpleDateFormat fmtDateTime = new SimpleDateFormat(
				"dd-MMM-yyyy hh:mm a");
		String paramSerial = request.getParameter("serial");
		if (StringUtils.isBlank(paramSerial)) {
			paramSerial = "*";
		}
		String datetestFrom = request.getParameter("datetestedFrom");
		String datetestedTo = request.getParameter("datetestedTo");
		String productType = request.getParameter("productType");

		// load master data for performance
		System.out.println("load master data for performance");
		List<AssyParameter> paramList = assyParameterService.getAll();
		HashMap<Long, AssyParameter> assyParamMap = new HashMap<Long, AssyParameter>();
		for (AssyParameter assyParam : paramList) {
			assyParamMap.put(assyParam.getId(), assyParam);
		}
		List<AssyProductType> productTypeList = assyProductTypeService.getAll();
		HashMap<Long, AssyProductType> productTypeMap = new HashMap<Long, AssyProductType>();
		for (AssyProductType assyProductType : productTypeList) {
			productTypeMap.put(assyProductType.getId(), assyProductType);
		}
		List<AssyProductModel> productModelList = assyProductModelService
				.getAll();
		HashMap<Long, AssyProductModel> productModelMap = new HashMap<Long, AssyProductModel>();
		for (AssyProductModel productModel : productModelList) {
			productModelMap.put(productModel.getId(), productModel);
		}
		List<AssyProductDefect> defectList = assyProductDefectService.getAll();
		HashMap<Long, AssyProductDefect> productDefectMap = new HashMap<Long, AssyProductDefect>();
		for (AssyProductDefect defect : defectList) {
			productDefectMap.put(defect.getId(), defect);
		}
		List<AssyProductStationPrerequisite> assyProductStationPrerequisiteList = assyProductStationPrerequisiteService.getAll();
		HashMap<Long, AssyProductStationPrerequisite> assyProductStationPrerequisiteMap = new HashMap<Long, AssyProductStationPrerequisite>();
		for (AssyProductStationPrerequisite condition : assyProductStationPrerequisiteList) {
			assyProductStationPrerequisiteMap.put(condition.getId(), condition);
		}
		
		List<AssyProductStation> stationList = assyProductStationService.getAll();
		HashMap<Long, AssyProductStation> assyProductStationMap = new HashMap<Long, AssyProductStation>();
		for (AssyProductStation station : stationList) {
			assyProductStationMap.put(station.getId(), station);
		}
		
		// end of loading master data for perfomance
		Criterion cSerial;
		Criterion cDatetest = Restrictions.between("datetimetested",
				CalendarUtil.startOfDay(CalendarUtil.stringToDate(datetestFrom,
						ResourceUtil.isoDateFormat)), CalendarUtil
						.endOfDay(CalendarUtil.stringToDate(datetestedTo,
								ResourceUtil.isoDateFormat)));
		Criterion cProductType = Restrictions.eq("productType",
				Long.valueOf(productType));
		System.out.println("load test data ...");
		String[] keywords = paramSerial.split(";");
		List<String> serialList = new ArrayList<String>();
		for (String serial : keywords) {
			if (!serial.contains("*")) {
				serialList.add(serial);
			}
		}
		Set<AssyProductTest> testSet = new HashSet<AssyProductTest>();

		List<AssyProductTest> list = null;
		if (!serialList.isEmpty()) {
			cSerial = Restrictions.in("serial", serialList);

			list = assyProductTestService.getByCriteria(cProductType, cSerial,
					cDatetest);
			for (AssyProductTest test : list) {
				testSet.add(test);
			}
		}
		System.out.println("load test data with like");
		for (String serial : keywords) {
			if (serial.contains("*")) {
				System.out.println("serial: " + serial);
				cSerial = Restrictions.like("serial", serial.replace("*", "%"));
				list = assyProductTestService.getByCriteria(cProductType,
						cSerial, cDatetest);
				for (AssyProductTest test : list) {
					testSet.add(test);
				}
			}
		}
		System.out.println("get used assy param");
		Set<AssyParameter> usedParamSet = new HashSet<AssyParameter>();
		Set<String> usedPrerequisiteParamSet = new HashSet<String>();
		Iterator<AssyProductTest> iter1 = testSet.iterator();
		while (iter1.hasNext()) {
			AssyProductTest test = iter1.next();
			System.out.println("serial=" + test.getSerial());
			String paramData = test.getParamData();
			String[] _params = paramData.split(";");
			for (String st : _params) {
				if (st.contains("=")) {
					String[] s = st.split("=");
					AssyParameter assyParam = assyParamMap.get(Long
							.valueOf(s[0]));
					usedParamSet.add(assyParam);
				}
			}
			if (test.getPrerequisiteId() != null) {
				System.out.println("load prerequisiteData...");
				//String prerequisiteData = assyProductStationPrerequisiteService.findById(test.getPrerequisiteId()).getInputParameter();
				AssyProductStationPrerequisite condition =  assyProductStationPrerequisiteMap.get(test.getPrerequisiteId());
				String prerequisiteData = condition.getInputParameter();
				System.out.println(prerequisiteData);
				test.setPrerequisiteData(prerequisiteData);
				_params = prerequisiteData.split(";");
				for (String st : _params) {
					if (st.contains("=")) {
						String[] s = st.split("=");
						usedPrerequisiteParamSet.add(s[0]);
					}
				}
			}

		}

		// AssyParameter [] usedParamList = (AssyParameter[])
		// usedParamSet.toArray();
		List<AssyParameter> usedParamList = new ArrayList<AssyParameter>(
				usedParamSet);
		List<String> usedPrerequisiteList = new ArrayList<String>(
				usedPrerequisiteParamSet);
		System.out.println("create field and grid column data");
		// generate field and grid header column

		// field id
		JSONObject field_id_obj = new JSONObject();
		field_id_obj.put("name", "id");
		arrayFieldData.add(field_id_obj);
		// field datetimetested
		JSONObject field_datetimetested_obj = new JSONObject();
		field_datetimetested_obj.put("name", "datetimetested");
		field_datetimetested_obj.put("type", "date");
		field_datetimetested_obj.put("dateFormat", "d-M-Y h:i A");
		arrayFieldData.add(field_datetimetested_obj);
		// field datetested
		JSONObject field_datetested_obj = new JSONObject();
		field_datetested_obj.put("name", "datetested");
		arrayFieldData.add(field_datetested_obj);
		// field timetested
		JSONObject field_timetested_obj = new JSONObject();
		field_timetested_obj.put("name", "timetested");
		arrayFieldData.add(field_timetested_obj);
		// field product type
		JSONObject field_producttype_obj = new JSONObject();
		field_producttype_obj.put("name", "producttype");
		arrayFieldData.add(field_producttype_obj);
		// field product model
		JSONObject field_productmodel_obj = new JSONObject();
		field_productmodel_obj.put("name", "productmodel");
		arrayFieldData.add(field_productmodel_obj);
		// field station
		JSONObject field_station_obj = new JSONObject();
		field_station_obj.put("name", "station");
		arrayFieldData.add(field_station_obj);

		// field serial
		JSONArray field_serial_array = new JSONArray();
		JSONObject field_serial_obj = new JSONObject();
		field_serial_obj.put("name", "serial");
		// field_serial_array.add(field_serial_obj);
		arrayFieldData.add(field_serial_obj);
		// field status
		JSONArray field_status_array = new JSONArray();
		JSONObject field_status_obj = new JSONObject();
		field_status_obj.put("name", "status");
		// field_status_array.add(field_status_obj);
		arrayFieldData.add(field_status_obj);
		// field defect
		JSONArray field_defect_array = new JSONArray();
		JSONObject field_defect_obj = new JSONObject();
		field_defect_obj.put("name", "defect");
		// field_defect_array.add(field_defect_obj);
		arrayFieldData.add(field_defect_obj);
		// field operator
		JSONArray field_operator_array = new JSONArray();
		JSONObject field_operator_obj = new JSONObject();
		field_operator_obj.put("name", "operator");
		// field_operator_array.add(field_operator_obj);
		arrayFieldData.add(field_operator_obj);

		// generate grid column

		// column datetimetested
		JSONObject column_datetimetested_obj = new JSONObject();
		column_datetimetested_obj.put("header", "Datetime tested");
		column_datetimetested_obj.put("dataIndex", "datetested");
		column_datetimetested_obj.put("width", "130");
		column_datetimetested_obj.put("minWidth", "130");
		column_datetimetested_obj.put("maxWidth", "130");
		arrayColumnData.add(column_datetimetested_obj);
		// column producttype
		JSONObject column_producttype_obj = new JSONObject();
		column_producttype_obj.put("header", "Product type");
		column_producttype_obj.put("dataIndex", "producttype");
		column_producttype_obj.put("width", "100");
		column_producttype_obj.put("minWidth", "100");
		column_producttype_obj.put("maxWidth", "100");
		arrayColumnData.add(column_producttype_obj);
		// column productmodel
		JSONObject column_productmodel_obj = new JSONObject();
		column_productmodel_obj.put("header", "Product model");
		column_productmodel_obj.put("dataIndex", "productmodel");
		column_productmodel_obj.put("width", "100");
		column_productmodel_obj.put("minWidth", "100");
		column_productmodel_obj.put("maxWidth", "100");
		arrayColumnData.add(column_productmodel_obj);
		// column station
		JSONObject column_station_obj = new JSONObject();
		column_station_obj.put("header", "Station");
		column_station_obj.put("dataIndex", "station");
		column_station_obj.put("width", "100");
		column_station_obj.put("minWidth", "100");
		column_station_obj.put("maxWidth", "100");
		arrayColumnData.add(column_station_obj);
		// column serial
		JSONObject column_serial_obj = new JSONObject();
		column_serial_obj.put("header", "Serial");
		column_serial_obj.put("dataIndex", "serial");
		column_serial_obj.put("minWidth", "100");
		column_serial_obj.put("maxWidth", "100");
		arrayColumnData.add(column_serial_obj);
		// column status
		JSONObject column_status_obj = new JSONObject();
		column_status_obj.put("header", "Status");
		column_status_obj.put("dataIndex", "status");
		column_status_obj.put("minWidth", "70");
		column_status_obj.put("maxWidth", "70");
		arrayColumnData.add(column_status_obj);
		// column defect
		JSONObject column_defect_obj = new JSONObject();
		column_defect_obj.put("header", "Defect");
		column_defect_obj.put("dataIndex", "defect");
		column_defect_obj.put("minWidth", "300");
		column_defect_obj.put("maxWidth", "300");
		arrayColumnData.add(column_defect_obj);
		// column operator
		JSONObject column_operator_obj = new JSONObject();
		column_operator_obj.put("header", "Operator");
		column_operator_obj.put("dataIndex", "operator");
		column_operator_obj.put("minWidth", "100");
		column_operator_obj.put("maxWidth", "100");
		arrayColumnData.add(column_operator_obj);

		JSONObject columnData;
		// field & grid column params
		JSONArray field_param_array;
		JSONObject field_param_obj;
		JSONArray column_param_array;
		JSONObject column_param_obj;
		for (AssyParameter param : usedParamList) {
			field_param_array = new JSONArray();
			field_param_obj = new JSONObject();
			field_param_obj.put("name", "param_" + param.getId().toString());
			// field_param_array.add(field_param_obj);
			arrayFieldData.add(field_param_obj);
			// column param
			column_param_array = new JSONArray();
			column_param_obj = new JSONObject();
			column_param_obj.put("header", param.getParameterName());
			column_param_obj.put("dataIndex", "param_"
					+ param.getId().toString());
			column_param_obj.put("width", "100");
			// column_param_array.add(column_param_obj);
			arrayColumnData.add(column_param_obj);
		}
		// field & grid column for prerequisite
		JSONArray field_prerequisite_array;
		JSONObject field_prerequisite_obj;
		JSONArray column_prerequisite_array;
		JSONObject column_prerequisite_obj;
		for (String param : usedPrerequisiteList) {
			field_prerequisite_array = new JSONArray();
			field_prerequisite_obj = new JSONObject();
			field_prerequisite_obj.put("name", "param_" + param);
			// field_param_array.add(field_param_obj);
			arrayFieldData.add(field_prerequisite_obj);
			// column param
			column_prerequisite_array = new JSONArray();
			column_prerequisite_obj = new JSONObject();
			column_prerequisite_obj.put("header", param);
			column_prerequisite_obj.put("dataIndex", "param_" + param);
			column_prerequisite_obj.put("width", "100");
			// column_param_array.add(column_param_obj);
			arrayColumnData.add(column_prerequisite_obj);
		}
		System.out.println("get test data json");
		try {

			JSONObject assyProductTest;
			Iterator<AssyProductTest> iter2 = testSet.iterator();
			while (iter2.hasNext()) {
				AssyProductTest test = iter2.next();
				assyProductTest = new JSONObject();
				System.out.println("id:" + test.getId().toString());
				assyProductTest.put("id", test.getId());
				assyProductTest.put("serial", test.getSerial());
				AssyProductModel productModel = productModelMap.get(test
						.getProductModel());
				if (productModel != null) {
					assyProductTest.put("productmodel",
							productModel.getProductModel());
					assyProductTest.put("producttype",
							productTypeMap.get(productModel.getProductType())
									.getProductTypeCode());
				}

				assyProductTest.put("datetested",
						fmtDateTime.format(test.getDatetimetested()));
				// assyProductTest.put("datetested",
				// fmtDate.format(test.getDatetimetested()));

				assyProductTest.put("timetested",
						fmtTime.format(test.getDatetimetested()));
				assyProductTest.put("station", assyProductStationMap.get(test.getStation()).getStation());
				assyProductTest.put("operator", test.getOperator());
				assyProductTest.put("status",StatusType.forValue(test.getStatus().intValue()).getLabel());
						//test.getStatus().byteValue() == StatusType.FAILED.getValue() ? "Failed" : "Passed");
				String defectJson = "";
				if (StringUtils.isNotBlank(test.getDefectcode())) {
					String[] defectIds = test.getDefectcode().split(";");
					for (String defectId : defectIds) {
						System.out.println("defectId:" + defectId);
						AssyProductDefect defect = productDefectMap.get(Long
								.valueOf(defectId));
						defectJson += defect.getDefectCode()+"("+ defect.getDefectNameEn() + "); ";
					}
				}
				assyProductTest.put("defect", defectJson);
				// product params
				String paramData = test.getParamData();
				String[] dataList = paramData.split(";");
				for (AssyParameter param : usedParamList) {
					assyProductTest
							.put("param_" + param.getId().toString(), "");
				}
				for (String param : dataList) {
					String[] value = param.split("=");
					assyProductTest.put("param_" + value[0],
							value[1].toString());
				}
				// product prerequisite param
				System.out.println(test.getPrerequisiteData());
				if (test.getPrerequisiteData() != null) {
					String prerequisiteData = test.getPrerequisiteData();
					dataList = prerequisiteData.split(";");
					for (String param : usedPrerequisiteList) {
						assyProductTest.put("param_" + param, "");
					}
					for (String param : dataList) {
						String[] value = param.split("=");
						assyProductTest.put("param_" + value[0],
								value[1].toString());
					}
				}
				arrayTestData.add(assyProductTest);
			}

			obj.put("productLogList", arrayTestData);
			obj.put("fieldData", arrayFieldData);
			obj.put("columnData", arrayColumnData);
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

	@RequestMapping("/exportProductTestToExcel")
	public void exportProductTestToExcel(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException,
			ParseException {
		response.setContentType("APPLICATION/OCTET-STREAM");
		response.setHeader("Content-Disposition", "filename=tasklist.xls");
		response.setHeader("Content-Type", "application/vnd.ms-excel");
		ServletOutputStream outputStream = response.getOutputStream();
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet firstSheet = workbook.createSheet("Product test data");

		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray arrayTestData = new JSONArray();
		JSONArray arrayFieldData = new JSONArray();
		JSONArray arrayColumnData = new JSONArray();
		SimpleDateFormat fmtDate = new SimpleDateFormat("dd-MMM-yyyy");
		SimpleDateFormat fmtTime = new SimpleDateFormat("hh:mm a");
		SimpleDateFormat fmtDateTime = new SimpleDateFormat(
				"dd-MMM-yyyy hh:mm a");
		String paramSerial = request.getParameter("serial");
		if (StringUtils.isBlank(paramSerial)) {
			paramSerial = "*";
		}
		String datetestFrom = request.getParameter("datetestedFrom");
		String datetestedTo = request.getParameter("datetestedTo");

		// load master data for performance
		System.out.println("load master data for performance");
		List<AssyParameter> paramList = assyParameterService.getAll();
		HashMap<Long, AssyParameter> assyParamMap = new HashMap<Long, AssyParameter>();
		for (AssyParameter assyParam : paramList) {
			assyParamMap.put(assyParam.getId(), assyParam);
		}
		List<AssyProductType> productTypeList = assyProductTypeService.getAll();
		HashMap<Long, AssyProductType> productTypeMap = new HashMap<Long, AssyProductType>();
		for (AssyProductType productType : productTypeList) {
			productTypeMap.put(productType.getId(), productType);
		}
		List<AssyProductModel> productModelList = assyProductModelService
				.getAll();
		HashMap<Long, AssyProductModel> productModelMap = new HashMap<Long, AssyProductModel>();
		for (AssyProductModel productModel : productModelList) {
			productModelMap.put(productModel.getId(), productModel);
		}
		List<AssyProductDefect> defectList = assyProductDefectService.getAll();
		HashMap<Long, AssyProductDefect> productDefectMap = new HashMap<Long, AssyProductDefect>();
		for (AssyProductDefect defect : defectList) {
			productDefectMap.put(defect.getId(), defect);
		}
		Criterion cSerial;
		Criterion cDatetest = Restrictions.between("datetimetested",
				CalendarUtil.startOfDay(CalendarUtil.stringToDate(datetestFrom,
						ResourceUtil.isoDateFormat)), CalendarUtil
						.endOfDay(CalendarUtil.stringToDate(datetestedTo,
								ResourceUtil.isoDateFormat)));
		System.out.println("load test data ...");
		String[] keywords = paramSerial.split(";");
		List<String> serialList = new ArrayList<String>();
		for (String serial : keywords) {
			if (!serial.contains("*")) {
				serialList.add(serial);
			}
		}
		Set<AssyProductTest> testSet = new HashSet<AssyProductTest>();

		List<AssyProductTest> list = null;
		if (!serialList.isEmpty()) {
			cSerial = Restrictions.in("serial", serialList);

			list = assyProductTestService.getByCriteria(cSerial, cDatetest);
			for (AssyProductTest test : list) {
				testSet.add(test);
			}
		}
		System.out.println("load test data with like");
		for (String serial : keywords) {
			if (serial.contains("*")) {
				System.out.println("serial: " + serial);
				cSerial = Restrictions.like("serial", serial.replace("*", "%"));
				list = assyProductTestService.getByCriteria(cSerial, cDatetest);
				for (AssyProductTest test : list) {
					testSet.add(test);
				}
			}
		}
		System.out.println("get used assy param");
		Set<AssyParameter> usedParamSet = new HashSet<AssyParameter>();
		Iterator<AssyProductTest> iter1 = testSet.iterator();
		while (iter1.hasNext()) {
			AssyProductTest test = iter1.next();
			String paramData = test.getParamData();
			String[] _params = paramData.split(";");
			for (String st : _params) {
				String[] s = st.split("=");
				AssyParameter assyParam = assyParamMap.get(Long.valueOf(s[0]));
				usedParamSet.add(assyParam);
			}
		}
		// AssyParameter [] usedParamList = (AssyParameter[])
		// usedParamSet.toArray();
		List<AssyParameter> usedParamList = new ArrayList<AssyParameter>(
				usedParamSet);
		System.out.println("create excel header");
		// create excel header
		HSSFRow rowHeader = firstSheet.createRow(0);
		HSSFCell cellDatetimetested = rowHeader.createCell(0);
		cellDatetimetested.setCellValue("Datetimetested");
		HSSFCell cellProducttype = rowHeader.createCell(1);
		cellProducttype.setCellValue("Product type");
		HSSFCell cellProductmodel = rowHeader.createCell(2);
		cellProductmodel.setCellValue("Product model");
		HSSFCell cellProductstation = rowHeader.createCell(3);
		cellProductstation.setCellValue("Station");
		HSSFCell cellSerial = rowHeader.createCell(4);
		cellSerial.setCellValue("Serial");
		HSSFCell cellStatus = rowHeader.createCell(5);
		cellStatus.setCellValue("Status");
		HSSFCell cellDefect = rowHeader.createCell(6);
		cellDefect.setCellValue("Defect");
		HSSFCell cellOperator = rowHeader.createCell(6);
		cellOperator.setCellValue("Operator");
		HSSFCell cellParam;
		int paramCol = 7;
		for (AssyParameter param : usedParamList) {
			cellParam = rowHeader.createCell(paramCol);
			cellParam.setCellValue(param.getParameterName());
			paramCol++;
		}

		// field id

		System.out.println("get test data json");
		int rowIndex = 1;
		try {

			JSONObject assyProductTest;
			Iterator<AssyProductTest> iter2 = testSet.iterator();
			while (iter2.hasNext()) {
				HSSFRow rowData = firstSheet.createRow(rowIndex);
				AssyProductTest test = iter2.next();
				assyProductTest = new JSONObject();

				HSSFCell cellDatetimetested1 = rowData.createCell(0);
				cellDatetimetested1.setCellValue(test.getDatetimetested());
				HSSFCell cellProducttype1 = rowData.createCell(1);
				AssyProductModel productModel = productModelMap.get(test
						.getProductModel());
				cellProducttype1.setCellValue(productTypeMap.get(
						productModel.getProductType()).getProductTypeCode());
				HSSFCell cellProductmodel1 = rowData.createCell(2);
				cellProductmodel1.setCellValue(productModel.getProductModel());
				HSSFCell cellProductstation1 = rowData.createCell(3);
				cellProductstation1.setCellValue(test.getStation());
				HSSFCell cellSerial1 = rowData.createCell(4);
				cellSerial1.setCellValue(test.getSerial());
				HSSFCell cellStatus1 = rowData.createCell(5);
				cellStatus1.setCellValue(StatusType.forValue(test.getStatus().intValue()).getLabel());
				HSSFCell cellDefect1 = rowData.createCell(6);
				String defectJson = "";
				if (StringUtils.isNotBlank(test.getDefectcode())) {
					String[] defectIds = test.getDefectcode().split(";");
					for (String defectId : defectIds) {
						AssyProductDefect defect = productDefectMap.get(Long
								.valueOf(defectId));
						defectJson += defect.getDefectNameEn() + " ; ";
					}
				}
				cellDefect1.setCellValue(defectJson);
				HSSFCell cellOperator1 = rowData.createCell(6);
				cellOperator1.setCellValue(test.getOperator());

				String[] dataList = test.getParamData().split(";");

				for (AssyParameter param : usedParamList) {
					assyProductTest
							.put("param_" + param.getId().toString(), "");
				}
				for (String param : dataList) {
					String[] value = param.split("=");
					assyProductTest.put("param_" + value[0],
							value[1].toString());
				}
				arrayTestData.add(assyProductTest);
			}

			obj.put("productLogList", arrayTestData);
			obj.put("fieldData", arrayFieldData);
			obj.put("columnData", arrayColumnData);
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
	@RequestMapping("/exportAOSmith")
	public void exportAOSmith(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException,
			ParseException {
		System.out.println("export AOSmith");
		response.setContentType("APPLICATION/OCTET-STREAM");
		response.setHeader("Content-Disposition", "filename=AOSmith_data.xls");
		response.setHeader("Content-Type", "application/vnd.ms-excel");
		ServletOutputStream outputStream = response.getOutputStream();
		InputStream tmplStream = getClass()
				.getClassLoader()
				.getResourceAsStream("tms/backend/conf/report/AOSmith.xls");
		POIFSFileSystem xlsInputStream = new POIFSFileSystem(tmplStream);
		HSSFWorkbook wb = new HSSFWorkbook(xlsInputStream);
		HSSFSheet sheet0 = wb.getSheetAt(0);
		CreationHelper createHelper = sheet0.getWorkbook().getCreationHelper();
		CellStyle dateStyle = sheet0.getWorkbook().createCellStyle();
		dateStyle.setDataFormat(createHelper.createDataFormat().getFormat(
				"mm/dd/yyyy hh:mm"));
		
		SimpleDateFormat fmtDate = new SimpleDateFormat("dd-MMM-yyyy");
		SimpleDateFormat fmtTime = new SimpleDateFormat("hh:mm a");
		SimpleDateFormat fmtDateTime = new SimpleDateFormat(
				"dd-MMM-yyyy hh:mm a");
		String paramSerial = request.getParameter("serial");
		if (StringUtils.isBlank(paramSerial)) {
			paramSerial = "*";
		}
		String datetestFrom = request.getParameter("datetestedFrom");
		String datetestedTo = request.getParameter("datetestedTo");
		String productType = request.getParameter("productType");
		
		// load master data for performance
		System.out.println("load master data for performance");
		List<AssyParameter> paramList = assyParameterService.getAll();
		HashMap<Long, AssyParameter> assyParamMap = new HashMap<Long, AssyParameter>();
		for (AssyParameter assyParam : paramList) {
			assyParamMap.put(assyParam.getId(), assyParam);
		}
		
		
		List<AssyProductType> productTypeList = assyProductTypeService.getAll();
		//HashMap<Long, AssyProductType> productTypeMap = new HashMap<Long, AssyProductType>();
//		for (AssyProductType productType : productTypeList) {
//			productTypeMap.put(productType.getId(), productType);
//		}
		List<AssyProductModel> productModelList = assyProductModelService
				.getAll();
		HashMap<Long, AssyProductModel> productModelMap = new HashMap<Long, AssyProductModel>();
		for (AssyProductModel productModel : productModelList) {
			productModelMap.put(productModel.getId(), productModel);
		}
		Criterion cProductType = Restrictions.eq("productType",
				Long.valueOf(productType));
		List<AssyProductStation> assyProductStationList =  assyProductStationService.getByCriteria(cProductType);
		HashMap<Long, AssyProductStation> productStationMap = new HashMap<Long, AssyProductStation>();
		for (AssyProductStation productStation : assyProductStationList) {
			productStationMap.put(productStation.getId(), productStation);
		}
		List<AssyProductDefect> defectList = assyProductDefectService.getAll();
		HashMap<Long, AssyProductDefect> productDefectMap = new HashMap<Long, AssyProductDefect>();
		for (AssyProductDefect defect : defectList) {
			productDefectMap.put(defect.getId(), defect);
		}
		List<AssyProductStationPrerequisite> assyProductStationPrerequisiteList = assyProductStationPrerequisiteService.getAll();
		HashMap<Long, AssyProductStationPrerequisite> assyProductStationPrerequisiteMap = new HashMap<Long, AssyProductStationPrerequisite>();
		for (AssyProductStationPrerequisite condition : assyProductStationPrerequisiteList) {
			assyProductStationPrerequisiteMap.put(condition.getId(), condition);
		}
		
		// write error code to excel
		 int rowIndex = 0;
		 DecimalFormat df=new DecimalFormat("0.00");
//		if (assyProductStationList != null &&
//				assyProductStationList.size() > 0 && 
//				assyProductStationList.get(0).getProductDefects() != null){
//			String[] defectSet =  assyProductStationList.get(0).getProductDefects().split(";");
//			HashMap<Long, String> unSortedMap = new HashMap<Long, String>();
//	        for(String str : defectSet){
//	        	unSortedMap.put(Long.parseLong(str), productDefectMap.get(Long.parseLong(str)).getDefectNameEn());
//			}
//	        Map<Long, String> sortedMap = new TreeMap<Long, String>(unSortedMap);
//	        Set set2 = sortedMap.entrySet();
//	         Iterator iterator2 = set2.iterator();
//	        
//	         HSSFRow rowData;
//	         HSSFCell cellError1,cellError2;
//	         while(iterator2.hasNext()) {
//	              Map.Entry me2 = (Map.Entry)iterator2.next();
////	              System.out.print(me2.getKey() + ": ");
////	              System.out.println(me2.getValue());
//	              rowIndex++;
//	               rowData = sheet0.createRow(rowIndex);
//	               cellError1 = rowData.createCell(0);
//	               cellError1.setCellValue(me2.getKey().toString());
//	               cellError1 = rowData.createCell(2);
//	               cellError1.setCellValue(me2.getValue().toString());
//	         }
//	        
//		}
		Criterion cSerial;
		Criterion cDatetest = Restrictions.between("datetimetested",
				CalendarUtil.startOfDay(CalendarUtil.stringToDate(datetestFrom,
						ResourceUtil.dateFormat)), CalendarUtil
						.endOfDay(CalendarUtil.stringToDate(datetestedTo,
								ResourceUtil.dateFormat)));
		System.out.println("load test data ...");
		String[] keywords = paramSerial.split(";");
		List<String> serialList = new ArrayList<String>();
		for (String serial : keywords) {
			if (!serial.contains("*")) {
				serialList.add(serial);
			}
		}
		Set<AssyProductTest> testSet = new HashSet<AssyProductTest>();
		
		List<AssyProductTest> list = null;
		if (!serialList.isEmpty()) {
			cSerial = Restrictions.in("serial", serialList);

			list = assyProductTestService.getByCriteria(cSerial, cDatetest,cProductType);
			for (AssyProductTest test : list) {
				testSet.add(test);
			}
		}
		System.out.println("load test data with like");
		for (String serial : keywords) {
			if (serial.contains("*")) {
				System.out.println("serial: " + serial);
				cSerial = Restrictions.like("serial", serial.replace("*", "%"));
				list = assyProductTestService.getByCriteria(cSerial, cDatetest,cProductType);
				for (AssyProductTest test : list) {
					testSet.add(test);
				}
			}
		}
	
		
		HSSFCellStyle cellStyle1 = wb.createCellStyle();
		HSSFCellStyle cellStyle2 = wb.createCellStyle();
		HSSFCellStyle cellStyle3 = wb.createCellStyle();
		cellStyle1.setDataFormat(
			    wb.getCreationHelper().createDataFormat().getFormat("0.0"));
		cellStyle2.setDataFormat(
			    wb.getCreationHelper().createDataFormat().getFormat("0.00"));
		cellStyle3.setDataFormat(
			    wb.getCreationHelper().createDataFormat().getFormat("0.000"));
		rowIndex = 17;
		try {

			JSONObject assyProductTest;
			Iterator<AssyProductTest> iter2 = testSet.iterator();
			int counter = 0;;
			while (iter2.hasNext()) {
				
				counter++;
				HSSFRow rowData = sheet0.createRow(rowIndex);
				AssyProductTest test = iter2.next();
				System.out.println("printing serial:"+test.getSerial());
				HSSFCell cellCounter = rowData.createCell(0);
				cellCounter.setCellValue(counter);
				HSSFCell cellProductModel = rowData.createCell(1);
				cellProductModel.setCellValue(productModelMap.get(test.getProductModel()).getProductModelName());
				HSSFCell cellSerial = rowData.createCell(2);
				cellSerial.setCellValue(test.getSerial());
				if (test.getDatetimetested() != null){
					HSSFCell cellDatetime = rowData.createCell(4);
					cellDatetime.setCellValue(test.getDatetimetested());
					cellDatetime.setCellStyle(dateStyle);	
				}
				// Input paramater
				String[] paramDataList = test.getParamData().split(";");
				HSSFCell cellParam = null;
				double ventPressure = 0,tapPressure = 0;
				for (String param : paramDataList) {
					String[] value = param.split("=");
//					assyProductTest.put("param_" + value[0],
//							value[1].toString());
					if (value[0].toString().equals("19")){ // Blower serial
						cellParam = rowData.createCell(3);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("13")){ // vent pressure
						ventPressure = Double.valueOf(value[1].toString());
						cellParam = rowData.createCell(5);
						cellParam.setCellStyle(cellStyle3);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(ventPressure);
					}else if(value[0].toString().equals("16")){ //tap pressure
						tapPressure = Double.valueOf(value[1].toString());
						cellParam = rowData.createCell(7);
						cellParam.setCellStyle(cellStyle3);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(tapPressure);
						//cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("15")){// vibration
						cellParam = rowData.createCell(9);
						cellParam.setCellStyle(cellStyle2);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(Double.valueOf(value[1].toString()));
						//cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("10")){// normal speed
						cellParam = rowData.createCell(10);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("17")){// current
						cellParam = rowData.createCell(11);
						cellParam.setCellStyle(cellStyle2);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(Double.valueOf(value[1].toString()));
					}else if(value[0].toString().equals("14")){// power
						cellParam = rowData.createCell(12);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("18")){// Hipot
						cellParam = rowData.createCell(13);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("20")){// Thermo/pressure switch
						cellParam = rowData.createCell(14);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("22") && !value[1].toString().equals("0")){// Temperature
						cellParam = rowData.createCell(16);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("24") && !value[1].toString().equals("0")){// Pressure
						cellParam = rowData.createCell(17);
						cellParam.setCellValue(df.format(Double.valueOf(value[1].toString())*0.02952)); // Convert hpa to inHg
					}else if(value[0].toString().equals("23") && !value[1].toString().equals("0")){// humidity
						cellParam = rowData.createCell(18);
						cellParam.setCellValue(value[1].toString());
					}
					
				}
				
				
				HSSFCell cellDefectCode = rowData.createCell(15);
				String defectJson = "";
				if (StringUtils.isNotBlank(test.getDefectcode())) {
					String[] defectIds = test.getDefectcode().split(";");
					for (String defectId : defectIds) {
						AssyProductDefect defect = productDefectMap.get(Long
								.valueOf(defectId));
						defectJson += defect.getDefectCode() + " ; ";
					}
				}
				cellDefectCode.setCellValue(defectJson);
				// prerequisite param
				double ventMaster1 = 0,ventMaster2 = 0,tapMaster1 = 0,tapMaster2 = 0;
				double ventAvg = 0,tapAvg=0;
				if (test.getPrerequisiteId() != null){
					
					// AssyProductStationPrerequisite condition =  assyProductStationPrerequisiteService.findById(test.getPrerequisiteId());
					AssyProductStationPrerequisite condition = assyProductStationPrerequisiteMap.get(test.getPrerequisiteId());
					 if (condition != null){
						 System.out.println("load prerequisite data");
						 String[] dataList = condition.getInputParameter().split(";");
						 for(String data : dataList){
							 String[] value = data.split("=");
							 if (value[0].toString().equals("Temperature")){
//								 cellParam = rowData.createCell(16);
//								 cellParam.setCellStyle(cellStyle1);
//								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
//								 cellParam.setCellValue(Double.valueOf(value[1].toString()));
								
							 }else if(value[0].toString().equals("Pressure")){
//								 cellParam = rowData.createCell(17);
//								 cellParam.setCellStyle(cellStyle2);
//								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
//								 cellParam.setCellValue(Double.valueOf(value[1].toString()));
							 }else if(value[0].toString().equals("Humidity")){
//								 cellParam = rowData.createCell(18);
//								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
//								 cellParam.setCellValue(Double.valueOf(value[1].toString()));
							 }else if(value[0].toString().equals("ventMaster1")){
								 ventMaster1 = Double.valueOf(value[1].toString());
								 cellParam = rowData.createCell(19);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(ventMaster1);
							 }else if(value[0].toString().equals("ventMaster2")){
								 ventMaster2 = Double.valueOf(value[1].toString());
								 cellParam = rowData.createCell(20);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(ventMaster2);
							 }else if(value[0].toString().equals("tapMaster1")){
								 tapMaster1 = Double.valueOf(value[1].toString());
								 cellParam = rowData.createCell(21);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(tapMaster1);
							 }else if(value[0].toString().equals("tapMaster2")){
								 tapMaster2 = Double.valueOf(value[1].toString());
								 cellParam = rowData.createCell(22);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(tapMaster2);
							 }else if(value[0].toString().equals("VentAVG")){
								 ventAvg = (ventMaster1 + ventMaster2)/2;
								 cellParam = rowData.createCell(23);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(ventAvg);
							 }else if(value[0].toString().equals("TapAVG")){
								 tapAvg = (tapMaster1 + tapMaster2)/2;
								 cellParam = rowData.createCell(24);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(tapAvg);
							 }
						 }
					 }
					 
				}
				
				HSSFCell cellVentLow = rowData.createCell(25);
				cellVentLow.setCellStyle(cellStyle3);
				cellVentLow.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellVentLow.setCellValue(ventAvg - 0.05);
				HSSFCell cellVentHeigh = rowData.createCell(26);
				cellVentHeigh.setCellStyle(cellStyle3);
				cellVentHeigh.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellVentHeigh.setCellValue(ventAvg + 0.05);
				HSSFCell cellTapLow = rowData.createCell(27);
				cellTapLow.setCellStyle(cellStyle3);
				cellTapLow.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellTapLow.setCellValue(tapAvg - 0.05);
				HSSFCell cellTapHeigh = rowData.createCell(28);
				cellTapHeigh.setCellStyle(cellStyle3);
				cellTapHeigh.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellTapHeigh.setCellValue( tapAvg + 0.05);
				HSSFCell cellStation = rowData.createCell(29); // Station name
				cellStation.setCellValue(productStationMap.get(test.getStation()).getStation());
				HSSFCell cellOperator = rowData.createCell(30); // Operator
				cellOperator.setCellValue(test.getOperator());
				
				HSSFCell cellVentVariance = rowData.createCell(6);
				cellVentVariance.setCellStyle(cellStyle3);
				cellVentVariance.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellVentVariance.setCellValue(Math.abs(ventAvg - ventPressure));
				//cellVentVariance.setCellValue(Math.abs(ventAvg - ventPressure));
				
				HSSFCell cellTapVariance = rowData.createCell(8);
				cellTapVariance.setCellStyle(cellStyle3);
				cellTapVariance.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellTapVariance.setCellValue(Math.abs(tapAvg - tapPressure));
				//cellTapVariance.setCellValue(Math.abs(tapAvg - tapPressure));
				
			
				rowIndex++;
				
			}

			wb.write(outputStream);
		} catch (Exception e) {
			outputStream.flush();
			outputStream.close();
			e.printStackTrace();
		}
		outputStream.flush();
		outputStream.close();
	}
	@RequestMapping("/exportAOSmithPDV")
	public void exportAOSmithPDV(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException,
			ParseException {
		System.out.println("export AOSmith");
		
		response.setContentType("APPLICATION/OCTET-STREAM");
		response.setHeader("Content-Disposition", "filename=AOSmithPDV_data.xls");
		response.setHeader("Content-Type", "application/vnd.ms-excel");
		ServletOutputStream outputStream = response.getOutputStream();
		InputStream tmplStream = getClass()
				.getClassLoader()
				.getResourceAsStream("tms/backend/conf/report/AOSmithPDV.xls");
		POIFSFileSystem xlsInputStream = new POIFSFileSystem(tmplStream);
		HSSFWorkbook wb = new HSSFWorkbook(xlsInputStream);
		HSSFSheet sheet0 = wb.getSheetAt(0);
		CreationHelper createHelper = sheet0.getWorkbook().getCreationHelper();
		CellStyle dateStyle = sheet0.getWorkbook().createCellStyle();
		dateStyle.setDataFormat(createHelper.createDataFormat().getFormat(
				"mm/dd/yyyy hh:mm"));
		
		SimpleDateFormat fmtDate = new SimpleDateFormat("dd-MMM-yyyy");
		SimpleDateFormat fmtTime = new SimpleDateFormat("hh:mm a");
		SimpleDateFormat fmtDateTime = new SimpleDateFormat(
				"dd-MMM-yyyy hh:mm a");
		String paramSerial = request.getParameter("serial");
		if (StringUtils.isBlank(paramSerial)) {
			paramSerial = "*";
		}
		String datetestFrom = request.getParameter("datetestedFrom");
		String datetestedTo = request.getParameter("datetestedTo");
		String productType = request.getParameter("productType");
		
		// load master data for performance
		System.out.println("load master data for performance");
		List<AssyParameter> paramList = assyParameterService.getAll();
		HashMap<Long, AssyParameter> assyParamMap = new HashMap<Long, AssyParameter>();
		for (AssyParameter assyParam : paramList) {
			assyParamMap.put(assyParam.getId(), assyParam);
		}
		
		
		List<AssyProductType> productTypeList = assyProductTypeService.getAll();
		//HashMap<Long, AssyProductType> productTypeMap = new HashMap<Long, AssyProductType>();
//		for (AssyProductType productType : productTypeList) {
//			productTypeMap.put(productType.getId(), productType);
//		}
		List<AssyProductModel> productModelList = assyProductModelService
				.getAll();
		HashMap<Long, AssyProductModel> productModelMap = new HashMap<Long, AssyProductModel>();
		for (AssyProductModel productModel : productModelList) {
			productModelMap.put(productModel.getId(), productModel);
		}
		Criterion cProductType = Restrictions.eq("productType",
				Long.valueOf(productType));
		List<AssyProductStation> assyProductStationList =  assyProductStationService.getByCriteria(cProductType);
		HashMap<Long, AssyProductStation> productStationMap = new HashMap<Long, AssyProductStation>();
		for (AssyProductStation productStation : assyProductStationList) {
			productStationMap.put(productStation.getId(), productStation);
		}
		List<AssyProductDefect> defectList = assyProductDefectService.getAll();
		HashMap<Long, AssyProductDefect> productDefectMap = new HashMap<Long, AssyProductDefect>();
		for (AssyProductDefect defect : defectList) {
			productDefectMap.put(defect.getId(), defect);
		}
		List<AssyProductStationPrerequisite> assyProductStationPrerequisiteList = assyProductStationPrerequisiteService.getAll();
		HashMap<Long, AssyProductStationPrerequisite> assyProductStationPrerequisiteMap = new HashMap<Long, AssyProductStationPrerequisite>();
		for (AssyProductStationPrerequisite condition : assyProductStationPrerequisiteList) {
			assyProductStationPrerequisiteMap.put(condition.getId(), condition);
		}
		
		// write error code to excel
		 int rowIndex = 0;
		 DecimalFormat df=new DecimalFormat("0.00");
//		if (assyProductStationList != null &&
//				assyProductStationList.size() > 0 && 
//				assyProductStationList.get(0).getProductDefects() != null){
//			String[] defectSet =  assyProductStationList.get(0).getProductDefects().split(";");
//			HashMap<Long, String> unSortedMap = new HashMap<Long, String>();
//	        for(String str : defectSet){
//	        	unSortedMap.put(Long.parseLong(str), productDefectMap.get(Long.parseLong(str)).getDefectNameEn());
//			}
//	        Map<Long, String> sortedMap = new TreeMap<Long, String>(unSortedMap);
//	        Set set2 = sortedMap.entrySet();
//	         Iterator iterator2 = set2.iterator();
//	        
//	         HSSFRow rowData;
//	         HSSFCell cellError1,cellError2;
//	         while(iterator2.hasNext()) {
//	              Map.Entry me2 = (Map.Entry)iterator2.next();
////	              System.out.print(me2.getKey() + ": ");
////	              System.out.println(me2.getValue());
//	              rowIndex++;
//	               rowData = sheet0.createRow(rowIndex);
//	               cellError1 = rowData.createCell(0);
//	               cellError1.setCellValue(me2.getKey().toString());
//	               cellError1 = rowData.createCell(2);
//	               cellError1.setCellValue(me2.getValue().toString());
//	         }
//	        
//		}
		Criterion cSerial;
		Criterion cDatetest = Restrictions.between("datetimetested",
				CalendarUtil.startOfDay(CalendarUtil.stringToDate(datetestFrom,
						ResourceUtil.dateFormat)), CalendarUtil
						.endOfDay(CalendarUtil.stringToDate(datetestedTo,
								ResourceUtil.dateFormat)));
		System.out.println("load test data ...");
		String[] keywords = paramSerial.split(";");
		List<String> serialList = new ArrayList<String>();
		for (String serial : keywords) {
			if (!serial.contains("*")) {
				serialList.add(serial);
			}
		}
		Set<AssyProductTest> testSet = new HashSet<AssyProductTest>();
		
		List<AssyProductTest> list = null;
		if (!serialList.isEmpty()) {
			cSerial = Restrictions.in("serial", serialList);

			list = assyProductTestService.getByCriteria(cSerial, cDatetest,cProductType);
			for (AssyProductTest test : list) {
				testSet.add(test);
			}
		}
		System.out.println("load test data with like");
		for (String serial : keywords) {
			if (serial.contains("*")) {
				System.out.println("serial: " + serial);
				cSerial = Restrictions.like("serial", serial.replace("*", "%"));
				list = assyProductTestService.getByCriteria(cSerial, cDatetest,cProductType);
				for (AssyProductTest test : list) {
					testSet.add(test);
				}
			}
		}
	
		
		HSSFCellStyle cellStyle1 = wb.createCellStyle();
		HSSFCellStyle cellStyle2 = wb.createCellStyle();
		HSSFCellStyle cellStyle3 = wb.createCellStyle();
		cellStyle1.setDataFormat(
			    wb.getCreationHelper().createDataFormat().getFormat("0.0"));
		cellStyle2.setDataFormat(
			    wb.getCreationHelper().createDataFormat().getFormat("0.00"));
		cellStyle3.setDataFormat(
			    wb.getCreationHelper().createDataFormat().getFormat("0.000"));
		rowIndex = 17;
		try {

			JSONObject assyProductTest;
			Iterator<AssyProductTest> iter2 = testSet.iterator();
			int counter = 0;;
			while (iter2.hasNext()) {
				
				counter++;
				HSSFRow rowData = sheet0.createRow(rowIndex);
				AssyProductTest test = iter2.next();
				System.out.println("printing serial:"+test.getSerial());
				HSSFCell cellCounter = rowData.createCell(0);
				cellCounter.setCellValue(counter);
				HSSFCell cellProductModel = rowData.createCell(1);
				cellProductModel.setCellValue(productModelMap.get(test.getProductModel()).getProductModelName());
				HSSFCell cellSerial = rowData.createCell(2);
				cellSerial.setCellValue(test.getSerial()); // Motor serial
				if (test.getDatetimetested() != null){
					HSSFCell cellDatetime = rowData.createCell(4); //Datetime
					cellDatetime.setCellValue(test.getDatetimetested());
					cellDatetime.setCellStyle(dateStyle);	
				}
				// Input paramater
				String[] paramDataList = test.getParamData().split(";");
				HSSFCell cellParam = null;
				double ventPressure = 0,tapPressure = 0;
				for (String param : paramDataList) {
					String[] value = param.split("=");
//					assyProductTest.put("param_" + value[0],
//							value[1].toString());
					if (value[0].toString().equals("19")){ // Blower serial
						cellParam = rowData.createCell(3);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("13")){ // vent pressure
						ventPressure = Double.valueOf(value[1].toString());
						cellParam = rowData.createCell(5);
						cellParam.setCellStyle(cellStyle3);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(ventPressure);
					}else if(value[0].toString().equals("16")){ //tap pressure
						tapPressure = Double.valueOf(value[1].toString());
						cellParam = rowData.createCell(7);
						cellParam.setCellStyle(cellStyle3);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(tapPressure);
						//cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("25")){ //intake
						tapPressure = Double.valueOf(value[1].toString());
						cellParam = rowData.createCell(9);
						cellParam.setCellStyle(cellStyle3);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(tapPressure);
						//cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("15")){// vibration
						cellParam = rowData.createCell(10);
						cellParam.setCellStyle(cellStyle2);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(Double.valueOf(value[1].toString()));
						//cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("10")){// normal speed
						cellParam = rowData.createCell(11);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("17")){// current
						cellParam = rowData.createCell(12);
						cellParam.setCellStyle(cellStyle2);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(Double.valueOf(value[1].toString()));
					}else if(value[0].toString().equals("14")){// power
						cellParam = rowData.createCell(13);
						cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("18")){// Hipot
						cellParam = rowData.createCell(14);
						cellParam.setCellValue(value[1].toString().toUpperCase().equals("OK")?"PASS":"FAIL");
					}else if(value[0].toString().equals("20")){// Thermo/pressure switch
						cellParam = rowData.createCell(15);
						cellParam.setCellValue(value[1].toString().toUpperCase().equals("OK")?"PASS":"FAIL");
					}else if(value[0].toString().equals("22") && !value[1].toString().equals("0")){// Temperature
						cellParam = rowData.createCell(17);
						cellParam.setCellValue(value[1].toString());
					}else if(value[0].toString().equals("24") && !value[1].toString().equals("0")){// Pressure
						cellParam = rowData.createCell(18);
						cellParam.setCellValue(df.format(Double.valueOf(value[1].toString())*0.02952)); // Convert hpa to inHg
					}else if(value[0].toString().equals("23") && !value[1].toString().equals("0")){// humidity
						cellParam = rowData.createCell(19);
						cellParam.setCellValue(value[1].toString());
					}
				}
				
				
				HSSFCell cellDefectCode = rowData.createCell(16); // Error code
				String defectJson = "";
				if (StringUtils.isNotBlank(test.getDefectcode())) {
					String[] defectIds = test.getDefectcode().split(";");
					for (String defectId : defectIds) {
						AssyProductDefect defect = productDefectMap.get(Long
								.valueOf(defectId));
						defectJson += defect.getDefectCode() + " ; ";
					}
				}
				cellDefectCode.setCellValue(defectJson);
				// prerequisite param
				double ventMaster1 = 0,ventMaster2 = 0,tapMaster1 = 0,tapMaster2 = 0;
				double ventAvg = 0,tapAvg=0;
				if (test.getPrerequisiteId() != null){
					
					// AssyProductStationPrerequisite condition =  assyProductStationPrerequisiteService.findById(test.getPrerequisiteId());
					AssyProductStationPrerequisite condition = assyProductStationPrerequisiteMap.get(test.getPrerequisiteId());
					 if (condition != null){
						 System.out.println("load prerequisite data");
						 String[] dataList = condition.getInputParameter().split(";");
						 for(String data : dataList){
							 String[] value = data.split("=");
//							 if (value[0].toString().equals("Temperature")){
//								 cellParam = rowData.createCell(17); // Temp
//								 cellParam.setCellStyle(cellStyle1);
//								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
//								 cellParam.setCellValue(Double.valueOf(value[1].toString()));
//								
//							 }else if(value[0].toString().equals("Pressure")){
//								 cellParam = rowData.createCell(18);
//								 cellParam.setCellStyle(cellStyle2);
//								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
//								 cellParam.setCellValue(Double.valueOf(value[1].toString()));
//							 }else if(value[0].toString().equals("Humidity")){
//								 cellParam = rowData.createCell(19);
//								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
//								 cellParam.setCellValue(Double.valueOf(value[1].toString()));
							 if(value[0].toString().equals("ventMaster1")){
								 ventMaster1 = Double.valueOf(value[1].toString());
								 cellParam = rowData.createCell(20);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(ventMaster1);
							 }else if(value[0].toString().equals("ventMaster2")){
								 ventMaster2 = Double.valueOf(value[1].toString());
								 cellParam = rowData.createCell(21);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(ventMaster2);
							 }else if(value[0].toString().equals("tapMaster1")){
								 tapMaster1 = Double.valueOf(value[1].toString());
								 cellParam = rowData.createCell(22);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(tapMaster1);
							 }else if(value[0].toString().equals("tapMaster2")){
								 tapMaster2 = Double.valueOf(value[1].toString());
								 cellParam = rowData.createCell(23);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(tapMaster2);
							 }else if(value[0].toString().equals("VentAVG")){
								 ventAvg = (ventMaster1 + ventMaster2)/2;
								 cellParam = rowData.createCell(24);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(ventAvg);
							 }else if(value[0].toString().equals("TapAVG")){
								 tapAvg = (tapMaster1 + tapMaster2)/2;
								 cellParam = rowData.createCell(25);
								 cellParam.setCellStyle(cellStyle3);
								 cellParam.setCellType(Cell.CELL_TYPE_NUMERIC);
								 cellParam.setCellValue(tapAvg);
							 }
						 }
					 }
					 
					 
				}
				
				HSSFCell cellVentLow = rowData.createCell(27); // Vent range low
				cellVentLow.setCellStyle(cellStyle3);
				cellVentLow.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellVentLow.setCellValue(ventAvg - 0.05);
				HSSFCell cellVentHeigh = rowData.createCell(28); // Vent range high
				cellVentHeigh.setCellStyle(cellStyle3);
				cellVentHeigh.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellVentHeigh.setCellValue(ventAvg + 0.05);
				HSSFCell cellTapLow = rowData.createCell(29); // Tap range low
				cellTapLow.setCellStyle(cellStyle3);
				cellTapLow.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellTapLow.setCellValue(tapAvg - 0.05);
				HSSFCell cellTapHeigh = rowData.createCell(30); // Tap range high
				cellTapHeigh.setCellStyle(cellStyle3);
				cellTapHeigh.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellTapHeigh.setCellValue( tapAvg + 0.05);
				HSSFCell cellStation = rowData.createCell(31); // Station name
				cellStation.setCellValue(productStationMap.get(test.getStation()).getStation());
				HSSFCell cellOperator = rowData.createCell(32); // Operator
				cellOperator.setCellValue(test.getOperator());
				
				HSSFCell cellVentVariance = rowData.createCell(6); //Vent pressure variance
				cellVentVariance.setCellStyle(cellStyle3);
				cellVentVariance.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellVentVariance.setCellValue(Math.abs(ventAvg - ventPressure));
				//cellVentVariance.setCellValue(Math.abs(ventAvg - ventPressure));
				
				HSSFCell cellTapVariance = rowData.createCell(8); //Blower tap pressure variance (in WC)
				cellTapVariance.setCellStyle(cellStyle3);
				cellTapVariance.setCellType(Cell.CELL_TYPE_NUMERIC);
				cellTapVariance.setCellValue(Math.abs(tapAvg - tapPressure));
				//cellTapVariance.setCellValue(Math.abs(tapAvg - tapPressure));
				
			
				rowIndex++;
				
			}

			wb.write(outputStream);
		} catch (Exception e) {
			outputStream.flush();
			outputStream.close();
			e.printStackTrace();
		}
		outputStream.flush();
		outputStream.close();
	}
	
	public String validateAOSmith(
			AssyProductTestService _assyProductTestService, String paramDatas) {
		System.out.println("call validateAOSmith");
		String[] paramData = paramDatas.split(";");
		String blowerSerial = "";
		for (String param : paramData) {
			if (param.startsWith("19=")) {
				blowerSerial = "%" + param + "%";
			}
		}
		System.out.println("blowerSerial = " + blowerSerial);
		Criterion cBlowerSerial = Restrictions.ilike("paramData", blowerSerial);
		Criterion cStatus = Restrictions.eq("status", StatusType.PASSED.getValue());
		List<AssyProductTest> test = _assyProductTestService
				.getByCriteria(cBlowerSerial,cStatus);
		if (test.size() > 0) {
			return "Blower Serial is duplicated. Plese check again\nBlower Serial đã được sử dụng trước đó. Hãy kiểm tra lại";
		}
		System.out.println("finished validateAOSmith");
		return "";
	}
	@RequestMapping("/saveAssyProductTestBarcode")
	public void saveAssyProductTestBarcode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveAssyProductTestBarcode");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		// request.
		String productType = request.getParameter("productType");
		String productModel = request.getParameter("productModel");
		String data = request.getParameter("data");
		String result = request.getParameter("result"); 
		
		
		if (StringUtils.isNotBlank(productType) &&
				StringUtils.isNotBlank(data) &&
				StringUtils.isNotBlank(result) ){
			
			AssyProductTestBarcode test = new AssyProductTestBarcode();
			test.setData(data);
			test.setProductType(productType);
			test.setProductModel(productModel);
			test.setCreatedTime(Calendar.getInstance().getTime());
			if (result.toUpperCase().equals("PASS")){
				test.setStatus( StatusType.PASSED.getValue());
			}else{
				test.setStatus( StatusType.FAILED.getValue());
				
			}
			Criterion cDatetest = Restrictions.between("createdTime",
					CalendarUtil.startOfDay(Calendar.getInstance().getTime()), CalendarUtil
							.endOfDay(Calendar.getInstance().getTime()));
			Criterion cProductType = Restrictions.eq("productType",productType);
			Criterion cProductModel = Restrictions.eq("productModel",productModel);
			Criterion cData = Restrictions.eq("data",data);
			
			Long totalToday = assyProductTestBarcodeService.getCount(cProductType, cProductModel, cData);
			if (totalToday > 0) {
				obj.put("success", false);
				obj.put("errorCode", 1);
				obj.put("errorMsg", "<html>Duplicate data<br>Trùng dữ liệu</html>");
			}else {
				assyProductTestBarcodeService.save(test);
				totalToday = assyProductTestBarcodeService.getCount(cDatetest, cProductType, cProductModel);
				obj.put("count", totalToday);
				obj.put("success", true);
			}
			
			
		}else{
			obj.put("success", false);
			obj.put("errorCode", 0);
			obj.put("errorMsg", "Missing required input params");
		}
		
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveAssyProductTestBarcode");
	}
	@RequestMapping("/getProductTestBarcodeLogs")
	public void getProductTestBarcodeLogs(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException,
			ParseException {

		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray arrayTestData = new JSONArray();
		JSONArray arrayFieldData = new JSONArray();
		JSONArray arrayColumnData = new JSONArray();
		SimpleDateFormat fmtDate = new SimpleDateFormat("dd-MMM-yyyy");
		SimpleDateFormat fmtTime = new SimpleDateFormat("hh:mm a");
		SimpleDateFormat fmtDateTime = new SimpleDateFormat(
				"dd-MMM-yyyy hh:mm a");
		String paramSerial = request.getParameter("serial");
		if (StringUtils.isBlank(paramSerial)) {
			paramSerial = "*";
		}
		String datetestFrom = request.getParameter("datetestedFrom");
		String datetestedTo = request.getParameter("datetestedTo");
		String productTypeId = request.getParameter("productType");
		AssyProductType productType = assyProductTypeService.findById(Long.valueOf(productTypeId));
		
		Criterion cSerial;
		Criterion cDatetest = Restrictions.between("createdTime",
				CalendarUtil.startOfDay(CalendarUtil.stringToDate(datetestFrom,
						ResourceUtil.isoDateFormat)), CalendarUtil
						.endOfDay(CalendarUtil.stringToDate(datetestedTo,
								ResourceUtil.isoDateFormat)));
		Criterion cProductType = Restrictions.eq("productType",
				productType.getProductTypeName());
		System.out.println("load test data ...");
		String[] keywords = paramSerial.split(";");
//		List<String> serialList = new ArrayList<String>();
//		for (String serial : keywords) {
//			if (!serial.contains("*")) {
//				serialList.add(serial);
//			}
//		}
		Set<AssyProductTestBarcode> testSet = new HashSet<AssyProductTestBarcode>();

		List<AssyProductTestBarcode> list = null;
//		if (!serialList.isEmpty()) {
//			cSerial = Restrictions.like("data", serialList);
//
//			list = assyProductTestBarcodeService.getByCriteria(cProductType, cSerial,
//					cDatetest);
//			for (AssyProductTestBarcode test : list) {
//				testSet.add(test);
//			}
//		}
		System.out.println("load test data with like");
		if (keywords.length > 0) {
			for (String serial : keywords) {
				if (serial.contains("*")) {
					System.out.println("serial: " + serial);
					System.out.println("%"+serial.replace("*", "%")+";");
					cSerial = Restrictions.like("data", "%"+serial.replace("*", "%")+";");
					list = assyProductTestBarcodeService.getByCriteria(cProductType,
							cSerial, cDatetest);
					for (AssyProductTestBarcode test : list) {
						testSet.add(test);
					}
				}else {
					System.out.println("serial: " + serial);
					System.out.println("%"+serial+";");
					cSerial = Restrictions.like("data", "%"+serial+";");
					list = assyProductTestBarcodeService.getByCriteria(cProductType,
							cSerial, cDatetest);
					for (AssyProductTestBarcode test : list) {
						testSet.add(test);
					}
				}
			}
		}else {
			list = assyProductTestBarcodeService.getByCriteria(cProductType, cDatetest);
			for (AssyProductTestBarcode test : list) {
				testSet.add(test);
			}
		}
		System.out.println("get used assy param");
		Set<String> usedParamSet = new HashSet<String>();
		Set<String> usedPrerequisiteParamSet = new HashSet<String>();
		Iterator<AssyProductTestBarcode> iter1 = testSet.iterator();
		while (iter1.hasNext()) {
			AssyProductTestBarcode test = iter1.next();
			//System.out.println("serial=" + test.getSerial());
			String paramData = test.getData();
			String[] _params = paramData.split(";");
			for (String st : _params) {
				if (st.contains("=")) {
					String[] s = st.split("=");
					usedParamSet.add(s[0]);
				}
			}
			

		}

		// AssyParameter [] usedParamList = (AssyParameter[])
		// String.toArray();
		List<String> usedParamList = new ArrayList<String>(
				usedParamSet);
		
		System.out.println("create field and grid column data");
		// generate field and grid header column

		// field id
		JSONObject field_id_obj = new JSONObject();
		field_id_obj.put("name", "id");
		arrayFieldData.add(field_id_obj);
		// field datetested
		JSONObject field_datetimetested_obj = new JSONObject();
		field_datetimetested_obj.put("name", "datetested");
		arrayFieldData.add(field_datetimetested_obj);
		
		// field product type
		JSONObject field_producttype_obj = new JSONObject();
		field_producttype_obj.put("name", "producttype");
		arrayFieldData.add(field_producttype_obj);
		
		// field product model
		JSONObject field_productmodel_obj = new JSONObject();
		field_productmodel_obj.put("name", "productmodel");
		arrayFieldData.add(field_productmodel_obj);
		
		// field status
		JSONObject field_status_obj = new JSONObject();
		field_status_obj.put("name", "status");
		arrayFieldData.add(field_status_obj);
		
		// generate grid column

		// column datetimetested
		JSONObject column_datetimetested_obj = new JSONObject();
		column_datetimetested_obj.put("header", "Datetime tested");
		column_datetimetested_obj.put("dataIndex", "datetested");
		column_datetimetested_obj.put("width", "170");
		column_datetimetested_obj.put("minWidth", "170");
		column_datetimetested_obj.put("maxWidth", "170");
		arrayColumnData.add(column_datetimetested_obj);
		// column producttype
		JSONObject column_producttype_obj = new JSONObject();
		column_producttype_obj.put("header", "Product type");
		column_producttype_obj.put("dataIndex", "producttype");
		column_producttype_obj.put("width", "100");
		column_producttype_obj.put("minWidth", "100");
		column_producttype_obj.put("maxWidth", "100");
		arrayColumnData.add(column_producttype_obj);

		// column productmodel
		JSONObject column_productmodel_obj = new JSONObject();
		column_productmodel_obj.put("header", "Product model");
		column_productmodel_obj.put("dataIndex", "productmodel");
		column_productmodel_obj.put("width", "250");
		column_productmodel_obj.put("minWidth", "250");
		column_productmodel_obj.put("maxWidth", "250");
		arrayColumnData.add(column_productmodel_obj);

		// column status
		JSONObject column_status_obj = new JSONObject();
		column_status_obj.put("header", "Status");
		column_status_obj.put("dataIndex", "status");
		column_status_obj.put("minWidth", "70");
		column_status_obj.put("maxWidth", "70");
		arrayColumnData.add(column_status_obj);
		

		JSONObject columnData;
		// field & grid column params
		JSONArray field_param_array;
		JSONObject field_param_obj;
		JSONArray column_param_array;
		JSONObject column_param_obj;
		Collections.sort(usedParamList);
		for (String param : usedParamList) {
			field_param_array = new JSONArray();
			field_param_obj = new JSONObject();
			field_param_obj.put("name", "param_" + param);
			// field_param_array.add(field_param_obj);
			arrayFieldData.add(field_param_obj);
			// column param
			column_param_array = new JSONArray();
			column_param_obj = new JSONObject();
			column_param_obj.put("header", param);
			column_param_obj.put("dataIndex", "param_"
					+ param);
			column_param_obj.put("width", "200");
			// column_param_array.add(column_param_obj);
			arrayColumnData.add(column_param_obj);
		}
		
		System.out.println("get test data json");
		try {

			JSONObject assyProductTest;
			Iterator<AssyProductTestBarcode> iter2 = testSet.iterator();
			while (iter2.hasNext()) {
				AssyProductTestBarcode test = iter2.next();
				assyProductTest = new JSONObject();
				System.out.println("id:" + test.getId().toString());
				assyProductTest.put("id", test.getId());
				
				
				assyProductTest.put("producttype",test.getProductType());
				assyProductTest.put("productmodel",test.getProductModel());
				assyProductTest.put("status",StatusType.forValue(test.getStatus().intValue()).getLabel());
				assyProductTest.put("datetested",fmtDateTime.format(test.getCreatedTime()));
				// assyProductTest.put("datetested",
				// fmtDate.format(test.getDatetimetested()));

				
				// product params
				String paramData = test.getData();
				String[] dataList = paramData.split(";");
				for (String param : usedParamList) {
					assyProductTest
							.put("param_" + param, "");
				}
				for (String param : dataList) {
					String[] value = param.split("=");
					if (value.length == 2) {
						assyProductTest.put("param_" + value[0],
							value[1].toString());
					}else {
						assyProductTest.put("param_" + value[0],"");
					}
						
				}
				
				arrayTestData.add(assyProductTest);
			}

			obj.put("productLogList", arrayTestData);
			obj.put("fieldData", arrayFieldData);
			obj.put("columnData", arrayColumnData);
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
