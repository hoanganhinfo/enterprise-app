package tms.web.service;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.activation.DataSource;
import javax.mail.MessagingException;
import javax.mail.util.ByteArrayDataSource;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRHtmlExporter;
import net.sf.jasperreports.export.Exporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.validator.EmailValidator;
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

import tms.backend.domain.CourierSample;
import tms.backend.domain.CourierShipment;
import tms.backend.service.CourierSampleService;
import tms.backend.service.CourierShipmentService;
import tms.utils.CalendarUtil;
import tms.utils.DocumentType;
import tms.utils.Email;
import tms.utils.ResourceUtil;

import com.liferay.portal.model.EmailAddress;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.User;
import com.liferay.portal.service.EmailAddressLocalServiceUtil;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.service.UserLocalServiceUtil;

@Controller
public class CourierShipmentWS extends MultiActionController {
	@Autowired
	private CourierShipmentService courierShipmentService;
	@Autowired
	private CourierSampleService courierSampleService;

	@Autowired
	private SessionFactory sessionFactory;

	@RequestMapping("/saveCourierShipment")
	public void saveCourierShipment(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - saveCourierShipment");
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String companyId = request.getParameter("companyId");
	    System.out.println("companyId:"+ companyId);
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }

	    CourierShipment courierShipment = new CourierShipment();
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("CourierShipmentList");
			if (obj instanceof JSONArray){
				JSONArray array = (JSONArray)obj;
				Iterator<JSONObject>  iter = array.iterator();
				while(iter.hasNext()){
					JSONObject shipmentObj = iter.next();
					courierShipment = new CourierShipment();
					Long id =  (Long) shipmentObj.get("id");
					if (id != null){
						courierShipment.setId(id);
						courierShipment= courierShipmentService.findById(id);
					}else{
						String createdby = (String) shipmentObj.get("createdby");
						courierShipment.setCreatedby(createdby);
					}

					String sender = (String) shipmentObj.get("sender");
					courierShipment.setSender(sender);
					String trackingNo = (String) shipmentObj.get("trackingNo");
					courierShipment.setTrackingNo(trackingNo);
					String approver = (String) shipmentObj.get("approver");
					courierShipment.setApprover(approver);


					String  department = (String) shipmentObj.get("department");

					if (!department.equals(courierShipment.getDepartment())){
						Organization dept =  OrganizationLocalServiceUtil.getOrganization(Long.valueOf(companyId),department);
						String emailTo = "";//EmailAddressLocalServiceUtil//shipment.getEmailTo();
						List<EmailAddress> emailList = EmailAddressLocalServiceUtil
								.getEmailAddresses(Long.valueOf(companyId),
										"com.liferay.portal.model.Organization",
										dept.getOrganizationId());
						for (EmailAddress e : emailList) {
							emailTo = emailTo + ";" + e.getAddress();
						}
						courierShipment.setEmailTo(emailTo);
					}
					courierShipment.setDepartment(department);



					String shipment_company = (String) shipmentObj.get("shipmentCompany");
					courierShipment.setShipmentCompany(shipment_company);
					String shipment_contact = (String) shipmentObj.get("shipmentContact");
					courierShipment.setShipmentContact(shipment_contact);
					String shipment_address = (String) shipmentObj.get("shipmentAddress");
					courierShipment.setShipmentAddress(shipment_address);
					String paymentby = (String) shipmentObj.get("paymentby");
					courierShipment.setPaymentby(paymentby);
					String shipmentby = (String) shipmentObj.get("shipmentby");
					courierShipment.setShipmentby(shipmentby);
					String reference_note = (String) shipmentObj.get("reference_note");
					courierShipment.setReferenceNote(reference_note);
					String documentDate = (String) shipmentObj.get("document_date");
					if (StringUtils.isNotBlank(documentDate)){
						courierShipment.setDocumentDate(CalendarUtil.stringToDate(documentDate,ResourceUtil.isoDateFormat));
					}

					String service_type = (String) shipmentObj.get("service_type");
					courierShipment.setServiceType(service_type);
					String package_qty = (String) shipmentObj.get("package_qty");
					courierShipment.setPackageQty(package_qty);
					Object weight = (Object) shipmentObj.get("weight");
					courierShipment.setWeight(Float.valueOf(weight.toString()));
					Object length = (Object) shipmentObj.get("length");
					courierShipment.setLength(Float.parseFloat(length.toString()));
					Object width = (Object) shipmentObj.get("width");
					courierShipment.setWidth(Float.parseFloat(width.toString()));
					Object height = (Object) shipmentObj.get("height");
					courierShipment.setHeight(Float.parseFloat(height.toString()));
					Boolean invoiced = (Boolean) shipmentObj.get("invoiced");
					courierShipment.setInvoiced(invoiced);
					Boolean posted_PS = (Boolean) shipmentObj.get("posted_PS");
					courierShipment.setPostedPs(posted_PS);

					Boolean customs = (Boolean) shipmentObj.get("customs");
					courierShipment.setCustoms(customs);

					if (courierShipment.getPostedPs()){
						String PS_no = (String) shipmentObj.get("PS_no");
						courierShipment.setPsNo(PS_no);
					}
					String shipment_purpose = (String) shipmentObj.get("shipment_purpose");
					courierShipment.setShipmentPurpose(shipment_purpose);
					String status = (String) shipmentObj.get("status");

					//Email to
					//String emailTo = (String) shipmentObj.get("emailTo");

					boolean isSent = true;
					if (courierShipment.getStatus() != null
							&& courierShipment.getStatus() ==  DocumentType.OPEN.getValue()
							&& status.equals(DocumentType.SUBMITTED.getLabel())){
						isSent = sendEmail(courierShipment,Long.valueOf(companyId));
					}
					if (courierShipment.getStatus() != null
							&& courierShipment.getStatus() == DocumentType.SUBMITTED.getValue()
							&& status.equals(DocumentType.APPROVED.getLabel())){
						isSent = sendApprovedEmail(courierShipment,Long.valueOf(companyId));
					}
					if (isSent){
						courierShipment.setStatus(DocumentType.fromString(status).getValue());
					}
					courierShipment = courierShipmentService.saveOrUpdate(courierShipment);
				}
			}else{
				JSONObject shipmentObj = (JSONObject)obj;
				courierShipment = new CourierShipment();
				Long id =  (Long) shipmentObj.get("id");
				if (id != null){
					courierShipment.setId(id);
					courierShipment= courierShipmentService.findById(id);
				}else{
					String createdby = (String) shipmentObj.get("createdby");
					courierShipment.setCreatedby(createdby);
				}
				String createdby = (String) shipmentObj.get("createdby");
				courierShipment.setCreatedby(createdby);
				String trackingNo = (String) shipmentObj.get("trackingNo");
				courierShipment.setTrackingNo(trackingNo);				String sender = (String) shipmentObj.get("sender");
				courierShipment.setSender(sender);
				String approver = (String) shipmentObj.get("approver");
				courierShipment.setApprover(approver);

				String department = (String) shipmentObj.get("department");

				if (!department.equals(courierShipment.getDepartment())){
					Organization dept =  OrganizationLocalServiceUtil.getOrganization(Long.valueOf(companyId),department);
					String emailTo = "";//EmailAddressLocalServiceUtil//shipment.getEmailTo();
					List<EmailAddress> emailList = EmailAddressLocalServiceUtil
							.getEmailAddresses(Long.valueOf(companyId),
									"com.liferay.portal.model.Organization",
									dept.getOrganizationId());
					for (EmailAddress e : emailList) {
						emailTo = emailTo + ";" + e.getAddress();
					}
					courierShipment.setEmailTo(emailTo);
				}
				courierShipment.setDepartment(department);
				String shipment_company = (String) shipmentObj.get("shipmentCompany");
				courierShipment.setShipmentCompany(shipment_company);
				String shipment_contact = (String) shipmentObj.get("shipmentContact");
				courierShipment.setShipmentContact(shipment_contact);
				String shipment_address = (String) shipmentObj.get("shipmentAddress");
				courierShipment.setShipmentAddress(shipment_address);
				String paymentby = (String) shipmentObj.get("paymentby");
				courierShipment.setPaymentby(paymentby);
				String shipmentby = (String) shipmentObj.get("shipmentby");
				courierShipment.setShipmentby(shipmentby);
				String reference_note = (String) shipmentObj.get("reference_note");
				courierShipment.setReferenceNote(reference_note);
				String documentDate = (String) shipmentObj.get("document_date");
				if (StringUtils.isNotBlank(documentDate)){
					courierShipment.setDocumentDate(CalendarUtil.stringToDate(documentDate,ResourceUtil.isoDateFormat));
				}
				String service_type = (String) shipmentObj.get("service_type");
				courierShipment.setServiceType(service_type);
				String package_qty = (String) shipmentObj.get("package_qty");
				courierShipment.setPackageQty(package_qty);
				Object weight = (Object) shipmentObj.get("weight");
				courierShipment.setWeight(Float.valueOf(weight.toString()));
				Object length = (Object) shipmentObj.get("length");
				courierShipment.setLength(Float.parseFloat(length.toString()));
				Object width = (Object) shipmentObj.get("width");
				courierShipment.setWidth(Float.parseFloat(width.toString()));
				Object height = (Object) shipmentObj.get("height");
				courierShipment.setHeight(Float.parseFloat(height.toString()));
				Boolean invoiced = (Boolean) shipmentObj.get("invoiced");
				courierShipment.setInvoiced(invoiced);
				Boolean posted_PS = (Boolean) shipmentObj.get("posted_PS");
				courierShipment.setPostedPs(posted_PS);
				Boolean customs = (Boolean) shipmentObj.get("customs");
				courierShipment.setCustoms(customs);

				if (courierShipment.getPostedPs()){
					String PS_no = (String) shipmentObj.get("PS_no");
					courierShipment.setPsNo(PS_no);
				}
				String shipment_purpose = (String) shipmentObj.get("shipment_purpose");
				courierShipment.setShipmentPurpose(shipment_purpose);
				String status = (String) shipmentObj.get("status");
				//Email to
				//String emailTo = (String) shipmentObj.get("emailTo");

				boolean isSent = true;
				if (courierShipment.getStatus() != null
						&& courierShipment.getStatus() ==  DocumentType.OPEN.getValue()
						&& status.equals(DocumentType.SUBMITTED.getLabel())){
					isSent = sendEmail(courierShipment,Long.valueOf(companyId));
				}

				if (courierShipment.getStatus() != null
						&& courierShipment.getStatus() == DocumentType.SUBMITTED.getValue()
						&& status.equals(DocumentType.APPROVED.getLabel())){
					isSent = sendApprovedEmail(courierShipment,Long.valueOf(companyId));
				}
				if (isSent){
					courierShipment.setStatus(DocumentType.fromString(status).getValue());
				}
				courierShipment = courierShipmentService.saveOrUpdate(courierShipment);

			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("message", courierShipment.getId());
		obj.put("success", true);
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - saveCourierShipment");
	}

