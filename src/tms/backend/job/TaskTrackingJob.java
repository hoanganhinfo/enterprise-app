package tms.backend.job;

import java.io.IOException;

import java.text.ParseException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.servlet.ServletException;

import tms.backend.domain.PmMailTask;
import tms.backend.domain.Task;
import tms.backend.service.TaskService;
import tms.backend.service.TaskServiceImpl;
import tms.utils.CalendarUtil;
import tms.utils.Email;
import tms.utils.PriorityType;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.messaging.Message;
import com.liferay.portal.kernel.messaging.MessageListener;
import com.liferay.portal.kernel.messaging.MessageListenerException;
import com.liferay.portal.kernel.util.MimeTypesUtil;
import com.liferay.portal.model.Organization;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.service.ServiceContext;
import com.liferay.portlet.documentlibrary.service.DLAppLocalServiceUtil;

public class TaskTrackingJob implements MessageListener {

	private TaskService taskService;

	@Override
	public void receive(Message arg0) throws MessageListenerException {

		/**
		 * Runs this program with Gmail POP3 server
		 */
		// TODO: remove below line if need use this service. Time schedule is setup in lifera-portlet.xml
		if (false) {
			System.out.println("Start scanning noreply@ewi.vn for creating task ...");
			String host = "mail.ewi.vn";
			String port = "995";
			// String userName = "noreply@ewi.vn";
			// String password = "NoReply";
			String userName = "noreply@ewi.vn";
			String password = "Ewi123456@";

			EmailAttachmentReceiver receiver = new EmailAttachmentReceiver();
			// System.out.println("\n----------xemsss-------"+receiver.getEmailTo("
			// 'cuong' d <cuong.@ewi.vn >")+"----------------\n");

			receiver.setUser(userName, password);
			receiver.downloadEmailAttachments(host, port);

			System.out.println("Start creating task on portal ...");

			for (PmMailTask item : receiver.ListMailInf) {
				// System.out.println("\t getRequesterId: "+
				// item.getRequesterId());
				// System.out.println("\t getRequesterName: "+
				// item.getRequesterName());
				// System.out.println("\t getDepartmentId: "+
				// item.getDepartmentId());
				// System.out.println("\t getEmail: "+ item.getEmail());
				// System.out.println("\t getAssigneeId: "+
				// item.getAssigneeId());
				// System.out.println("\t getAssigneeEmail: "+
				// item.getAssigneeEmail());
				//// System.out.println("\t getDesc: "+ item.getDesc());
				// System.out.println("\t getTaskname: "+ item.getTaskname());
				// System.out.println("\t getStatusId: "+ item.getStatusId());
				// System.out.println("\t getScopeId: "+ item.getScopeId());
				// System.out.println("\t getRequestDate: "+
				// item.getRequestDate());
				//
				// System.out.println("\t getPriorityId: "+
				// item.getPriorityId());
				// System.out.println("\t getTargetDate: "+
				// item.getTargetDate());

				System.out.println("\n");
				ServiceContext serviceContext = new ServiceContext();
				serviceContext.setUserId(Long.valueOf(item.getRequesterId()));
				serviceContext.setAddCommunityPermissions(true);
				serviceContext.setAddGuestPermissions(true);

				serviceContext.setAddGroupPermissions(true);
				try {
					Task task = saveTaskMail(item);
					Organization org = OrganizationLocalServiceUtil
							.getOrganization(Long.valueOf(item.getDepartmentId().replaceAll(",", "")));
					// send email to assignee

					if (task != null) {
						String subject = "[Task alert] - " + org.getName() + " has a new task on portal from "
								+ item.getRequesterName();
						StringBuffer body = new StringBuffer();
						body.append("<B>" + org.getName() + " has a new task</B>");
						body.append("<br>Task name: " + task.getTaskname());
						body.append("<br>Requested by: " + item.getRequesterName());
						body.append("<br>Priority: " + PriorityType.forValue(task.getPriority().intValue()).getLabel());
						body.append("<br>Target date: " + CalendarUtil.dateToString(task.getTargetdate()));
						body.append("<br>");
						body.append("<br>Description:");
						body.append("<br>" + task.getDescription());
						body.append("<br><br><br>");
						body.append("<br>=================================================");
						body.append("<br>This is automated mail. Please don't reply.Thanks");
						body.append("<br>=================================================");
						Email.postMail(item.getAssigneeEmail() + "," + task.getEmail(), subject, body.toString());
					} else {
						String subject = "[Task manager] Cannot create your task : " + item.getTaskname()
								+ " on portal";
						StringBuffer body = new StringBuffer();
						body.append("<B>To " + item.getRequesterName() + ",</B>");
						body.append("<br> There is some system problem when creating new task on portal");
						body.append("<br> Please resend or contact system administrator.");

						body.append("<br><br><br>");
						body.append("<br>=================================================");
						body.append("<br>This is automated mail. Please don't reply.Thanks");
						body.append("<br>=================================================");

						Email.postMail(item.getAddressFrom(), subject, body.toString());
					}

					// save attachment file
					System.out.println("\n-----------" + item.getAttachmentFileList().size() + "------------\n");
					for (MimeBodyPart file : item.getAttachmentFileList()) {

						com.liferay.portal.kernel.repository.model.Folder taskImageFolderId = DLAppLocalServiceUtil
								.getFolder(21501);

						DLAppLocalServiceUtil.addFileEntry(Long.valueOf(Long.valueOf(item.getRequesterId())),
								taskImageFolderId.getRepositoryId(), Long.valueOf(taskImageFolderId.getFolderId()),
								file.getFileName(), MimeTypesUtil.getContentType(file.getFileName()),
								setFileName(file.getFileName(), String.valueOf(task.getId())), task.getId() + "", "",
								file.getInputStream(), file.getSize(), serviceContext);

					}

				} catch (ServletException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (PortalException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (SystemException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (NumberFormatException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (MessagingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			System.out.println("End creating tasks on portal.");
		}

	}

	public Task saveTaskMail(PmMailTask emailInf) throws ServletException, IOException, ParseException {
		// logger.info("EWI : START METHOD - saveTask");

		// request.
		taskService = TaskServiceImpl.getInstance();
		String requesterId = emailInf.getRequesterId();// from
		String requesterName = emailInf.getRequesterName();// ten nguoi gui
		String departmentId = emailInf.getDepartmentId();// id depart
		String assigneeId = emailInf.getAssigneeId();// to
		String assigneeEmail = emailInf.getAssigneeEmail();
		String scopeId = emailInf.getScopeId();
		String taskname = emailInf.getTaskname();
		String desc = emailInf.getDesc();
		String priorityId = emailInf.getPriorityId();
		String statusId = emailInf.getStatusId();
		String requestDate = emailInf.getRequestDate();
		String targetDate = emailInf.getTargetDate();
		String planDate = emailInf.getPlanDate();
		String actualDate = emailInf.getActualDate();
		String email = emailInf.getEmail();// cc
		Task task = new Task();

		task.setRequesterId(Integer.parseInt(requesterId));
		task.setDepartment(departmentId);
		task.setAssignee(assigneeId);
		task.setAssigneeEmail(assigneeEmail);
		task.setScope(Byte.valueOf(scopeId));
		task.setTaskname(taskname);
		task.setDescription(desc);
		task.setPriority(Byte.valueOf(priorityId));
		task.setStatus(Byte.valueOf(statusId));
		task.setRequestDate(CalendarUtil.stringToDate(requestDate));
		task.setTargetdate(CalendarUtil.stringToDate(targetDate));
		// task.setPlanCompletedDate(CalendarUtil.stringToDate(planDate));
		// task.setActualCompletedDate(CalendarUtil.stringToDate(actualDate));
		task.setEmail(email);

		return taskService.saveOrUpdate(task);
	}

	public String setFileName(String filename, String id) {
		int x = 0;
		for (int i = 0; i < filename.length(); i++) {
			String tmp = String.valueOf(filename.charAt(i));
			if (tmp.trim().equals("."))
				x = i;
		}
		String _t = filename.substring(0, x).replace(" ", "_");
		String _d = filename.substring(x, filename.length());
		String _kq = _t + "_" + id + _d;
		return _kq;

	}

}