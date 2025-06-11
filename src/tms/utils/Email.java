package tms.utils;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.HtmlEmail;
import org.apache.commons.mail.MultiPartEmail;

import com.liferay.mail.service.MailServiceUtil;
import com.liferay.portal.kernel.mail.MailMessage;
import com.liferay.portal.kernel.messaging.MessageBusUtil;

import java.io.File;
import java.util.StringTokenizer;
import java.util.Vector;
import java.util.Date;
import java.util.Properties;

/**
 * User: ble Date: Jul 23, 2007 Time: 12:34:37 AM
 */
public class Email {
	public Email() {
	}

	/**
	 * The sendMail method sends an email @ param recipients This is a string
	 * will all the email addresses with , delimiter. Note that currently is
	 * takes only a list of users and not email group. @ param subject Subject
	 * of the email @ param message Complete message of the email @ param from
	 * the sender email address as a string @ return boolean, true if the email
	 * send is successful otherwise false @ throws javax.Mail.MessagingException
	 * EmailDetail.xml contains the information related to email.
	 */
	public boolean sendMail(javax.mail.Session mailSession, String recipients,
			String subject, String message, String from)
			throws MessagingException {

		int noOfRecipients = 0;
		Address[] addressTo = null;
		Vector vectorRecipients = new Vector();

		StringTokenizer tokenizerEmailAddress = new StringTokenizer(recipients,
				",");

		for (int i = 0; (tokenizerEmailAddress.hasMoreTokens()); i++) {
			vectorRecipients.addElement((Address) (new InternetAddress(
					tokenizerEmailAddress.nextToken())));
			addressTo = new Address[vectorRecipients.size()];
			for (int j = 0; j < vectorRecipients.size(); j++) {
				addressTo[j] = (Address) vectorRecipients.elementAt(j);
			}

		}

		try {
			Message mailMsg = new MimeMessage(mailSession);
			InternetAddress addressFrom = new InternetAddress(from);
			mailMsg.setSubject(subject);
			mailMsg.setFrom(addressFrom);
			mailMsg.setRecipients(Message.RecipientType.TO, addressTo);
			mailMsg.setSentDate(new Date());
			// emailMPartContent.setContent(message);
			// mailMsg.setContent(emailMPartContent.getMultiPart());

			mailMsg.setContent(message, "text/plain");
			System.out.println("***sending the message to " + addressTo);
			Transport.send(mailMsg);
		} catch (MessagingException mx) {
			mx.printStackTrace();
			Exception ex = null;
			if ((ex = mx.getNextException()) != null) {
				ex.printStackTrace();
			}
			return false;
		}
		return true;
	}

