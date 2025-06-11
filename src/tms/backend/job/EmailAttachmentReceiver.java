package tms.backend.job;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.Part;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import tms.backend.domain.PmMailTask;
import tms.utils.Email;
import tms.utils.ScopeType;
import tms.utils.StatusType;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.model.User;
import com.liferay.portal.service.UserLocalServiceUtil;
public class EmailAttachmentReceiver 
{
	/**
	 * This program demonstrates how to download e-mail messages and save
	 * attachments into files on disk.
	 */
	    private String saveDirectory;
	    private String userName;
	    private String passWord;
	    private boolean checkSendMail  = true;
	    
	    public List<PmMailTask> ListMailInf = new ArrayList<>();
	    /**
	     * Sets the directory where attached files will be stored.
	     * @param dir absolute path of the directory
	     */
	    public void setSaveDirectory(String dir) {
	        this.saveDirectory = dir;
	    }
	    
	    public void setUser(String userName,String passWord)
	    {
	    	this.userName = userName;
	    	this.passWord = passWord;
	    }
	 
	    /**
	     * Downloads new messages and saves attachments to disk if any.
	     * @param host
	     * @param port
	     * @param userName
	     * @param password
	     */
//	    public void downloadEmailAttachments(String host, String port, String userName, String password) 
	    public void downloadEmailAttachments(String host, String port)
	    {
	        Properties properties = new Properties();
	 
	        // server setting
	        properties.put("mail.pop3.host", host);
	        properties.put("mail.pop3.port", port);
	 
	        // SSL setting
//	        properties.setProperty("mail.pop3.socketFactory.class",
//	                "javax.net.ssl.SSLSocketFactory");
//	        properties.setProperty("mail.pop3.socketFactory.fallback", "false");
//	        properties.setProperty("mail.pop3.socketFactory.port",
//	                String.valueOf(port));
	 
	        Session session = Session.getInstance(properties);
	 
	        try {
	            // connects to the message store
	            Store store = session.getStore("pop3");
	            store.connect(userName, passWord);
	 
	            // opens the inbox folder
	            Folder folderInbox = store.getFolder("INBOX");
	            folderInbox.open(Folder.READ_WRITE);
	 
	            // fetches new messages from server
	            Message[] arrayMessages = folderInbox.getMessages();
	            
	            
	            
	            for (int i = 0; i < arrayMessages.length; i++) 
			    {
	            	
	            			PmMailTask _item = new PmMailTask();
			                Message message = arrayMessages[i];
//			                String textMsg ="";
			          
			                
			                
			                
			                Address[] fromAddress = message.getFrom();
			                String from= ((InternetAddress)(Address)(fromAddress[0])).getAddress();
			                String subject = message.getSubject();
			                String sentDate = message.getSentDate().toString();
			                String contentType = message.getContentType();
			                String messageContent = "";
			                String messageContentHTML = "";
//			                store attachment file name, separated by comma
			                String attachFiles = "";    
			                
//				              -----------show list address send to -----------------------
				                String cc = InternetAddress.toString(arrayMessages[i].getRecipients(Message.RecipientType.CC));
				                _item.setEmail(getEmailCC(cc));
				                
				                String to = InternetAddress.toString( arrayMessages[i].getRecipients(Message.RecipientType.TO));
				                System.out.println("\n--------------to: "+to+"----------\n");
				                String _emailTo = filterEmailTo(to).trim();
				                System.out.println("\n--------------_emailTo: "+_emailTo+"----------\n");
				              //  String _tmp = getEmailTo(_emailTo);
//				                System.out.println("\n--------------_tmp: "+_tmp+"----------\n");
				                //-------------------------------------------------------------------
				                try 
				                {
				                	 
				                	 User resquesterUser = UserLocalServiceUtil.getUserByEmailAddress(10154, from);
				                	 if(resquesterUser!=null)
				                	 {
					                	 _item.setRequesterId(String.valueOf(resquesterUser.getUserId()));
					                	 _item.setGroupId(resquesterUser.getGroupId());
							             _item.setRequesterName(resquesterUser.getScreenName());
							             _item.setAddressFrom(from);
				                	 }
				                	 else
				                	 {
				                		 String sub ="[Task manager] Cannot create your task : "+ subject + " on portal";
				                		 StringBuffer body = new StringBuffer();
				                		 	body.append("<B>To " + _item.getRequesterName() + ",</B>");
											body.append("<br> Your user email <b>"+from+"</b> has not registed in system");
											body.append("<br> Please check and resend to taskmanager@ewi.vn.");
											
											
											body.append("<br><br><br>");
											body.append("<br>=================================================");
											body.append("<br>This is automated mail. Please don't reply.Thanks");
											body.append("<br>=================================================");
				                		    Email.postMail(from, sub, body.toString());
				                	 }
				                	 
										
				                	 
				                	
									 
								} catch (PortalException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								} catch (SystemException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}
				                //-------------------------------------------------------------------
				                
//				                if(!_tmp.equals(""))
//				                {
//				                	_emailTo = _tmp;
//				                }
				            
				                _item.setAssigneeEmail(_emailTo);
				               
				                try 
				                {
				                	if(!_emailTo.equals(""))
				                	{
				                		
										 User assigneeUser =   UserLocalServiceUtil.getUserByEmailAddress(10154, _emailTo);
										 
										 if(assigneeUser!=null)
										 {
											 
											 _item.setAssigneeId(String.valueOf(assigneeUser.getUserId()));
											 String _deparID = String.valueOf(assigneeUser.getOrganizations().get(0).getOrganizationId());
											 if(!_deparID.trim().equals(""))
											 {
												 _item.setDepartmentId(_deparID);
												 checkSendMail = true;
											 }
											 else
											 { 
												 
											 }
											 
										 }
										 
				                	}
				                	else // if you not have email address to
				                	{
				                		// this.sendmessage += "\n"+this.messageErrorSendMail;;
				                		  String subject1 ="[Task manager] Cannot create your task : "+ subject + " on portal";
				                		  StringBuffer body = new StringBuffer();
				          				body.append("<B>To " + _item.getRequesterName() + ",</B>");
				          				body.append("<br>System cannot create this task on portal because you didn't include assignee on your sent email ");
				          				body.append("<br>Please include assignee and resend your task to taskmanager@ewi.vn" );
				          				body.append("<br><br>");
				          				body.append("<br>Regards," );
				          				body.append("<br>System Administrator." );
				          				body.append("<br><br><br>");
				          				body.append("<br>=================================================");
				          				body.append("<br>This is automated mail. Please don't reply.Thanks");
				          				body.append("<br>=================================================");
				          				
				                	   		    

				                		// sendMail(from, subject1, body.toString(), "taskmanager@ewi.vn");
				          				Email.postMail(from, subject1,
				    							body.toString());
				                		 checkSendMail = false;
				                	}
				                	 
								} catch (PortalException e1) {
									// TODO Auto-generated catch block
									String sub ="[Task manager] Cannot create your task : "+ subject + " on portal";
		                		   StringBuffer body = new StringBuffer();
		                		   body.append("<B>To " + _item.getRequesterName() + ",</B>");
									body.append("<br> The assignee email: <b>"+_emailTo+"</b> has not existed in system");
									body.append("<br> Please check and resend to taskmanager@ewi.vn.");
									
									
									body.append("<br><br><br>");
									body.append("<br>=================================================");
									body.append("<br>This is automated mail. Please don't reply.Thanks");
									body.append("<br>=================================================");
		                		    Email.postMail(from, sub, body.toString());
		                		    checkSendMail = false;
		                		    
									e1.printStackTrace();
								} catch (SystemException e1) {
									// TODO Auto-generated catch block
									
									e1.printStackTrace();
								}
//				               --------------end-----------------------------------
			                

			                if (contentType.contains("multipart")) 
			                {
			                    // content may contain attachments
			                    Multipart multiPart = (Multipart) message.getContent();
			                    int numberOfParts = multiPart.getCount();
			                    
			                    for (int partCount = 0; partCount < numberOfParts; partCount++) 
			                    {
			                    	BodyPart _part = multiPart.getBodyPart(partCount);
			                    	MimeBodyPart part = (MimeBodyPart) multiPart.getBodyPart(partCount);
//			                        ----------------------------------------------------
			                    	String disposition = _part.getDisposition();
//			                    	----------------------------get file insert-----------------------
			                    
			                    	if(_part.getContentType().contains("image/"))
			                    	{
			                    		
			                    		 String destFilePath = "D:/Attachment/" + _part.getFileName();
			                    		 System.out.println("\n------file insert--"+destFilePath+"---------\n");
//			                    		 File f = new File("image"+new Date().getTime()+".jpg");
			                    		 DataOutputStream output = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(destFilePath)));
			                    		 com.sun.mail.util.BASE64DecoderStream test=(com.sun.mail.util.BASE64DecoderStream) _part.getContent();
			                    		 byte[] buffer = new byte[1024];
			                    		 int bytesRead;
			                    		 while((bytesRead = test.read(buffer)) != -1)
			                    		 {
			                    		 output.write(buffer,0,bytesRead);
			                    		 }
			                    		 test.close();
			                    		 output.close();
			                    		 
			                    		 
			                    		 
			                    	} else
//			                    	-----------------------------end----------------------------------
			                    	
									  if (disposition == null) 
									  {   
										 
										  MimeBodyPart _mimeBodyPart = (MimeBodyPart) _part;
//										 if have a attachment
										  if(_mimeBodyPart.getContent() instanceof MimeMultipart) 
										  {
											  MimeMultipart _mimeMultipart = (MimeMultipart) _mimeBodyPart.getContent();
											  messageContent = _mimeMultipart.getBodyPart(0).getContent().toString();
											  messageContentHTML = _mimeMultipart.getBodyPart(1).getContent().toString();
										  }
										  else
										  {
											  messageContent = multiPart.getBodyPart(0).getContent().toString();
											  messageContentHTML = multiPart.getBodyPart(1).getContent().toString(); 
										  }
										  
				                      }  
									  else
//									  ----------------------------------------------------
										  
			                        if (Part.ATTACHMENT.equalsIgnoreCase(part.getDisposition())) {
			                            // this part is attachment
//			                            String fileName = part.getFileName();
//			                            attachFiles += fileName + ", ";
//			                            part.saveFile(saveDirectory + File.separator + fileName);
			                            if (part.getSize() > 0){
			                            	_item.getAttachmentFileList().add(part);
			                            }
			                        } else {
			                            // this part may be the message content
			                         /*   messageContent = part.getContent().toString();
			                            BodyPart _p = multiPart.getBodyPart(partCount);
			                            System.out.println("\n--------1------html-----------------\n");
			                            System.out.println("-----12----------: "+_p.getContent()+"-----\n");
			                            System.out.println("\n--------2------html-----------------\n");*/
			                            		
			                        } 
			                        
			                    }
			 
			                    if (attachFiles.length() > 1) 
			                    {
			                        attachFiles = attachFiles.substring(0, attachFiles.length() - 2);
			                    }
			                } 
			                else if (contentType.contains("text/plain")|| contentType.contains("text/html")) 
			                {
			                    Object content = message.getContent();
			                    if (content != null) 
			                    {
//			                        messageContent = content.toString();
			                     /*   System.out.println("\n--------------html-----------------\n");
			                        System.out.println("\n--------------"+content.toString()+"-----------------\n");
			                        System.out.println("\n--------------end html-----------------\n");*/
			                    }
			                }
			 
			                
//			                _item.setDesc(messageContentHTML);
			                _item.setDesc(getMessageContent(messageContentHTML));
			                _item.setTaskname(subject);
			                _item.setStatusId(StatusType.OPEN.getValue()+"");
			                _item.setScopeId(ScopeType.COMPANY.getValue()+"");
			               
//			               ------------------------------------------ Priority and Target date--------------------------------------
			                String _val = get_Prior_TargDt(messageContent).trim();
			                
			                if(!_val.equals(""))
			                {
			                	System.out.println("\n------------_priority------------"+_val.split(":")[0].trim()+"------------------------\n");
			                	String _priority = String.valueOf(setIdPriority(_val.split(":")[0].trim()));
			                	String _targetDt = _val.split(":")[1].trim();
			                	
				                	_item.setPriorityId(_priority);
			                
			                	if(_targetDt.equals("null") || !checkdate(_targetDt))
			                	{
			                		java.util.Date _date = message.getSentDate();			                	
				                	_item.setTargetDate(DateUtil(_date, true));
			                	}
			                	else
			                	{
				                	_item.setTargetDate(_targetDt);
				                }

			                }
			                else  // don't have any "[" and "]" in the message
			                {
			                	_item.setPriorityId("2");
			                	java.util.Date _date = message.getSentDate();			                	
			                	_item.setTargetDate(DateUtil(_date, true));
			                }
			              
//			                --------------------------------------------end-----------------------------------------------------------
			                java.util.Date _date = message.getSentDate();
			                _item.setRequestDate(DateUtil(_date, false));
			                
			               
			                if(checkSendMail)
			                {
			                	
			                	 ListMailInf.add(_item);
			                }
			                	 message.setFlag(Flags.Flag.DELETED, true);
			                
			                
	            }// end for

	            
	            // disconnect
	            folderInbox.close(true); //false
	            store.close();
	        } catch (NoSuchProviderException ex) {
	            System.out.println("No provider for pop3.");
	            ex.printStackTrace();
	        } catch (MessagingException ex) {
	            System.out.println("Could not connect to the message store");
	            ex.printStackTrace();
	        } catch (IOException ex) {
	            ex.printStackTrace();
	        }
	    }
	    private String filterEmailTo(String to)
	    {
	    	String []str = to.split(",");
	    	for(int i=0;i<str.length;i++)
	    	{
	    		
	    		String _ymail = str[i];
	    		String _xmail= getEmailTo(str[i]);
	    		
	    		if(!_xmail.trim().equals(""))
	    		{
		    		if(!_xmail.toLowerCase().equals(userName.trim().toLowerCase()))
		    		{
	    				return _xmail;
		    		}
	    		}
	    		else
	    		{
	    			if(!_ymail.toLowerCase().equals(userName.trim().toLowerCase()))
		    		{
	    				return _ymail;
		    		}
	    		}
	    	}
	    	return  "";
	    }
	    public String get_Prior_TargDt(String messageContain)
	    {
	    	List<Integer> index = findIndexer(messageContain);//getSubStringByCharacter(messageContain, "[", "]");
	    	return getStr(index, messageContain);
	    }
	    
	    public int setIdPriority(String values)
	    {
	    	if(!values.equals(""))
	    	{
		    	switch(values)
		    	{
			    	case "all": 	return 0;
			    	case "high": 	return 1;
			    	case "medium": 	return 2;
			    	case "low": 	return 3;
		    	}
	    	}
	    	return 2;
	    }
	    public String setString(String pr, String tg)
	    {
	    	
	    	String _res ="";
	    	if(!pr.trim().equals("") && tg.trim().equals(""))
	    	{
	    		_res = pr + ":"+"null";
	    	}
	    	else
	    		if(pr.trim().equals("") && !tg.trim().equals(""))
		    	{
		    		_res = "null"+":"+tg;
		    	}
	    	else
	    		if(!pr.trim().equals("") && !tg.trim().equals(""))
		    	{
		    		_res = pr+":"+tg;
		    	}
	    		else
		    		if(pr.trim().equals("") && tg.trim().equals(""))
			    	{
			    		_res = "";
			    	}
	    	return _res;
	    	
	    }
	   
	    public List<Integer> getSubStringByCharacter(String values ,String type1, String type2 )
	    {
	    	List<Integer> arrayIndex = new ArrayList<Integer>();
	    	for(int i =0 ;i < values.length(); i++)
	    	{
	    		
	    		String e = String.valueOf(values.charAt(i)).trim();
	    		if(e.equals(type1))
	    			arrayIndex.add(i);
	    		if(e.equals(type2))
	    			arrayIndex.add(i);
	    	}
	    	return arrayIndex;
	    }
	    
	    public String getEmailCC(String cc)
	    {
	    	List<Integer> _indexes = null;
	    	String 	_result = "";
	    	if(cc!=null)
	    	{
		    	String [] _emailAddresses = cc.split(",");
		    	for(int i=0;i< _emailAddresses.length;i++)
		    	{
		    		String _tmp = getEmailTo(_emailAddresses[i]);
		    		if(!_tmp.equals(""))
		    		{
		    			_result += _tmp+";";
		    		}
		    		else
		    		{
		    			_result += _emailAddresses[i].trim() + ";";
		    		}
		    	}
	    	}
	    	return _result;
	    }
	    
	    public String getEmailTo(String values)
	    {
	    	String _result = "";
	    	List<Integer> _indexes = getSubStringByCharacter(values, "<", ">");
	    	
	    	if(_indexes.size()>0)
	    	{
	    		for(int i=0;i< _indexes.size();i=i+2)
	    		{
	    			_result = values.substring(_indexes.get(i)+1, _indexes.get(i+1)).trim();
	    		}
	    	}
	    	return _result;
	    }
	    
