Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.define('EAP.Grid.PersonalTaskGrid', {
	extend : 'Ext.grid.Panel',
	title : 'Personal task',
	autoScroll: true,
	viewConfig : {
		emptyText : 'There are no tasks to display',
		deferEmptyText : false
	},
	departmentStore : null,
    statusStore: null,
    priorityStore: null,
    scopeStore: null,
    userStore: null,
    locationStore: null,
    taskActionStore: null,
    taskRequestTypeStore: null,
	initComponent : function() {
		Ext.apply(this, {
//			frame : true,
			forceFit: true,
			columns : [ {header : 'Task code',sortable : true,dataIndex : 'id',width:100},
			            {header : 'Task name',sortable : true,dataIndex : 'taskname',width:500},
			            {header : '',sortable : false,resizable:false,width:50,renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				        	   if (record.data.hasAttachmentFile == true){
				        		   return '<img src="/enterprise-app/images/app/attachment.png" />';
				        	   }else{
				        		   return '';
				        	   }
				           }},
			            {header : 'To department',flex : 1,sortable : true,dataIndex : 'department',width:160},
			            {header : 'Assignee',flex : 1,sortable : true,dataIndex : 'assigneeEmail',width:100},
			            {header : 'Request date',flex : 1,sortable : true,dataIndex : 'requestdate',width:120},
			            {header : 'Target date',flex : 1,sortable : true,dataIndex : 'targetdate',width:120},
			            {header : 'Confirm date',flex : 1,sortable : true,dataIndex : 'plandate',width:120},
			            {header : 'Actual date',flex : 1,sortable : true,dataIndex : 'actualdate',width:120},
			            {header : 'Priority',flex : 1,sortable : true,dataIndex : 'priority',width:100},
			            {header : 'Status',flex : 1,sortable : true,dataIndex : 'status',width:100}]
		});
		this.callParent(arguments);
		var loadMask = new Ext.LoadMask(this, {
            store: this.store
        });

		this.getSelectionModel().on('selectionchange', this.onSelectChange, this);

	},
	listeners : {
		select: function( dv, record, index, eOpts ){
			selectedTaskId = record.get('id');
			selectedTask = record;
		},
	    itemdblclick: function(dv, record, item, index, e) {
	        var dlg = Ext.create('EAP.Window.Task', {
				 title: 'View task',
				 requesterId:  record.get('requesterId'),
				 requester: record.get('requester'),
				 taskId: record.get('id'),
				 task : record,
				 departmentId: record.get('department'),
				 departmentStore: this.departmentStore,
				 priorityStore : this.priorityStore,
				 statusStore : this.statusStore,
				 scopeStore: this.scopeStore,
				 userStore: this.userStore,
				 assetCategoryStore: this.assetCategoryStore,
				locationStore: locationStore,
				taskRequestTypeStore: taskRequestTypeStore,
				 saveUrl: SAVE_TASK_URL,
				 reloadFn: function (){
					 assignedTaskDS.load({scope : this, params :  {
							myOrgs: myOrgs,
							departmentId: Ext.getCmp('cbDepartment1').getValue(),
							priorityId: Ext.getCmp('cbPriority1').getValue(),
							statusId: Ext.getCmp('cbStatus1').getValue(),
							requestDateFrom: Ext.getCmp('requestDateFrom').getRawValue(),
							requestDateTo: Ext.getCmp('requestDateTo').getRawValue()}});
						personalTaskDS.load({scope   : this, params :  {
							userId: userId,
							departmentId: Ext.getCmp('cbDepartment1').getValue(),
							priorityId: Ext.getCmp('cbPriority1').getValue(),
							statusId: Ext.getCmp('cbStatus1').getValue(),
							requestDateFrom: Ext.getCmp('requestDateFrom').getRawValue(),
							requestDateTo: Ext.getCmp('requestDateTo').getRawValue()}});
				 }
				});
			dlg.show();
	    }
	},

	onSelectChange : function(selModel, selections) {
		 Ext.getCmp('delete').setDisabled(selections.length === 0);
		 Ext.getCmp('attachedImage').setDisabled(selections.length === 0);

	}
});