	@RequestMapping("/deleteCourierShipment")
	public void deleteCourierShipment(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("EWI : START METHOD - deleteCourierShipment");
		/*
		String assetCategoryId = request.getParameter("assetCategoryId");
		AssetCategory assetCategory = assetCategoryService.findById(Long.valueOf(assetCategoryId));
		assetCategoryService.delete(assetCategory);

		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		obj.put("id", assetCategory.getId());
		out.print(obj);
		out.flush();*/
		response.setContentType("text/html; charset=UTF-8");
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = request.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }
	    try {
	    	JSONObject rootObj =  (JSONObject) JSONValue.parse(sb.toString());
			Object obj =  rootObj.get("CourierShipmentList");

				JSONObject assetCategoryJson = (JSONObject)obj;
				Long id =  (Long) assetCategoryJson.get("id");
				CourierShipment courierShipment  = courierShipmentService.findById(id);
				courierShipmentService.deleteByShipment(id);
				courierShipmentService.delete(courierShipment);


		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();
		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - deleteCourierShipment");
	}

	@RequestMapping("/getCourierShipmentList")
	public void getCourierShipmentList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException, ParseException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// String myOrgs = request.getParameter("myOrgs");
		String departmentId = request.getParameter("departmentId");
		String start = request.getParameter("start");
		String limit = request.getParameter("limit");
		String sort = request.getParameter("sort");
		JSONArray sortArray =  (JSONArray) JSONValue.parse(sort);
		JSONObject sortObj = (JSONObject) sortArray.get(0);
		String sortProperty = (String) sortObj.get("property");
		String sortDirection = (String) sortObj.get("direction");
		List<CourierShipment> list = null;
		String filter = request.getParameter("filter");
		ArrayList<Criterion> conditionList = new ArrayList<>();
		if (StringUtils.isNotBlank(filter)) {
			JSONArray filterArray =  (JSONArray) JSONValue.parse(filter);
			Criterion cFilter = null;
			for (int i=0;i<filterArray.size();i++){

				JSONObject filterObj = (JSONObject) filterArray.get(i);
				String filterProperty = (String) filterObj.get("property");
				Object valueObj = filterObj.get("value");
				String type = (String) filterObj.get("type");
				String operator = (String) filterObj.get("operator");

				String filterValue = "";

				if (valueObj instanceof JSONArray){
					List<Long> fieldList = new ArrayList<Long>();

					JSONArray jsonArray = (JSONArray) filterObj.get("value");
					for(int j=0;j <jsonArray.size();j++){
						//filterValue= filterValue+ ","+jsonArray.get(j).toString().trim();
						fieldList.add(Long.valueOf(jsonArray.get(j).toString()));
						cFilter = Restrictions.in(filterProperty, fieldList);
					}
				}else{
					System.out.println("A");
					List<String> fieldList = new ArrayList<String>();
					filterValue = (String) filterObj.get("value");
					String[] keywords = filterValue.split(",");
					if ("string".equals(type)){
						for (String keyword : keywords) {
							if (keyword.trim().length() == 0){
								continue;
							}
							if (!keyword.contains("*")) {
								fieldList.add(keyword.trim());
							}else{
								cFilter = Restrictions.like(filterProperty,
										keyword.replace("*", "%"));
								list = courierShipmentService.getByCriteria(sortProperty,sortDirection,cFilter);
								/*
								for (CourierShipment record : list) {
									//serialList.add(employee.getEmployeeId());
									// access properties as Map
									Map<String, Object> properties;
									try {
										properties = BeanUtils.describe(record);
										Object value = properties.get(filterProperty);
										fieldList.add(String.valueOf(value).trim());
									} catch (IllegalAccessException e) {
										// TODO Auto-generated catch block
										e.printStackTrace();
									} catch (InvocationTargetException e) {
										// TODO Auto-generated catch block
										e.printStackTrace();
									} catch (NoSuchMethodException e) {
										// TODO Auto-generated catch block
										e.printStackTrace();
									}

								}*/
							}
						}
						System.out.println(fieldList.toString());
						if (fieldList.size() > 0){
							cFilter = Restrictions.in(filterProperty, fieldList);
						}
					}else if (type.equals("date")){
						filterValue = (String) filterObj.get("value");
						Date _date = CalendarUtil.stringToDate(filterValue,tms.utils.ResourceUtil.dateFormat_YYYYMMDD);
						Date beginDate = CalendarUtil.startOfDay(_date);
						Date endDate = CalendarUtil.endOfDay(_date);
						if (operator.equals("eq")){
							cFilter = Restrictions.between(filterProperty,beginDate,endDate);
						}else if (operator.equals("gte")){
							_date = CalendarUtil.startOfDay(_date);
							cFilter = Restrictions.ge(filterProperty,beginDate);
						}else if (operator.equals("lte")){
							_date = CalendarUtil.endOfDay(_date);
							cFilter = Restrictions.le(filterProperty,endDate);
						}else{
							cFilter =  Restrictions.or(Restrictions.lt(filterProperty,beginDate),
									Restrictions.gt(filterProperty,endDate));
						}
					}else if (type.equals("int")){
						filterValue = (String) filterObj.get("value");
						long _value = Long.parseLong(filterValue);
						if (operator.equals("eq")){
							cFilter = Restrictions.between(filterProperty,_value,_value);
						}else if (operator.equals("gte")){
							cFilter = Restrictions.ge(filterProperty,_value);
						}else if (operator.equals("lte")){
							cFilter = Restrictions.le(filterProperty,_value);
						}else{
							cFilter =  Restrictions.or(Restrictions.lt(filterProperty,_value),
									Restrictions.gt(filterProperty,_value));
						}
					}
					//cFilter = Restrictions.in("employeeId", serialList);

				}

				conditionList.add(cFilter);



			}



		}

