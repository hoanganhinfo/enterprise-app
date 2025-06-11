var GET_PRODUCT_TEST_LOG_URL='/enterprise-app/service/getProductTestLogs';
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
	Ext.create('Ext.panel.Panel', {
    	id: 'mainFrm',
    	height: 600,
        width: '100%',
        layout: {
            type: 'border'
        },
    	items: [],
        renderTo: 'ProductionPlanPanel'
        
    });
	
});