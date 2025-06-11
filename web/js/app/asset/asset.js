/**
 * Asset list
 *
 * @author anhph
 * @copyright (c) 2013, by Anhphan
 * @date 12 September 2013
 * @version $Id$
 *
 */
var GET_ASSET_CATEGORY_LIST='/enterprise-app/service/getAssetCategoryList';
var SAVE_ASSET_CATEGORY_URL = '/enterprise-app/service/saveAssetCategory';
var DELETE_ASSET_CATEGORY_URL = '/enterprise-app/service/deleteAssetCategory';
var GET_ASSET_LIST='/enterprise-app/service/getAsset';

var GET_ASSET_LOCATION_LIST='/enterprise-app/service/getAssetLocationList';
var SAVE_ASSET_LOCATION_URL = '/enterprise-app/service/saveAssetLocation';
var DELETE_ASSET_LOCATION_URL = '/enterprise-app/service/deleteAssetLocation';

var SAVE_ASSET_URL = '/enterprise-app/service/saveAsset';
var DELETE_ASSET_URL = '/enterprise-app/service/deleteAsset';

var GET_ASSET_HISTORY_LIST='/enterprise-app/service/getAssetHistoryList';
var SAVE_ASSET_HISTORY_LIST='/enterprise-app/service/saveAssetHistoryList';
var DELETE_ASSET_HISTORY_LIST='/enterprise-app/service/deleteAssetHistoryList';
var UPDATE_ASSET_HISTORY_ACTION='/enterprise-app/service/updateAssetHistoryAction';
var GET_ASSET_TREE_LIST='/enterprise-app/service/getAssetTree';

var GET_ASSET_PERMISSION_LIST='/enterprise-app/service/getAssetPermissionList';
var SAVE_ASSET_PERMISSION_URL = '/enterprise-app/service/saveAssetPermission';
var DELETE_ASSET_PERMISSION_URL = '/enterprise-app/service/deleteAssetPermission';

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

