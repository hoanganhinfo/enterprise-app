var _ventPressure1,_ventPressure2,_tapPressure1,_tapPressure2;
Ext.define('EAP.Window.PrerequisiteAOSmithPDV',{
	extend: 'Ext.window.Window',
    title: 'AOSmith PDV Prerequisite',
    width: 450,
    bodyStyle: 'padding:10px',
    layout: {
        type: 'table',
        columns: 2
    },
    model: true,
    height: 430,
    actionId : '',
    saveUrl: '/enterprise-app/service/addAOSmithPDVPrerequisite',
    productType : '',
    productStation : '',
    productModel : '',
    productModelName: '',
    initComponent: function(){
//    	this.bbar = ['->',
//    	            { xtype: 'button', scope: this, text: 'Submit',handler: this.onSave },
//    	            { xtype: 'button', scope: this, text: 'Close',handler: this.onClose }
//    	          ];
    	this.items = [{
	        xtype:'label',
	        //fieldLabel: 'Requester',
	        labelAlign: 'right',
	        name: 'lblTitle',
	        colspan: 2,
	        html : "<B>MASTER BLOWER INPUT </B>",
	        disabled: true,
	        margin: '4 4 4 4'
	    },{
	    	 xtype:'textfield',
	         fieldLabel: 'Vent pressure #1',
	         labelAlign: 'right',
	         id: 'ventPressure1',
	         width: 200,
	         margin: '4 4 4 4',
	         enableKeyEvents: true,
	         listeners: {
				keypress: function(f,e)	
				{
					var keycode = e.getKey();
					switch(keycode)
					{
						case 13: 
							{ 
								Ext.getCmp('tapPressure1').focus();
								break;
							}
					}
				}
				,scope:this
			}	        	 
	    },{
	    	xtype:'textfield',
	         fieldLabel: 'Tap pressure #1',
	         labelAlign: 'right',
	         id: 'tapPressure1',
	         width: 200,
	         margin: '4 4 4 4',
	         enableKeyEvents: true,
	         listeners: 	{
	        	 keypress: function(f,e)	
					{
						var keycode = e.getKey();
						switch(keycode)
						{
							case 13: 
								{ 
									Ext.getCmp('ventPressure2').focus();
									break;
								}
						}
					},	        	 
					blur: function(f,e)	
						{
							f.setValue(-1*Math.abs(f.getRawValue()));
							
						},scope:this
			}
	    },{
	    	xtype:'textfield',
	         fieldLabel: 'Vent pressure #2',
	         labelAlign: 'right',
	         id: 'ventPressure2',
	         width: 200,
	         margin: '4 4 4 4',
	         enableKeyEvents: true,
	         listeners: {
				keypress: function(f,e)	
				{
					var keycode = e.getKey();
					switch(keycode)
					{
						case 13: 
							{ 
								Ext.getCmp('tapPressure2').focus();
								break;
							}
					}
				}
				,scope:this
			}	
	    },{
	    	xtype:'textfield',
	         fieldLabel: 'Tap pressure #2',
	         labelAlign: 'right',
	         id: 'tapPressure2',
	         width: 200,
	         margin: '4 4 4 4',
	         enableKeyEvents: true,
	         listeners: {
	        	 keypress: function(f,e)	
					{
						var keycode = e.getKey();
						switch(keycode)
						{
							case 13: 
								{ 
									Ext.getCmp('humidity').focus();
									break;
								}
						}
				},	        	 
				blur: function(f,e)	
				{
					f.setValue(-1*Math.abs(f.getRawValue()));
				},scope:this
			}
	    },{
	    	xtype:'textfield',
	         fieldLabel: 'Humidity',
	         labelAlign: 'right',
	         id: 'humidity',
	         width: 200,
	         margin: '4 4 4 4',
	         enableKeyEvents: true,
	         listeners: {
					keypress: function(f,e)	
					{
						var keycode = e.getKey();
						switch(keycode)
						{
							case 13: 
								{ 
									Ext.getCmp('temperature').focus();
									break;
								}
						}
					}
					,scope:this
			}	
	    },{
	    	xtype:'textfield',
	         fieldLabel: 'Temperature',
	         labelAlign: 'right',
	         id: 'temperature',
	         width: 200,
	         margin: '4 4 4 4',
	         enableKeyEvents: true,
	         listeners: {
				keypress: function(f,e)	
				{
					var keycode = e.getKey();
					switch(keycode)
					{
						case 13: 
							{ 
								Ext.getCmp('pressure').focus();
								break;
							}
					}
				}
				,scope:this
			}	
	    },{
	    	xtype:'textfield',
	         fieldLabel: 'Air Pressure',
	         labelAlign: 'right',
	         id: 'pressure',
	         width: 200,
	         colspan: 1,
	         margin: '4 4 4 4',
	         enableKeyEvents: true,
	         listeners: {
				keypress: function(f,e)	
				{
					var keycode = e.getKey();
					switch(keycode)
					{
						case 13: 
							{ 
								Ext.getCmp('inTake').focus();
								break;
							}
					}
				}
				,scope:this
			}	
	    },{
	    	xtype:'textfield',
	         fieldLabel: 'InTake',
	         labelAlign: 'right',
	         id: 'inTake',
	         width: 200,
	         colspan: 1,
	         margin: '4 4 4 4',
	         enableKeyEvents: true,
	         listeners: {
				keypress: function(f,e)	
				{
					var keycode = e.getKey();
					switch(keycode)
					{
						case 13: 
							{ 
								Ext.getCmp('ventPressure1').focus();
								break;
							}
					}
				}
				,scope:this
			}	
	    },Ext.create('Ext.button.Button',{
			  id: 'id_btnSave_'+this.idActionPanel,
			  inputId: 'inputId_btnSave'+this.idActionPanel,
			  name: 'btnPass',
			  text : 'SAVE',
			  scale   : 'large',
			  width: 185,//150,//190,//200,
			  height: 70,
			  cls: 'x-btn-pass',
			  handler : this.onSave,
			  scope : this}),
		Ext.create('Ext.button.Button',{
				  id: 'id_btnClose_'+this.idActionPanel,
				  inputId: 'inputId_btnPass'+this.idActionPanel,
				  name: 'btnPass',
				  text : 'CLOSE',
				  scale   : 'large',
				  width: 185,//150,//190,//200,
				  height: 70,
				  cls: 'x-btn-pass',
				  handler : this.onClose,
				  scope : this})];
		this.callParent(arguments);
	},
	onRender: function(){
		this.callParent(arguments);
	},
	onSave: function(){
		if (Ext.getCmp("ventPressure1").getRawValue() == ''){
			alert('Please input vend pressure 1');
			return;
		}
		if (Ext.getCmp("ventPressure2").getRawValue() == ''){
			alert('Please input vend pressure 2');
			return;
		}
		if (Ext.getCmp("tapPressure1").getRawValue() == ''){
			alert('Please input tap pressure 1');
			return;
		}
		if (Ext.getCmp("tapPressure2").getRawValue() == ''){
			alert('Please input tap pressure 2');
			return;
		}
		if (Ext.getCmp("humidity").getRawValue() == ''){
			alert('Please input Humidity');
			return;
		}
		if (Ext.getCmp("temperature").getRawValue() == ''){
			alert('Please input Temperature');
			return;
		}
		if (Ext.getCmp("pressure").getRawValue() == ''){
			alert('Please input Pressure');
			return;
		}
		if (Ext.getCmp("inTake").getRawValue() == ''){
			alert('Please input InTake');
			return;
		}
		
		new Ext.data.Connection().request({
			method : 'POST',
			url : this.saveUrl,
			scope: this,
			params : {
				productType : this.productType,
				productStation: this.productStation,
				productModel: this.productModel,
				productModelName : this.productModelName,
				ventPressure1: Ext.getCmp("ventPressure1").getRawValue(),
				ventPressure2: Ext.getCmp("ventPressure2").getRawValue(),
				tapPressure1:Ext.getCmp("tapPressure1").getRawValue(),
				tapPressure2:Ext.getCmp("tapPressure2").getRawValue(),
				humidity: Ext.getCmp("humidity").getRawValue(),
				temperature:Ext.getCmp("temperature").getRawValue(),
				pressure:Ext.getCmp("pressure").getRawValue(),
				inTake:Ext.getCmp("inTake").getRawValue(),
				param1: 'day'
			},
			scriptTag : true,
			success : function(response) {
				//alert('Delete success !!');
				var rs = Ext.decode(response.responseText);
				if (rs.success == true && rs.verified == true){ 
					loadParamsProduct(this.actionId);	
					Ext.getCmp('frmAction_'+this.actionId).prerequisiteId = rs.prerequisiteId;
					Ext.getCmp('frmAction_'+this.actionId).prerequisiteLabel = rs.prerequisiteLabel;
					//Ext.getCmp('frmAction_'+this.actionId).prerequisiteData = rs.prerequisiteData;
					
					var elements = document.getElementsByClassName("portlet-title-text");
					elements[0].innerHTML  = rs.prerequisiteLabel;
					this.close();
				}else{
					var elements = document.getElementsByClassName("portlet-title-text");
					elements[0].innerHTML  = "Product Test";
					alert('Master data input are invalid. Please check again.\Dữ liệu mẫu thử không hợp lệ. Hãy thử lại')
				}
			},
			failure : function(response) {
				var elements = document.getElementsByClassName("portlet-title-text");
				elements[0].innerHTML  = "Product Test";
				
			}
		});
		
		
	},
	onClose: function(){
		this.close();
	}
	
});
