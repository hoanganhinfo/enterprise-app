
var GET_MOLD_LIST = '/enterprise-app/service/getMoldList';
var GET_MOLD_LIST_BY_COLOR = '/enterprise-app/service/getMoldListByColor';


Ext.define('OldF.MixedMaterial.Input',{
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
		
		width: 'auto',
		height: 'auto',
		
		layout:{ type : 'table', columns: 4 },
		initComponent:function()
		{
			_MMSCodeMax = new Ext.data.JsonStore({
				    autoLoad : true,
					autoSync: true,
				    storeId: 'myStoreMMSCodeMax',
				   
				    proxy: {
				        type: 'ajax',
				        api: { read: GET_MIXED_MATERIAL_MAX_CODE_URL },
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
				    fields: ['mixed_material_code_existing'],
		
					exception: function(proxy, response, operation)
							{
					            Ext.MessageBox.show({
						                title: 'REMOTE EXCEPTION',
						                msg: operation.getError(),
						                icon: Ext.MessageBox.ERROR,
						                buttons: Ext.Msg.OK
					            	});
				        	},
				        	scope: this
				});
			_MMStore = new Ext.data.JsonStore({
				    
				    storeId: 'myStoreMMs',
				   
				    proxy: {
				        type: 'ajax',
				        api: { read: GET_MIXED_MATERIAL_LIST_URL },
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
				
				this.items = [
								this.column1(),
								this.column2(),
								this.column3(),
								this.column4()
							],
							
				this.callParent(arguments);
		},
		column1:function()
		{
			
			var _panelColumn = Ext.create('Ext.panel.Panel',{
			width: 150,
			height: 'auto',
			border: false,
			items:	[
						{
							xtype: 'label',
							text:' Regrind resin code: '
						},
						{
							xtype: 'textfield',
							width: 130,
							readOnly:true,
							id: 'id_regrind_resin_code'
							
						}
					]
			});
			return _panelColumn;
		},
		column2:function()
		{
			var _panelColumn = Ext.create('Ext.panel.Panel',{
			width: 150,
			height: 'auto',
			border: false,
			
			items:	[
						{
							xtype: 'label',
							text:' Regrind resin name: '
						},
						{
							xtype: 'textfield',
							width: 130,
							readOnly:true,
							id: 'id_regrind_resin_name'
							
						}
					]
			});
			return _panelColumn;
		},
		column3:function()
		{
			var _panelColumn = Ext.create('Ext.panel.Panel',{
			width: 150,
			height: 'auto',
			border: false,
			//margin: '20,10,20,10',
			items:	[
						{
							xtype: 'label',
							text:' Regrind rate: '
						},
						{
							xtype: 'textfield',
							width: 130,
							maskRe: /[0-9.]/,
							id: 'id_regrind_rate',
							listeners: { 
											change: function(field , newValue, oldValue, eOpts)
											{
												if(_MMStore == null)
												{
													alert('_MMStore is  null');
												}
//												alert(_vvirgin_material_name+'  '+_rregrind_material_name+'  '+_rregrind_rate+ ' '+_color_select+' '+newValue);
												 _MMStore.load({params:{virgin_material_name:_vvirgin_material_name ,regrind_material_name:_rregrind_material_name,regrind_rate:newValue,color:_color_select },scope: this});
												 _MMStore.on('load',function( store, records, successful, eOpts)
												 {
														if(store.count() > 0)
														{
															Ext.getCmp('id_mixed_material_code').setRawValue(store.first().get('mixed_material_code'));
															Ext.getCmp('id_existing').setRawValue(true);
														}
														else
														{
															Ext.getCmp('id_existing').setRawValue(false);
															Ext.getCmp('id_mixed_material_code').setRawValue(_MMSCodeMax.first().get('mixed_material_code_existing'));
														}
													
												},this);
											}
										}
							
						}
					]
			});
			return _panelColumn;
		},
		column4:function()
		{
			var _panelColumn = Ext.create('Ext.panel.Panel',{
			//width: 200,
			height: 'auto',
			border: false,
			//margin: '20,10,20,10',
			items:	[
						{
							xtype: 'label',
							html: 'Mixed material weight send back '+_kg
						},
						{
							xtype: 'textfield',
							width: 200,
							maskRe: /[0-9.]/,
							id: 'id_mixed_material_weight_send_back'
							
						}
					]
			});
			return _panelColumn;
		}
		
		
		
});