//	    -------------------------------------------------------Date------------------------------------------
	    public String DateUtil(java.util.Date date, boolean add7Day)
	    {
	    	SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        	Calendar c = Calendar.getInstance();
        	c.setTime(date); // Now use today date.
        	if(add7Day)
        	{
        		c.add(Calendar.DATE, 7); // Adding 7 days
        	}
        	String output = sdf.format(c.getTime());
        	return output;
	    }
	    public java.util.Date getDateBf(List<java.util.Date> listDate)
	    {
	    	java.util.Date _mindate = listDate.get(0);
	    	for(int i=1 ;i < listDate.size();i++)
	    	{
	    		if(_mindate.before(listDate.get(i)))
	    		{
	    			_mindate = listDate.get(i);
	    		}
	    	}
	    	return _mindate;
	    	
	    }
	    public  void sendMail( String recipient,  String subject,  String message, String from ) //throws MessagingException 
		{ 
	    	try{
	    			
					Properties props = new Properties(); 	
					props.put( "mail.smtp.host", "smtp.vntt.com.vn");
					props.put( "mail.smtp.auth","true");
					
					
					Authenticator authenticator = new Authenticator() {
						public PasswordAuthentication getPasswordAuthentication()
						{
							return new PasswordAuthentication(userName,passWord);
						}
					};
					
					
					Session session = Session.getInstance(props, authenticator); 
					
					Message msg = new MimeMessage( session ); 
					
					InternetAddress addressFrom = new InternetAddress( from ); 
					msg.setFrom( addressFrom ); 
					
					InternetAddress addressTo = new InternetAddress( recipient ); 
					msg.setRecipient( Message.RecipientType.TO, addressTo ); 
					
					msg.setSubject( subject ); 
					msg.setContent( message, "text/plain" );
					
					
					Transport.send( msg ); 
					
	    	}
	    	catch (MessagingException e)
	    	{

	    		System.out.println("\t SEND MAIL HAVE ERROR: "+e.getMessage()+"\n");
	    		e.printStackTrace();
	    	}

					
		} 
	    public List<Integer> findIndexer(String values)
	    {
	    	List<String> arrayString = new ArrayList<String>(); 
	    	List<Integer> arIndex = new ArrayList<Integer>(); 
	    	for(int i =0 ;i < values.length(); i++)
	    	{
	    		
	    		String e = String.valueOf(values.charAt(i)).trim();
	    		if(e.equals("["))
	    		{
	    			arrayString.add(e);
	    			arIndex.add(i);
	    		}
	    		if(e.equals("]"))
	    		{
	    			arrayString.add(e);
	    			arIndex.add(i);
	    		}
	    	}

	    	
	    	List<Integer> arrayIndex = new ArrayList<Integer>();
	    	int _size = arrayString.size();
	    	
	    	for(int j=0 ;j< _size;j++)
	    	{
	    			if(arrayString.get(j).equals("["))
	    			{
	    				   
	    				    int _tmp = (j+1);
	    				    if(_tmp <_size)
	    				    {
			    				if(arrayString.get(j+1).equals("]"))
			    				{
			    					arrayIndex.add(arIndex.get(j));
			    					arrayIndex.add(arIndex.get(j+1));
			    				}
	    				    }
	    				
	    			}
	    	}
	    	return arrayIndex;
	    	
	    }
	    

	   
	    public String getStr(List<Integer> index, String f)
	    {
	    	
	    	String _prio = "Priority", _targ = "Target date", _containPrio = "", _containTarg = "", _result = "", _pr="",_tg="";
	    	if(index.size()> 0)
	    	{
		    	for(int j=0 ;j< index.size();j= j+2)
		    	{
		    		String str = f.substring(index.get(j)+1, index.get(j+1));	
		    		str = str.trim().toLowerCase();
		    		
		    		if( str.contains(_prio.toLowerCase()))
		    		{
		    			if(str.contains(":"))
		    			{
		    				String[] _ischeck = str.split(":");
		    				
		    				if(_ischeck.length == 2)
		    				{
		    					_containPrio = _ischeck[1].trim();
		    					
		    					_containPrio = getPriority(_containPrio);
		    					if(!_containPrio.equals(""))
			    				{
			    					_pr = _containPrio;
			    				}
		    				}
		    				
		    			}
		    		}
		    		
		    		if( str.contains(_targ.toLowerCase()))
		    		{
		    			if(str.contains(":"))
		    			{
		    				String[] _ischeck = str.split(":");
		    				if(_ischeck.length == 2)
		    				{
			    				_containTarg = _ischeck[1].trim();
			    				
			    				_containTarg = getPriority(_containTarg);
			    				if(!_containTarg.equals(""))
			    				{
			    					_tg = _containTarg;
			    				}
		    				}
		    			}
		    		}
		    			
		    	}

		    	
		    	_result = setString(_pr, _tg);
		    	
		    	System.out.println("\n------_result-----"+_result+"-------------\n");
		    	return _result;
	    	}
	    	
	    	
	    	return "";
	    }
	    public boolean checkdate(String xdate)
	    {
	    		String pattern = "(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/((19|20)\\d\\d)";
	    	    Pattern r = Pattern.compile(pattern);
	    	    Matcher m = r.matcher(xdate); 
	    	    return m.find();
	    }
	    public String getPriority(String values)
	    {
	    	String []_tmps =values.split("&nbsp;");
	    	for(int i=0;i<_tmps.length;i++)
	    	{
	    		if(!_tmps[i].trim().equals(""))
	    			return _tmps[i].trim();
	    	}
	    	return "";
	    	
	    	
	    }
	    
	    public String getMessageContent(String message)
	    {
	    	System.out.println("\n------- message: "+message+"------\n");
	    	String _str ="", _tmp = message;
	    	List<Integer> _indexs = findIndexer(message);
	    	List<Integer> _filterIndexer = new ArrayList<Integer>();
	    	
	    	for(int i=0 ;i< _indexs.size(); i=i+2)
	    	{
	    		_str = message.substring(_indexs.get(i),_indexs.get(i+1)+1).toLowerCase();
	    		
	    		if(checkHTML(_str, "target date"))
	    		{
	    			_filterIndexer.add(_indexs.get(i));
	    			_filterIndexer.add(_indexs.get(i+1));

	    		}
	    		else if(checkHTML(_str, "priority"))
	    		{
	    			_filterIndexer.add(_indexs.get(i));
	    			_filterIndexer.add(_indexs.get(i+1));
	    		}
	    	}
	    	
	    	String _strTMP2 = "",_strTMP4 = "";
	    	System.out.println("\n-----------size "+_filterIndexer.size()+"----------------------\n");
	    	if(_filterIndexer.size()==2)
	    	{
	    		_strTMP2 =  message.substring(0, _filterIndexer.get(0));
	    		_strTMP2 += message.substring(_filterIndexer.get(1)+1, message.length());
	    		return _strTMP2;
	    	}
	    	else if(_filterIndexer.size() == 4)
	    	{
	    		_strTMP4 = message.substring(0, _filterIndexer.get(0)-1);
	    		_strTMP4 += message.substring(_filterIndexer.get(1), _filterIndexer.get(2));
	    		_strTMP4 += message.substring(_filterIndexer.get(3)+1, message.length());
	    		return _strTMP4;
	    	}
	    	return _tmp;
	    }
	    public boolean checkHTML(String htmlContent,String _strEquals)
	    {
	    	htmlContent = htmlContent.replaceAll("\\<[^>]*>", "");
	    	htmlContent = htmlContent.replaceAll("&nbsp;", "");
	    	System.out.println("\n-----------HTML: --------"+htmlContent+"-------\n");
	    	if(htmlContent.toLowerCase().contains(_strEquals))
	    	{
	    		return true;
	    	}
	    	return false;
	    }
	    
	    
	   
	    
}



