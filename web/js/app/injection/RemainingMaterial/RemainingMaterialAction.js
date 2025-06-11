Ext.define('OldF.RemainingMaterial.Action',{
		extend: 'Ext.form.Panel',
		required: 	[
						'Ext.data.*',
						'Ext.state.*',
						'Ext.grid.*',
						'Ext.form.ComboBox',
						'Ext.form.FieldSet',
						'Ext.tip.QuickTipManager',
						'Ext.toolbar.TextItem'
					],
		_MMs: null,
		SAVE_REGRIND_OTHER_URL:'/enterprise-app/service/saveRegrindOrderWithRemainingMaterial',
		width: 'auto',
		height: 'auto',
		layout:{ type : 'table', columns: 3  },
		defaults: { bodyStyle: 'padding:10px' },
		//border: false,
		margin: '10,0,30,0',
		initComponent:function()
		{
			
				
			this._MMs = new Ext.data.JsonStore({
				    
				    storeId: 'myStoreMMs',
				   
				    proxy: {
				        type: 'ajax',
				        api: { read: GET_MIXED_MATERIAL_LIST_BY_RATE_VIRGIN_URL },
				        reader: {
				            type: 'json',
				            root: 'InjMixedMaterialList',
				            idProperty: 'mixed_material_code'
				        }
				    },
				    listeners: {
				        	load: function(store, records, successful, eOpts){
				        		
				        	}
				    },
				    fields: [{name: 'id', type: 'int'},{name:'transdate', type: 'date'}, 
				    		 'mixed_material_code','virgin_material_name','regrind_material_name',
				    		 {name:'regrind_rate', type: 'double'},'color','mold_code',	 'part_name',
						     {name:'weight', type: 'double'}],
		
					exception: function(proxy, response, operation)
							{
					            Ext.MessageBox.show({
						                title: 'REMOTE EXCEPTION',
						                msg: operation.getError(),
						                icon: Ext.MessageBox.ERROR,
						                buttons: Ext.Msg.OK
					            	});
				        	}
				});
			
			this._MMs.on('load',function( store, records, successful, eOpts){
					
					if(store.count() > 0)
					{
						
						_mixed_material_code = store.first().get('mixed_material_code');
						_regrind_material_name = store.first().get('regrind_material_name');
						
						
					}
					else
					{
						_mixed_material_code = '';
						_regrind_material_name = '';
					}
				},this);
			
			
			
			this.items = [{
								  xtype: 'button', 
								  //padding: '50 100 50 100',
								  name: 'btnOK',
								  text : 'OK',
								  scale   : 'large',
								  width: 200,
								  height: 50,
								  cls: 'x-btn-default-large-fail-edited',
								  //cellCls: 'x-type-cell-button-pass',
								  handler : this.onSuccess,
								  scope : this
							}],
							
			
					
				this.callParent(arguments);
		},
		onSuccess:function()
		{
			
			var virgin_material_code = Ext.getCmp('id_new_resin_code').getRawValue();
			var regrind_rate = Ext.getCmp('id_regrind_rate').getRawValue();
			var mixed_material = Ext.getCmp('id_mixed_material_weight_send_back').getRawValue();
			var new_material = Ext.getCmp('id_new_material_weight_send_back').getRawValue();
			
			if(regrind_rate == '' && mixed_material=='' && new_material =='')
			{
				 Ext.MessageBox.show({
						                title: 'Exception',
						                msg: 'Checking input',
						                icon: Ext.MessageBox.ERROR,
						                buttons: Ext.Msg.OK
					            	});
					            	return;
			}
			
			if(regrind_rate!='' || virgin_material_code!='')
			{
				this._MMs.load({params:{virgin_material_code: virgin_material_code,regrind_rate:regrind_rate },scope:this});
			
			}

			Ext.MessageBox.show({
			 	title: 'Message', 
			 	msg: 'Do you want to save',
			 	icon: Ext.MessageBox.QUESTION, 
			 	buttons: Ext.MessageBox.OKCANCEL,
			 	fn: function(buttonId)
			 	{
			 		if(buttonId == 'ok')
					{
								new Ext.data.Connection().request({
								method : 'POST',					
					    		url : this.SAVE_REGRIND_OTHER_URL,
					    		params : {
					    					    userName: userName,
								    			moldCode:_moldNumber_select,//select
												color : _color_select,//select
												partCode :  _product_code_select ,//select
												partName : _product_name_select,//select
												virginMaterialCode   : Ext.getCmp('id_new_resin_code').getRawValue(),		  
												virginMaterialName   : Ext.getCmp('id_new_resin_name').getRawValue(),
												virginMaterialWeight : Ext.getCmp('id_new_material_weight_send_back').getRawValue(),
												regrindMaterialCode : Ext.getCmp('id_regrind_resin_code').getRawValue(),
												regrindMaterialName : Ext.getCmp('id_regrind_resin_name').getRawValue(),
												regrindPercentage : Ext.getCmp('id_regrind_rate').getRawValue(),
												mixedMaterialCode: _mixed_material_code,
												mixedMaterialName: _regrind_material_name,
												mixedMaterialWeight : Ext.getCmp('id_mixed_material_weight_send_back').getRawValue()
											
					    				 },
					    		success: function(response)
				    			{
				    				 	var rs = Ext.decode(response.responseText);
	    								if (rs.success == true)
	    								{
	    											Ext.getCmp('id_regrind_rate').setRawValue('');
													Ext.getCmp('id_mixed_material_weight_send_back').setRawValue('');
													Ext.getCmp('id_new_material_weight_send_back').setRawValue('');
													
													Ext.getCmp('id_mixed_material_code').setRawValue('');
													Ext.getCmp('id_existing').setRawValue(false);
	    								}
	    								else
	    								{
	    									alert('have something wrong. Please checking again');
	    								}
				    			}
							});
					}
					else
					{
						
					}
			 	},scope: this
			});

		}
		
});