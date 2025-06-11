
Ext.define('EAP.Portlet.AssemblylineCombo',{
		extend: 'Ext.form.ComboBox',
		required: 	[
						
					],
		idPumplineCombo: '',
		GET_PUMPLINE_LIST:  '/ewi/service/getActivePumpLine',
		initComponent:function()
		{
			var ds = new Ext.data.JsonStore({
					autoLoad : true,
					fields : ['pumpId', 'pumpCode'],
					proxy: {
					        type: 'ajax',
					        url: this.GET_PUMPLINE_LIST,
					        extraParams: {screentype: '10'}, 
					        reader: {
							            type: 'json',
							            root: 'pumpLineList',
							            idProperty: 'pumpId'
				        			}
	    					}
						});
			
			
			Ext.apply(this,{
				id : 'cboPumpLine_'+this.idPumplineCombo,
				inputId: 'cbPumpLine_'+this.idPumplineCombo,
				store : ds,
				labelAlign: 'left',
				labelWidth: 78,//-----------------------------------------------------------------------
			    fieldLabel: 'Pump line',	      
				displayField : 'pumpCode',
				valueField : 'pumpId',
				typeAhead : true,
				loadingText : 'Searching...',
				width: 190,//200-------------------------------------------------------------------
				editable: false,
				allowBlank: false,
				msgTarget: 'side',
				maxWidth: 190,//200,
				// hideTrigger:true,
				triggerAction : 'all',
				queryMode : 'remote',
				minChars : 1
				
//				width :155,//190,// 200,
//					maxWidth:155,//190,// 200,
//					labelWidth:50,
				
			});
			this.callParent(arguments);
		}
});