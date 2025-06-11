package tms.web.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import au.com.bytecode.opencsv.CSVReader;
import tms.backend.domain.WellingtonTest;
import tms.backend.service.WellingtonTestService;
import tms.utils.CalendarUtil;
import tms.utils.ResourceUtil;
import tms.utils.StatusType;

@Controller
public class WellingtonTestWS extends MultiActionController {
	@Autowired
	private SessionFactory sessionFactory;
	@Autowired
	private WellingtonTestService wellingtonTestService;
	final private static int ECR01_LIMIT_NUMBER = 41;
	//inal private static int MAX_COUNTER = 1080;
	@RequestMapping("/saveWellingtonTest")
	public void saveWellingtonHiPotTest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveWellingtonTest");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		// request.
		String serial = request.getParameter("serial");
		
		String motorType = request.getParameter("motorType");
		String result = request.getParameter("result"); 
		String datetested = request.getParameter("datetested");
		String timetested = request.getParameter("timetested");
		String checkSum = request.getParameter("checkSum");
		String tester = request.getParameter("tester");
		
		String hipot = request.getParameter("hipot");
		
		logger.info(String.format("SN#%s SKU%s",serial,motorType));
		if (StringUtils.isNotBlank(serial) &&
				StringUtils.isNotBlank(motorType) &&
				StringUtils.isNotBlank(datetested) &&
				StringUtils.isNotBlank(timetested)){
			WellingtonTest test = new WellingtonTest();
			test.setMotorSerial(serial);
			test.setMotorType(motorType);
			if (result.toUpperCase().equals("PASS")){
				test.setStatus( StatusType.PASSED.getValue());
			}else{
				test.setStatus( StatusType.FAILED.getValue());
				
			}
			try {
				test.setDatetested(CalendarUtil
						.stringToDate(datetested + " " + timetested,
								new SimpleDateFormat("yyyyMMdd H:mmm:ss")));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				obj.put("errorCode", 2);
				logger.error(e.getMessage());
			}
			test.setChesum(checkSum);
			test.setTester(tester);
			test.setShipmentNo("");
			test.setCustomerOrder("");
			test.setCustomerRef("");
			test.setContainerNo("");
			wellingtonTestService.saveOrUpdate(test);
			obj.put("success", true);
		}else{
			obj.put("success", false);
			obj.put("errorCode", 0);
			obj.put("errorMsg", "Missing required input params");
		}
		
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveWellingtonTest");
	}
	@RequestMapping("/saveWellingtonTest")
	public void saveWellingtonTest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveWellingtonTest");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		// request.
		String serial = request.getParameter("serial");
		
		String motorType = request.getParameter("motorType");
		String result = request.getParameter("result"); 
		String datetested = request.getParameter("datetested");
		String timetested = request.getParameter("timetested");
		String checkSum = request.getParameter("checkSum");
		String tester = request.getParameter("tester");
		
		String limitNumber = request.getParameter("limitNumber");
		String limitVersion = request.getParameter("limitVersion");
		String limitRevision = request.getParameter("limitRevision");
		String voltage = request.getParameter("voltage");
		String inputPowers = request.getParameter("inputPowers");
		
		String qcTest = request.getParameter("qcTest");
		logger.info(String.format("SN#%s SKU%s",serial,motorType));
		if (StringUtils.isNotBlank(serial) &&
				StringUtils.isNotBlank(motorType) &&
				StringUtils.isNotBlank(datetested) &&
				StringUtils.isNotBlank(timetested)){
			WellingtonTest test = new WellingtonTest();
			test.setMotorSerial(serial);
			test.setMotorType(motorType);
			if (result.toUpperCase().equals("PASS")){
				test.setStatus( StatusType.PASSED.getValue());
			}else{
				test.setStatus( StatusType.FAILED.getValue());
				
			}
			try {
				test.setDatetested(CalendarUtil
						.stringToDate(datetested + " " + timetested,
								new SimpleDateFormat("yyyyMMdd H:mmm:ss")));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				obj.put("errorCode", 2);
				logger.error(e.getMessage());
			}
			
			if (StringUtils.isNotBlank(qcTest) && qcTest.equals("Y")){
				test.setQctested(true);
			}else{
				test.setQctested(false);
			}
			
			test.setLimitNumber(Integer.parseInt(limitNumber));
			test.setLimitVersion(Integer.parseInt(limitVersion));
			test.setLimitRevision(Integer.parseInt(limitRevision));
			test.setVoltage(Double.parseDouble(voltage.replace("V", "")));
			test.setChesum(checkSum);
			test.setTester(tester);
			BufferedReader reader = new BufferedReader(new StringReader(inputPowers));
			test.setInputPowers(reader.readLine());
			test.setShipmentNo("");
			test.setCustomerOrder("");
			test.setContainerNo("");
			test.setCustomerRef("");
			wellingtonTestService.saveOrUpdate(test);
			obj.put("success", true);
		}else{
			obj.put("success", false);
			obj.put("errorCode", 0);
			obj.put("errorMsg", "Missing required input params");
		}
		
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveWellingtonTest");
	}
	@RequestMapping("/updateWellingtonTest")
	public void updateWellingtonTest(HttpServletRequest request,
			HttpServletResponse response)  throws ServletException, IOException  {
		logger.info("EWI : START METHOD - updateWellingtonTest");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
	
		// request.
		int MAX_COUNTER = 1080;
		try{
			String maxQty = request.getParameter("maxQty");
			MAX_COUNTER = Integer.parseInt(maxQty);
		}catch(Exception e){
			e.printStackTrace();
		}
		String station = request.getParameter("station");
		String serial = request.getParameter("serial");
		String motorType = request.getParameter("motorType");
		String batchNo = request.getParameter("batchNo");
		String sequence = request.getParameter("sequence");
		String requireFinalTest = request.getParameter("hasFinalTest");
		System.out.println("hasFinalTest = "+ requireFinalTest);
		SimpleDateFormat formatter = new SimpleDateFormat("yyMMdd");
		int pos = batchNo.indexOf("-");
		int pallet = Integer.parseInt(batchNo.substring(1,pos));
		Calendar cal = Calendar.getInstance();
		
		String currentDate = formatter.format(cal.getTime());
		logger.info(String.format("SN#%s SKU#%s",serial,motorType));
		Criterion cSerial = Restrictions.eq("motorSerial", serial);
		
		Criterion cMotorType = Restrictions.eq("motorType", motorType);
		Criterion cBatchNo = Restrictions.isNotNull("batchno");
		Criterion cQCTested = Restrictions.or(Restrictions.eq("qctested", false),Restrictions.isNull("qctested"));
		List<WellingtonTest> testList = wellingtonTestService
				.getByCriteria(cSerial,cMotorType,cQCTested);
		List<WellingtonTest> notNullTestList = new ArrayList<>();
		List<WellingtonTest> nullTestList = new ArrayList<>();
		
		for (WellingtonTest test : testList){
			if (test.getBatchno() == null){
				nullTestList.add(test);
			}else{
				notNullTestList.add(test);
			}
		}
		if (notNullTestList != null && notNullTestList.size() > 0){
			logger.info("A");
			obj.put("success", false);
			obj.put("errorCode", 0);
			obj.put("errorMsg", "ERROR: DUPLICATE SERIAL");
		}else{
			
			cBatchNo = Restrictions.isNull("batchno");
//			testList = wellingtonTestService
//					.getByCriteria(cSerial,cMotorType,cBatchNo,cQCTested);
			if (nullTestList != null && nullTestList.size() > 0 || requireFinalTest.equals("false")){
				logger.info("B");
				WellingtonTest test = new WellingtonTest();
				test.setShipmentNo("");
				test.setCustomerOrder("");
				test.setCustomerRef("");
				test.setContainerNo("");
				test.setMotorSerial(serial);
				test.setMotorType(motorType);
				test.setDatetested(cal.getTime());
				if ( requireFinalTest.equals("true")){
					test = nullTestList.get(nullTestList.size()-1);	
				}
				logger.info("BBB");
				if (requireFinalTest.equals("false") || test.getStatus() == StatusType.PASSED.getValue()){
					test.setBatchno(batchNo);
					test.setDatetimepacked(cal.getTime());
					logger.info("sequence = "+ sequence);
					int seq = Integer.parseInt(sequence.trim());
					test.setSequence(seq);
					logger.info("saving batchno");
					 if (requireFinalTest.equals("true")){
						 wellingtonTestService.update(test);
					 }else{
						 wellingtonTestService.save(test);
					 }
					
					// return next batchNo
					obj.put("success", true);
					if (seq >= MAX_COUNTER){
						seq = 1;
						if (StringUtils.right(batchNo, 6).equals(currentDate)){
							pallet++;
						}else{
							pallet = 1;
							
						}
						batchNo = station+pallet+"-"+currentDate;
						
					}else{
						seq++;
						
					}
					obj.put("nextSequence", seq);
					obj.put("batchNo", batchNo);
				}else{
					obj.put("success", false);
					obj.put("errorCode", 1);
					obj.put("errorMsg", "ERROR: FINAL TEST IS FAILED");
				}
			}else{
				obj.put("success", false);
				obj.put("errorCode", 0);
				obj.put("errorMsg", "ERROR: THIS SERIAL HAS NO FINAL TEST");
			}
		}
	
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - updateWellingtonTest");
	}
	@RequestMapping("/getNextPacking")
	public void getNextPacking(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - getNextPacking");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		// request.
		String station = request.getParameter("station");
		String motorType = request.getParameter("motorType");
		int MAX_COUNTER = 1080;
		try{
			String maxQty = request.getParameter("maxQty");
			MAX_COUNTER = Integer.parseInt(maxQty);
		}catch(Exception e){
			e.printStackTrace();
		}
		
		if (StringUtils.isNotBlank(station) && StringUtils.isNotBlank(motorType))
		{
			logger.info(String.format("SKU=%s",motorType));
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyMMdd");
			
			Calendar cal = Calendar.getInstance();
			String currentDate = formatter.format(cal.getTime());
			String batchNo = station;
			WellingtonTest test = null;
			try{
				test = wellingtonTestService.getLastedBatchNo(station, motorType);
			}catch(Exception e){
				e.printStackTrace();
			}
			System.out.println("AAAA2");
			int pallet = 1;
			int sequence = 1;
			
			batchNo = station+pallet+"-"+currentDate;
			System.out.println("AAAA3");
			if (test != null){
				System.out.println("AAAA");
				batchNo = test.getBatchno();
				String[] s = batchNo.split("-");
				
				
				if (test.getSequence() < MAX_COUNTER){
					sequence = test.getSequence()+1;
				}else{
					if (s[1].equals(currentDate)){
						pallet = Integer.parseInt(s[0].substring(1));
						pallet++;
					
					}
					batchNo = station+pallet+"-"+currentDate;
					test = wellingtonTestService.getLastedBatchNo(station);
					if (test.getBatchno().endsWith(currentDate)){
						batchNo = test.getBatchno();
						s = batchNo.split("-");
						pallet = Integer.parseInt(s[0].substring(1));
						pallet++;
						batchNo = station+pallet+"-"+currentDate;
					}
				}
			}else{
			//
				test = wellingtonTestService.getLastedBatchNo(station);
				if (test.getBatchno().endsWith(currentDate)){
					batchNo = test.getBatchno();
					String[] s = batchNo.split("-");
					pallet = Integer.parseInt(s[0].substring(1));
					pallet++;
					batchNo = station+pallet+"-"+currentDate;
				}
			}
			obj.put("batchNo", batchNo);
			obj.put("nextSequence", sequence);
			obj.put("station", station);
			obj.put("success", true);
		}else{
			obj.put("success", false);
		}
				
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - getNextPacking");
	}
	@RequestMapping("/uploadWellingtonTest")
	public void uploadWellingtonTest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		String motorType = request.getParameter("motorType");
		
		try {
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			final CommonsMultipartFile functiontestFile = (CommonsMultipartFile) multipartRequest
					.getFile("functionTestFile");
			final CommonsMultipartFile packingFile = (CommonsMultipartFile) multipartRequest
					.getFile("packingFile");
			// import function test csv file
			CSVReader reader = new CSVReader(new InputStreamReader(
					functiontestFile.getInputStream()));
			String[] nextLine;
			WellingtonTest test;
			int line = 0;
			nextLine = reader.readNext();
			while ((nextLine = reader.readNext()) != null) {
				try{
					line++;
					String serial = nextLine[0];
					String result = nextLine[1];
					String datetested = nextLine[2];
					String timetested = nextLine[3];
					Criterion cSerial = Restrictions.eq("motorSerial", serial);
					Criterion cMotorType = Restrictions.eq("motorType", motorType);
					Criterion cDatetimetested = Restrictions.eq("datetested", CalendarUtil
							.stringToDate(datetested + " " + timetested,
									new SimpleDateFormat("yyyyMMdd H:mmm:ss")));
					List<WellingtonTest> testList = wellingtonTestService
							.getByCriteria(cSerial,cMotorType,cDatetimetested);
					if (testList == null || testList.size() == 0) {
						test = new WellingtonTest();
						test.setShipmentNo("");
						test.setCustomerOrder("");
						test.setCustomerRef("");
						test.setContainerNo("");
						test.setMotorSerial(serial);
						
					} else {
						test = testList.get(0);
						//continue;	

					}
					if (result.toUpperCase().equals("PASS")){
						test.setStatus( StatusType.PASSED.getValue());
					}else{
						test.setStatus( StatusType.FAILED.getValue());
						
					}
					
					
					System.out.println(datetested + " " + timetested);
					test.setDatetested(CalendarUtil
							.stringToDate(datetested + " " + timetested,
									new SimpleDateFormat("yyyyMMdd H:mmm:ss")));
					test.setChesum(nextLine[4]);
					test.setTester(nextLine[5]);
					int limitNumber = Integer.parseInt(nextLine[6]);
					test.setMotorType(motorType);
					test.setLimitNumber(Integer.parseInt(nextLine[6]));
					test.setLimitVersion(Integer.parseInt(nextLine[7]));
					test.setLimitRevision(Integer.parseInt(nextLine[8]));
					test.setVoltage(Double.parseDouble(nextLine[9].replace("V", "")));
					test.setQctested(false);
					String inputParams = "";
					int inputCol = 10;
						boolean flag = StringUtils.isNotBlank(nextLine[inputCol]);
						while (flag) {
							inputParams += nextLine[inputCol] + ",";
							inputCol++;
							try{
								flag = StringUtils.isNotBlank(nextLine[inputCol]);
							}catch(Exception e){
								flag = false;
							}
						}
					
					test.setInputPowers(inputParams);
					if (test.getMotorSerial() != null &&
							test.getDatetested() != null &&
							test.getTester() != null &&
							test.getLimitNumber() != null &&
							test.getLimitRevision() != null &&
							test.getLimitVersion() != null &&
							test.getVoltage() != null &&
							test.getInputPowers() != null
							){
						wellingtonTestService.saveOrUpdate(test);
					}else{
						System.out.println("Invalid final test data at line:"+line);
						obj.put("success", false);
						obj.put("msg", "invaliddata");
						obj.put("line", line);
						out.print(obj);
						out.flush();
						return;
					}
				} catch (Exception e) {
					System.out.println("Error in Function data file");
					
					obj.put("success", false);
					obj.put("msg", "invaliddata");
					obj.put("line", line);
					out.print(obj);
					out.flush();
					e.printStackTrace();
					return;

				}
			//	line++;
				// packingMotorList.add(motor);
			}
			
			
			//  =============== Import packing csv file ====================
			reader = new CSVReader(new InputStreamReader(
					packingFile.getInputStream()));
			nextLine = reader.readNext();
			obj.put("success", true);
			line = 0;
			while ((nextLine = reader.readNext()) != null) {
				try{
				String serial = nextLine[0].replaceAll("\"", "");
				line++;
				System.out.println(serial);
				Criterion cSerial = Restrictions.eq("motorSerial", serial);
				
				motorType =  nextLine[2].replaceAll("\"", "");
				Criterion cMotorType = Restrictions.eq("motorType", motorType);
				List<WellingtonTest> testList = wellingtonTestService
						.getByCriteria(cSerial,cMotorType);
				
				try{
					Collections.sort(testList, new Comparator<WellingtonTest>(){

						@Override
						public int compare(WellingtonTest o1, WellingtonTest o2) {
							// TODO Auto-generated method stub
							//long d1 =  o1.getDatetested().getTime();
							//long d2 = o2.getDatetested().getTime();
							//return  (int)(d1 - d2);
							try{
								if (o1.getDatetested() != null && o2.getDatetested() != null){
									return o2.getDatetested().compareTo(o1.getDatetested());
								}
								if (o1.getDatetimepacked() != null && o2.getDatetimepacked() != null){
									return o2.getDatetimepacked().compareTo(o1.getDatetimepacked());
								}
							}catch(Exception e){
								return 	o2.getId().compareTo(o1.getId());
							}
							return 	o2.getId().compareTo(o1.getId());
							
						}
				          
				   });
				}catch(Exception e){
					e.printStackTrace();
				}				
				//System.out.println(testList.size());
				if (testList.size() == 0) {
//					test = new WellingtonTest();
//					test.setMotorSerial(nextLine[0]);
//					test.setMotorType(nextLine[2]);
					continue;

				} else {
					test = testList.get(0);

					if (test.getStatus().intValue() == StatusType.FAILED.getValue()){
						continue;
					}
				}
				String datetimepacked = nextLine[1].replaceAll("\"", "");
				
				try{
				test.setStatus(StatusType.PASSED.getValue());
				test.setDatetimepacked(CalendarUtil.stringToDate(
						datetimepacked, new SimpleDateFormat(
								"dd-MMM-yyyy hh:mm:ss a")));
				}catch(Exception e){
					//9/24/2014 7:33
//					e.printStackTrace();
					obj.put("success", false);
					obj.put("msg", "packingdate");
					break;
//					test.setDatetimepacked(CalendarUtil.stringToDate(
//							datetimepacked, new SimpleDateFormat(
//									"M/d/yyyy h:m")));
				}
				
				test.setBatchno(nextLine[3].replaceAll("\"", "").trim());
				test.setSequence(Integer.parseInt(nextLine[4].replaceAll("\"", "").trim()));
				wellingtonTestService.saveOrUpdate(test);
				}catch(Exception e){
					System.out.println("Packed data");
					e.printStackTrace();
					obj.put("success", false);
					obj.put("msg", "packingfile");
					obj.put("line", line);
					out.print(obj);
					out.flush();
					return;
					
				}
//				line++;
				// packingMotorList.add(motor);
			}
			System.out.println("Finished imported");
			
		} catch (Exception e) {
			e.printStackTrace();
			obj.put("success", false);
		} finally {
			out.print(obj);
			out.flush();

		}
	}

	@RequestMapping("/getWellingtonTestLogs")
	public void getWellingtonTestLogs(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException, ParseException {
		
		JSONObject obj = new JSONObject();
		JSONArray arrayTestData = new JSONArray();
		JSONArray arrayFieldData = new JSONArray();
		JSONArray arrayColumnData = new JSONArray();
		SimpleDateFormat fmtDate = new SimpleDateFormat("dd-MMM-yyyy");
		SimpleDateFormat fmtTime = new SimpleDateFormat("hh:mm a");
		SimpleDateFormat fmtDateTime = new SimpleDateFormat(
				"dd-MMM-yyyy hh:mm:ss");
		String isLatest = request.getParameter("isLatest");
		String paramSerial = request.getParameter("serial");
		String start = request.getParameter("start");
		String limit = request.getParameter("limit");
		String batchNo = request.getParameter("batchNo");
		String shipmentNo = request.getParameter("shipmentNo");
		String customerRef = request.getParameter("customerRef");
		String customerOrder = request.getParameter("customerOrder");
		String containerNo = request.getParameter("containerNo");
		String qcTested = request.getParameter("qcTested");
		
		String itemNumber = request.getParameter("itemNumber");
		
		if (StringUtils.isBlank(paramSerial)) {
			paramSerial = "*";
		}
		String datetestFrom = request.getParameter("datetestedFrom");
		System.out.println(datetestFrom);
		String datetestedTo = request.getParameter("datetestedTo");
		String status = request.getParameter("status");
		int startNum = Integer.parseInt(start);//Integer.parseInt(start)*Integer.parseInt(limit) - (Integer.parseInt(limit) + 1);
		Criterion cItemNumber = null;
		if (StringUtils.isNotBlank(itemNumber)){
			cItemNumber = Restrictions.eq("motorType", itemNumber);
		}
		Criterion cBatchNo = null;
		if (StringUtils.isNotBlank(batchNo)){
			batchNo = batchNo.replaceAll(";",",");
			batchNo = batchNo.replaceAll(" ","");
			String[] strBatchNos = batchNo.split(",");
			cBatchNo = Restrictions.in("batchno", strBatchNos);
		}
		Criterion cShipmentNo = null;
		if (StringUtils.isNotBlank(shipmentNo.trim())){
			cShipmentNo = Restrictions.eq("shipmentNo", shipmentNo);
		}
		Criterion cCustomerRef = null;
		if (customerRef != null && StringUtils.isNotBlank(customerRef.trim())){
			cCustomerRef = Restrictions.eq("customerRef", customerRef);
		}
		Criterion cCustomerOrder = null;
		if (customerOrder != null && StringUtils.isNotBlank(customerOrder.trim())){
			cCustomerOrder = Restrictions.eq("customerOrder", customerOrder);
		}
		Criterion cContainerNo = null;
		if (containerNo != null && StringUtils.isNotBlank(containerNo.trim())){
			cContainerNo = Restrictions.eq("containerNo", containerNo);
		}		
		
		Criterion cQCTested = null;
		if (StringUtils.isNotBlank(qcTested)){
			System.out.println("qcTested="+qcTested);
			if ("TRUE".equals(qcTested.toUpperCase())){
				cQCTested = Restrictions.eq("qctested", true);	
			}else{
				cQCTested = Restrictions.or(Restrictions.eq("qctested", false),Restrictions.isNull("qctested"));
			}
					
			
		}
		
		Criterion cSerial;
//		Criterion cDatetest = Restrictions.or(Restrictions.between("datetested", CalendarUtil
//				.startOfDay(CalendarUtil.stringToDate(datetestFrom,
//						ResourceUtil.isoDateFormat)), CalendarUtil
//				.endOfDay(CalendarUtil.stringToDate(datetestedTo,
//						ResourceUtil.isoDateFormat))),
//						Restrictions.between("datetimepacked", CalendarUtil
//								.startOfDay(CalendarUtil.stringToDate(datetestFrom,
//										ResourceUtil.isoDateFormat)), CalendarUtil
//								.endOfDay(CalendarUtil.stringToDate(datetestedTo,
//										ResourceUtil.isoDateFormat))));
		Criterion cDatetestFrom = null;
		if (StringUtils.isNotEmpty(datetestFrom)){
			cDatetestFrom = Restrictions.ge("datetested",  CalendarUtil
				.startOfDay(CalendarUtil.stringToDate(datetestFrom,
						ResourceUtil.dateFormat)));
		}
		Criterion cDatetestTo = null;
		if (StringUtils.isNotEmpty(datetestedTo)){
			cDatetestTo = Restrictions.le("datetested",  CalendarUtil
				.endOfDay(CalendarUtil.stringToDate(datetestedTo,
						ResourceUtil.dateFormat)));
		}
		System.out.println("load test data ...");
		Set<WellingtonTest> testSet = new HashSet<WellingtonTest>();
		ArrayList<WellingtonTest> testList  = new ArrayList<WellingtonTest>();
		if (StringUtils.isNotBlank(paramSerial)) {
			String[] keywords = paramSerial.split(";");
			List<String> serialList = new ArrayList<String>();
			for (String serial : keywords) {
				if (!serial.contains("*")) {
					serialList.add(serial);
				}
			}

			List<WellingtonTest> list = null;
			if (!serialList.isEmpty()) {
				cSerial = Restrictions.in("motorSerial", serialList);

				list = wellingtonTestService.getByCriteria(cSerial, cDatetestFrom,cDatetestTo,cBatchNo,cItemNumber,cCustomerRef,cCustomerOrder,cQCTested,cContainerNo);
				for (WellingtonTest test : list) {
					//testSet.
					//testSet.add(test);
					testList.add(test);
				}
			}
			System.out.println("load test data with like");
			for (String serial : keywords) {
				if (serial.contains("*")) {
					System.out.println("motorSerial: " + serial);
					cSerial = Restrictions.like("motorSerial",
							serial.replace("*", "%"));
					list = wellingtonTestService.getByCriteria(cSerial,	cDatetestFrom,cDatetestTo,cBatchNo, cItemNumber,cCustomerRef,cCustomerOrder,cQCTested,cContainerNo);
					for (WellingtonTest test : list) {
						//testSet.add(test);
						testList.add(test);
					}
				}
			}
		} else {
			List<WellingtonTest> list = null;
			list = wellingtonTestService.getByCriteria(cDatetestFrom,cDatetestTo,cBatchNo,cItemNumber,cCustomerRef,cCustomerOrder,cQCTested,cContainerNo);
			for (WellingtonTest test : list) {
				//testSet.add(test);
				testList.add(test);
			}
		}
		System.out.println("aaa-test count:"+testList.size());
		if (!isLatest.equals("true")){
			List<String> serialList = new ArrayList<String>();
			for(WellingtonTest test : testList){
				serialList.add(test.getMotorSerial());
			}
			Criterion cFilter = null;
			if (serialList.size() > 0){
				cFilter = Restrictions.in("motorSerial", serialList);
				testList = (ArrayList<WellingtonTest>) wellingtonTestService.getByCriteria(cDatetestFrom,cDatetestTo,cFilter,cItemNumber,cCustomerRef,cCustomerOrder,cQCTested,cContainerNo);
			}
			
			
			
		}
		System.out.println("bbbb");
		// filter by Status
		List<WellingtonTest> statusTestList = new ArrayList<WellingtonTest>();
		if (StringUtils.isNotBlank(status) && !status.equals("0") ){
			for(WellingtonTest test : testList){
				if (Byte.valueOf(status)== test.getStatus().byteValue()){
					statusTestList.add(test);
				}
			}
			testList.clear();
			testList.addAll(statusTestList);
		}

		if (startNum != -1){
			System.out.println("create field and grid column data");
			// generate field and grid header column
	
			// field id
			JSONObject field_id_obj = new JSONObject();
			field_id_obj.put("name", "id");
			arrayFieldData.add(field_id_obj);
			
			// field serial
			JSONObject field_serial_obj = new JSONObject();
			field_serial_obj.put("name", "serial");
			arrayFieldData.add(field_serial_obj);
			
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
			
			// field batch no
			JSONObject field_batchno_obj = new JSONObject();
			field_batchno_obj.put("name", "batchno");
			arrayFieldData.add(field_batchno_obj);
			
			// field container no
			JSONObject field_containerno_obj = new JSONObject();
			field_containerno_obj.put("name", "containerno");
			arrayFieldData.add(field_containerno_obj);
			
			//field sequence
			JSONObject field_sequenceNo_obj = new JSONObject();
			field_sequenceNo_obj.put("name", "sequenceNo");
			arrayFieldData.add(field_sequenceNo_obj);
			
			// field checksum
			JSONObject field_checksum_obj = new JSONObject();
			field_checksum_obj.put("name", "checksum");
			arrayFieldData.add(field_checksum_obj);
			
			// field tester
			JSONObject field_tester_obj = new JSONObject();
			field_tester_obj.put("name", "tester");
			arrayFieldData.add(field_tester_obj);
			
			// field qctested
			JSONObject field_qctested_obj = new JSONObject();
			field_qctested_obj.put("name", "qctested");
			arrayFieldData.add(field_qctested_obj);

	
			// field status
			JSONObject field_status_obj = new JSONObject();
			field_status_obj.put("name", "result");
			arrayFieldData.add(field_status_obj);
			
			// field limit_number
			JSONObject field_limitnumber_obj = new JSONObject();
			field_limitnumber_obj.put("name", "limitnumber");
			arrayFieldData.add(field_limitnumber_obj);
			
			// field limit_version
			JSONObject field_limitversion_obj = new JSONObject();
			field_limitversion_obj.put("name", "limitversion");
			arrayFieldData.add(field_limitversion_obj);
			
			// field limit_revision
			JSONObject field_limitrevision_obj = new JSONObject();
			field_limitrevision_obj.put("name", "limitrevision");
			arrayFieldData.add(field_limitrevision_obj);
			
			// field voltage
			JSONObject field_voltage_obj = new JSONObject();
			field_voltage_obj.put("name", "voltage");
			arrayFieldData.add(field_voltage_obj);
			
			// field motor_type
			JSONObject field_motor_type_obj = new JSONObject();
			field_motor_type_obj.put("name", "motortype");
			arrayFieldData.add(field_motor_type_obj);
			
			// field sequence
			JSONObject field_sequence_obj = new JSONObject();
			field_sequence_obj.put("name", "sequence");
			arrayFieldData.add(field_sequence_obj);
			
			// field datetimepacked
			JSONObject field_datetimepacked_obj = new JSONObject();
			field_datetimepacked_obj.put("name", "datetimepacked");
			//field_datetimepacked_obj.put("type", "date");
			//field_datetimepacked_obj.put("dateFormat", "d-M-Y h:i A");
			arrayFieldData.add(field_datetimepacked_obj);
			// field input_powers
			JSONObject field_input_powers_obj = new JSONObject();
			field_input_powers_obj.put("name", "inputpowers");
			arrayFieldData.add(field_input_powers_obj);
	
			// generate grid column
			// column serial
	//		{header: 'Distributor',flex: 1,sortable: true,dataIndex: 'distributor',
	//      	  editor: {
	//                xtype: 'textfield',
	//                allowBlank: false
	//            }},
			JSONObject column_serial_obj = new JSONObject();
			column_serial_obj.put("header", "Serial");
			column_serial_obj.put("dataIndex", "serial");
			column_serial_obj.put("minWidth", "100");
			column_serial_obj.put("maxWidth", "100");
			column_serial_obj.put("sortable", false);
			JSONObject objEditor = new JSONObject();
			objEditor.put("xtype", "textfield");
			column_serial_obj.put("editor", objEditor);
			arrayColumnData.add(column_serial_obj);
			// column motor_type
			JSONObject column_motor_type_obj = new JSONObject();
			column_motor_type_obj.put("header", "Motor type");
			column_motor_type_obj.put("dataIndex", "motortype");
			column_motor_type_obj.put("minWidth", "120");
			column_motor_type_obj.put("maxWidth", "120");
			column_motor_type_obj.put("sortable", false);
			JSONObject objMotorTypeEditor = new JSONObject();
			objMotorTypeEditor.put("xtype", "textfield");
			column_motor_type_obj.put("editor", objMotorTypeEditor);
			arrayColumnData.add(column_motor_type_obj);
			// column datetimepacked
			JSONObject column_datetimepacked_obj = new JSONObject();
			column_datetimepacked_obj.put("header", "Packing on");
			column_datetimepacked_obj.put("dataIndex", "datetimepacked");
			column_datetimepacked_obj.put("minWidth", "130");
			column_datetimepacked_obj.put("maxWidth", "130");
			column_datetimepacked_obj.put("sortable", false);
			arrayColumnData.add(column_datetimepacked_obj);
			// column batchno
			JSONObject column_batchno_obj = new JSONObject();
			column_batchno_obj.put("header", "Batch No");
			column_batchno_obj.put("dataIndex", "batchno");
			column_batchno_obj.put("width", "100");
			column_batchno_obj.put("minWidth", "100");
			column_batchno_obj.put("maxWidth", "100");
			column_batchno_obj.put("sortable", false);
			JSONObject objBatchNoEditor = new JSONObject();
			objBatchNoEditor.put("xtype", "textfield");
			column_batchno_obj.put("editor", objBatchNoEditor);
			arrayColumnData.add(column_batchno_obj);
			// column containerNo
			JSONObject column_containerno_obj = new JSONObject();
			column_containerno_obj.put("header", "Container No");
			column_containerno_obj.put("dataIndex", "containerno");
			column_containerno_obj.put("width", "100");
			column_containerno_obj.put("minWidth", "100");
			column_containerno_obj.put("maxWidth", "100");
			column_containerno_obj.put("sortable", false);
			JSONObject objContainerNoEditor = new JSONObject();
			objContainerNoEditor.put("xtype", "textfield");
			column_containerno_obj.put("editor", objContainerNoEditor);
			arrayColumnData.add(column_containerno_obj);
			
			// column sequenceNo
			JSONObject column_sequenceNo_obj = new JSONObject();
			column_sequenceNo_obj.put("header", "Sequence No");
			column_sequenceNo_obj.put("dataIndex", "sequenceNo");
			column_sequenceNo_obj.put("width", "100");
			column_sequenceNo_obj.put("minWidth", "100");
			column_sequenceNo_obj.put("maxWidth", "100");
			column_sequenceNo_obj.put("sortable", false);
			arrayColumnData.add(column_sequenceNo_obj);
			// column result
			JSONObject column_status_obj = new JSONObject();
			column_status_obj.put("header", "Result");
			column_status_obj.put("dataIndex", "result");
			column_status_obj.put("minWidth", "70");
			column_status_obj.put("maxWidth", "70");
			column_status_obj.put("sortable", false);
			arrayColumnData.add(column_status_obj);
			// column datetimetested
			JSONObject column_datetimetested_obj = new JSONObject();
			column_datetimetested_obj.put("header", "Datetime tested");
			column_datetimetested_obj.put("dataIndex", "datetested");
			column_datetimetested_obj.put("width", "130");
			column_datetimetested_obj.put("minWidth", "130");
			column_datetimetested_obj.put("maxWidth", "130");
			column_datetimetested_obj.put("sortable", false);
			arrayColumnData.add(column_datetimetested_obj);
			
			// column checksum
			JSONObject column_checksum_obj = new JSONObject();
			column_checksum_obj.put("header", "Checksum");
			column_checksum_obj.put("dataIndex", "checksum");
			column_checksum_obj.put("width", "150");
			column_checksum_obj.put("minWidth", "150");
			column_checksum_obj.put("maxWidth", "150");
			column_datetimetested_obj.put("sortable", false);
			JSONObject objChecksumEditor = new JSONObject();
			objChecksumEditor.put("xtype", "textfield");
			column_checksum_obj.put("editor", objChecksumEditor);
			arrayColumnData.add(column_checksum_obj);
			// column tester
			JSONObject column_tester_obj = new JSONObject();
			column_tester_obj.put("header", "Tester");
			column_tester_obj.put("dataIndex", "tester");
			column_tester_obj.put("width", "100");
			column_tester_obj.put("minWidth", "60");
			column_tester_obj.put("maxWidth", "60");
			column_tester_obj.put("sortable", false);
			arrayColumnData.add(column_tester_obj);
			// column tester
			JSONObject column_qctested_obj = new JSONObject();
			column_qctested_obj.put("header", "QC tested");
			column_qctested_obj.put("dataIndex", "qctested");
			column_qctested_obj.put("width", "100");
			column_qctested_obj.put("minWidth", "80");
			column_qctested_obj.put("maxWidth", "80");
			column_qctested_obj.put("sortable", false);
			arrayColumnData.add(column_qctested_obj);
			// column limit_number
			JSONObject column_limit_number_obj = new JSONObject();
			column_limit_number_obj.put("header", "Limit number");
			column_limit_number_obj.put("dataIndex", "limitnumber");
			column_limit_number_obj.put("width", "80");
			column_limit_number_obj.put("minWidth", "80");
			column_limit_number_obj.put("maxWidth", "80");
			column_limit_number_obj.put("sortable", false);
			arrayColumnData.add(column_limit_number_obj);
			// column limit_version
			JSONObject column_limit_version_obj = new JSONObject();
			column_limit_version_obj.put("header", "Limit version");
			column_limit_version_obj.put("dataIndex", "limitversion");
			column_limit_version_obj.put("width", "80");
			column_limit_version_obj.put("minWidth", "80");
			column_limit_version_obj.put("maxWidth", "80");
			column_limit_version_obj.put("sortable", false);
			arrayColumnData.add(column_limit_version_obj);
			// column limit_revision
			JSONObject column_limit_revision_obj = new JSONObject();
			column_limit_revision_obj.put("header", "Limit revision");
			column_limit_revision_obj.put("dataIndex", "limitrevision");
			column_limit_revision_obj.put("width", "80");
			column_limit_revision_obj.put("minWidth", "80");
			column_limit_revision_obj.put("maxWidth", "80");
			column_limit_revision_obj.put("sortable", false);
			arrayColumnData.add(column_limit_revision_obj);
	
			// column voltage
			JSONObject column_voltage_obj = new JSONObject();
			column_voltage_obj.put("header", "Voltage");
			column_voltage_obj.put("dataIndex", "voltage");
			column_voltage_obj.put("width", "100");
			column_voltage_obj.put("minWidth", "70");
			column_voltage_obj.put("maxWidth", "70");
			column_voltage_obj.put("sortable", false);
			arrayColumnData.add(column_voltage_obj);
			// column input_powers
			JSONObject column_input_powers_obj = new JSONObject();
			column_input_powers_obj.put("header", "Input powers");
			column_input_powers_obj.put("dataIndex", "inputpowers");
			column_input_powers_obj.put("minWidth", "700");
			//column_input_powers_obj.put("maxWidth", "300");
			column_input_powers_obj.put("sortable", false);
			arrayColumnData.add(column_input_powers_obj);
		}
		System.out.println("get test data json");
		try {

			JSONObject assyProductTest;
			List<WellingtonTest> resultList = null;
			if (isLatest.equals("true")){
				try{
					Collections.sort(testList, new Comparator<WellingtonTest>(){

						@Override
						public int compare(WellingtonTest o2, WellingtonTest o1) {
							// TODO Auto-generated method stub
							//long d1 =  o1.getDatetested().getTime();
							//long d2 = o2.getDatetested().getTime();
							//return  (int)(d1 - d2);
							if (!o1.getBatchno().equals(o2.getBatchno())){
								return o1.getBatchno().compareTo(o2.getBatchno());
							}else if (!o1.getMotorSerial().equals(o2.getMotorSerial())){
								return o1.getMotorSerial().compareTo(o2.getMotorSerial());
							}else{
								try{
								if (o1.getDatetested() != null && o2.getDatetested() != null){
									return o1.getDatetested().compareTo(o2.getDatetested());
								}
								if (o1.getDatetimepacked() != null && o2.getDatetimepacked() != null){
									return o1.getDatetimepacked().compareTo(o2.getDatetimepacked());
								}
								}catch(Exception e){
									return 	o1.getId().compareTo(o2.getId());
								}
								
							}
							return 	o1.getId().compareTo(o2.getId());
							
						}
				          
				       });
					}catch(Exception e){
						e.printStackTrace();
					}
				for(WellingtonTest _test : testList){
					if (_test.getDatetimepacked() != null){
					testSet.add(_test);
					}
				}
			 resultList = new ArrayList<WellingtonTest>(testSet);
			}else{
				resultList = testList;
			}
			try{
			Collections.sort(resultList, new Comparator<WellingtonTest>(){

				@Override
				public int compare(WellingtonTest o1, WellingtonTest o2) {
					// TODO Auto-generated method stub
					//long d1 =  o1.getDatetested().getTime();
					//long d2 = o2.getDatetested().getTime();
					//return  (int)(d1 - d2);
					if (!o1.getBatchno().equals(o2.getBatchno())){
						return o1.getBatchno().compareTo(o2.getBatchno());
					}else if (!o1.getMotorSerial().equals(o2.getMotorSerial())){
						return o1.getMotorSerial().compareTo(o2.getMotorSerial());
					}else{
						try{
						if (o1.getDatetested() != null && o2.getDatetested() != null){
							return o1.getDatetested().compareTo(o2.getDatetested());
						}
						if (o1.getDatetimepacked() != null && o2.getDatetimepacked() != null){
							return o1.getDatetimepacked().compareTo(o2.getDatetimepacked());
						}
						}catch(Exception e){
							return 	o1.getId().compareTo(o2.getId());
						}
						
					}
					return 	o1.getId().compareTo(o2.getId());
					
				}
		          
		       });
			}catch(Exception e){
				e.printStackTrace();
			}
			
			//Iterator<WellingtonTest> iter2 = resultList.iterator();
			int count = 0;
			
			int maxNum = startNum + Integer.parseInt(limit) - 1;
			if (startNum == -1){
				maxNum = resultList.size();
			}
			String data = "";
			for(WellingtonTest test :  resultList) {
			//	WellingtonTest test = iter2.next();
				if (count > maxNum){
					break;
				}
				
				if (count >=startNum && count <=maxNum){
				if (startNum == -1){
					data += test.toCSVRow()+"\n";
				}else{
					LinkedHashMap jsonOrderedMap = new LinkedHashMap();
					//assyProductTest = new JSONObject();
					//jsonOrderedMap.put("id", test.getId());
					jsonOrderedMap.put("serial", test.getMotorSerial());
					jsonOrderedMap.put("motortype", test.getMotorType()==null?"":test.getMotorType());
					if (test.getDatetimepacked() != null){
						jsonOrderedMap.put("datetimepacked",
							fmtDateTime.format(test.getDatetimepacked()));
					}else{
						jsonOrderedMap.put("datetimepacked","");
					}
					jsonOrderedMap.put("batchno", StringUtils.isNotBlank(test.getBatchno())?test.getBatchno():" ");
					jsonOrderedMap.put("containerno", StringUtils.isNotBlank(test.getContainerNo())?test.getContainerNo():" ");
					jsonOrderedMap.put("sequenceNo", test.getSequence()==null?" ":test.getSequence());
					
					if (test.getStatus() != null){
					jsonOrderedMap.put("result",
							test.getStatus().intValue() == StatusType.FAILED.getValue() ? "Failed" : "Passed");
					}else{
						jsonOrderedMap.put("result","");
					}
					
					if (test.getDatetested() != null){
					jsonOrderedMap.put("datetested",
							fmtDateTime.format(test.getDatetested()));
					}else{
						jsonOrderedMap.put("datetested","");
					}
	
					jsonOrderedMap.put("checksum", test.getChesum()==null?"":test.getChesum());
					jsonOrderedMap.put("tester", test.getTester()==null?"":test.getTester());
					jsonOrderedMap.put("qctested", (test.getQctested() != null && test.getQctested()==true)?"Yes":"No");
					
					jsonOrderedMap.put("limitnumber",  test.getLimitNumber()== null?"":test.getLimitNumber().toString());
					jsonOrderedMap.put("limitversion", test.getLimitVersion()== null?"":test.getLimitVersion().toString());
					jsonOrderedMap.put("limitrevision", test.getLimitRevision()== null?"":test.getLimitRevision().toString());
					jsonOrderedMap.put("voltage", test.getVoltage()==null?"":test.getVoltage().toString());
					
					
					if (test.getInputPowers() != null){
					jsonOrderedMap.put("inputpowers", test.getInputPowers().replaceAll(","," , "));
					}else{
						jsonOrderedMap.put("inputpowers", "");
					}
	//				String s = JSONValue.toJSONString(jsonOrderedMap);
					
					assyProductTest =  new JSONObject(jsonOrderedMap);
	//				if (startNum == -1){
	//					arrayTestData.add(s.replaceAll("null", "\"\""));
	//				}else{
	//					arrayTestData.add(assyProductTest);	
	//				}
					arrayTestData.add(assyProductTest);
					}
				}
				count++;
				
				
			}
			
			
			if (startNum == -1){
				String header = "Serial,Motor type,Packing on,Batch no,Container no,Sequence,Result,Datetime tested,Checksum,Tester,QC tested, Limit number, Limit version,Limit revision,Voltage,Input powers\n";
				PrintWriter out = response.getWriter();
				 response.setContentType("text/csv");
				response.setHeader("Content-Disposition", "filename=Wellington_data.csv");
				out.write(header+data);
				out.flush();
				out.close();

			}else{
				PrintWriter out = response.getWriter();
				response.setContentType("text/html; charset=UTF-8");
				obj.put("productLogList", arrayTestData);
				obj.put("fieldData", arrayFieldData);
				obj.put("columnData", arrayColumnData);
				obj.put("message", 0);
				obj.put("totalCount", resultList.size());
				obj.put("success", true);
				out.print(obj);
				out.flush();
			}
			
		} catch (Exception e) {
			PrintWriter out = response.getWriter();
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
			out.print(obj);
			out.flush();
		}
		
		
	}
	@RequestMapping("/getBatchNo")
	public void getBatchNo(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String shipmentNo = "";
		String motor = "";
		String customerOrder = "";
		String customerRef = "";
		String containerNo ="";
		String batchNo = "";
		String start = request.getParameter("start");
		String limit = request.getParameter("limit");
		if (StringUtils.isBlank(start)){
			start = "-1";
		}
		String filter = request.getParameter("filter");
		if (StringUtils.isNotBlank(filter)) {
			JSONArray filterArray =  (JSONArray) JSONValue.parse(filter);
			Criterion cFilter = null;
			for (int i=0;i<filterArray.size();i++){
				JSONObject filterObj = (JSONObject) filterArray.get(i);
				String filterProperty = (String) filterObj.get("property");
				Object valueObj = filterObj.get("value");
				if (filterProperty.equals("batchNo")){
					batchNo = valueObj.toString();
				}else if (filterProperty.equals("shipmentNo")){
					shipmentNo = valueObj.toString();
				}else if (filterProperty.equals("motor")){
					motor = valueObj.toString();
				}else if (filterProperty.equals("customerOrder")){
					customerOrder = valueObj.toString();
				}else if (filterProperty.equals("customerRef")){
					customerRef = valueObj.toString();
				}else if (filterProperty.equals("containerNo")){
					containerNo = valueObj.toString();
				}
				
			}
		}
		System.out.println("batchNo: "+batchNo);
		System.out.println("shipmentNo: "+shipmentNo);
		try {
			List<Object[]> subList = wellingtonTestService.getBatchNo(batchNo,motor,shipmentNo,customerOrder,customerRef,containerNo);
			int count = 0;
			int startNum = Integer.parseInt(start);//Integer.parseInt(start)*Integer.parseInt(limit) - (Integer.parseInt(limit) + 1);
			int maxNum = 0;
			if (StringUtils.isNotBlank(limit)){
				maxNum = startNum + Integer.parseInt(limit) - 1;
				if (startNum == -1){
					maxNum = subList.size();
				}
			}else{
				maxNum = subList.size();
			}
			JSONObject jsonTask;
			System.out.println(subList.size());
			for (Object[] st : subList) {
				//String[] value = st.split("#");
				if (count >=startNum && count <=maxNum){
					jsonTask = new JSONObject();
					jsonTask.put("batchNo", st[0].toString());
					jsonTask.put("name", st[0].toString());
					jsonTask.put("motor", st[1].toString());
					jsonTask.put("shipmentNo", st[2].toString());
					System.out.println("customer order="+st[3].toString());
					jsonTask.put("customerOrder", st[3].toString());
					jsonTask.put("customerRef", st[4].toString());
					jsonTask.put("containerNo", st[5].toString());
					jsonTask.put("qty", st[6].toString());
					array.add(jsonTask);
				}
				count++;
			}
			obj.put("BatchList", array);
			obj.put("message", 0);
			obj.put("success", true);
			obj.put("totalCount", subList.size());
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}finally{
			
		}
		out.print(obj);
		out.flush();
	}
	@RequestMapping("/getWellingtonShipmentList")
	public void getWellingtonShipmentList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		try{
		List<Object[]> subList = wellingtonTestService.getBatchNo("","","","","","");
		Set<String> shipmentSet = new HashSet<String>();
		for (Object[] st : subList) {
			//String[] value = st.split("#");
			if (st[2] != null && st[2].toString().trim().length() > 0){
				shipmentSet.add(st[2].toString());
			}
//			if (value.length == 3 && value[2].trim().length() > 0){
//				shipmentSet.add(value[2]);
//			}
		}
			//List<Inventtable> list = itemList//inventtableService.getAll();
			//System.out.println(list.size());
			JSONObject jsonTask;
//			System.out.println(subList.size());
//			jsonTask = new JSONObject();
//			jsonTask.put("shipmentNo", " ");
//			array.add(jsonTask);
			Iterator<String> it = shipmentSet.iterator();
			while(it.hasNext()){
				jsonTask = new JSONObject();
				jsonTask.put("shipmentNo", it.next());
				array.add(jsonTask);
			}
				
//			for (String st : subList) {
//				String[] value = st.split("#");
//				jsonTask = new JSONObject();
//				jsonTask.put("batchNo", value[0]);
//				jsonTask.put("name", value[0]);
//				if (value.length == 2 && value[1].trim().length() > 0){
//					jsonTask.put("shipmentNo", value[1]);
//					array.add(jsonTask);
//				}else{
//					jsonTask.put("shipmentNo", "");
//				}
//				
//			}
			obj.put("ShipmentList", array);
			obj.put("message", 0);
			obj.put("success", true);
			obj.put("totalCount", shipmentSet.size());
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}finally{
			
		}
		out.print(obj);
		out.flush();
	}	
	@RequestMapping("/updateBatchNo")
	public void updateBatchNo(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		String batchNo = request.getParameter("batchNo");
		String shipmentNo = request.getParameter("shipmentNo");
		String containerNo = request.getParameter("containerNo");
		if (shipmentNo == null){
			shipmentNo = "";
		}
		String customerOrder = request.getParameter("customerOrder");
		String customerRef = "";
		String motor = request.getParameter("motor");
		if (StringUtils.isNotBlank(customerOrder)){
			HttpClient client = new DefaultHttpClient();
	     	HttpPost post = new HttpPost("http://localhost:8080/ax-portlet/service/getCustomerRefByOrder");
	     	List nameValuePairs = new ArrayList(1);
	     	nameValuePairs.add(new BasicNameValuePair("customerOrder", customerOrder)); //you can as many name value pair as you want in the list.
	     	post.setEntity(new UrlEncodedFormEntity(nameValuePairs));
			HttpResponse response1 = client.execute(post);
			BufferedReader rd = new BufferedReader(new InputStreamReader(response1.getEntity().getContent()));
			String line = rd.readLine();
			JSONParser parser = new JSONParser();
			JSONObject  json;
			try {
				System.out.println(line);
				json = (JSONObject) parser.parse(line);
				customerRef = (String) json.get("CustomerRef");
			} catch (org.json.simple.parser.ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		try {
			Integer count = wellingtonTestService.updateShipmentByBatchNo(batchNo,motor,shipmentNo,customerOrder,customerRef,containerNo);
			obj.put("customerRef", customerRef);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}finally{
			
		}
		out.print(obj);
		out.flush();
	}
}
