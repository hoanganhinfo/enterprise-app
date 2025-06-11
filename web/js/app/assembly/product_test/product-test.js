var GET_ASSY_PRODUCT_TYPE_LIST_URL = '/enterprise-app/service/getAssyProductTypeList';
var GET_ASSY_PRODUCT_MODEL_LIST_URL = '/enterprise-app/service/getAssyProductModelListByAPT';
var GET_ASSY_PRODUCT_STATION_LIST_URL = '/enterprise-app/service/getAssyProductStationList';
var GET_TEN_PRODUCT_LIST_URL = '/enterprise-app/service/getAssyProductStationList';
var VERIFY_PRODUCT_PREREQUISITE_URL = '/enterprise-app/service/verifyAssyProductStationPrerequisiteList';
//var GET_PUMPLINE_LIST='/ewi/service/getActivePumpLine';
//var GET_PUMP_MODEL_LIST_URL = '/ewi/service/getActivePumpModels';
//var GET_DEFECT_CODE_LIST='/ewi/service/getActiveDefects';

//var DELETE_FUNCTION_TEST_ITEM = '/ewi/service/deleteFunctionTest';
//var GET_TEN_FUNCTION_TEST_LIST = '/ewi/service/getTenFunctionTestList';
//var SAVE_FUNCTION_TEST_LIST_URL= '/ewi/service/saveFunctionTest';
//var appList = null;
var selectedGrid = null;
var _instance;
var frmAction;
var runningTester = false;
var FOCUS_AFTER_SAVING = 0;
var  paramMap = new Map();
var lastTestGrid;
function disableAOSParam(){
	Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].setReadOnly(true);
	Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].setReadOnly(true);
	Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].setReadOnly(true);
	Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].setReadOnly(true);
	Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].setReadOnly(true);
	Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].setReadOnly(true);
	Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].setReadOnly(true);
}
function populateAOSTester(value){
	console.log(value);
	value = value.replace("R","");
	var res = value.split("#");

	Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].setValue(res[0].replace("+",""));
	Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].setValue(res[1].replace("+",""));
	Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].setValue(res[2]); //Power
	Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].setValue(res[3]);
	Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].setValue(res[4]);
	//Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].setValue(res[5]); // vibration
	if (res[6] == "101"){
		Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].setValue("OK");
	}else{
		Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].setValue("NG");
	}
	//Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].focus();
	Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].setValue("OK");
	if (Ext.isNumeric(res[8])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_22]')[0].setValue(res[8]); //Temperature
	}
	if (Ext.isNumeric(res[9])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_23]')[0].setValue(res[9]); //Humidity
	}
	if (Ext.isNumeric(res[10])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_24]')[0].setValue(res[10]); // Pressure
	}
	Ext.getCmp('id_btnSave_'+_instance).focus();
}
function populateAOSPDVTester(value){
	console.log(value);
	//alert(value);
	value = value.replace("R","");
	var res = value.split("#");

	Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].setValue(res[0].replace("+","")); // Tap
	Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].setValue(res[1].replace("+","")); // Vent
	//Ext.ComponentQuery.query('[name='+_instance+'_param_25]')[0].setValue(res[2]); //InTake
	Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].setValue(res[2]); //Power
	Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].setValue(res[3]); // Current
	Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].setValue(res[4]); //Normal speed
	//Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].setValue(res[5]); // vibration
	if (res[6] == "101"){
		Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].setValue("OK");
	}else{
		Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].setValue("NG");
	}
	Ext.ComponentQuery.query('[name='+_instance+'_param_25]')[0].setValue(res[7]); //InTake
	//Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].focus();
	Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].setValue("OK"); // Hipot
	if (Ext.isNumeric(res[8])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_22]')[0].setValue(res[8]); //Temperature
	}
	if (Ext.isNumeric(res[9])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_23]')[0].setValue(res[9]); //Humidity
	}
	if (Ext.isNumeric(res[10])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_24]')[0].setValue(res[10]); // Pressure
	}
	Ext.getCmp('id_btnSave_'+_instance).focus();
}
function createProductTypeCombo(_id,_selectedProductType) {
	var ds = new Ext.data.JsonStore({
		autoLoad : true,
		//fields : ['id', 'product_type','product_type_name'],
		model: 'EAP.Model.AssyProductType',
		proxy: {
	        type: 'ajax',
	        url: GET_ASSY_PRODUCT_TYPE_LIST_URL,
	        reader: {
	            type: 'json',
	            root: 'AssyProductTypeList',
	            idProperty: 'id'
	        }
	    }
	});

	// Custom rendering Template
//	var resultTpl = new Ext.XTemplate('<tpl for="."><div class="search-item">',
	//		'<h3><span>{bondCode}<br/></h3>', '</div></tpl>');

	var cboProductType = new Ext.form.ComboBox({
		id : 'cboProductType_'+_id,
		inputId: 'cbProductType_'+_id,
		store : ds,
		allowBlank: false,
		msgTarget: 'side',		
		labelAlign: 'left',
	    fieldLabel: 'Product',	      
		displayField : 'product_type',
		valueField : 'id',
		flex: 2,
		typeAhead : true,
		editable: false,
		width : 250,
		maxWidth: 250,
		// hideTrigger:true,
		triggerAction : 'all',
		queryMode : 'remote',
		minChars : 1,
		listeners: {
			select: function(combo,record,opt){
				//selectedProductType = record[0].data.id;
				_selectedProductType = record[0].get('id');
				Ext.getCmp('frmAction_'+_id).productType = record[0].get('id');
				Ext.getCmp('frmAction_'+_id).padding = record[0].get('padding');
				Ext.getCmp('frmAction_'+_id).isAutoResult = record[0].get('autoresult');
				Ext.getCmp('frmAction_'+_id).reloadGUI();
				
				var serialMaxLength  = parseInt(record[0].get('serial_size'));
				var prefixFunction = record[0].get('prefix_function');
				var txtSerial = Ext.getCmp('id_txtSerialNo_'+_id);
				txtSerial.maxLength = serialMaxLength;
				txtSerial.inputEl.dom.maxLength = serialMaxLength;
				var elements = document.getElementsByClassName("portlet-title-text");
				elements[0].innerHTML  = "Product Test";
				Ext.get('btnConditionInput').setVisible(false);
				Ext.getCmp('frmParams'+_id).removeAll();
				
				var gridView = Ext.ComponentQuery.query('#frmTestGrid_'+_instance)[0];
			    gridView.headerCt.removeAll();
			    gridView.getView().refresh();
			    
				Ext.getCmp('cboProductModel_'+_id).getStore().load({
					params:{product_type: record[0].get('id')},
					callback: function(){
						Ext.getCmp('cboProductModel_'+_id).setRawValue('');
						Ext.getCmp('frmAction_'+_id).productModel = '';
					}
					});
				Ext.getCmp('cboProductStation_'+_id).getStore().load({
					params:{productTypeId: record[0].get('id')},
					callback: function(){
						Ext.getCmp('cboProductStation_'+_id).setRawValue('');
						Ext.getCmp('frmAction_'+_id).station = '';
					}
					});
				Ext.getCmp('frmAction_'+_id).prefixSerial = '';
				
				
				Ext.getCmp('id_txtSerialNo_'+_id).labelEl.update('');
				Ext.getCmp('id_txtSerialNo_'+_id).labelEl.parent().setDisplayed(false);
				if (prefixFunction != null && prefixFunction != ''){
					new Ext.data.Connection().request({
						method : 'POST',
						url : '/enterprise-app/service/'+prefixFunction,
						params : {
							//testId : testId
						},
						scriptTag : true,
						success : function(response) {
							//alert('Delete success !!');
							var rs = Ext.decode(response.responseText);
							Ext.getCmp('id_txtSerialNo_'+_id).labelEl.parent().setDisplayed(true);
							Ext.getCmp('frmAction_'+_id).prefixSerial = rs.prefix;
							Ext.getCmp('id_txtSerialNo_'+_id).labelEl.update(rs.prefix);
						}	
					});
				}
					
				
        	}
		}		
	});

	return cboProductType;
}
function createProductModelCombo(_id,_selectedProductType) {
	var ds = new Ext.data.JsonStore({
//		autoLoad : true,
		fields : ['id', 'product_model','validateFnOnClent','validateFnOnServer','allowDuplicate'],
		proxy: {
	        type: 'ajax',
	        url: GET_ASSY_PRODUCT_MODEL_LIST_URL,
	        extraParams: {product_type: _selectedProductType}, 
	        reader: {
	            type: 'json',
	            root: 'AssyProductModelList',
	            idProperty: 'id'
	        },
			listeners: {
				beforeload: function(){
					Ext.apply(this.proxy.extraParams,{
						'product_type': _selectedProductType
					});

				}
			}
	    }
	});

	// Custom rendering Template
//	var resultTpl = new Ext.XTemplate('<tpl for="."><div class="search-item">',
	//		'<h3><span>{bondCode}<br/></h3>', '</div></tpl>');

	var cboProductModel = new Ext.form.ComboBox({
		id : 'cboProductModel_'+ _id,
		inputId: 'cbProductModel_'+ _id,
		store : ds,
		allowBlank: false,
		msgTarget: 'side',		
		labelAlign: 'left',
	    fieldLabel: 'Model',	
	    //labelWidth: 50,
	    flex: 1,
		displayField : 'product_model',
		valueField : 'id',
		typeAhead : true,
		editable: false,
		width : 450,
		maxWidth: 450,
		// hideTrigger:true,
		triggerAction : 'all',
		queryMode : 'local',
		minChars : 1,
		listeners: {
			select: function(combo,record,opt){
				Ext.getCmp('frmAction_'+_id).productModel = record[0].get('id');
				Ext.getCmp('frmAction_'+_id).productModelName = record[0].get('product_model');
				Ext.getCmp('frmAction_'+_id).validateFnOnClent = record[0].get('validateFnOnClent');
				Ext.getCmp('frmAction_'+_id).validateFnOnServer = record[0].get('validateFnOnServer');
				Ext.getCmp('frmAction_'+_id).allowDuplicate = record[0].get('allowDuplicate');
				
				Ext.getCmp('cboProductStation_'+_id).setRawValue('');
				Ext.getCmp('frmAction_'+_id).station = '';
				var elements = document.getElementsByClassName("portlet-title-text");
				elements[0].innerHTML  = "Product Test";
				Ext.getCmp('frmParams'+_id).removeAll();
				Ext.get('btnConditionInput').setVisible(false);
        	}
		}		
	});

	return cboProductModel;
}
function createProductStationCombo(_id,_selectedProductType) {
	var ds = new Ext.data.JsonStore({
//		autoLoad : true,
		//fields : ['id', 'station','product_params','product_defects','product_params_name','product_params_size'],
		model: 'EAP.Model.AssyProductStation',
		proxy: {
	        type: 'ajax',
	        url: GET_ASSY_PRODUCT_STATION_LIST_URL,
	        extraParams: {productTypeId: _selectedProductType}, 
	        reader: {
	            type: 'json',
	            root: 'AssyProductStationList',
	            idProperty: 'id'
	        },
			listeners: {
				beforeload: function(){
					Ext.apply(this.proxy.extraParams,{
						'productTypeId': _selectedProductType
					});

				}
			}
	    }
	});

	// Custom rendering Template
//	var resultTpl = new Ext.XTemplate('<tpl for="."><div class="search-item">',
	//		'<h3><span>{bondCode}<br/></h3>', '</div></tpl>');

	var cboProductStation = new Ext.form.ComboBox({
		id : 'cboProductStation_'+ _id,
		inputId: 'cbProductStation_'+ _id,
		store : ds,
		allowBlank: false,
		msgTarget: 'side',		
		labelAlign: 'left',
	    fieldLabel: 'Station',
	    labelWidth: 50,
	    flex: 1,
		displayField : 'station',
		valueField : 'id',
		typeAhead : true,
		editable: false,
		width : 200,
		maxWidth: 200,
		// hideTrigger:true,
		triggerAction : 'all',
		queryMode : 'local',
		minChars : 1,
		listeners: {
			select: function(combo,record,opt){
				//selectedStation = record[0].get('id');
				Ext.getCmp('frmAction_'+_id).station = record[0].get('id');
				//Ext.getCmp('frmAction_'+_id).stationName = record[0].get('id');
				Ext.getCmp('frmAction_'+_id).stationStep = record[0].get('step');
				Ext.getCmp('frmAction_'+_id).productType = record[0].get('product_type');
				
				Ext.getCmp('frmAction_'+_id).productParams = record[0].get('product_params');
				Ext.getCmp('frmAction_'+_id).productParamsName = record[0].get('product_params_name');
				Ext.getCmp('frmAction_'+_id).productParamsSize = record[0].get('product_params_size');
				Ext.getCmp('frmAction_'+_id).productParamsWidth = record[0].get('product_params_width');
				Ext.getCmp('frmAction_'+_id).productParamsValue = record[0].get('product_params_value');
				Ext.getCmp('frmAction_'+_id).productNegativeValue = record[0].get('negative_value');
				
			//	alert(record[0].get('product_params_colspan'));
				Ext.getCmp('frmAction_'+_id).productParamsColspan = record[0].get('product_params_colspan');
				var prerequisite = record[0].get('prerequisite');
				Ext.getCmp('frmAction_'+_id).prerequisite = prerequisite;
				if (prerequisite!= null && prerequisite != ''){
					Ext.get('btnConditionInput').setVisible(true);
					new Ext.data.Connection().request({
						method : 'POST',
						url : VERIFY_PRODUCT_PREREQUISITE_URL,
						scope: this,
						params : {
							productTypeId : Ext.getCmp('frmAction_'+_id).productType,
							productStationId: Ext.getCmp('frmAction_'+_id).station,
							productModel : Ext.getCmp('frmAction_'+_id).productModel,
							param1: 'day'
						},
						scriptTag : true,
						success : function(response) {
							//alert('Delete success !!');
							var rs = Ext.decode(response.responseText);
							if (rs.success == true){
								if (rs.verified == false){
									var elements = document.getElementsByClassName("portlet-title-text");
									elements[0].innerHTML  = "Product Test";
									Ext.getCmp('frmParams'+_id).removeAll();
									var dlg = Ext.create(prerequisite, {
										// title: 'View task',
								    	productType :Ext.getCmp('frmAction_'+_id).productType,
								        productStation : Ext.getCmp('frmAction_'+_id).station,
								        productModel : Ext.getCmp('frmAction_'+_id).productModel,
								        productModelName : Ext.getCmp('frmAction_'+_id).productModelName,
								        actionId : _id
										});	
									dlg.show();	
								}else{
									loadParamsProduct(_id);
									var prerequisiteId = rs.prerequisiteId;
									var prerequisiteLabel = rs.prerequisiteLabel;
									//var prerequisiteData = rs.prerequisiteLabel;
									Ext.getCmp('frmAction_'+_id).prerequisiteId = prerequisiteId;
									Ext.getCmp('frmAction_'+_id).prerequisiteLabel = prerequisiteLabel;
									//Ext.getCmp('frmAction_'+_id).prerequisiteData = prerequisiteData;
									var elements = document.getElementsByClassName("portlet-title-text");
									elements[0].innerHTML  = prerequisiteLabel;
								}
							}
						},
						failure : function(response) {
								
						}
					});
					
					
				     
				}else{
					Ext.get('btnConditionInput').setVisible(false);
					loadParamsProduct(_id);
				}
				Ext.getCmp('frmTestGrid_'+_id).station = record[0].get('id');
				Ext.getCmp('defectCodeList_'+_id).getStore().load({
					params:{defectIds: record[0].get('product_defects')},
					callback: function(records, operation, success){
						//Ext.getCmp('frmLastTenGrid_'+_id).setRawValue('');
					}
					});
				Ext.getCmp('frmTestGrid_'+_id).getStore().load({
					params:{sessionId: sessionId,operator: operatorName, station: record[0].get('id') }
					});				
				//alert(record[0].data.product_params);
//				alert(record[0].data.product_params_name);
				
				
				 
        	}
		}		
	});

	return cboProductStation;
}

