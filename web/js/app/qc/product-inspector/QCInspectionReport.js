Ext.define('EAP.Form.QCInspectionReport',{
	extend: 'Ext.form.Panel',
	 width: 500,
     //frame: true,
     title: 'QC Inspection Report',
     bodyPadding: '10 10 0',

     defaults: {
         //anchor: '100%',
         allowBlank: false,
         msgTarget: 'side',
         labelWidth: 200
     },
	initComponent: function(){
		
	
		this.callParent(arguments);
		
	}

});
