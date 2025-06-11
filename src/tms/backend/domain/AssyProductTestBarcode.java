package tms.backend.domain;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Date;
import java.util.TimeZone;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.json.simple.JSONObject;

import tms.utils.CalendarUtil;
import tms.utils.ResourceUtil;

@Entity
@Table(name = "assy_product_test_barcode")
public class AssyProductTestBarcode implements java.io.Serializable {

	private Long id;
	private String data;
	private Byte status;
	private Date createdTime;
	private String productType;
	private String productModel;
	
	public AssyProductTestBarcode() {
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column(name = "data")
	public String getData() {
		return this.data;
	}

	public void setData(String data) {
		this.data = data;
	}

	@Column(name = "status")
	public Byte getStatus() {
		return this.status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}


	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "createdTime", length = 0)
	public Date getCreatedTime() {
		return this.createdTime;
	}

	public void setCreatedTime(Date createdTime) {
		this.createdTime = createdTime;
	}


	
	
	
	public String toCSVRow() throws IOException{
		return "";
//		SimpleDateFormat fmtDateTime = new SimpleDateFormat(
//				"dd-MMM-yyyy hh:mm:ss");
//		BufferedReader reader =null;
//		if (this.inputPowers !=null){
//			reader = new BufferedReader(new StringReader(this.inputPowers));	
//		}
//		
//		
//		return 	(this.motorSerial==null?",":this.motorSerial+",")+
//				(this.motorType==null?",":this.motorType+",")+
//				(this.datetimepacked==null?",":fmtDateTime.format(this.datetimepacked)+",")+
//				(this.batchno==null?",":this.batchno+",")+
//				(this.containerNo==null?",":this.containerNo+",")+
//				(this.sequence==null?",":this.sequence+",")+
//				(this.status==null?"":(this.status.intValue()==StatusType.FAILED.getValue()?"Fail,":"Pass,"))+
//				(this.datetested==null?",":fmtDateTime.format(this.datetested)+",")+
//				(this.chesum==null?",":this.chesum+",")+
//				(this.tester==null?",":this.tester+",")+
//				(this.qctested != null && this.qctested==true?"Yes,":"No,")+
//				(this.limitNumber==null?",":this.limitNumber+",")+
//				(this.limitVersion==null?",":this.limitVersion+",")+
//				(this.limitRevision==null?",":this.limitRevision+",")+
//				(this.voltage==null?",":this.voltage+",")+
//				(reader==null?",":reader.readLine()+",");

	}
	public JSONObject toJson() throws IllegalArgumentException, IllegalAccessException{
		JSONObject obj = new JSONObject();
		for (Field field : this.getClass().getDeclaredFields()) {
   		    Object value = field.get(this);
   		    if (value instanceof java.util.Date){
   		    	ResourceUtil.isoDateFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));
   		    	obj.put(field.getName(), CalendarUtil.dateToString((Date)value,ResourceUtil.isoDateFormat));
   		    }else{
   		    	obj.put(field.getName(), value);	
   		    }

	    }
		return obj;
	}

	@Column(name = "productType")
	public String getProductType() {
		return productType;
	}



	public void setProductType(String productType) {
		this.productType = productType;
	}
	@Column(name = "productModel")
	public String getProductModel() {
		return productModel;
	}

	public void setProductModel(String productModel) {
		this.productModel = productModel;
	}

}
