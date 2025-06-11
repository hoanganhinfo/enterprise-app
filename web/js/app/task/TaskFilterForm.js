Ext.define('EAP.Form.TaskFilterForm',{
	extend: 'Ext.form.Panel',
	border : true,
	bodyBorder : true,
	exportUrl: '',
	layout: {
	      type: 'table',
	      columns: 5,
	      tableAttrs: {
	         style: {
	            width: '100%'
	         }
	      }
	   },
	   defaults: {
	     // bodyStyle: 'padding:10px'
	   },
	departmentStore: null,
    statusStore: null,
    priorityStore: null,
    assignedTaskDS: null,
	personalTaskDS: null,
	initComponent: function(){
    	this.bbar = ['->',
    	             { xtype: 'button', scope: this, text: 'View',handler: this.onView},
    	             { xtype: 'button', scope: this,text: 'Export to excel',handler: this.onExport}
    	           ];		
		this.items = [{
	    	 xtype:'combo',
		    	id : 'cbDepartment1',
		    	inputId: 'cboDepartment1',
		    	store : this.departmentStore,
		    	labelAlign: 'right',
		        fieldLabel: 'Department',	      
		    	displayField : 'orgName',
		    	valueField : 'orgId',
		    	editable: false,
		    	width: 250,
		    	value: -1,
		    	allowBlank: false,
		    	msgTarget: 'side',
		    	// hideTrigger:true,
		    	triggerAction : 'all',
		    	queryMode : 'local',
		    	margin: '4 4 4 4'
		    },{
	    	xtype:'combo',
		    id : 'cbPriority1',
		    inputId: 'cboPriority1',
		    store : this.priorityStore,
		    labelAlign: 'right',
		    fieldLabel: 'Priority',	      
		    displayField : 'name',
		    valueField : 'value',
		    value: 0,
		    width: 200,
		    allowBlank: false,
		    msgTarget: 'side',
		    // hideTrigger:true,
		    triggerAction : 'all',
		    queryMode : 'local',
		    margin: '4 4 4 4'
		},{
			xtype:'combo',
			id : 'cbStatus1',
			inputId: 'cboStatus1',
			store : this.statusStore,
			labelAlign: 'right',
			fieldLabel: 'Status',	      
			displayField : 'name',
			valueField : 'value',
			value: 1,
			width: 200,
			allowBlank: false,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '4 4 4 4'
		},{
        	fieldLabel: 'Request date from',
        	name: 'requestDateFrom',
        	labelAlign: 'right',
        	id: 'requestDateFrom',
        	format: 'd/m/Y',
        	width: 200,
	    	margin: '4 4 4 4',
        	xtype: 'datefield'
        	
        },{
        	fieldLabel: 'Request date to',
        	name: 'requestDateTo',
        	labelAlign: 'right',
        	id: 'requestDateTo',
        	format: 'd/m/Y',
        	width: 200,
	    	margin: '4 4 4 4',
        	xtype: 'datefield'
        	
        }],
		this.callParent(arguments);
	},
	onRender: function(){

		this.callParent(arguments);
	},
	onView: function(){
		this.assignedTaskDS.load({scope : this, params :  {
			userId: userId,
			userEmail: userEmail,
			myOrgs: myOrgs,
			departmentId: Ext.getCmp('cbDepartment1').getValue(),
			priorityId: Ext.getCmp('cbPriority1').getValue(),
			statusId: Ext.getCmp('cbStatus1').getValue(),
			requestDateFrom: Ext.getCmp('requestDateFrom').getRawValue(),
			requestDateTo: Ext.getCmp('requestDateTo').getRawValue()}});
		this.personalTaskDS.load({scope   : this, params :  {
			userId: userId,
			departmentId: Ext.getCmp('cbDepartment1').getValue(),
			priorityId: Ext.getCmp('cbPriority1').getValue(),
			statusId: Ext.getCmp('cbStatus1').getValue(),
			requestDateFrom: Ext.getCmp('requestDateFrom').getRawValue(),
			requestDateTo: Ext.getCmp('requestDateTo').getRawValue()}});		
    	
	},
	onExport: function(){
		this.getForm().doAction('standardsubmit',{
			   url: this.exportUrl,
			   params: {
					myOrgs: myOrgs,
					userId: userId,		
					departmentId: Ext.getCmp('cbDepartment1').getValue(),  
					priorityId: Ext.getCmp('cbPriority1').getValue(),
					statusId: Ext.getCmp('cbStatus1').getValue(),
					requestDateFrom: Ext.getCmp('requestDateFrom').getRawValue(),
					requestDateTo: Ext.getCmp('requestDateTo').getRawValue()  
			   },
			   standardSubmit: true,
			   timeout: 100000,
			   method: 'POST'
			});
	}
	
});
