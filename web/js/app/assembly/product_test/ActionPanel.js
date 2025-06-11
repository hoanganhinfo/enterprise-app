Ext.define('EAP.Portlet.ActionPanel',{
	extend: 'Ext.form.Panel',
	border : false,
	bodyBorder : false,
	layout: {type: 'anchor', pack: 'left'},
	defaults: {
	    //  bodyStyle: 'padding:10px'
	   },
       layout: {
           type: 'vbox',
           align: 'left'
       },	   
	bodyCls: 'x-type-frm-action',
	idActionPanel: '',
	width:200,
	SAVE_PRODUCT_TEST_LIST_URL : '/enterprise-app/service/saveProductTest',
	GET_TEST_COUNT_URL :  '/enterprise-app/service/getNumberOfTest',
	station : null,
	stationStep : null,
	productType: null,
	productModel: null,
	padding: '',
	productModelName: '',
	txtSerialNo : null,
	prerequisite : '',
	prefixSerial : '',
	paramPanel: null,
	defectPanel : null,
	testListPanel: null,
	productParamsColspan: '',
	productParamsWidth: '',
	productParams: '',
	productParamsName: '',
	productParamsSize: '',
	productParamsValue:'',
	productNegativeValue : '',
	prerequisiteId: '',
	prerequisiteData: '',
	prerequisiteLabel: '',
	isSaving : false,
	isAutoResult: 0,
	validateFnOnClent: '',
	validateFnOnServer : '',
	allowDuplicate: false,
	numberOfClick : 0,
	initComponent: function(){
//		this.oncreateSerialNumber();
//	 if (this.isAutoResult == 0){
//		this.items= [{
//	        xtype: 'label',
//	        id : 'lblSerial',
//	        html: '<b>Serial:</b> '
//	    },
//		             this.oncreateSerialNumber(),
//		             this.oncreateButtonPass(),
//		             this.oncreateButtonFail()
//					]
//	 }else{
//		 this.items= [{
//		        xtype: 'label',
//		        id : 'lblSerial',
//		        html: '<b>Serial:</b> '
//		    },
//			             this.oncreateSerialNumber(),
//			             this.oncreateButtonSave()
//						]
//	 }
		this.callParent(arguments);
		
		
	},
	reloadGUI: function(){
		this.oncreateSerialNumber();
		this.removeAll();
		var lblSerial = Ext.create('Ext.form.Label',{
			id : 'lblSerial',
	        html: '<b>Serial:</b> '
		});
		this.add(lblSerial);
		this.add(this.txtSerialNo);
		if (this.isAutoResult == 0){
			this.add(this.oncreateButtonPass());
			this.add(this.oncreateButtonFail());
		}else{
			this.add(this.oncreateButtonApplet());			
			this.add(this.oncreateButtonSave());
		}
		
		this.doLayout();
	},
	//--------------------------------------------------------------------------------------------------------------
	
	//-----------------------------------------------------GUI------------------------------------------------------
	oncreateSerialNumber:function()
	{
		this.txtSerialNo = Ext.create('Ext.form.field.Text',{
								 xtype: 'textfield', 
								  id: 'id_txtSerialNo_'+this.idActionPanel,
								  inputId: 'inputId_txtSerialNo_'+this.idActionPanel,
								  labelAlign: 'right',
								  labelSeparator: '',
								 // maxLength: 6,
								  border : false,
								  enforceMaxLength: true,
								  fieldLabel: '&nbsp;',
								  allowBlank: false,
								  msgTarget: 'side',
								  enableKeyEvents: true,
								  width:200,// 175,//160,//190,//200,
								  maxWidth:200,//175,//160,// 200,
								  labelWidth: 70,//75,
								  //maskRe: /\d/,	
								  listeners: 	{
								  					blur: function(f,e)
								  					{
								  						var val = f.getRawValue().trim();
								  						if (val.length == 0){
								  							return;
								  						}
										            	if (Ext.isNumber(val) && val.length <f.maxLength){
										            		var t = new Number(val);
										  			    	f.setValue(Ext.String.leftPad(t, f.maxLength, this.padding));	
										  			    	//f.setValue(f.getRawValue().trim());
										            	}
										        		Ext.Ajax.request({
										        			url : this.GET_TEST_COUNT_URL,
										        			params : {  
										        				serial:   this.prefixSerial+ this.txtSerialNo.getValue()
										        			},
										        			success : function(response) {
										        				var data = Ext.decode(response.responseText);
										        				var testCount = data.testcount + 1;
										        				Ext.getCmp('lblSerial').setText('<b>Serial:</b>&nbsp;&nbsp;&nbsp;&nbsp;Test time:'+testCount,false);
										        			}, 
										        			failure: function(response, opts) {
										        				
										        		    },
										        			scope: this
										        		});
								  					},
								  					
								  					focus: function(f,e)
								  					{
								  						Ext.getCmp('frmTestGrid_'+this.idActionPanel).getSelectionModel().deselectAll();
								  					},
								  					keypress: function(f,e)
								  								{
																	var keycode = e.getKey();
																	switch(keycode)
																	{
																		case 13: { 
																			if (!Ext.isEmpty(Ext.getCmp(this.idActionPanel+'_param_0'))){
																				Ext.getCmp(this.idActionPanel+'_param_0').focus();
																			}
																				break;
																				}
																		case 43:{
																					var val = f.getRawValue().trim();
																					
																					if(Ext.isNumber(val) && val.length <= f.maxLength)
																					{
																						var t = new Number(f.getValue());
																						f.setValue(Ext.String.leftPad(t+1,f.maxLength,this.padding));
																					}
																					
																					f.focus();
																				break;
																		}
																		case 45:{
																					var val = f.getRawValue().trim();
																					if(Ext.isNumber(val)){
																						var t = new Number(val);
																						if(t>0)
																						{
																							var val = f.getRawValue();
																							if(val.length <= f.maxLength)
																							{
																								f.setValue(Ext.String.leftPad(t-1,f.maxLength,this.padding));
																							}
																							
																							
																						}
																					}
																						
																					
																					
																					f.focus();
																				break;}
																	}
																	var val = f.getRawValue().trim();
																	f.setValue(val.trim())
										        	   				if (e.isSpecialKey() == false && val != null && val.length == f.maxLength ){
																	//if (val.length == f.maxLength ){
										        	   					e.stopEvent();
										        	   					// Auto-run tester after scanning
										        	   					
										        	   					if (runningTester == false){
										        	   						runningTester = true;
										        	   						if (this.productType == 9 || this.productType == 14){ //AOSmith and AOSmith PDV
										        	   							FOCUS_AFTER_SAVING = 11;
										        	   							//Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].focus();
										        	   					    	Ext.getCmp('frmParams'+_instance).items.getAt(3).focus();
										        	   							var value = document.AOSmithTester.runTester("13");
										        	   							runningTester = false;
										        	   							if (value == "Timeout"){
										        	   								f.setValue("");
										        	   								
										        	   								Ext.Msg.show({
										        	   									title : 'Thông báo:',
										        	   									msg : '<b><span style="color:red">Error: Timeout. Please test again.</span></b></br><b><span style="color:red">Đã quá thời gian qui định. Hãy thực hiện lại</span></b>',
										        	   									icon : Ext.Msg.INFO,
										        	   									buttons : Ext.Msg.OK,
										        	   									scope:this,
										        	   									fn : function(buttonId) {
										        	   										this.txtSerialNo.focus();		
										        	   									},
										        	   								});
										        	   								
										        	   							}else{
										        	   								if (this.productType == 9){
										        	   									populateAOSTester(value);
										        	   								}else{
										        	   									populateAOSPDVTester(value);
										        	   								}
										        	   									
										        	   								
										        	   							}
										        	   						}
										        	   						
										        	   					}
													  		    		return;
										        	   				}
										        	   				
								  								},
								  					
								  								scope: this
								  				}	
					});
					//return this.txtSerialNo;
	},
	oncreateButtonPass:function()
	{
		
		
		var btnpass = Ext.create('Ext.button.Button',{
							  id: 'id_btnPass_'+this.idActionPanel,
							  inputId: 'inputId_btnPass'+this.idActionPanel,
							  name: 'btnPass',
							  text : 'PASS',
							  scale   : 'large',
							  width: 185,//150,//190,//200,
							  height: 70,
							  cls: 'x-btn-pass',
							  handler : this.onSuccess,
							  scope : this}); 
							  
							  return btnpass;
	},
	oncreateButtonFail:function()
	{
		var btnfail = Ext.create('Ext.button.Button',{
							  id: 'id_btnFail_'+this.idActionPanel,
							  inputId:'inputId_btnFail'+this.idActionPanel,
							  name: 'btnFail',
							  text : 'FAIL',
							  scale   : 'large',
							  width: 185,//150,//190,//200,
							  height: 70,
							  cls: 'x-btn-fail',
							  handler : this.onFail,
							  scope : this});
							  return btnfail;
	},
	oncreateButtonSave:function()
	{
		var btnSave = Ext.create('Ext.button.Button',{
							  id: 'id_btnSave_'+this.idActionPanel,
							  inputId:'inputId_btnSave'+this.idActionPanel,
							  name: 'btnSave',
							  text : 'Save',
							  scale   : 'large',
							  width: 185,//150,//190,//200,
							  height: 70,
							  cls: 'x-btn-pass',
							  handler : this.onSave,
							  scope : this});
							  return btnSave;
	},
	oncreateButtonApplet:function()
	{
		var btnTester = Ext.create('Ext.button.Button',{
							  id: 'id_btnApplet_'+this.idActionPanel,
							  inputId:'inputId_btnApplet'+this.idActionPanel,
							  name: 'btnApplet',
							  text : 'Run tester',
							  scale   : 'large',
							  width: 185,//150,//190,//200,
							  height: 70,
							  cls: 'x-btn-pass',
							  handler : this.onTester,
							  scope : this});
							  return btnTester;
	},
	//-----------------------------------------------------EVENT--------------------------------------------------------	
	onSuccess:function()
	{
		if(!this.checkInformationBeforeSave(false)){
			return;
		}
		
		var getidx = this.idActionPanel;
		this.paramPanel.getForm().submit({
			url : this.SAVE_PRODUCT_TEST_LIST_URL,
			params: {
				instanceId: this.idActionPanel,
		        status: 'pass',
		        allowDuplicate: this.allowDuplicate,
		        station: this.station,
		        stationName : this.station, 
		        stationStep: this.stationStep,
		        productType: this.productType,
		        productModel : this.productModel,
		        serial : this.prefixSerial+ this.txtSerialNo.getValue(),
		        operator: operatorName,
		        productParams: this.productParams,
		        sessionId: sessionId,
		        prerequisiteId: this.prerequisiteId,
		  //      qctest: _qctest,
		        defectCode: ''
		    },
			success : function(form, action) {
				this.paramPanel.getForm().reset();
		    	this.defectPanel.getSelectionModel().deselectAll();
				this.testListPanel.getStore().load({
					params:{sessionId: sessionId,operator: operatorName, station: this.station }
					});	
		    	
		    	var t = new Number( this.txtSerialNo.getValue());
		    	this.txtSerialNo.setValue(Ext.String.leftPad(t+1, this.txtSerialNo.maxLength, this.padding));
				if (!Ext.isEmpty(Ext.getCmp(this.idActionPanel+'_param_0'))){
					Ext.getCmp(this.idActionPanel+'_param_0').focus();
				}
		    	
//		    	 this.txtSerialNo.focus();
//		    	 this.txtSerialNo.selectText();
		    	this.isSaving = false;
			},
			failure : function(form, action) {
		        switch (action.failureType) {
	            case Ext.form.action.Action.CLIENT_INVALID:
	            	Ext.Message.show("Error","Please input all required information</br>Chưa nhập đầy đủ thông tin");
	                break;
	            case Ext.form.action.Action.CONNECT_FAILURE:
	            	Ext.Message.show('Failure', 'Ajax communication failed</br>Kết nối mạng thất bại');
	                break;
	            case Ext.form.action.Action.SERVER_INVALID:
	            	switch( action.result.error){
	            	case "1":
	            		Ext.Message.show("Error","This fail serial need be reworked</br>Serial này chưa được Reworked");
	            		break;
	            	case "2":
	            		Ext.Message.show("Error","This serial has already passed this step</br>Serial đã pass trạm kiểm tra này");
	            		break;
	            	case "3":
	            		Ext.Message.show("Error","This serial has not passed previous step</br>Serial chưa pass trạm trước");
	            		break;	 
	            	case "4":
	            		Ext.Message.show("Error","This serial has not tested by production</br>Serial nÃ y chÆ°a qua giai Ä‘oáº¡n sáº£n xuáº¥t ");
	            		break;	            		
	            	}
		        }
		        this.isSaving = false;
			},
			scope : this
		});
	   
	    

	},
	
	onFail:function()
	{
		if(!this.checkInformationBeforeSave(true)){
		return;
		}
		
		var selectDefect = Ext.getCmp("defectCodeList_"+this.idActionPanel).getSelectionModel().getSelection();
			var defect = '';
			for(var i=0 ;i< selectDefect.length; i++)
			{
				defect += selectDefect[i].get('id')+';';
			}
		
			this.paramPanel.getForm().submit({
				url : this.SAVE_PRODUCT_TEST_LIST_URL,
				params: {
					instanceId: this.idActionPanel,
			        status: 'fail',
			        allowDuplicate: this.allowDuplicate,
			        station: this.station,
			        stationName : this.station, 
			        stationStep: this.stationStep,
			        productType: this.productType,
			        productModel : this.productModel,
			        serial : this.prefixSerial+ this.txtSerialNo.getValue(),
			        operator: operatorName,
			        productParams: this.productParams,
			        sessionId: sessionId,
			        prerequisiteId: this.prerequisiteId,
			  //      qctest: _qctest,
			        defectCode: defect
			    },
				success : function(form, action) {
					this.paramPanel.getForm().reset();
			    				    	this.defectPanel.getSelectionModel().deselectAll();
					this.testListPanel.getStore().load({
						params:{sessionId: sessionId,operator: operatorName, station: this.station }
						});				    	
					var t = new Number( this.txtSerialNo.getValue());
			    	this.txtSerialNo.setValue(Ext.String.leftPad(t+1, this.txtSerialNo.maxLength, this.padding));
					if (!Ext.isEmpty(Ext.getCmp(this.idActionPanel+'_param_0'))){
						Ext.getCmp(this.idActionPanel+'_param_0').focus();
					}
			    	
//			    	 this.txtSerialNo.focus();
//			    	 this.txtSerialNo.selectText();
			    	this.isSaving = false;
				},
				failure : function(form, action) {
			        switch (action.failureType) {
		            case Ext.form.action.Action.CLIENT_INVALID:
		            	Ext.Message.show("Error","Please input all required information</br>Chưa nhập đầy đủ thông tin");
		                break;
		            case Ext.form.action.Action.CONNECT_FAILURE:
		            	Ext.Message.show('Failure', 'Ajax communication failed</br>Kết nối mạng thất bại');
		                break;
		            case Ext.form.action.Action.SERVER_INVALID:
		            	switch( action.result.error){
		            	case "1":
		            		Ext.Message.show("Error","This fail serial need be reworked</br>Serial này chưa được Reworked");
		            		break;
		            	case "2":
		            		Ext.Message.show("Error","This serial has already passed this step</br>Serial đã pass trạm kiểm tra này");
		            		break;
		            	case "3":
		            		Ext.Message.show("Error","This serial has not passed previous step</br>Serial chưa pass trạm trước");
		            		break;	 
		            	case "4":
		            		Ext.Message.show("Error","This serial has not tested by production</br>Serial nÃ y chÆ°a qua giai Ä‘oáº¡n sáº£n xuáº¥t ");
		            		break;	            		
	            	}
		        }
			        this.isSaving = false;
				},
				scope : this
			});
		
			
			
			
		
	},
	onSave:function()
	{
		if(!this.checkInformationBeforeSave(false)){
		return;
		}
		//eval("method_name").call(args);
		var defect = '';
		if (this.validateFnOnClent != ''){
			defect = eval(this.validateFnOnClent).call();
		}
		if (defect == 'false'){
			return;
		}
		if (defect != ''){
			Ext.Msg.show({
				title : 'Warning: Confirm again',
				msg : 'Are you sure this test is <b><span style="color:red">failed</span></b></br>Bạn có chắc mẫu này <b><span style="color:red">bị lỗi</span></b> không',
				icon : Ext.Msg.QUESTION,
				buttons : this.numberOfClick<4?Ext.Msg.YESNO:Ext.Msg.YES,
				scope:this,
				defaultFocus: 2,
				fn : function(buttonId) {
					if (buttonId != 'yes'){
						this.numberOfClick ++;
						this.isSaving = false;
						return;
					} 
					this.numberOfClick = 0;
					this.isSaving = true;
					this.paramPanel.getForm().submit({
						url : this.SAVE_PRODUCT_TEST_LIST_URL,
						params: {
							instanceId: this.idActionPanel,
					        status:'fail',
					        hasRework : 'false',
					        allowDuplicate: this.allowDuplicate,
					        station: this.station,
					        stationName : this.station, 
					        stationStep: this.stationStep,
					        productType: this.productType,
					        productModel : this.productModel,
					        serial : this.prefixSerial+ this.txtSerialNo.getValue(),
					        operator: operatorName,
					        productParams: this.productParams,
					        validateFnOnServer : this.validateFnOnServer,
					        sessionId: sessionId,
					        prerequisiteId: this.prerequisiteId,
					  //      qctest: _qctest,
					        defectCode: defect
					    },
						success : function(form, action) {
							this.paramPanel.getForm().reset();
					    	this.defectPanel.getSelectionModel().deselectAll();
							this.testListPanel.getStore().load({
								params:{sessionId: sessionId,operator: operatorName, station: this.station }
								});				    	
							//var t = new Number( this.txtSerialNo.getValue());
					    	this.txtSerialNo.setValue('');
					    	Ext.getCmp('frmParams'+_instance).items.getAt(FOCUS_AFTER_SAVING).focus();
//							if (!Ext.isEmpty(Ext.getCmp(this.idActionPanel+'_param_0'))){
//								//Ext.getCmp(this.idActionPanel+'_param_0').focus();
//								Ext.getCmp(this.idActionPanel+'_param_0').focus();
//								this.items.getAt(0).focus();
//							}
					    	
//					    	 this.txtSerialNo.focus();
//					    	 this.txtSerialNo.selectText();
					    	this.isSaving = false;
					    	FOCUS_AFTER_SAVING = 0;
						},
						failure : function(form, action) {
							this.numberOfClick = 0;
					        switch (action.failureType) {
				            case Ext.form.action.Action.CLIENT_INVALID:
				            	Ext.Message.show("Error","Please input all required information</br>Chưa nhập đầy đủ thông tin",4000);
				                break;
				            case Ext.form.action.Action.CONNECT_FAILURE:
				            	Ext.Message.show('Failure', 'Ajax communication failed</br>Kết nối mạng thất bại',4000);
				                break;
				            case Ext.form.action.Action.SERVER_INVALID:
				            	switch( action.result.error){
				            	case "1":
				            		Ext.Message.show("Error","This fail serial need be reworked</br>Serial này chưa được Reworked",4000);
				            		break;
				            	case "2":
				            		Ext.Message.show("Error","This serial has already passed this step</br>Serial đã pass trạm kiểm tra này",4000);
				            		break;
				            	case "3":
				            		Ext.Message.show("Error","This serial has not passed previous step</br>Serial chưa pass trạm trước",4000);
				            		break;	 
				            	case "4":
				            		Ext.Message.show("Error","This serial has not tested by production</br>Serial nÃ y chÆ°a qua giai Ä‘oáº¡n sáº£n xuáº¥t ",4000);
				            		break;	
				            	case "9":
					            	Ext.Message.show("Error",action.result.errorText,4000);
				            		break;				            		
			            	}
				        }
					        this.isSaving = false;
						},
						scope : this
					});
				},
				icon : Ext.MessageBox.QUESTION
			});
		}else{
			this.numberOfClick = 0;
			this.isSaving = true;
			this.paramPanel.getForm().submit({
				url : this.SAVE_PRODUCT_TEST_LIST_URL,
				params: {
					instanceId: this.idActionPanel,
			        status: 'pass',
			        hasRework : 'false',
			        station: this.station,
			        stationName : this.station, 
			        stationStep: this.stationStep,
			        productType: this.productType,
			        productModel : this.productModel,
			        serial : this.prefixSerial+ this.txtSerialNo.getValue(),
			        operator: operatorName,
			        validateFnOnServer : this.validateFnOnServer,
			        productParams: this.productParams,
			        sessionId: sessionId,
			        prerequisiteId: this.prerequisiteId,
			  //      qctest: _qctest,
			        defectCode: defect
			    },
				success : function(form, action) {
					this.paramPanel.getForm().reset();
			    				    	this.defectPanel.getSelectionModel().deselectAll();
					this.testListPanel.getStore().load({
						params:{sessionId: sessionId,operator: operatorName, station: this.station }
						});				    	
					//var t = new Number( this.txtSerialNo.getValue());
			    	//this.txtSerialNo.setValue(Ext.String.leftPad(t+1, this.txtSerialNo.maxLength, this.padding));
					this.txtSerialNo.setValue('');
					if (!Ext.isEmpty(Ext.getCmp(this.idActionPanel+'_param_0'))){
						Ext.getCmp(this.idActionPanel+'_param_0').focus();
					}
			    	Ext.getCmp('frmParams'+_instance).items.getAt(FOCUS_AFTER_SAVING).focus();
					//Ext.ComponentQuery.query('[name='+_instance+'_param_19]')[0].focus();
//			    	 this.txtSerialNo.focus();
//			    	 this.txtSerialNo.selectText();
			    	FOCUS_AFTER_SAVING = 0;
			    	this.isSaving = false;
				},
				failure : function(form, action) {
			        switch (action.failureType) {
		            case Ext.form.action.Action.CLIENT_INVALID:
		            	Ext.Message.show("Error","Please input all required information</br>Chưa nhập đầy đủ thông tin",4000);
		                break;
		            case Ext.form.action.Action.CONNECT_FAILURE:
		            	Ext.Message.show('Failure', 'Ajax communication failed</br>Kết nối mạng thất bại',4000);
		                break;
		            case Ext.form.action.Action.SERVER_INVALID:
		            	switch( action.result.error){
		            	case "1":
		            		Ext.Message.show("Error","This fail serial need be reworked</br>Serial này chưa được Reworked",4000);
		            		break;
		            	case "2":
		            		Ext.Message.show("Error","This serial has already passed this step</br>Serial đã pass trạm kiểm tra này",4000);
		            		break;
		            	case "3":
		            		Ext.Message.show("Error","This serial has not passed previous step</br>Serial chưa pass trạm trước",4000);
		            		break;	 
		            	case "4":
		            		Ext.Message.show("Error","This serial has not tested by production</br>Serial nÃ y chÆ°a qua giai Ä‘oáº¡n sáº£n xuáº¥t ",4000);
		            		break;	  
		            	case "9":
			            	Ext.Message.show("Error",action.result.errorText,4000);
		            		break;
	            	}
		        }
			        this.isSaving = false;
				},
				scope : this
			});
		}
		
	},
	onTester : function(tester){
		if (runningTester == false){
				runningTester = true;
				if (this.productType == 9){
					FOCUS_AFTER_SAVING = 8;
					//Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].focus();
			    	Ext.getCmp('frmParams'+_instance).items.getAt(3).focus();
					var value = document.AOSmithTester.runTester("13");
					runningTester = false;
					if (value == "Timeout"){
						f.setValue("");
						Ext.Msg.show({
							title : 'Thông báo:',
							msg : '<b><span style="color:red">Error: Timeout. Please test again.</span></b></br><b><span style="color:red">Đã quá thời gian qui định. Hãy thực hiện lại</span></b>',
							icon : Ext.Msg.INFO,
							buttons : Ext.Msg.OK,
							scope:this,
							fn : function(buttonId) {
								this.txtSerialNo.focus();		
							},
						});
						
					}else{
						populateAOSTester(value);
					}
				}
				
			}
	},
//---------------------------------------------------FUNCTION----CHECK----------------------------------------------
	checkInformationBeforeSave:function(fail)
	{
		if(this.isSaving == true)
		{
			return false;
		}
		if(Ext.isEmpty(this.productModel))
		{
			Ext.Message.show('Error','Please select product model</br>Chưa chọn product model',4000);
			return false;
		}
		if(Ext.isEmpty(this.station))
		{
			Ext.Message.show('Error','Please select station</br>Chưa chọn station',4000);
			return false;
		}
		if(!this.paramPanel.getForm().isValid())
		{
			Ext.Message.show('Error','Please type parameters</br>Chưa nhập đầy đủ các thông số kiểm tra sản phẩm',4000);
			return false;
		}		
		if(Ext.isEmpty(this.txtSerialNo.getValue()))
		{
			Ext.Message.show('Error','Please type serial</br>Chưa nhập số serial',4000);
			return false;
		}
		
		if(fail)
		{
			if(this.defectPanel.getSelectionModel().hasSelection()==false)
			{
				Ext.Message.show("Error","Please select defect code</br>Chưa chọn mã lỗi",4000);
				return false;
			}
		}
		
		return true;
	}

});
