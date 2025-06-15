Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.define('EAP.Grid.AssignedTaskGrid', {
	extend : 'Ext.grid.Panel',
	 alias: 'widget.assignedTaskGrid',
	title : 'Department task',
	viewConfig : {
		emptyText : 'There are no tasks to display',
		deferEmptyText : false,
		stripeRows: true,
		forcefit:true
	},
	departmentStore : null,
	autoHeight: true,
    statusStore: null,
    taskActionStore: null,
    priorityStore: null,
    scopeStore: null,
    userStore: null,
    assetCategoryStore: null,
    locationStore: null,
    taskRequestTypeStore: null,
	initComponent : function() {

		Ext.apply(this, {
			columns : [ {header : 'Task code',sortable : true,dataIndex : 'id',width:70},
			            {header : 'Task name',sortable : true,dataIndex : 'taskname',width:200},
			            /*
			            {header : '',sortable : false,resizable:false,width:40,renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				        	   if (record.data.hasAttachmentFile == true){
				        		   return '<img src="/enterprise-app/images/app/attachment.png" />';
				        	   }else{
				        		   return '';
				        	   }
				           }},
				           */
			            {header : 'To department',sortable : true,dataIndex : 'department',width:100},
			            {header : 'Asset code',sortable : true,dataIndex : 'assetCode',width:120},
			            {header : 'Asset name',sortable : true,dataIndex : 'assetName',width:150},
			            {header : 'Assignee',sortable : true,dataIndex : 'assigneeEmail',width:100},
			            {header : 'Request date',sortable : true,dataIndex : 'requestdate',width:90},
			            {header : 'Expected date',sortable : true,dataIndex : 'targetdate',width:90},
			            {header : 'Confirm date',sortable : true,dataIndex : 'confirmedDate',width:90},
			            {header : 'Schedule date',sortable : true,dataIndex : 'plandate',width:90},
			            {header : 'Actual date',sortable : true,dataIndex : 'actualdate',width:90},
			            {header : 'Requested by',sortable : true,dataIndex : 'requester',width:90},
			            {header : 'Request type',sortable : true,dataIndex : 'requestType',width:90},
			            {header : 'Priority',sortable : true,dataIndex : 'priority',width:60},
			            {header : 'Status',sortable : true,dataIndex : 'status',width:60},
			            {header : 'Action',sortable : true,dataIndex : 'taskAction',width:60}]
		});
		this.callParent(arguments);
		var loadMask = new Ext.LoadMask(this, {
            store: this.store
        });

		this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
	},
	onRender: function(){
		this.callParent(arguments);
	},
	listeners : {
		select: function( dv, record, index, eOpts ){
			selectedTaskId = record.get('id');
			selectedTask = record;
		},
	    itemdblclick: function(dv, record, item, index, e) {
	    	console.log(this.assetCategoryStore);
	    	console.log(this.taskActionStore);
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
				 taskActionStore: this.taskActionStore,
				 userStore: this.userStore,
				 scopeStore: this.scopeStore,
				 assetCategoryStore: this.assetCategoryStore,
				 assetStore:this.assetStore,
				locationStore: this.locationStore,
				taskRequestTypeStore: this.taskRequestTypeStore,
				 saveUrl: SAVE_TASK_URL,
				 reloadFn: function (){
					 assignedTaskDS.load();
					// personalTaskDS.load();
				 }
				});
			dlg.show();
	    }
	},
	onSelectChange : function(selModel, selections) {
		 Ext.getCmp('deleteTask').setDisabled(selections.length === 0);
		 //Ext.getCmp('attachedImage').setDisabled(selections.length === 0);

	}
});