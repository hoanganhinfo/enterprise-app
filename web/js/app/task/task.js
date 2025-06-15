/**
 * Task tracking
 *
 * @author anhph
 * @copyright (c) 2013, by anhphan
 * @date 25 June 2012
 * @version $Id$
 *
 */
var GET_TASK_LIST = '';
var GET_PERSONAL_TASK_LIST='/enterprise-app/service/getPersonalTask';
var GET_ASSIGNED_TASK_LIST='/enterprise-app/service/getAssignedTask';
var SAVE_TASK_URL='/enterprise-app/service/saveTask';
var DELETE_TASK_URL='/enterprise-app/service/deleteTask';
var EXPORT_TASK_LIST_URL='/enterprise-app/service/exportTaskToExcel';
var UPLOAD_PHOTO_URL='/enterprise-app/service/upload';
var PHOTO_LIST_URL = '/enterprise-app/service/getAttachmentFiles';
var DOWNLOAD_PHOTO_URL = '/enterprise-app/service/downloadPhoto';
var DELETE_PHOTO_URL = '/enterprise-app/service/deletePhoto';
var GET_ASSET_CATEGORY_LIST='/enterprise-app/service/getAssetCategoryList';
var GET_ASSET_LIST='/enterprise-app/service/getAsset';
var selectedTaskId = '';
var selectedTask;
var assignedTaskDS = new Ext.data.JsonStore({
	autoLoad : true,
	model:'EAP.Model.Task',
	proxy: {
        type: 'ajax',
        extraParams :{userId:userId,myOrgs: myOrgs,repositoryId:repositoryId,taskImageFolderId:taskImageFolderId,statusId: 1},
        url: GET_ASSIGNED_TASK_LIST,
        reader: {
            type: 'json',
            root: 'taskList',
            idProperty: 'id'
        }
    }
});

var personalTaskDS = new Ext.data.JsonStore({
	autoLoad : true,
	model:'EAP.Model.Task',
	proxy: {
        type: 'ajax',
        extraParams :{userId: userId,repositoryId:repositoryId,taskImageFolderId:taskImageFolderId,statusId: 1},
        url: GET_PERSONAL_TASK_LIST,
        reader: {
            type: 'json',
            root: 'taskList',
            idProperty: 'id'
        }
    }
});
var attachmentFileDS = new Ext.data.JsonStore({
	autoLoad : true,
	model:'EAP.Model.Attachment',
	id:'attachmentFileDS',
	proxy: {
        type: 'ajax',
        extraParams :{fileUrl:fileUrl,userId:userId,repositoryId:repositoryId,taskImageFolderId:taskImageFolderId},
        url: PHOTO_LIST_URL,
        reader: {
            type: 'json',
            root: 'fileList',
            idProperty: 'id'
        }
    }
});
var userStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'userId'},
        {type: 'string', name: 'userName'},
        {type: 'string', name: 'userEmail'},
        {type: 'string', name: 'department'}
    ]
});
userStore.loadData(Ext.decode(usersJsonData));
userStore.sort('userEmail', 'ASC');
var departmentStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'orgId'},
        {type: 'string', name: 'orgName'}
    ]
});
var departmentAllStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'orgId'},
        {type: 'string', name: 'orgName'}
    ]
});
departmentStore.loadData(Ext.decode(departmentJsonData));
departmentAllStore.loadData(Ext.decode(departmentJsonData));
var priorityStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
var scopeStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
scopeStore.loadData(Ext.decode(scopeJsonData));

var priorityAllStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
priorityStore.loadData(Ext.decode(priorityJsonData));
priorityAllStore.loadData(Ext.decode(priorityJsonData));
var statusStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
var statusAllStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});

statusStore.loadData(Ext.decode(statusJsonData));
statusAllStore.loadData(Ext.decode(statusJsonData));
var taskActionStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
var taskActionAllStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
var locationStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'id'},
        {type: 'string', name: 'locationCode'}
    ]
});
var taskRequestTypeStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
locationStore.loadData(Ext.decode(locationData));

