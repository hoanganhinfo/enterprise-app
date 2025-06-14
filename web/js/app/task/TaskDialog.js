Ext.Loader.setPath("Ext.ux.DateTimePicker", "/enterprise-app/js/extjs4.1/examples/ux/DateTimeField/DateTimePicker.js");
Ext.Loader.setPath("Ext.ux.DateTimeField", "/enterprise-app/js/extjs4.1/examples/ux/DateTimeField/DateTimeField.js");

Ext.define('EAP.Window.Task',{
	extend: 'Ext.window.Window',
    title: 'New task',
    width: 620,
    bodyStyle: 'padding:10px',
    layout: {
        type: 'table',
        // The total column count must be specified here
        columns: 2
    },
    height: 700,
    saveUrl: '',
    departmentJsonData : '',
    departmentStore : null,
    statusStore: null,
    taskActionStore: null,
    userStore: null,
    scopeStore: null,
    locationStore: null,
    taskRequestTypeStore: null,
    priorityStore: null,
    assetCategoryStore: null,
    assetStore: null,
    taskId: null,
    task: null,
    requester: '',
    reloadFn: null,
    requesterId: '',
    departmentId: '',
    initComponent: function(){
    	this.bbar = ['->',
    	            { xtype: 'button', scope: this, text: 'Submit',handler: this.onSave },
    	            { xtype: 'button', scope: this, text: 'Close',handler: this.onClose }
    	          ];
    	this.items = [{
	    	 xtype:'combo',
	    	id : 'cbDepartment',
	    	inputId: 'cboDepartment',
	    	store : this.departmentStore,
	    	labelAlign: 'right',
	        fieldLabel: 'To department',
	    	displayField : 'orgName',
	    	width: 300,
	    	height: 30,
	    	displayField : 'orgName',
	    	valueField : 'orgId',
	    	editable: false,
	    	allowBlank: false,
	    	msgTarget: 'side',
	    	// hideTrigger:true,
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '2 2 2 2',
	    	scope: this,
            listeners:{
     			 select: function(combo, records,opt) {
     				 Ext.getCmp('cbAssignee').getStore().clearFilter(true);
     				 var val = combo.getRawValue();
     				 console.log('val: '+ val);
     				Ext.getCmp('cbAssignee').setRawValue('');
     				Ext.getCmp('cbAssignee').getStore().filter("department", val);
     			 }
            }
	    },{
//	    	 xtype:'textfield',
//	         fieldLabel: 'Assignee',
//	         labelAlign: 'right',
//	         value: this.task==null?'':this.task.get('assignee'),
//	         id: 'assignee',
//	         width: 250,
//	         colspan: 2,
//	         margin: '2 2 2 2'
	    	 xtype:'combo',
		     id : 'cbAssignee',
		    	inputId: 'cboAssignee',
		    	height: 30,
		    	labelAlign: 'right',
		        fieldLabel: 'Assignee',
		    	displayField : 'userName',
		    	valueField : 'userId',
		    	store: this.userStore,
		    	colspan: 1,
		    //	value: -1,
		    	editable: true,
		    	allowBlank: true,
		    	width: 300,
		    	msgTarget: 'side',
		    	triggerAction : 'all',
		    	queryMode : 'local',
		    	margin: '2 2 2 2'
	    },{
	    	 xtype:'combo',
	    	id : 'cbLocation',
	    	inputId: 'cboLocation',
	    	labelAlign: 'right',
	        fieldLabel: 'Location',
	        height: 30,
	    	displayField : 'locationCode',
	    	valueField : 'locationCode',
	    	store: this.locationStore,
	    	colspan: 1,
	    	editable: true,
	    	allowBlank: true,
	    	msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '2 2 2 2',
			listeners:{
	  			 change: function(combo, newValue, oldValue, eOpts ) {
	  				Ext.getCmp("cbAsset").getStore().load({
	  					  params: {locationCode: Ext.getCmp("cbLocation").getValue(), categoryId: Ext.getCmp("cbAssetCategory").getValue()},
	  					 callback: function(records, operation, success) {
	  				        if (success == true) {
	  				        	//Ext.getCmp("cbAsset").select(Ext.getCmp("cbAsset").getStore().getAt(0));
	  				        }
	  				    }
	  				})

	             }
	         }
	    },{
	    	xtype:'combo',
	    	id : 'cbAssetCategory',
	    	inputId: 'cboAssetCategory',
	    	labelAlign: 'right',
	        fieldLabel: 'Asset category',
	    	displayField : 'categoryname',
	    	valueField : 'id',
	    	height: 30,
	    	store: this.assetCategoryStore,
	    	colspan: 1,
	    	editable: true,
	    	allowBlank: true,
	    	msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '2 2 2 2',
	    	scope: this,
            listeners:{
     			 change: function(combo, newValue, oldValue, eOpts ) {
     				Ext.getCmp("cbAsset").getStore().load({
     					  params: {locationCode: Ext.getCmp("cbLocation").getValue(), categoryId: Ext.getCmp("cbAssetCategory").getValue()},
     					 callback: function(records, operation, success) {
     				        if (success == true) {
     				        	//Ext.getCmp("cbAsset").select(Ext.getCmp("cbAsset").getStore().getAt(0));
     				        }
     				    }
     				})

                }
            }
	    },{
	    	xtype:'combo',
	    	id : 'cbAsset',
	    	inputId: 'cboAsset',
	    	labelAlign: 'right',
	        fieldLabel: 'Asset',
	        height: 30,
	    	displayField : 'assetCode',
	    	itemTpl : '{assetCode} | {assetName}',
	    	valueField : 'id',
	    	store: this.assetStore,
	    	colspan: 1,
	    	// value: 1,
	    	editable: true,
	    	allowBlank: true,
	    	msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '2 2 2 2'
	    },{
			xtype:'combo',
			id : 'cbRequestType',
			inputId: 'cboRequestType',
			height: 30,
			store : this.taskRequestTypeStore,
			labelAlign: 'right',
			fieldLabel: 'Request type',
			displayField : 'name',
			valueField : 'value',
			value:  this.task==null?5:this.task.get('requestTypeId'),
			editable: false,
			scope: this,
			allowBlank: false,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	columnWidth:0.5,
	    	margin: '2 2 2 2'
		},{
	    	 xtype:'textfield',
	         fieldLabel: 'Task name',
	         labelAlign: 'right',
	         value: this.task==null?'':this.task.get('taskname'),
	         id: 'taskname',
	         height:30,
	         width: 560,
	         colspan: 2,
	         margin: '2 2 2 2'
	    },{
	    	xtype:'textareafield',
	        fieldLabel: 'Description',
	        labelAlign: 'right',
	        id: 'desc',
	        value:  this.task==null?'':this.task.get('description'),
	        anchor:'95%',
	        width: 560,
	        growMax: 100,
	        growMin: 100,
	        height:100,
	        colspan: 2,
	        margin: '2 2 2 2'
	    },{
	    	xtype:'combo',
		    id : 'cbPriority',
		    inputId: 'cboPriority',
		    store : this.priorityStore,
		    value:  this.task==null?2:this.task.get('priorityId'),
		    labelAlign: 'right',
		    fieldLabel: 'Priority',
		    height: 30,
		    displayField : 'name',
		    valueField : 'value',
		    allowBlank: false,
		    msgTarget: 'side',
		    // hideTrigger:true,
		    //triggerAction : 'all',
		    queryMode : 'local',
		    columnWidth:0.5,
		    margin: '2 2 2 2'
		},{
			xtype:'combo',
			id : 'cbStatus',
			inputId: 'cboStatus',
			store : this.statusStore,
			labelAlign: 'right',
			fieldLabel: 'Status',
			height: 30,
			displayField : 'name',
			valueField : 'value',
			value:  this.task==null?5:this.task.get('statusId'),
			scope: this,
			allowBlank: false,
			msgTarget: 'side',
	    	//triggerAction : 'all',
	    	queryMode : 'local',
	    	columnWidth:0.5,
	    	margin: '2 2 2 2'
		},{
        	fieldLabel: 'Request date',
        	height: 30,
        	name: 'requestDate',
        	labelAlign: 'right',
        	id: 'requestDate',
        	format : 'd/m/Y h:i A',
            value : new Date(),
        	hideTrigger : true,
        	editable: false,
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
        	value: this.task==null?new Date():this.task.get('requestdate'),
        	xtype: 'datetimefield'

        },{
        	fieldLabel: 'Expected date',
        	name: 'targetDate',
        	labelAlign: 'right',
        	id: 'targetDate',
        	//format: 'd/m/Y',
        	 format : 'd/m/Y h:i A',
             value : new Date(),
             minValue: this.task==null?new Date():this.task.get('requestdate'),
          //   maxValue: '31/12/2016 05:30 PM',
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
        	value: this.task==null?new Date():Ext.Date.parse(this.task.get('targetdate'), "d/m/Y h:i A"),
        	xtype: 'datetimefield'

        },{
        	fieldLabel: 'Confirmed date',
        	name: 'confirmedDate',
        	labelAlign: 'right',
        	id: 'confirmedDate',
        	format : 'd/m/Y h:i A',
        	hideTrigger : true,
        	editable: false,
        	minValue: this.task==null?new Date():this.task.get('requestdate'),
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
	    	value: this.task==null?new Date():Ext.Date.parse(this.task.get('confirmedDate'), "d/m/Y h:i A"),
        	xtype: 'datetimefield'

        },{
        	fieldLabel: 'Schedule completed',

        	name: 'planDate',
        	labelAlign: 'right',
        	id: 'planDate',
        	format : 'd/m/Y h:i A',
        	 minValue: this.task==null?new Date():this.task.get('requestdate'),
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
	    	value: this.task==null?new Date():Ext.Date.parse(this.task.get('plandate'), "d/m/Y h:i A"),
        	xtype: 'datetimefield'

        },{
        	fieldLabel: 'Actual completed',
        	name: 'actualDate',
        	labelAlign: 'right',
        	hideTrigger : true,
        	height:30,
        	editable: false,
        	id: 'actualDate',
        	format : 'd/m/Y h:i A',
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
	    	value: this.task==null?null:this.task.get('actualdate'),
        	xtype: 'datetimefield'

        },{
			xtype:'combo',
			id : 'cbTaskAction',
			inputId: 'cboTaskAction',
			height: 30,
			store : this.taskActionStore,
			labelAlign: 'right',
			fieldLabel: 'Action',
			displayField : 'name',
			valueField : 'value',
			scope: this,
			value:  this.task==null?5:this.task.get('taskActionId'),
			//allowBlank: false,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	columnWidth:0.5,
	    	margin: '2 2 2 2'
		},{
	    	xtype:'textareafield',
	        fieldLabel: 'Resolution',
	        labelAlign: 'right',
	        id: 'resolution',
	        cls:'x-textareafield',
	        value:  this.task==null?'':this.task.get('resolution'),
	        anchor:'95%',
	        width: 560,
	        growMax: 100,
	        growMin: 100,
	        height:100,
	        colspan: 2,
	        margin: '2 2 2 2'
	    },{
	    	 xtype:'textfield',
	         id: 'email',
	         width: 560,
	         hidden: true,
	         value: this.task==null?'':this.task.get('email'),
	         fieldLabel: 'Email to',
	         labelAlign: 'right',
	         colspan: 2,
	         margin: '2 2 2 2'
	    }];
	      // alert(this.departmentJsonData);

		this.callParent(arguments);
		//Ext.getCmp("requestDate").triggerEl.hide()
		Ext.getCmp("cbStatus").on('select',function(combo,record,opts){
			if (this.task.get('requesterId') != userId){
				if (record[0].data.value == 3){
					alert('Only requester can hold on the task');
					Ext.getCmp("cbStatus").setValue(this.task.get('statusId'));
					return;
				}
				if (record[0].data.value == 4){
					alert('Only requester can close the task');
					Ext.getCmp("cbStatus").setValue(this.task.get('statusId'));
					return;
				}
			}
			if (record[0].data.value == 2){
				Ext.getCmp("actualDate").setValue(new Date());

			}
		},this);
		 if (this.taskId == null){

				Ext.getCmp("taskname").setReadOnly(false);
				Ext.getCmp("cbAssignee").setReadOnly(false);
				Ext.getCmp("desc").setReadOnly(false);
				Ext.getCmp("cbDepartment").setReadOnly(false);
				//Ext.getCmp("cbScope").setReadOnly(false);
				Ext.getCmp("cbPriority").setReadOnly(false);
				Ext.getCmp("cbStatus").setReadOnly(true);
				Ext.getCmp("requestDate").setReadOnly(false);
				Ext.getCmp("targetDate").setReadOnly(false);
				Ext.getCmp("planDate").setReadOnly(false);
				Ext.getCmp("actualDate").setReadOnly(true);
				Ext.getCmp("email").setReadOnly(false);
				Ext.getCmp("cbAssetCategory").setReadOnly(false);
				Ext.getCmp("cbAsset").setReadOnly(false);

		}else{

			Ext.getCmp("cbDepartment").setValue(this.task.get('departmentId'));
			Ext.getCmp("cbPriority").setValue(this.task.get('priorityId'));
			Ext.getCmp("cbStatus").setValue(this.task.get('statusId'));
			//Ext.getCmp("cbScope").setValue(this.task.get('scopeId'));
			Ext.getCmp("cbAssignee").setValue(this.task.get('assigneeId'));
			Ext.getCmp("cbAsset").setValue(this.task.get('assetCode'));
			//Ext.getCmp("cbAssetCategory").setValue(this.task.get('assetCategoryId'));
			Ext.getCmp("cbAsset").getStore().load({
					  params: {categoryId: Ext.getCmp("cbAssetCategory").getValue()},
					  scope: this,
					 callback: function(records, operation, success) {
				        if (success == true) {
				        	//Ext.getCmp("cbAsset").select(Ext.getCmp("cbAsset").getStore().getAt(0));
				        	Ext.getCmp("cbAsset").setValue(this.task.get('assetId'));
				        }
				    }
				})

			if (userId == this.task.get('requesterId')){
				if (this.task.get('statusId') == 1){
					Ext.getCmp("taskname").setReadOnly(false);
					Ext.getCmp("cbAssignee").setReadOnly(false);
					Ext.getCmp("desc").setReadOnly(false);
					Ext.getCmp("cbDepartment").setReadOnly(false);
				//	Ext.getCmp("cbScope").setReadOnly(false);
					Ext.getCmp("cbPriority").setReadOnly(false);
					Ext.getCmp("cbStatus").setReadOnly(false);
					Ext.getCmp("requestDate").setReadOnly(false);
					Ext.getCmp("targetDate").setReadOnly(false);
					Ext.getCmp("planDate").setReadOnly(false);
					Ext.getCmp("actualDate").setReadOnly(true);
					Ext.getCmp("cbAssetCategory").setReadOnly(false);
					Ext.getCmp("cbAsset").setReadOnly(false);

				}else{
					Ext.getCmp("taskname").setReadOnly(true);
					Ext.getCmp("cbAssignee").setReadOnly(true);
					Ext.getCmp("desc").setReadOnly(true);
					Ext.getCmp("cbDepartment").setReadOnly(true);
				//	Ext.getCmp("cbScope").setReadOnly(true);
					Ext.getCmp("cbAssetCategory").setReadOnly(true);
					Ext.getCmp("cbAsset").setReadOnly(true);
					Ext.getCmp("cbPriority").setReadOnly(true);
					Ext.getCmp("cbStatus").setReadOnly(false);
					Ext.getCmp("requestDate").setReadOnly(false);
					Ext.getCmp("targetDate").setReadOnly(true);
					Ext.getCmp("planDate").setReadOnly(true);
					Ext.getCmp("actualDate").setReadOnly(true);

				}
			}else{
				Ext.getCmp("taskname").setReadOnly(true);
				Ext.getCmp("cbAssignee").setReadOnly(true);
				Ext.getCmp("desc").setReadOnly(true);
				Ext.getCmp("cbDepartment").setReadOnly(true);
			//	Ext.getCmp("cbScope").setReadOnly(true);
				Ext.getCmp("cbPriority").setReadOnly(true);
				Ext.getCmp("cbAssetCategory").setReadOnly(true);
				Ext.getCmp("cbAsset").setReadOnly(true);
				Ext.getCmp("cbStatus").setReadOnly(false);
				Ext.getCmp("requestDate").setReadOnly(false);
				Ext.getCmp("targetDate").setReadOnly(true);
				Ext.getCmp("planDate").setReadOnly(false);
				Ext.getCmp("actualDate").setReadOnly(true);
				Ext.getCmp("email").setReadOnly(true);
			}



		}
		 Ext.getCmp("actualDate").setReadOnly(true);
		 Ext.getCmp("confirmedDate").setReadOnly(true);
		 Ext.getCmp("requestDate").setReadOnly(true);
	},
	onRender: function(){
		this.callParent(arguments);
	},
	onShow: function(){
		this.callParent(arguments);
	      // alert(this.departmentJsonData);
		 if (this.taskId == null){
			 Ext.getCmp("cbStatus").disable();
		}else{
			Ext.getCmp("cbStatus").enable();
//			alert(this.task.get('taskname'));
//			Ext.getCmp("taskname").setValue(this.task.get('taskname'));
//			Ext.getCmp("cbDepartment").setValue(2);
//			Ext.getCmp("cbPriority").setValue(2);
//			Ext.getCmp("cbStatus").setValue(2);

		}
},
	onSave: function() {
		if (Ext.getCmp("cbDepartment").getRawValue() == ''){
			alert('Please select department');
			return;
		}
		Ext.getBody().mask('Processing data...');
		new Ext.data.Connection().request({
			method : 'POST',
			url : this.saveUrl,
			scope: this,
			params : {
				requesterId : this.requesterId,
				requesterName: this.requester,
				taskId: this.taskId,
				assigneeId:  Ext.getCmp("cbAssignee").getValue(),
				assigneeEmail: Ext.getCmp("cbAssignee").getRawValue(),
				scopeId: 1,//Ext.getCmp("cbScope").getValue(),
				departmentId: Ext.getCmp("cbDepartment").getValue(),
				taskname:  Ext.getCmp("taskname").getValue(),
				desc:  Ext.getCmp("desc").getValue(),
				priorityId:  Ext.getCmp("cbPriority").getValue(),
				statusId:  Ext.getCmp("cbStatus").getValue(),
				requestDate:  Ext.getCmp("requestDate").getRawValue(),
				targetDate:  Ext.getCmp("targetDate").getRawValue(),
				planDate:  Ext.getCmp("planDate").getRawValue(),
				actualDate: Ext.getCmp("actualDate").getRawValue(),
				email:  Ext.getCmp("email").getValue(),
				assetId : Ext.getCmp("cbAsset").getValue(),
				assetCategoryId : Ext.getCmp("cbAssetCategory").getValue(),
				taskActionId: Ext.getCmp("cbTaskAction").getValue(),
				requestTypeId :  Ext.getCmp("cbRequestType").getValue(),
				resolution : Ext.getCmp("resolution").getValue(),
			},
			scriptTag : true,
			success : function(response) {
				//alert('Delete success !!');
				var rs = Ext.decode(response.responseText);
				Ext.getBody().unmask();
				if (rs.success == true){
					//Ext.getCmp('lastedTestGrid').getStore().remove(selectedTest[0]);
					this.close();
					this.reloadFn();
				}else{
					Ext.Msg.show({
					title : 'INFORMATION',
					msg : 'Save failed !!',
					minWidth : 200,
					modal : true,
					icon : Ext.Msg.INFO,
					buttons : Ext.Msg.OK
				});
				}
			},
			failure : function(response) {
				Ext.getBody().unmask();
				Ext.Msg.show({
					title : 'INFORMATION',
					msg : 'Save fail !!',
					minWidth : 200,
					modal : true,
					icon : Ext.Msg.INFO,
					buttons : Ext.Msg.OK
				});
			}
		});
	},
	onSelectDepartment: function(){
		//console.log(Ext.getCmp("cbDepartment").getValue());
	},
	onClose: function(){
		this.reloadFn();
		this.close();
//		Ext.getCmp("cbPriority").setValue(2);
//		Ext.getCmp("cbStatus").setValue(2);
	}

});
