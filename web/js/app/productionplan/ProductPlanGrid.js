//Ext.Loader.setConfig({enabled: true});
//Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux/exporter');

Ext.define('EAP.Portlet.ProductTestLogGrid',{
	extend: 'Ext.grid.Panel',

	title : 'Product test logs',
	viewConfig : {
		emptyText : 'There are no logs to display',
		deferEmptyText : false,
		enableRowBody : true,
		getRowClass : function(row, index) {
			var cls = '';
			var data = row.data;
			if (data.status == "Failed") {
				cls = 'highlighted-row';
			}
			return cls;
		}
	},    
    initComponent: function() {
      

        this.callParent(arguments);
    }

	
		
		
});
