package tms.backend.domain;

// Generated Apr 18, 2016 2:35:26 PM by Hibernate Tools 3.4.0.CR1

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Id;
import javax.persistence.Table;

/**
 * CourierSample generated by hbm2java
 */
@Entity
@Table(name = "courier_sample", catalog = "enterprise_app")
public class CourierSample implements java.io.Serializable {

	private Long id;
	private String sampleName;
	private Float sampleQuantity;
	private Float sampleWeight;
	private Long courierShipmentId;
	private Float sampleValue;
	private Boolean invoiced;
	private Boolean postedPs;
	private String psNo;
	public CourierSample() {
	}

	public CourierSample(String sampleName, Float sampleQuantity,
			Float sampleWeight, Long courierShipmentId, Float sampleValue) {
		this.sampleName = sampleName;
		this.sampleQuantity = sampleQuantity;
		this.sampleWeight = sampleWeight;
		this.courierShipmentId = courierShipmentId;
		this.sampleValue = sampleValue;
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

	@Column(name = "sample_name", length = 100)
	public String getSampleName() {
		return this.sampleName;
	}

	public void setSampleName(String sampleName) {
		this.sampleName = sampleName;
	}

	@Column(name = "sample_quantity", precision = 9, scale = 3)
	public Float getSampleQuantity() {
		return this.sampleQuantity;
	}

	public void setSampleQuantity(Float sampleQuantity) {
		this.sampleQuantity = sampleQuantity;
	}

	@Column(name = "sample_weight", precision = 9, scale = 3)
	public Float getSampleWeight() {
		return this.sampleWeight;
	}

	public void setSampleWeight(Float sampleWeight) {
		this.sampleWeight = sampleWeight;
	}

	@Column(name = "courier_shipment_id")
	public Long getCourierShipmentId() {
		return this.courierShipmentId;
	}

	public void setCourierShipmentId(Long courierShipmentId) {
		this.courierShipmentId = courierShipmentId;
	}

	@Column(name = "sample_value", precision = 9, scale = 3)
	public Float getSampleValue() {
		return this.sampleValue;
	}

	public void setSampleValue(Float sampleValue) {
		this.sampleValue = sampleValue;
	}
	@Column(name = "invoiced")
	public Boolean getInvoiced() {
		return this.invoiced;
	}

	public void setInvoiced(Boolean invoiced) {
		this.invoiced = invoiced;
	}

	@Column(name = "posted_PS")
	public Boolean getPostedPs() {
		return this.postedPs;
	}

	public void setPostedPs(Boolean postedPs) {
		this.postedPs = postedPs;
	}
	@Column(name = "PS_no", length = 100)
	public String getPsNo() {
		return this.psNo;
	}

	public void setPsNo(String psNo) {
		this.psNo = psNo;
	}

}
