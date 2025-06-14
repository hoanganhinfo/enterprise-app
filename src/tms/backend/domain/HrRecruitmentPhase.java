package tms.backend.domain;
// Generated Oct 9, 2013 2:23:35 PM by Hibernate Tools 3.4.0.CR1

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * HrRecruitmentPhase generated by hbm2java
 */
@Entity
@Table(name = "hr_recruitment_phase")
public class HrRecruitmentPhase implements java.io.Serializable {

	private Long id;
	private String phaseCode;
	private String phaseName;
	private Date postedDate;
	private Date stopDate;
	private String postedMethod;
	private String postedContent;
	private Integer status;

	public HrRecruitmentPhase() {
	}

	public HrRecruitmentPhase(String phaseCode, String phaseName,
			Date postedDate, Date stopDate, String postedMethod,
			String postedContent, Integer status) {
		this.phaseCode = phaseCode;
		this.phaseName = phaseName;
		this.postedDate = postedDate;
		this.stopDate = stopDate;
		this.postedMethod = postedMethod;
		this.postedContent = postedContent;
		this.status = status;
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

	@Column(name = "phase_code", length = 20)
	public String getPhaseCode() {
		return this.phaseCode;
	}

	public void setPhaseCode(String phaseCode) {
		this.phaseCode = phaseCode;
	}

	@Column(name = "phase_name", length = 200)
	public String getPhaseName() {
		return this.phaseName;
	}

	public void setPhaseName(String phaseName) {
		this.phaseName = phaseName;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "posted_date", length = 0)
	public Date getPostedDate() {
		return this.postedDate;
	}

	public void setPostedDate(Date postedDate) {
		this.postedDate = postedDate;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "stop_date", length = 0)
	public Date getStopDate() {
		return this.stopDate;
	}

	public void setStopDate(Date stopDate) {
		this.stopDate = stopDate;
	}

	@Column(name = "posted_method", length = 200)
	public String getPostedMethod() {
		return this.postedMethod;
	}

	public void setPostedMethod(String postedMethod) {
		this.postedMethod = postedMethod;
	}

	@Column(name = "posted_content", columnDefinition="TEXT")
	public String getPostedContent() {
		return this.postedContent;
	}

	public void setPostedContent(String postedContent) {
		this.postedContent = postedContent;
	}

	@Column(name = "status")
	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

}