function loadParamsProduct(_id){
	Ext.getCmp('frmParams'+_id).removeAll();
	
	var paramsToken = Ext.getCmp('frmAction_'+_id).productParams.split(";");
	var paramsNameToken = Ext.getCmp('frmAction_'+_id).productParamsName.split(";");
	var paramSizeToken =  Ext.getCmp('frmAction_'+_id).productParamsSize.split(";");
	var paramColspan =  Ext.getCmp('frmAction_'+_id).productParamsColspan.split(";");
	var paramWidth =  Ext.getCmp('frmAction_'+_id).productParamsWidth.split(";");
	var paramValue =  Ext.getCmp('frmAction_'+_id).productParamsValue.split(";");
	var paramNegativeValue =  Ext.getCmp('frmAction_'+_id).productNegativeValue.split(";");
	console.log(paramsToken);
	paramMap = new Map();
	var gridView = Ext.ComponentQuery.query('#frmTestGrid_'+_instance)[0];
    console.log(gridView.getXType());
    var columns = new Array();
    var fields = new Array();
    gridView.headerCt.removeAll();
    var column = Ext.create('Ext.grid.column.Column', {text: 'Serial',dataIndex:'serial', width: 120});
    gridView.headerCt.insert(gridView.columns.length, column);
    column = Ext.create('Ext.grid.column.Column', {text: 'Time',dataIndex:'datetested', width: 130});
    gridView.headerCt.insert(gridView.columns.length, column);
    column = Ext.create('Ext.grid.column.Column', {text: 'Result',dataIndex:'status', width: 85});
    gridView.headerCt.insert(gridView.columns.length, column);
    
	for (var i=0; i < paramsToken.length - 1; i++){
        //print(arrayOfStrings[i] + " / ");
		var paramField ;
		paramMap.set(paramsToken[i],paramsNameToken[i]);
		
		column = Ext.create('Ext.grid.column.Column', {text: paramsNameToken[i],dataIndex:'param_'+paramsToken[i], width: 100});
		gridView.headerCt.insert(gridView.columns.length, column);
        gridView.getView().refresh();
		columns.push(column);
		fields.push('param_'+paramsToken[i]);
		if (paramValue[i] == null || paramValue[i] == '' || paramValue[i] == 'null'){
			 paramField = new Ext.form.TextField({
				id : _id+'_param_'+ i,
				name: _id+'_param_'+ paramsToken[i],
				allowBlank: false,
				msgTarget: 'side',		
				labelAlign: 'left',
				isNegativeValue: paramNegativeValue[i]=='true'?true:false,
				maxLength: parseInt(paramSizeToken[i])+1,
				invalidCls: 'x-field-invalid',
				enforceMaxLength: parseInt(paramSizeToken[i])==0?false:true,
				enableKeyEvents: true,
			    fieldLabel: paramsNameToken[i],	
	//		    labelWidth: 100,
			    width : parseInt(paramWidth[i]),
			    colspan:  parseInt(paramColspan[i]),
				listeners: 	{
					keypress: function(f,e)	
					{
						var keycode = e.getKey();
						switch(keycode)
						{
							case 13: 
									{ 
											var id = f.getId();
											var pos  = id.lastIndexOf("_");
											var paramId = parseInt(id.substring(pos+1)) +1;
											if (!Ext.isEmpty(Ext.getCmp(_id+'_param_'+ paramId))){
												Ext.getCmp(_id+'_param_'+ paramId).focus();
											}else{
												Ext.getCmp('id_txtSerialNo_'+_id).focus();
											}
											break;
									}
						}
						
					},
					 blur: function(f,e){
						var val = f.getRawValue();
						if (val.indexOf('.') == 0){
							f.setValue('0'+f.getRawValue());
						}
						if (f.isNegativeValue == true){
							val = parseFloat(f.getValue());
							f.setValue(-1*Math.abs(val));
						}
					 },scope:this
				}
						
			});
		}else{
			var myRe = /\w+/g;
			var _store = paramValue[i].match(myRe);
		
			 paramField = new Ext.form.ComboBox({
					id : _id+'_param_'+ i,
					name: _id+'_param_'+ paramsToken[i],
					allowBlank: false,
					msgTarget: 'side',		
					labelAlign: 'left',
					editable:  false,
					invalidCls: 'x-field-invalid',
					fieldLabel: paramsNameToken[i],
					enableKeyEvents: true,
				    store:_store,
		//		    labelWidth: 100,
				    width : parseInt(paramWidth[i]),
				    colspan:  parseInt(paramColspan[i]),
					listeners: 	{
						keypress: function(f,e)	
						{
							var keycode = e.getKey();
							switch(keycode)
							{
								case 13: 
										{ 
												var id = f.getId();
												var pos  = id.lastIndexOf("_");
												var paramId = parseInt(id.substring(pos+1)) +1;
												if (!Ext.isEmpty(Ext.getCmp(_id+'_param_'+ paramId))){
													Ext.getCmp(_id+'_param_'+ paramId).focus();
												}else{
													Ext.getCmp('id_txtSerialNo_'+_id).focus();
												}
												break;
										}
							}
							
						},scope:this
					}
				});
		}
		Ext.getCmp('frmParams'+_id).add(paramField);
		Ext.getCmp('frmParams'+_id).doLayout();
		//this.createParamField(paramsToken[i],paramsNameToken[i]);
	}
	fields.push('testid');
	fields.push('serial');
	fields.push('datetested');
	fields.push('status');
	console.log(fields);
	var TestDs = new Ext.data.JsonStore({
		autoLoad: false,
		fields: fields,
		proxy:	{
					type: 'ajax',
					url: '/enterprise-app/service/getTenProductTestList',
					reader:	{
								type:'json',
								root:'testList',
								idProprety:'testid'
							}
				}
	});
	gridView.getView().refresh();
	gridView.reconfigure(TestDs);
	console.log(paramMap);
	TestDs.load({params:{sessionId: sessionId,operator: operatorName, station: Ext.getCmp('frmTestGrid_'+_instance).station }});
	
}