		// Criterion cRequestDate = Restrictions.and(cFromdate, cTodate);
		try {


			list = courierShipmentService.getByCriteria(Integer.parseInt(start), Integer.parseInt(limit),sortProperty,sortDirection,conditionList);
			JSONObject jsonCourierShipment;
			for (CourierShipment shipment : list) {

				jsonCourierShipment = new JSONObject();
				jsonCourierShipment.put("id", shipment.getId());
				jsonCourierShipment.put("trackingNo", shipment.getTrackingNo());
				jsonCourierShipment.put("sender", shipment.getSender());
				jsonCourierShipment.put("department", shipment.getDepartment());
				jsonCourierShipment.put("shipmentCompany", shipment.getShipmentCompany());
				jsonCourierShipment.put("shipmentContact", shipment.getShipmentContact());
				jsonCourierShipment.put("shipmentAddress", shipment.getShipmentAddress());
				jsonCourierShipment.put("paymentby", shipment.getPaymentby());
				jsonCourierShipment.put("shipmentby", shipment.getShipmentby());
				jsonCourierShipment.put("document_date", CalendarUtil.dateToString(shipment.getDocumentDate()));
				jsonCourierShipment.put("reference_note", shipment.getReferenceNote());
				jsonCourierShipment.put("service_type", shipment.getServiceType());
				jsonCourierShipment.put("shipment_purpose", shipment.getShipmentPurpose());
				jsonCourierShipment.put("package_qty", shipment.getPackageQty());
				jsonCourierShipment.put("weight", shipment.getWeight());
				jsonCourierShipment.put("length", shipment.getLength());
				jsonCourierShipment.put("width", shipment.getWidth());
				jsonCourierShipment.put("height", shipment.getHeight());
				jsonCourierShipment.put("approver", shipment.getApprover().trim());
				jsonCourierShipment.put("emailTo", shipment.getEmailTo().trim());
				jsonCourierShipment.put("PS_no", shipment.getPsNo());
				jsonCourierShipment.put("invoiced", shipment.getInvoiced());
				jsonCourierShipment.put("posted_PS", shipment.getPostedPs());
				jsonCourierShipment.put("customs", shipment.getCustoms());
				jsonCourierShipment.put("status", DocumentType.forValue(shipment.getStatus()).getLabel());
				jsonCourierShipment.put("createdby", shipment.getCreatedby());
				//jsonCourierShipment.put("creatorEmail", shipment.getCreatorEmail());

				array.add(jsonCourierShipment);
			}
			obj.put("CourierShipmentList", array);
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

	@RequestMapping("/exportCourierShipment")
	public void exportCourierShipment(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException,
			ParseException {

		String shipmentId = request.getParameter("shipmentId");
		response.setContentType("application/pdf");
		response.setHeader("Content-Disposition", "attachment;filename="+shipmentId+".pdf");
		ServletOutputStream outputStream = response.getOutputStream();
		InputStream tmplStream = getClass()
				.getClassLoader()
				.getResourceAsStream("tms/backend/conf/report/CourierShipment.jrxml");


		CourierShipment shipment = courierShipmentService.findById(Long.valueOf(shipmentId));
		try{
		// String path = request.getSession().getServletContext().getResourceAsStream("cadena/backend/conf/report/LeaveRequestData.xls");
		 JasperReport jasperReport = JasperCompileManager.compileReport(tmplStream);
		 Map parameters = new HashMap();
		 System.out.println("...header....");
		 parameters.put("sender", shipment.getSender());
		 parameters.put("shipmentNo", shipment.getId().toString());
		 parameters.put("department", shipment.getDepartment());
		 parameters.put("shipmentBy", shipment.getShipmentby()!= null?shipment.getShipmentby().toUpperCase():"");
		 parameters.put("documentDate", shipment.getDocumentDate());
		 parameters.put("companyName", shipment.getShipmentCompany());
		 parameters.put("contactName", shipment.getShipmentContact());
		 parameters.put("contactAddress", shipment.getShipmentAddress());
		 parameters.put("paymentBy", shipment.getPaymentby());
		 parameters.put("yourRef", shipment.getReferenceNote());
		 parameters.put("serviceType", shipment.getServiceType());
		 parameters.put("PackageQty", shipment.getPackageQty());
		 parameters.put("weight", shipment.getWeight());
		 parameters.put("length", shipment.getLength());
		 parameters.put("width", shipment.getWidth());
		 parameters.put("height", shipment.getHeight());
		 parameters.put("shipmentPurpose", shipment.getShipmentPurpose());
		 parameters.put("customs", shipment.getCustoms()!= null && shipment.getCustoms()?"Y":"");
		 System.out.println("... detail ...");

		 boolean invoiced = false;

		 Criterion cShipmentId = Restrictions.eq("courierShipmentId", shipment.getId());
		 List<CourierSample> dataList = courierSampleService.getByCriteria(cShipmentId);
		 if (dataList.size() == 0){
			 CourierSample sample = new CourierSample();
			 dataList.add(sample);
		 }
		 String po = "";
		 Set<String> poSet = new HashSet<String>();
		 for(CourierSample sample : dataList){
			 if (sample.getInvoiced() != null &&  sample.getInvoiced()){
				 invoiced = true;
			 }
			 if (sample.getPsNo() != null && sample.getPsNo().trim().length() > 0){
				 if (!poSet.contains(sample.getPsNo())){
					 poSet.add(sample.getPsNo().trim());
					 po +=sample.getPsNo().trim()+",";
				 }
			 }
		 }
		 parameters.put("invoiced", invoiced?"Y":"");
		 parameters.put("PO", po);
	      JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);


		 JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, beanColDataSource);
		 byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);
		 outputStream.write(pdfBytes);
		 JRHtmlExporter html = new JRHtmlExporter();

		 //uncomment this line to make browser download the file
		 //response.setContentType("application/pdf");
		 //response.setHeader("Content-Disposition", "attachment;filename=xxx.pdf");
		}catch(Exception e){
			e.printStackTrace();
		}

