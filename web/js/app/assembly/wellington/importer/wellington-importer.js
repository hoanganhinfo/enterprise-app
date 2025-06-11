Ext.Loader.setConfig({
	enabled : true
});
var viewByData;
var GET_ACTIVE_WELLINGTON_MOTOTR_LIST = '/enterprise-app/service/getActiveWellingtonMotorList';
if (hasImportPermission == 'false'){
	//viewByData =  ['Packing result'];
	viewByData =  ['Full result','Packing result'];
}else{
	viewByData =  ['Full result','Packing result'];	
}

var statusAllStore = new Ext.data.JsonStore({
    fields: [ 
        {type: 'int', name: 'value'},
        {type: 'string', name: 'name'}
    ]
});
statusAllStore.loadData(Ext.decode(statusJsonData));
//var myRolesStore = new Ext.data.JsonStore({
//    fields: [ 
//        {type: 'int', name: 'roleId'},
//        {type: 'string', name: 'roleName'}
//    ]
//});
//myRolesStore.loadData(Ext.decode(myRolesJsonData));
var wellingtonMotorStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        model: 'EAP.Model.WellingtoMotor',
        //data: wellingtonMotorsData
		proxy: {
	        type: 'ajax',
	        url: GET_ACTIVE_WELLINGTON_MOTOTR_LIST,
	        reader: {
	            type: 'json',
	            root: 'WellingtonMotorList',
	            idProperty: 'id'
	        }
	    }        
    });

Ext.Loader.setPath('Ext.ux.exporter',
		'/enterprise-app/js/extjs4.1/examples/ux/exporter');
Ext.require([ 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.toolbar.Paging',
		'Ext.ux.exporter.Base64', 'Ext.ux.exporter.Button',
		'Ext.ux.exporter.Formatter',
		'Ext.ux.exporter.csvFormatter.CsvFormatter',
		'Ext.ux.exporter.excelFormatter.Workbook',
		'Ext.ux.exporter.excelFormatter.Worksheet',
		'Ext.ux.exporter.excelFormatter.Cell',
		'Ext.ux.exporter.excelFormatter.Style',
		'Ext.ux.exporter.excelFormatter.ExcelFormatter',
		'Ext.ux.exporter.Exporter' ]);
Ext.onReady(function() {
//	Ext.Ajax.on('beforerequest', function(connection, options) {
////		if (!Ext.isDefined(Ext.getCmp('testGrid'))){
////			Ext.getBody().mask('Loading data...');
////		}
//	});
//
//	Ext.Ajax.on('requestcomplete', function(connection, options) {
//		if (!Ext.isDefined(Ext.getCmp('testGrid'))){
//			Ext.getBody().unmask();
//		}
//		
//	});
//
	Ext.Ajax.on('requestexception', function(connection, options) {
			Ext.getBody().unmask();
	});
	Ext.tip.QuickTipManager.init();
	var importForm = Ext.create('EAP.Portlet.WellingtonImportPanel', {
		width : '400',
		id : 'wellingtonImportFrm',
		
		stateful : true,
		height : 125
	});
	var filterForm = Ext.create('EAP.Form.WellingtonFilterForm', {
		width : '400',
		id : 'wellingtonFilterFrm',
		statusStore: statusAllStore,
		stateful : true,
		height : 200
	});
	
	var shipmentGrid = Ext.create('EAP.Grid.WellingtonShipmentGrid', {
		width : '400',
		id : 'shipmentGrid',
		stateful : true,
		height : 600
	});
	var motorGrid = Ext.create('EAP.Grid.WellingtonMotorGrid', {
		width : '400',
		id : 'motorGrid',
		stateful : true,
		height : 600
	});
	var frmWellingtonAppPanel = Ext.create('Ext.tab.Panel', {
		id : 'frmWellingtonPanel',
		width : '450',
		items : [filterForm,shipmentGrid,motorGrid ],
		renderTo : 'fi-form'

	});
	frmWellingtonAppPanel.on('tabchange',function(tab){
       	Ext.fly('test-log-grid').update('&nbsp;');
	});
	//alert(myRolesStore.find('roleName','Wellington'));
//	alert(hasImportPermission);
//	alert(hasAssignShipmentPermission);
	if (hasImportPermission == 'true'){
		frmWellingtonAppPanel.insert(0,importForm);
		
		
		//frmVendorPerformancePanel.remove(importForm);
	}
});
