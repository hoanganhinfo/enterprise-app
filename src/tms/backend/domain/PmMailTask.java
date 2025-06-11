package tms.backend.domain;

import java.util.ArrayList;
import java.util.List;

import javax.mail.internet.MimeBodyPart;

public class PmMailTask 
{

	private String requesterId; 			//id from=
	private String requesterName; 			// from name =
	private String departmentId; 			// id depart=
	private String assigneeId; 				// to id=
	private long groupId; 				// to id=
	
	private String assigneeEmail;			// to= -taskmanager
	private String scopeId; 				//company=
	private String taskId; 					//--
	private String taskname; 				//subject email=
	
	private String desc; 					// message content=
	private String priorityId;
	private String statusId; 				//open =
	private String requestDate; 			// ngay gui mail=
	
	private String targetDate; 				// ngay muon fini-- phai cat chuoi xu ly chuoi de lay ra
	private String planDate; 
	private String actualDate;
	private String email; 					//cc= email@ewi.vn
	private ArrayList<MimeBodyPart>	attachmentFileList = new ArrayList<MimeBodyPart>();
	public String getRequesterId() {
		return requesterId;
	}
	public void setRequesterId(String requesterId) {
		this.requesterId = requesterId;
	}
	public String getRequesterName() {
		return requesterName;
	}
	public void setRequesterName(String requesterName) {
		this.requesterName = requesterName;
	}
	public String getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}
	public String getAssigneeId() {
		return assigneeId;
	}
	public void setAssigneeId(String assigneeId) {
		this.assigneeId = assigneeId;
	}
	public String getAssigneeEmail() {
		return assigneeEmail;
	}
	public void setAssigneeEmail(String assigneeEmail) {
		this.assigneeEmail = assigneeEmail;
	}
	public String getScopeId() {
		return scopeId;
	}
	public void setScopeId(String scopeId) {
		this.scopeId = scopeId;
	}
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	public String getTaskname() {
		return taskname;
	}
	public void setTaskname(String taskname) {
		this.taskname = taskname;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getPriorityId() {
		return priorityId;
	}
	public void setPriorityId(String priorityId) {
		this.priorityId = priorityId;
	}
	public String getStatusId() {
		return statusId;
	}
	public void setStatusId(String statusId) {
		this.statusId = statusId;
	}
	public String getRequestDate() {
		return requestDate;
	}
	public void setRequestDate(String requestDate) {
		this.requestDate = requestDate;
	}
	public String getTargetDate() {
		return targetDate;
	}
	public void setTargetDate(String targetDate) {
		this.targetDate = targetDate;
	}
	public String getPlanDate() {
		return planDate;
	}
	public void setPlanDate(String planDate) {
		this.planDate = planDate;
	}
	public String getActualDate() {
		return actualDate;
	}
	public void setActualDate(String actualDate) {
		this.actualDate = actualDate;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public long getGroupId() {
		return groupId;
	}
	public void setGroupId(long groupId) {
		this.groupId = groupId;
	}
	public ArrayList<MimeBodyPart> getAttachmentFileList() {
		return attachmentFileList;
	}
	public void setAttachmentFileList(ArrayList<MimeBodyPart> attachmentFileList) {
		this.attachmentFileList = attachmentFileList;
	}
	
	
	
	private String addressFrom ;
	public String getAddressFrom() {
		return addressFrom;
	}
	public void setAddressFrom(String addressFrom) {
		this.addressFrom = addressFrom;
	}
	
	

}
