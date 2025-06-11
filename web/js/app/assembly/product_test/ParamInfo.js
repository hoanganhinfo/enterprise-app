Ext.define('EAP.Portlet.ParamInfo',{
	extend: 'Ext.form.Panel',
	border : 0,
	bodyBorder : true,
	//layout: { type: 'hbox', pack: 'left'},
	idInputInfo:'',
	defaults: {bodyStyle: 'padding:10px'},
//	 width: '100%',
	bodyCls: 'x-type-frm',
	defaultType: 'textfield',//'textfield',
	scope: this,
	paramMap: null,
    layout: {
        type: 'table',
        // The total column count must be specified here
        columns: 4
    },
//	layout: {
//        type: 'column'
//    },	
//	layout: 'column',
	initComponent: function()
	{
		
//		var htmlsla = '<font color = "red">230VAC/50Hz</font>' +' Power(W)';
//		var htmlslb = '<font color = "red">240VAC/60Hz</font>' +' Power(W)';
//		var htmlslc = '<font color = "red">120VAC/60Hz</font>' +' Power(W)';
//		
		//this.items = 	[];
					
		this.callParent(arguments);
		
	}
	
});
