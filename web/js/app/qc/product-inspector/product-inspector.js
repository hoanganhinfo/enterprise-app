Ext.Loader.setConfig({
	enabled : true
});
var GET_QC_INSPECTION_TABLE_LIST='/enterprise-app/service/getQcInspectorTableList';
var SAVE_QC_INSPECTION_TABLE_URL = '/enterprise-app/service/saveQcInspectorTable';
var DELETE_QC_INSPECTION_TABLE_URL = '/enterprise-app/service/deleteQcInspectorTable';
var GET_QC_INSPECTION_LINE_LIST='/enterprise-app/service/getQcInspectorLineList';
var SAVE_QC_INSPECTION_LINE_URL = '/enterprise-app/service/saveQcInspectorLine';
var DELETE_QC_INSPECTION_LINE_URL = '/enterprise-app/service/deleteQcInspectorLine';
var PAGE_SIZE = 100;

var inspectionTableDS = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: false,
	model: 'EAP.Model.QCInspectionTable',
	pageSize: PAGE_SIZE,
	proxy: {
        type: 'ajax',
        extraParams: {
        	dateinspectedFrom :  new Date(),
			dateinspectedTo : new Date()
			}, 
        api: {
            read: GET_QC_INSPECTION_TABLE_LIST,
            create: SAVE_QC_INSPECTION_TABLE_URL,
            update: SAVE_QC_INSPECTION_TABLE_URL,
            destroy: DELETE_QC_INSPECTION_TABLE_URL
        }, 
        reader: {
            type: 'json',
            root: 'InspectionTableList',
            idProperty: 'id',
            totalProperty: 'totalCount',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'InspectionTableList'
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
var inspectionLineDS = new Ext.data.JsonStore({
//	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.QCInspectionLine',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_QC_INSPECTION_LINE_LIST,
            create: SAVE_QC_INSPECTION_LINE_URL,
            update: SAVE_QC_INSPECTION_LINE_URL,
            destroy: DELETE_QC_INSPECTION_LINE_URL
        }, 
        reader: {
            type: 'json',
            root: 'InspectionLineList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'InspectionLineList'
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
var statusTypeStore = new Ext.data.JsonStore({
    fields: [ 
        {type: 'string', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
var allStatusTypeStore = new Ext.data.JsonStore({
    fields: [ 
        {type: 'string', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
var transTypeStore = new Ext.data.JsonStore({
    fields: [ 
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
var defectLevelStore = new Ext.data.JsonStore({
    fields: [ 
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
var allTransTypeStore = new Ext.data.JsonStore({
    fields: [ 
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});

statusTypeStore.loadData(Ext.decode(statusTypeJsonData));
allStatusTypeStore.loadData(Ext.decode(statusTypeJsonData));
allTransTypeStore.loadData(Ext.decode(transTypeJsonData));
transTypeStore.loadData(Ext.decode(transTypeJsonData));
defectLevelStore.loadData(Ext.decode(defectLevelJsonData)); 
transTypeStore.removeAt(0);
statusTypeStore.removeAt(0);
Ext.require([ 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.toolbar.Paging']);
Ext.onReady(function() {

	Ext.Ajax.on('requestexception', function(connection, options) {
			Ext.getBody().unmask();
	});
	Ext.tip.QuickTipManager.init();
	
	var inspectionOrder = Ext.create('EAP.Form.QCInspectionOrder', {
		//width : '400',
		id : 'inputForm',
		inspectionTableStore : inspectionTableDS,
		inspectionLineStore : inspectionLineDS,
		stateful : true,
//		height : 500
	});
	var inspectionReport = Ext.create('EAP.Form.QCInspectionReport', {
		//width : '400',
		id : 'reportForm',
		stateful : true,
//		height : 500
	});

	var mainPanel = Ext.create('Ext.tab.Panel', {
		id : 'mainPanel',
		width : '530',
		//height: '520',
		items : [ inspectionOrder, inspectionReport,{
            title: 'Use * for wildcard search',
            html: "",
            border: 0,
            cls: 'x-type-tip',
            disabled: true,
        	} ],
		renderTo : 'upperPane'

	});

});