		outputStream.flush();
		outputStream.close();
	}

	@RequestMapping("/updateTrackingNo")
	public void updateTrackingNo(HttpServletRequest request,
			HttpServletResponse response)  throws ServletException, IOException  {
		logger.info("EWI : START METHOD - updateTrackingNo");
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		JSONObject obj = new JSONObject();
		out = response.getWriter();

		// request.
		try{
		int MAX_COUNTER = 1080;
		String shipmentNo = request.getParameter("shipmentNo");
		String trackingNo = request.getParameter("trackingNo");
		Criterion cShipmentId = Restrictions.eq("courierShipmentId", Long.valueOf(shipmentNo));
		CourierShipment courierShipment = courierShipmentService.findById(Long.valueOf(shipmentNo));
		courierShipment.setTrackingNo(trackingNo);
		courierShipmentService.update(courierShipment);

		obj.put("success", true);
		obj.put("errorCode", 0);
		}catch(Exception e){
			obj.put("success", false);
			obj.put("errorCode", 0);
		}

		out.print(obj);
		out.flush();
		logger.info("EWI : END METHOD - updateTrackingNo");
	}
	private boolean sendEmail(CourierShipment shipment,long companyId){
		try{
			InputStream tmplStream = getClass()
					.getClassLoader()
					.getResourceAsStream("tms/backend/conf/report/CourierShipment.jrxml");

			 String message = "";
			 DataSource aAttachment = null ;

			 JasperReport jasperReport = JasperCompileManager.compileReport(tmplStream);
			 Map parameters = new HashMap();
			 System.out.println("...header....");
			 parameters.put("sender", shipment.getSender());
			 parameters.put("shipmentNo", shipment.getId().toString());
			 parameters.put("department", shipment.getDepartment());
			 parameters.put("shipmentBy", shipment.getShipmentby()!= null?shipment.getShipmentby().toUpperCase():"");
			 parameters.put("documentDate", shipment.getDocumentDate());
			 parameters.put("companyName", shipment.getShipmentCompany());
			 parameters.put("contactName", shipment.getShipmentContact());
			 parameters.put("contactAddress", shipment.getShipmentAddress());
			 parameters.put("paymentBy", shipment.getPaymentby());
			 parameters.put("yourRef", shipment.getReferenceNote());
			 parameters.put("serviceType", shipment.getServiceType());
			 parameters.put("PackageQty", shipment.getPackageQty());
			 parameters.put("weight", shipment.getWeight());
			 parameters.put("length", shipment.getLength());
			 parameters.put("width", shipment.getWidth());
			 parameters.put("height", shipment.getHeight());
			 parameters.put("shipmentPurpose", shipment.getShipmentPurpose());
			 parameters.put("customs", shipment.getCustoms()!= null && shipment.getCustoms()?"Y":"");
			 System.out.println("... detail ...");

			 boolean invoiced = false;

			 Criterion cShipmentId = Restrictions.eq("courierShipmentId", shipment.getId());
			 List<CourierSample> dataList = courierSampleService.getByCriteria(cShipmentId);
			 if (dataList.size() == 0){
				 CourierSample sample = new CourierSample();
				 dataList.add(sample);
			 }
			 String po = "";

			 Set<String> poSet = new HashSet<String>();
			 for(CourierSample sample : dataList){
				 if (sample.getInvoiced() != null &&  sample.getInvoiced()){
					 invoiced = true;
				 }
				 if (sample.getPsNo() != null && sample.getPsNo().trim().length() > 0){
					 if (!poSet.contains(sample.getPsNo())){
						 poSet.add(sample.getPsNo().trim());
						 po +=sample.getPsNo().trim()+",";
					 }
				 }
			 }
			 parameters.put("invoiced", invoiced?"Y":"");
			 parameters.put("PO", po);
		      JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
		      ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			 JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, beanColDataSource);
			 Exporter exporter = new HtmlExporter();
	         exporter.setExporterOutput(new SimpleHtmlExporterOutput(outStream));
	         exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
	         exporter.exportReport();
	         message = new String(outStream.toByteArray(), StandardCharsets.UTF_8);

	         ByteArrayOutputStream baos = new ByteArrayOutputStream();
	 		JasperExportManager.exportReportToPdfStream(jasperPrint, baos);
	 		aAttachment =  new ByteArrayDataSource(baos.toByteArray(), "application/pdf");




			String[] emails = shipment.getEmailTo().split(";");
			String subject = String.format("[Task alert] - Courier shipment #%d need to be approved",shipment.getId());
			StringBuffer body = new StringBuffer();
			body.append("Dear sir/madam,");
			body.append("<br>Please visit link http://portal.ewi.vn:8080 to approve this shipment<br>");
			body.append(message);
			body.append("<br><br>");
			body.append("Regards.");
			body.append("<br><br><br>");
			body.append("<br>=================================================");
			body.append("<br>This is automated mail. Please don't reply.Thanks");
			body.append("<br>=================================================");

			for(int i=0;i<emails.length;i++){
				if (EmailValidator.getInstance().isValid(emails[i])){
					System.out.println(emails[i]);
					Email.postMail(emails[i], subject, body.toString(),aAttachment,String.format("CourierShipment#%d", shipment.getId()),"Courier shipment");
				}
			}
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		return true;
	}
	private boolean sendApprovedEmail(CourierShipment shipment,long companyId){
		try {
			User user =  UserLocalServiceUtil.getUserByScreenName(companyId, shipment.getCreatedby());

			String[] emails= { "courier@ewi.vn",user.getEmailAddress()};
			InputStream tmplStream = getClass().getClassLoader()
					.getResourceAsStream("tms/backend/conf/report/CourierShipment.jrxml");

			String message = "";
			DataSource aAttachment = null;

			// String path =
			// request.getSession().getServletContext().getResourceAsStream("cadena/backend/conf/report/LeaveRequestData.xls");
			JasperReport jasperReport = JasperCompileManager.compileReport(tmplStream);
			Map parameters = new HashMap();
			System.out.println("...header....");
			parameters.put("sender", shipment.getSender());
			parameters.put("shipmentNo", shipment.getId().toString());
			parameters.put("department", shipment.getDepartment());
			parameters.put("shipmentBy",
					shipment.getShipmentby() != null ? shipment.getShipmentby()
							.toUpperCase() : "");
			parameters.put("documentDate", shipment.getDocumentDate());
			parameters.put("companyName", shipment.getShipmentCompany());
			parameters.put("contactName", shipment.getShipmentContact());
			parameters.put("contactAddress", shipment.getShipmentAddress());
			parameters.put("paymentBy", shipment.getPaymentby());
			parameters.put("yourRef", shipment.getReferenceNote());
			parameters.put("serviceType", shipment.getServiceType());
			parameters.put("PackageQty", shipment.getPackageQty());
			parameters.put("weight", shipment.getWeight());
			parameters.put("length", shipment.getLength());
			parameters.put("width", shipment.getWidth());
			parameters.put("height", shipment.getHeight());
			parameters.put("shipmentPurpose", shipment.getShipmentPurpose());
			parameters.put("customs",shipment.getCustoms() != null	&& shipment.getCustoms() ? "Y" : "");

			boolean invoiced = false;

			Criterion cShipmentId = Restrictions.eq("courierShipmentId",
					shipment.getId());
			List<CourierSample> dataList = courierSampleService
					.getByCriteria(cShipmentId);
			if (dataList.size() == 0) {
				CourierSample sample = new CourierSample();
				dataList.add(sample);
			}
			String po = "";

			Set<String> poSet = new HashSet<String>();
			for (CourierSample sample : dataList) {
				if (sample.getInvoiced() != null && sample.getInvoiced()) {
					invoiced = true;
				}
				if (sample.getPsNo() != null
						&& sample.getPsNo().trim().length() > 0) {
					if (!poSet.contains(sample.getPsNo())) {
						poSet.add(sample.getPsNo().trim());
						po += sample.getPsNo().trim() + ",";
					}
				}
			}
			parameters.put("invoiced", invoiced ? "Y" : "");
			parameters.put("PO", po);
			JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(
					dataList);
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperReport, parameters, beanColDataSource);
			Exporter exporter = new HtmlExporter();
			exporter.setExporterOutput(new SimpleHtmlExporterOutput(outStream));
			exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
			exporter.exportReport();
			message = new String(outStream.toByteArray(),StandardCharsets.UTF_8);
			String str;

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			JasperExportManager.exportReportToPdfStream(jasperPrint, baos);
			aAttachment = new ByteArrayDataSource(baos.toByteArray(),
					"application/pdf");

			String subject = String
					.format("[Task alert] - Courier shipment #%d is ready for shipping",
							shipment.getId());
			StringBuffer body = new StringBuffer();
			body.append("Dear sir/madam,");
			body.append(String.format(
					"<br>Courier shipment #%d is ready for shipping",
					shipment.getId()));
			body.append("<br><br>");
			body.append(message);
			body.append("Regards.");
			body.append("<br><br><br>");
			body.append("<br>=================================================");
			body.append("<br>This is automated mail. Please don't reply.Thanks");
			body.append("<br>=================================================");
			for (int i = 0; i < emails.length; i++) {
				if (EmailValidator.getInstance().isValid(emails[i])) {
					Email.postMail(emails[i],subject,body.toString(),aAttachment,
							String.format("CourierShipment#%d",
									shipment.getId()), "Courier shipment");
				}
			}
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		return true;


	}
}
