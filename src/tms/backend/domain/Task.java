package tms.backend.domain;

// Generated Sep 12, 2013 8:08:12 AM by Hibernate Tools 3.4.0.CR1

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
 * Task generated by hbm2java
 */
@Entity
@Table(name = "task")
public class Task implements java.io.Serializable {

	private Long id;
	private String taskname;
	private String description;
	private Integer requesterId;
	private String department;
	private String assignee;
	private String assigneeEmail;
	private String assigneeName;
	private Byte priority;
	private Date requestDate;
	private Byte status;
	private Date targetdate;
	private Date planCompletedDate;
	private Date actualCompletedDate;
	private Date confirmDate;
	private String email;
	private String machineId;
	private Byte scope;
	private Long assetId;
	private Long assetCategoryId;
	private Byte taskAction;
	private Byte requestType;
	public Task() {
	}

	public Task(String taskname, String description, Integer requesterId,
			String department, Byte priority, Date requestDate, Byte status,
			Date targetdate, Date planCompletedDate, Date actualCompletedDate,
			String email) {
		this.taskname = taskname;
		this.description = description;
		this.requesterId = requesterId;
		this.department = department;
		this.priority = priority;
		this.requestDate = requestDate;
		this.status = status;
		this.targetdate = targetdate;
		this.planCompletedDate = planCompletedDate;
		this.actualCompletedDate = actualCompletedDate;
		this.email = email;
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

	@Column(name = "taskname", columnDefinition="TEXT")
	public String getTaskname() {
		return this.taskname;
	}

	public void setTaskname(String taskname) {
		this.taskname = taskname;
	}

	@Column(name = "description", columnDefinition="TEXT")
	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(name = "requester_id")
	public Integer getRequesterId() {
		return this.requesterId;
	}

	public void setRequesterId(Integer requesterId) {
		this.requesterId = requesterId;
	}

	@Column(name = "department")
	public String getDepartment() {
		return this.department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}
	@Column(name = "assignee")
	public String getAssignee() {
		return this.assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	@Column(name = "priority")
	public Byte getPriority() {
		return this.priority;
	}

	public void setPriority(Byte priority) {
		this.priority = priority;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "request_date", length = 0)
	public Date getRequestDate() {
		return this.requestDate;
	}

	public void setRequestDate(Date requestDate) {
		this.requestDate = requestDate;
	}

	@Column(name = "status")
	public Byte getStatus() {
		return this.status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "targetdate", length = 0)
	public Date getTargetdate() {
		return this.targetdate;
	}

	public void setTargetdate(Date targetdate) {
		this.targetdate = targetdate;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "plan_completed_date", length = 0)
	public Date getPlanCompletedDate() {
		return this.planCompletedDate;
	}

	public void setPlanCompletedDate(Date planCompletedDate) {
		this.planCompletedDate = planCompletedDate;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "actual_completed_date", length = 0)
	public Date getActualCompletedDate() {
		return this.actualCompletedDate;
	}

	public void setActualCompletedDate(Date actualCompletedDate) {
		this.actualCompletedDate = actualCompletedDate;
	}

	@Column(name = "email", columnDefinition="TEXT")
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	@Column(name = "scope")
	public Byte getScope() {
		return this.scope;
	}

	public void setScope(Byte scope) {
		this.scope = scope;
	}
	@Column(name = "assigneeEmail")
	public String getAssigneeEmail() {
		return assigneeEmail;
	}

	public void setAssigneeEmail(String assigneeEmail) {
		this.assigneeEmail = assigneeEmail;
	}
	@Column(name = "assigneeName")
	public String getAssigneeName() {
		return assigneeName;
	}

	public void setAssigneeName(String assigneeName) {
		this.assigneeName = assigneeName;
	}

	@Column(name = "machineId")
	public String getMachineId() {
		return machineId;
	}

	/**
	 * @param machineId the machineId to set
	 */
	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}

	/**
	 * @return the assetId
	 */
	@Column(name = "assetId")
	public Long getAssetId() {
		return assetId;
	}

	/**
	 * @param assetId the assetId to set
	 */
	public void setAssetId(Long assetId) {
		this.assetId = assetId;
	}

	/**
	 * @return the assetCategoryId
	 */
	@Column(name = "assetCategoryId")
	public Long getAssetCategoryId() {
		return assetCategoryId;
	}

	/**
	 * @param assetCategoryId the assetCategoryId to set
	 */
	public void setAssetCategoryId(Long assetCategoryId) {
		this.assetCategoryId = assetCategoryId;
	}

	/**
	 * @return the taskAction
	 */
	@Column(name = "taskAction")
	public Byte getTaskAction() {
		return taskAction;
	}

	/**
	 * @param taskAction the taskAction to set
	 */
	public void setTaskAction(Byte taskAction) {
		this.taskAction = taskAction;
	}

	/**
	 * @return the requestType
	 */
	@Column(name = "requestType")
	public Byte getRequestType() {
		return requestType;
	}

	/**
	 * @param requestType the requestType to set
	 */
	public void setRequestType(Byte requestType) {
		this.requestType = requestType;
	}

	/**
	 * @return the confirmDate
	 */
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "confirmedDate", length = 0)
	public Date getConfirmDate() {
		return confirmDate;
	}

	/**
	 * @param confirmDate the confirmDate to set
	 */
	public void setConfirmDate(Date confirmDate) {
		this.confirmDate = confirmDate;
	}

}