var assetGrid;
var newAssetNode;
var selectedCategoryId;
var activeDepartment = null;
var activeAssetCategory = null;
var activeAsset = null;
var activeAssetId = null;
var assetButtonView;
var categoryList = null;
var activeViewMode = 'Grid';
var assetCategoryStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.AssetCategory',
	proxy: {
        type: 'ajax',
        //extraParams :{departmentId: '1'},
        api: {
            read: GET_ASSET_CATEGORY_LIST,
            create: SAVE_ASSET_CATEGORY_URL,
            update: SAVE_ASSET_CATEGORY_URL,
            destroy: DELETE_ASSET_CATEGORY_URL
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

    },
    listeners: {
        write: function(proxy, operation){
    	if (operation.action == 'create'){
    		this.autoSync = false;
    		message = operation.resultSet.message;
    		var newRec = this.getAt(0);
    		newRec.set('id', message);
    		this.autoSync = true;
    	}
        }
    }
});
var assetLocationStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.AssetLocation',
	proxy: {
        type: 'ajax',
        //extraParams :{departmentId: '1'},
        api: {
            read: GET_ASSET_LOCATION_LIST,
            create: SAVE_ASSET_LOCATION_URL,
            update: SAVE_ASSET_LOCATION_URL,
            destroy: DELETE_ASSET_LOCATION_URL
        },
        reader: {
            type: 'json',
            root: 'AssetLocationList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssetLocationList'
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

    },
    listeners: {
        write: function(proxy, operation){
    	if (operation.action == 'create'){
    		this.autoSync = false;
    		message = operation.resultSet.message;
    		var newRec = this.getAt(0);
    		newRec.set('id', message);
    		this.autoSync = true;
    	}
        }
    }
});
var assetPermissionDS = new Ext.data.JsonStore({
	//autoLoad : true,
	autoSync: false,
	model: 'EAP.Model.Permission',
	proxy: {
        type: 'ajax',
        //extraParams :{departmentId: '1'},
        api: {
            read: GET_ASSET_PERMISSION_LIST,
            create: SAVE_ASSET_PERMISSION_URL,
            update: SAVE_ASSET_PERMISSION_URL,
            destroy: DELETE_ASSET_PERMISSION_URL
        },
        reader: {
            type: 'json',
            root: 'PermissionList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'PermissionList'
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

    },
    listeners: {
        write: function(proxy, operation){
    	if (operation.action == 'create'){
    		this.autoSync = false;
    		message = operation.resultSet.message;
    		var newRec = this.getAt(0);
    		newRec.set('id', message);
    		this.autoSync = true;
    	}
        }
    }
});
var assetTreeStore = Ext.create('Ext.data.TreeStore', {
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.Asset',
	proxy : {
//		type : 'memory',
		type: 'ajax',
	//	extraParams :{ categoryId:_categoryId},
        api: {
			read: GET_ASSET_TREE_LIST,
            create: SAVE_ASSET_URL,
            update: SAVE_ASSET_URL,
            destroy: DELETE_ASSET_URL
        },
		reader : {
			type : 'json',
			root: 'assetTree',
            idProperty: 'id',
            messageProperty:'message'
		},
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'assetTree'
        }

	},
    listeners: {
        write : function(store,oper,e){
        	var rs = oper.getResultSet();
     		if (newAssetNode != null){
     			this.autoSync = false;
     			newAssetNode.beginEdit();
     			newAssetNode.setId(rs.message);
     			//newAssetNode.set('id', rs.message);
     			newAssetNode.endEdit(true);
     			this.autoSync = true;
     			newAssetNode = null;
     			return;
     		}else{
     		/*
			var selection = assetGrid.getView().getSelectionModel().getSelection()[0];
			console.log('a');
			if (selection == null) return;
     		var parentNode = store.getNodeById(selection.get('id'));
     		console.log('b');
     		if (parentNode == null) return;
     		console.log('c');
     		var newNode = parentNode.findChild("id", null, false);
     		console.log('d');
     		if (newNode == null) return;
     		console.log('y');
     		if (rs.message != '-1'){
     			if (newNode != null){
     				console.log('z');
     				newNode.set('id', rs.message);
     				parentNode.expand();
     			}
     		}*/
     		}
     	},
     	update: function(store, record, operation, eOpts ){

     	},
     	remove: function( store, node, isMove, eOpts ){
     		var parentNode = node.parentNode;
        	if (parentNode.isRoot() == false && parentNode.hasChildNodes() == false){
        		parentNode.set('leaf',true);
        	}


     	}
     }

});

var assetHistoryDS = new Ext.data.JsonStore({
//	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.AssetHistory',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_ASSET_HISTORY_LIST,
            create: SAVE_ASSET_HISTORY_LIST,
            update: SAVE_ASSET_HISTORY_LIST,
            destroy: DELETE_ASSET_HISTORY_LIST
        },
        reader: {
            type: 'json',
            root: 'AssetHistoryList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssetHistoryList'
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

    },
    sorters: [{
        sorterFn: function(o1, o2){
            var getDate = function(o){
            	//Ext.Date.parse("2012-02-28", "Y-m-d")
                var startDate = Ext.Date.parse(o.get('startDate'),"d/m/Y");
               // console.log(startDate);
                return startDate;
            },
            date1 = Ext.Date.parse(o1.get('startDate'),"d/m/Y"),
            date2 = Ext.Date.parse(o2.get('startDate'),"d/m/Y");

            if (date1 === date2) {
            	var id1 = o1.get('id');
            	var id2 = o1.get('id');
            	if (id1==id2){
            		return 0;
            	}else{
            		return id1 < id2 ? 1 : -1;
            	}
            }

            return date1 < date2 ? 1 : -1;
        }
    }],
    /*
    sorters: [{
    	property: 'id',
    	direction: 'ASC'
    	}]
    ,*/
    listeners: {
    	 write: function(proxy, operation){
    		 console.log(operation.action);
	    	if (operation.action == 'create'){
	    		this.autoSync = false;
	    		message = operation.resultSet.message;
	    		console.log(message);
	    		var newRec = this.getAt(0);
	    		console.log(newRec);
	    		newRec.set('id', message);
	    		this.autoSync = true;
	    	}
        }
    }
});
var assignedTaskDS = new Ext.data.JsonStore({
	autoLoad : true,
	model:'EAP.Model.Task',
	proxy: {
        type: 'ajax',
        extraParams :{userId:userId,myOrgs: '',repositoryId:repositoryId,taskImageFolderId:taskImageFolderId,statusId: 1,assetId:activeAssetId},
        url: GET_ASSIGNED_TASK_LIST,
        reader: {
            type: 'json',
            root: 'taskList',
            idProperty: 'id'
        }
    }
});

var userStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'userId'},
        {type: 'string', name: 'userName'},
        {type: 'string', name: 'userEmail'}
    ]
});
userStore.loadData(Ext.decode(userJsonData));
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
var ownerStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
ownerStore.loadData(Ext.decode(myOrgs));
console.log(ownerStore);
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
var taskRequestTypeStore = new Ext.data.JsonStore({
    fields: [
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
taskActionStore.loadData(Ext.decode(taskActionJsonData));
taskActionAllStore.loadData(Ext.decode(taskActionJsonData));
taskRequestTypeStore.loadData(Ext.decode(taskRequestTypeJsonData));
departmentStore.removeAt(0);
statusStore.removeAt(0);
priorityStore.removeAt(0);
taskActionStore.removeAt(0);

var assetStore = new Ext.data.JsonStore({
//	autoLoad : true,
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
	assetButtonView = Ext.create('EAP.view.AssetButtonView', {
	    //store: assetDS,
		//region: 'north',
        //store: assetDS,
 	    id: 'assetButtonView',
 	    permissionId: this.permissionId,
	 	 //   departmentJson: this.departmentJson,
 	    historyStore: this.historyStore,
 	    height: '100%',
 	    collapsible: false

	});
	var bottomTab = Ext.create('Ext.tab.Panel', {
		id : 'bottomTab',
		//width : '300',
		height: '300',
		region: 'south',
		items : [{
            xtype: 'assetHistoryGrid',
            store: assetHistoryDS,
    	    id: 'assetHistoryList',
    	    cellCls: 'x-type-grid-defect-list',
    	    stateful: true,
    	    height: 300,
            title: 'Asset history',
            columnLines: true,


        },{
        	xtype: 'AssignedTaskGrid',
            store: assignedTaskDS,
    	    id: 'assignedTaskList',
    	    title:'Task',
    	    stateful: true,
    	    height: 300,
    	    columnLines: true,
    	    stateId: 'stateGrid',
    	    departmentStore: departmentStore,
    		priorityStore : priorityStore,
    		statusStore : statusStore,
    		scopeStore: scopeStore,
    		userStore: userStore,
    		assetCategoryStore: assetCategoryStore,
    		assetStore:assetStore,
    		taskActionStore: taskActionStore
        }]

	});

	Ext.tip.QuickTipManager.init();
	// turn on validation errors beside the field globally
	Ext.form.Labelable.msgTarget = 'side';
	Ext.create('Ext.panel.Panel', {
    	id: 'mainFrm',
    	height: 900,
        width: '100%',
        layout: {
            type: 'border'
        },
    	items: [{
    		xtype: 'assetView',
    		region: 'center',
    		height: '100%',
    		asetDepartmentJson : assetDepartmentJsonData,
    		departmentJson: departmentJsonData,
    		historyStore: assetHistoryDS
    	},bottomTab],
        renderTo: 'assetPanel'

    });
 /*
    assetDS.on('load',function(store, records, successful, operation, eOpts ){
    	if (records.length > 0){
    		//assetHistoryGrid.getView().focusRow(0);
    		//console.log('a');
    		//var firstRow = store.getAt(0);
    		//assetHistoryGrid.getSelectionModel().select(firstRow);
    		//console.log('b');
    	}
    },this);
    */

//    departmentCombo.on('change',function(field,newValue,oldValue,option){
//    	assetCategoryCodeDS.load({params:{departmentId: newValue}});
//    });


});