Liferay.Portlet.ready(


    /*
    This function gets loaded after each and every portlet on the page.

    portletId: the current portlet's id
    node: the Alloy Node object of the current portlet
    */

    function(portletId, node) {

		var selectedProductType = '';
//		var prefixFunction = '';
		
    	var _lastIndex = portletId.lastIndexOf("_");
    	if (_lastIndex == -1){ return;}
    	_instance = portletId.substr(_lastIndex+1);
    	if (Ext.get(_instance+'_product') == null ||
    			Ext.get(_instance+'_product').dom.innerHTML.trim() != '') {
    		  return;
    	}
    	//alert(instanceId);
    	
		 Ext.create('Ext.form.Panel', {
			 	id: 'frmProduct'+_instance,
		      //  bodyPadding: 5,  // Don't want content to crunch against the borders
		        height: '100%',
		        width:'100%',
		        border: 0,
		        layout: {
		            type: 'hbox',
		            align: 'center'
		        },
		  	   	items: 	[createProductTypeCombo(_instance,selectedProductType),
				       	 createProductModelCombo(_instance,selectedProductType),
				       	 createProductStationCombo(_instance,selectedProductType),
				       	{
				 			xtype : 'button',
				 			scope : this,
				 			//hidden: true,
				 			flex: 1,
				 			height: 35,
				 			width : 120,
				 			maxWidth: 120,
				 			cls: 'x-btn-condition',
				 			id: 'btnConditionInput',
				 			text : 'Master input',
				 			handler : function(){
				 				if (Ext.getCmp('frmAction_'+_instance).prerequisite != '' &&
				 						Ext.getCmp('frmAction_'+_instance).prerequisite != null){
				 				var dlg = Ext.create(Ext.getCmp('frmAction_'+_instance).prerequisite, {
									// title: 'View task',
							    	productType :Ext.getCmp('frmAction_'+_instance).productType,
							        productStation : Ext.getCmp('frmAction_'+_instance).station,
							        productModel : Ext.getCmp('frmAction_'+_instance).productModel,
							        productModelName : Ext.getCmp('frmAction_'+_instance).productModelName,
							        actionId : _instance
									});	
								dlg.show();	
				 				}
				 			}
				 		}
		  	   	       	 ],
		        renderTo: _instance+'_product'
		    });
		Ext.get('btnConditionInput').setVisible(false);		 
		var paramPanel = Ext.create('EAP.Portlet.ParamInfo',{
	     		idDefectCode: _instance,//'DefectCode'
	     		id:'frmParams'+_instance,
	     		height:'auto',
	     		width:'100%',
	     		renderTo: _instance+'_param'
	     		});			 


	    lastTestGrid = Ext.create('EAP.Portlet.LastedTestGrid',{
	     		idLastedTestGrid: _instance,
	     		id:'frmTestGrid_'+_instance,
	     		width: '100%',
	     		height:200
	     		}); 
  
 		var defectCodePanel = Ext.create('EAP.Portlet.DefectCodeGrid',{
     		idDefectCode: _instance,//'DefectCode'
     		//id:'frmDefectCodeGrid_'+_instance,
     		height:300,
     		width:'100%',
     		renderTo: _instance+'_defects'
     		});	 
		 frmAction = Ext.create('EAP.Portlet.ActionPanel',{
	     		idActionPanel: _instance,
	     		id: 'frmAction_'+_instance,
	     		width: '100%',
	     		height: 200,
	     		paramPanel: paramPanel,
	     		defectPanel : defectCodePanel,
	     		testListPanel: lastTestGrid
	     		//renderTo: _instance+'_action'
	     		});
		    Ext.create('Ext.form.Panel', {
		      //  bodyPadding: 5,  // Don't want content to crunch against the borders
		        height: 210,
		        width:'100%',
		        border: 0,
		        layout: {
		            type: 'hbox',
		            align: 'center'
		        },
		  	   	items: 	[frmAction,lastTestGrid
		  	   	       	 ],
		        renderTo: _instance+'_action'
		    });			 
    });
   
