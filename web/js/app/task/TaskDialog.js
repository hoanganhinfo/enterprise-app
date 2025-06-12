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
     			 select: function(combo, records,opt) {}
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
		    	labelAlign: 'right',
		        fieldLabel: 'Assignee',
		    	displayField : 'userEmail',
		    	valueField : 'userId',
		    	store: this.userStore,
		    	colspan: 1,
		    //	value: -1,
		    	editable: false,
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
			store : this.taskRequestTypeStore,
			labelAlign: 'right',
			fieldLabel: 'Request type',
			displayField : 'name',
			valueField : 'value',
			value: 5,
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
	         width: 560,
	         colspan: 2,
	         margin: '2 2 2 2'
	    },{
	    	xtype:'htmleditor',
	        fieldLabel: 'Description',
	        labelAlign: 'right',
	        id: 'desc',
	        value:  this.task==null?'':this.task.get('description'),
	        anchor:'95%',
	        width: 560,
	        height:200,
	        colspan: 2,
	        margin: '2 2 2 2'
	    },{
	    	xtype:'combo',
		    id : 'cbPriority',
		    inputId: 'cboPriority',
		    store : this.priorityStore,
		    labelAlign: 'right',
		    fieldLabel: 'Priority',
		    displayField : 'name',
		    valueField : 'value',
		    value: 2,
		    allowBlank: false,
		    msgTarget: 'side',
		    // hideTrigger:true,
		    triggerAction : 'all',
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
			displayField : 'name',
			valueField : 'value',
			value: 1,
			scope: this,
			allowBlank: false,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	columnWidth:0.5,
	    	margin: '2 2 2 2'
		},{
        	fieldLabel: 'Request date',
        	name: 'requestDate',
        	labelAlign: 'right',
        	id: 'requestDate',
        	format: 'd/m/Y',
        	editable: false,
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
        	value: this.task==null?new Date():this.task.get('requestdate'),
        	xtype: 'datefield'

        },{
        	fieldLabel: 'Target date',
        	name: 'targetDate',
        	labelAlign: 'right',
        	id: 'targetDate',
        	//format: 'd/m/Y',
        	 format : 'd/m/Y h:i A',
             value : new Date(),
            // minValue: '01/12/2015 04:00 PM',
          //   maxValue: '31/12/2016 05:30 PM',
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
        	value: this.task==null?new Date():this.task.get('targetdate'),
        	xtype: 'datetimefield'

        },{
        	fieldLabel: 'Confirmed date',
        	name: 'confirmedDate',
        	labelAlign: 'right',
        	id: 'confirmedDate',
        	format: 'd/m/Y',
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
	    	value: this.task==null?null:this.task.get('confirmedDate'),
        	xtype: 'datefield'

        },{
        	fieldLabel: 'Schedule completed',
        	name: 'planDate',
        	labelAlign: 'right',
        	id: 'planDate',
        	format: 'd/m/Y',
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
	    	value: this.task==null?null:this.task.get('plandate'),
        	xtype: 'datefield'

        },{
        	fieldLabel: 'Actual completed',
        	name: 'actualDate',
        	labelAlign: 'right',
        	id: 'actualDate',
        	format: 'd/m/Y',
        	columnWidth:0.5,
	    	margin: '2 2 2 2',
	    	value: this.task==null?null:this.task.get('actualdate'),
        	xtype: 'datefield'

        },{
			xtype:'combo',
			id : 'cbTaskAction',
			inputId: 'cboTaskAction',
			store : this.taskActionStore,
			labelAlign: 'right',
			fieldLabel: 'Action',
			displayField : 'name',
			valueField : 'value',
			scope: this,
			//allowBlank: false,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	columnWidth:0.5,
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
					Ext.getCmp("requestDate").setReadOnly(true);
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
				Ext.getCmp("requestDate").setReadOnly(true);
				Ext.getCmp("targetDate").setReadOnly(true);
				Ext.getCmp("planDate").setReadOnly(false);
				Ext.getCmp("actualDate").setReadOnly(true);
				Ext.getCmp("email").setReadOnly(true);
			}



		}

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