	/**
	 * The postTextMail method sends an email. This method can be called
	 * directly without any other previous method as a prerequisite. @ param
	 * recipients This is a string will all the email addresses with ','
	 * delimiter. Note that currently is takes only a list of users and not
	 * email group. @ param subject Subject of the email @ param message
	 * Complete message of the email @ param from the sender email address as a
	 * string @ param SMTPHost address or name of SMTP server @ param authName
	 * Authantication name if required, null otherwise @ param authPassword
	 * Password if authantication required @ throws
	 * javax.Mail.MessagingException
	 */
	public static void postMail(String recipients, String subject,
			String message, String from, String SMTPHost, String port,
			String authName, String authPassword,DataSource dataSource) throws MessagingException {
		try {
			boolean debug = false;
			// recipients="minhnt@unicomsoftware.com,";
			// subject = "test";
			// message ="test";
			// from ="noreply@ewi.vn";
			// SMTPHost = "smtp.vntt.com.vn";
			// port="25";
			// authName= "itsupervisor@ewi.vn";
			// Set the host smtp address
			Properties props = new Properties();
			props.put("mail.smtp.host", SMTPHost);
			props.put("mail.smtp.port", port);
			// create some properties and get the default Session
			Session session = Session.getDefaultInstance(props);
			session.setDebug(debug);

			// create a message
			MimeMessage msg = new MimeMessage(session);

			// set the from and to address
			InternetAddress addressFrom = null;

			addressFrom = new InternetAddress(from);

			msg.setFrom(addressFrom);

			StringTokenizer st = new StringTokenizer(recipients, ";");
			InternetAddress[] addressTo = new InternetAddress[st.countTokens()];
			for (int i = 0; st.hasMoreElements(); i++) {
				String tmpEmailAddress = st.nextToken();

				addressTo[i] = new InternetAddress(tmpEmailAddress);

			}

			msg.setRecipients(Message.RecipientType.TO, addressTo);

			// Optional : You can also set your custom headers in the Email if
			// you Want
			// msg.addHeader("MyHeaderName", "myHeaderValue");

			// Setting the Subject and Content Type

			msg.setSubject(subject, "utf-8");

			// msg.setText(subject,"utf-8");
			// msg.setContent(message, "text/html");
			if (addressTo.length == 0) return ;
			msg.setText(message, "utf-8", "html");
//			if (dataSource != null){
//				Multipart multipart = new MimeMultipart();
//				MimeBodyPart messageBodyPart = new MimeBodyPart();
//				messageBodyPart.setDataHandler(new DataHandler(dataSource));
//				messageBodyPart.setFileName(filename);
//				
//				multipart.addBodyPart(messageBodyPart);
//				msg.setContent(multipart);
//				
//			}
			st = null;
			MailMessage mailMessage = new MailMessage();
			
			mailMessage.setFrom(addressFrom);
			mailMessage.setSubject(subject);
			mailMessage.setBody(message);
			mailMessage.setTo(addressTo);
			mailMessage.setHTMLFormat(true);
			
			System.out.println("sending mail");
			MailServiceUtil.sendEmail(mailMessage); 

			
//			Transport tr = session.getTransport("smtp");
//
//			tr.connect(SMTPHost, Integer.parseInt(port), authName, authPassword);
//
//			msg.saveChanges(); // don't forget this
//			tr.sendMessage(msg, msg.getAllRecipients());
//			tr.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * The postTextMail method sends an email. @ param recipients This is a
	 * string will all the email addresses with ',' delimiter. Note that
	 * currently is takes only a list of users and not email group. @ param
	 * subject Subject of the email @ param message Complete message of the
	 * email @ throws javax.Mail.MessagingException
	 */
	public static void postMail(String recipients, String subject,
			String message) throws MessagingException {
		System.out.println("Email to: " + recipients);
		try{
		String emailServer = Config.getInstance().getProperty("email.server");
		String emailFrom = Config.getInstance().getProperty("email.from");
		String emailUser = Config.getInstance().getProperty("email.user");
		String port = Config.getInstance().getProperty("email.port");
		String emailPassword = Config.getInstance().getProperty(
				"email.password");
//		postMail(recipients, subject, message, emailFrom, emailServer, port,
//				emailUser, emailPassword,dataSource);
		// create the mail
		HtmlEmail  email = new HtmlEmail ();
		email.setHostName(emailServer);
		email.setSmtpPort(Integer.parseInt(port));
		email.setStartTLSEnabled(false);
		email.setAuthenticator(new DefaultAuthenticator(emailUser, emailPassword));
		
		email.setFrom(emailFrom);
		email.addTo(recipients);
		email.setSubject(subject);
		email.setHtmlMsg(message);
		

		// send the email
		email.send();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	public static void postMail(String recipients, String subject,
			String message,DataSource dataSource,String filename, String fileDesc) throws MessagingException {
		try{
		String emailServer = Config.getInstance().getProperty("email.server");
		String emailFrom = Config.getInstance().getProperty("email.from");
		String emailUser = Config.getInstance().getProperty("email.user");
		String port = Config.getInstance().getProperty("email.port");
		String emailPassword = Config.getInstance().getProperty(
				"email.password");
//		postMail(recipients, subject, message, emailFrom, emailServer, port,
//				emailUser, emailPassword,dataSource);
		// create the mail
		HtmlEmail  email = new HtmlEmail ();
		email.setHostName(emailServer);
		email.setSmtpPort(Integer.parseInt(port));
		email.setAuthenticator(new DefaultAuthenticator(emailUser, emailPassword));
		
		email.setFrom(emailFrom);
		email.addTo(recipients);
		email.setSubject(subject);
		email.setHtmlMsg(message);
		// add the attachment
		if (dataSource != null){
			email.attach(dataSource, filename, fileDesc);
		}

		// send the email
		email.send();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}

/**
 * SimpleAuthenticator is used to do simple authentication when the SMTP server
 * requires it.
 */
class SMTPAuthenticator extends javax.mail.Authenticator {
	String uname;
	String pwd;

	public SMTPAuthenticator(String uname, String pwd) {
		super();
		this.uname = uname;
		this.pwd = pwd;
	}

	public PasswordAuthentication getPasswordAuthentication() {
		return new PasswordAuthentication(uname, pwd);
	}

}