taskActionStore.loadData(Ext.decode(taskActionJsonData));
taskActionAllStore.loadData(Ext.decode(taskActionJsonData));
taskRequestTypeStore.loadData(Ext.decode(taskRequestTypeJsonData));
departmentStore.removeAt(0);
statusStore.removeAt(0);
priorityStore.removeAt(0);
taskActionStore.removeAt(0);
var assetCategoryStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: false,
	model: 'EAP.Model.AssetCategory',
	proxy: {
        type: 'ajax',
        //extraParams :{departmentId: '1'},
        api: {
            read: GET_ASSET_CATEGORY_LIST
        },
        reader: {
            type: 'json',
            root: 'AssetCategoryList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssetCategoryList'
        },
        listeners: {
            exception: function(proxy, response, operation){
            Ext.MessageBox.show({
	                title: 'REMOTE EXCEPTION',
	                msg: operation.getError(),
	                icon: Ext.MessageBox.ERROR,
	                buttons: Ext.Msg.OK
            	});
        	}
        }

    }
});

var assetStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.Asset',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_ASSET_LIST
        },
        reader: {
            type: 'json',
            root: 'AssetList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssetList'
        },
        listeners: {
            exception: function(proxy, response, operation){
            Ext.MessageBox.show({
	                title: 'REMOTE EXCEPTION',
	                msg: operation.getError(),
	                icon: Ext.MessageBox.ERROR,
	                buttons: Ext.Msg.OK
            	});
        	}
        }

    }
});
Ext.onReady(function() {

	Ext.tip.QuickTipManager.init();
	// turn on validation errors beside the field globally
	Ext.form.Labelable.msgTarget = 'side';
	/*
	var assignedTaskList = Ext.create('EAP.Grid.AssignedTaskGrid', {
		store: assignedTaskDS,
	    id: 'assignedTaskList',
	    stateful: true,
	//    height: '100%',
	    columnLines: true,
	    stateId: 'stateGrid',
	    departmentStore: departmentStore,
		priorityStore : priorityStore,
		statusStore : statusStore,
		scopeStore: scopeStore,
		userStore: userStore,
		assetCategoryStore: assetCategoryStore,
		assetStore:assetStore,
		taskActionStore: taskActionStore,
		locationStore: locationStore,
		taskRequestTypeStore: taskRequestTypeStore

	});

	var personalTaskGrid = Ext.create('EAP.Grid.PersonalTaskGrid', {
			//width: 350,
	        store: personalTaskDS,
		    id: 'personalTaskGrid',
		    stateful: true,
		    height: 400,
		    stateId: 'stateGrid',
		    departmentStore: departmentStore,
			priorityStore : priorityStore,
			statusStore : statusStore,
			scopeStore: scopeStore,
			userStore: userStore,
			assetCategoryStore: assetCategoryStore,
			assetCategoryStore: assetCategoryStore,
			assetStore:assetStore,
			taskActionStore: taskActionStore,
			locationStore: locationStore,
			taskRequestTypeStore: taskRequestTypeStore
		});
*/
	var filterForm = Ext.create('EAP.Form.TaskFilterForm', {
	    id: 'taskFilterForm',
	    stateful: true,
	    region: 'north',
	    title: 'Filter by',
	    titleCollapse: true,

        collapsible: true,
	    stateId: 'stateGrid',
	    exportUrl: EXPORT_TASK_LIST_URL,
	    departmentStore: departmentAllStore,
     	priorityStore : priorityAllStore,
		statusStore : statusAllStore,
		assignedTaskDS: assignedTaskDS,
		personalTaskDS: personalTaskDS,
		assetCategoryStore: assetCategoryStore,
		//renderTo: 'taskFilterPanel'

	});
	/*
	var taskTab = Ext.create('Ext.tab.Panel', {
    	id: 'mainFrm',
        //bodyPadding: 5,  // Don't want content to crunch against the borders
        height: '100%',
       // width: '100%',
	    region: 'center',
        items: [assignedTaskList],
        dockedItems : [],

    });*/
	var taskTab = Ext.create('Ext.tab.Panel', {
		id : 'bottomTab',
		//width : '300',
		//height: '300',
		region: 'center',
		items : [{
        	xtype: 'assignedTaskGrid',
            store: assignedTaskDS,
    	    id: 'assignedTaskList',
    	    title:'Task',
    	    stateful: true,
    	   // height: 300,
    	    columnLines: true,
    	    stateId: 'stateGrid',
		    departmentStore: departmentStore,
			priorityStore : priorityStore,
			statusStore : statusStore,
			scopeStore: scopeStore,
			userStore: userStore,
			assetCategoryStore: assetCategoryStore,
			assetCategoryStore: assetCategoryStore,
			assetStore:assetStore,
			taskActionStore: taskActionStore,
			locationStore: locationStore,
			taskRequestTypeStore: taskRequestTypeStore
        }],
        dockedItems : [ {
			xtype : 'toolbar',
			items : [ {
				iconCls: 'icon-add',
				 scale : 'medium',
				text : 'New task',
				scope : this,
				handler : function(){
					var dlg = Ext.create('EAP.Window.Task', {
						 title: 'Add new task',
						 requesterId: userId,
						 requester: userName,
						 departmentStore: departmentStore,
						 userStore: userStore,
						 scopeStore: scopeStore,
						 priorityStore : priorityStore,
						 statusStore : statusStore,
						 taskActionStore: taskActionStore,
						 assetCategoryStore: assetCategoryStore,
						 assetStore: assetStore,
						 locationStore: locationStore,
						 taskRequestTypeStore: taskRequestTypeStore,
						 saveUrl: SAVE_TASK_URL,
						 reloadFn: function (){
								assignedTaskDS.load({scope : this, params :  {
									userId: userId,
									userEmail: userEmail,
									myOrgs: myOrgs,
									departmentId: Ext.getCmp('cbDepartment1').getValue(),
									priorityId: Ext.getCmp('cbPriority1').getValue(),
									statusId: Ext.getCmp('cbStatus1').getValue(),
									requestDateFrom: Ext.getCmp('requestDateFrom').getRawValue(),
									requestDateTo: Ext.getCmp('requestDateTo').getRawValue()}});
								/*
								personalTaskDS.load({scope   : this, params :  {
									userId: userId,
									departmentId: Ext.getCmp('cbDepartment1').getValue(),
									priorityId: Ext.getCmp('cbPriority1').getValue(),
									statusId: Ext.getCmp('cbStatus1').getValue(),
									requestDateFrom: Ext.getCmp('requestDateFrom').getRawValue(),
									requestDateTo: Ext.getCmp('requestDateTo').getRawValue()}});*/

						 }
						});
					dlg.show();
				}
			}, {
				iconCls : 'icon-delete',
				 scale : 'medium',
				text : 'Delete',
				disabled : true,
				itemId : 'deleteTask',
				id: 'deleteTask',
				scope : this,
				handler : function(){
					if (selectedTask.get('requesterId') != userId){
						alert('Only requester can delete task');
						return;
					}else{
						if (selectedTask.get('statusId') != 1){
							alert('Only open task can be deleted task');
							return;
						}

						Ext.Msg.show({
							title : 'Task deletion',
							msg : 'Are you sure to delete this task',
							icon : Ext.Msg.QUESTION,
							buttons : Ext.Msg.YESNO,
							fn : function(buttonId) {
								if (buttonId != 'yes')
									return;
								new Ext.data.Connection().request({
									method : 'POST',
									url : DELETE_TASK_URL,
									params : {
										taskId: selectedTaskId,
										repositoryId:repositoryId,
										taskImageFolderId:taskImageFolderId
									},
									scriptTag : true,
									success : function(response) {
										//alert('Delete success !!');
										var rs = Ext.decode(response.responseText);
										if (rs.success == true){
											assignedTaskDS.load({scope : this, params :  {
												userId: userId,
												userEmail: userEmail,
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

										}else{
											Ext.Msg.show({
											title : 'INFORMATION',
											msg : 'Delete failed !!',
											minWidth : 200,
											modal : true,
											icon : Ext.Msg.INFO,
											buttons : Ext.Msg.OK
										});
										}
									},
									failure : function(response) {
										Ext.Msg.show({
											title : 'INFORMATION',
											msg : 'Delete fail !!',
											minWidth : 200,
											modal : true,
											icon : Ext.Msg.INFO,
											buttons : Ext.Msg.OK
										});
									}
								});

							},
							icon : Ext.MessageBox.QUESTION
						});

					}
				}
			}, {
				text : 'Attachment files',
				disabled : true,
				iconCls : 'icon-attachment-file',
				 scale : 'medium',
				itemId : 'attachedImage',
				id: 'attachedImage',
				scope : this,
				handler : function(){
					var dlg = Ext.create('EAP.Window.AttachmentDialog', {
						 requesterId: userId,
						 requester: userName,
						 taskId: selectedTaskId,
						 task: selectedTask,
						 uploadUrl: UPLOAD_PHOTO_URL,
						 attachmentFileDS: attachmentFileDS
						});
					dlg.show();
				}
			}  ]
		} ]

	});
	Ext.create('Ext.panel.Panel', {
    	id: 'mainFrm',
    	height: 700,
        width: '100%',
        layout: {
            type: 'border'
        },
    	items: [filterForm, taskTab],
        renderTo: 'mainPanel'

    });
});