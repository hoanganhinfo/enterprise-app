package tms.backend.domain;

// Generated Dec 7, 2013 12:58:21 PM by Hibernate Tools 3.4.0.CR1

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * PmCalendar generated by hbm2java
 */
@Entity
@Table(name = "pm_calendar")
public class PmCalendar implements java.io.Serializable {

	private Long id;
	private String name;
	private String type;
	private Date calendarDate;
	private Byte calendarWeekday;
	private Date overrideStartDate;
	private Date overrideEndDate;
	private Byte isWorkingDay;
	private String availability;
	private Long projectId;

	public PmCalendar() {
	}

	public PmCalendar(String name, String type, Date calendarDate,
			Byte calendarWeekday, Date overrideStartDate, Date overrideEndDate,
			Byte isWorkingDay, String availability, Long projectId) {
		this.name = name;
		this.type = type;
		this.calendarDate = calendarDate;
		this.calendarWeekday = calendarWeekday;
		this.overrideStartDate = overrideStartDate;
		this.overrideEndDate = overrideEndDate;
		this.isWorkingDay = isWorkingDay;
		this.availability = availability;
		this.projectId = projectId;
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

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "calendar_date", length = 0)
	public Date getCalendarDate() {
		return this.calendarDate;
	}

	public void setCalendarDate(Date calendarDate) {
		this.calendarDate = calendarDate;
	}

	@Column(name = "calendar_weekday")
	public Byte getCalendarWeekday() {
		return this.calendarWeekday;
	}

	public void setCalendarWeekday(Byte calendarWeekday) {
		this.calendarWeekday = calendarWeekday;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "override_start_date", length = 0)
	public Date getOverrideStartDate() {
		return this.overrideStartDate;
	}

	public void setOverrideStartDate(Date overrideStartDate) {
		this.overrideStartDate = overrideStartDate;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "override_end_date", length = 0)
	public Date getOverrideEndDate() {
		return this.overrideEndDate;
	}

	public void setOverrideEndDate(Date overrideEndDate) {
		this.overrideEndDate = overrideEndDate;
	}

	@Column(name = "is_working_day")
	public Byte getIsWorkingDay() {
		return this.isWorkingDay;
	}

	public void setIsWorkingDay(Byte isWorkingDay) {
		this.isWorkingDay = isWorkingDay;
	}

	@Column(name = "availability")
	public String getAvailability() {
		return this.availability;
	}

	public void setAvailability(String availability) {
		this.availability = availability;
	}

	@Column(name = "project_id")
	public Long getProjectId() {
		return this.projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

}
