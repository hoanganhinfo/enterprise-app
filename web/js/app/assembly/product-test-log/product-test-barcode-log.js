var GET_PRODUCT_TEST_LOG_URL='/enterprise-app/service/getProductTestBarcodeLogs';
var GET_ASSY_PRODUCT_TYPE_LIST_URL = '/enterprise-app/service/getAssyProductTypeList';
var EXPORT_LIST_URL='';
Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.ux.exporter',  '/enterprise-app/js/extjs4.1/examples/ux/exporter');
Ext.require([
         	'Ext.grid.*',
         	'Ext.data.*',
         	'Ext.util.*',
         	'Ext.ux.exporter.Base64',
         	'Ext.ux.exporter.Button',
         	'Ext.ux.exporter.Formatter',
         	'Ext.ux.exporter.csvFormatter.CsvFormatter',
         	'Ext.ux.exporter.excelFormatter.Workbook',
         	'Ext.ux.exporter.excelFormatter.Worksheet',
         	'Ext.ux.exporter.excelFormatter.Cell',
         	'Ext.ux.exporter.excelFormatter.Style',
         	'Ext.ux.exporter.excelFormatter.ExcelFormatter',
         	'Ext.ux.exporter.Exporter'
         	]);


Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();
	// turn on validation errors beside the field globally
	Ext.form.Labelable.msgTarget = 'side';
	var filterForm = Ext.create('EAP.Form.ProductFilterForm', {
		width: '100%',
        id: 'productFilterForm',
	    stateful: true,
	    height: 150,
	    title: 'Filter by',
	    titleCollapse: true,
	    stateId: 'stateGrid',
	    exportUrl: EXPORT_LIST_URL,
	    renderTo: 'test-log-filter'		
	  
	});	
	
});