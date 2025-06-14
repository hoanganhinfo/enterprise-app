package tms.backend.domain;

// Generated May 6, 2014 11:10:29 AM by Hibernate Tools 3.4.0.CR1

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * InjMold generated by hbm2java
 */
@Entity
@Table(name = "inj_mold")
public class InjMold implements java.io.Serializable {

	private Long id;
	private String moldCode;
	private String productCode;
	private String projectName;
	private Integer cavity;
	private String productName;
	private String color;

	public InjMold() {
	}

	public InjMold(String moldCode, String productCode, Integer cavity,
			String productName, String color) {
		this.moldCode = moldCode;
		this.productCode = productCode;
		this.cavity = cavity;
		this.productName = productName;
		this.color = color;
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

	@Column(name = "mold_code", length = 20)
	public String getMoldCode() {
		return this.moldCode;
	}

	public void setMoldCode(String moldCode) {
		this.moldCode = moldCode;
	}

	@Column(name = "product_code", length = 20)
	public String getProductCode() {
		return this.productCode;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	@Column(name = "cavity")
	public Integer getCavity() {
		return this.cavity;
	}

	public void setCavity(Integer cavity) {
		this.cavity = cavity;
	}

	@Column(name = "product_name")
	public String getProductName() {
		return this.productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}
	
	@Column(name = "color")
	public String getColor() {
		return this.color;
	}

	public void setColor(String color) {
		this.color = color;
	}
	@Column(name = "project_name")
	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

}
