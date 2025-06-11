Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');


Ext.define('OldF.MixedMaterialStock.Grid',{
	extend: 'Ext.grid.Panel',
	requires: 	[
					'Ext.grid.plugin.CellEditing',
					'Ext.form.field.Text',
					'Ext.toolbar.TextItem',
					'Ext.ux.CheckColumn'
				],
	
	initComponent:function()
	{
		
		
		var checkItem = Ext.create('Ext.selection.CheckboxModel',{checkOnly: true});
		this.Editting = Ext.create('Ext.grid.plugin.CellEditing',{ clicksToEdit: 1, listeners: {scope: this }});
	
		 
		Ext.apply(this,{
			enableLocking : true,
			columnLines: true,
			viewConfig: { stripeRows: true },
			id: 'idMMS',
			
			dockedItems:	[{
									xtype: 'toolbar',
									items:	[
												this.createFilterWithWeight(),
												
												{
													xtype: 'button'	,
													text: 'Fresh'	,	
													iconCls: 'icon-fresh'	,
													scope: this	,
													scale: 'medium',
													handler: this.onEvent_Fresh	
												}
											]
							}],
			columns: 	[{
			            	header: 'Date',
			            	width: 120,
			                sortable: true,
			                dataIndex: 'transdate'
                 		},
                 		{
			            	header: 'Mixed material code',
			            	width: 150,
			                sortable: true,
			                dataIndex: 'mixed_material_code'
                 		},
                 		{
			            	header: 'Virgin material name',
			            	width: 300,
			                sortable: true,
			                dataIndex: 'virgin_material_name'
                 		},
                 		{
			            	header: 'Regrind material name',
			            	width: 200,
			                sortable: true,
			                dataIndex: 'regrind_material_name'
			                
                 		},
                 		{
			            	header: 'Regrind rate',
			            	width: 120,
			                dataIndex: 'regrind_rate'
			                
			                
                 		},
                 		{
			            	header: 'Color',
//			                flex: 1,
			            	width: 100,
			                sortable: true,
			                dataIndex: 'color'
			               
                 		},
                 		{
			            	header: 'Mold code',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                dataIndex: 'mold_code'
			                
                 		},
                 		{
			            	header: 'Part name',
//			                flex: 1,
			            	width: 160,
			                sortable: true,
			                dataIndex: 'part_name'
			                
			                
                 		},
                 		{
			            	header: 'Weight',
//			                flex: 1,
			            	width: 100,
			                sortable: true,
			                dataIndex: 'weight'
			                
                 		},
                 		{
			            	header: 'Operator name',
			            	width: 100,
			                sortable: true,
			                dataIndex: 'userName'
			                
                 		},]
		});
		
		
		
		this.callParent(arguments);
	},
	createFilterWithWeight:function()
	{
				// The data store containing the list of states
				var states = Ext.create('Ext.data.Store', {
				    fields: ['abbr', 'name'],
				    data : [
						        {"abbr":"", "name":"ALL"},
						        {"abbr":"IN",  "name":"IN" },
						        {"abbr":"OUT", "name":"OUT"},
						        {"abbr":"IN_STOCK", "name":"IN STOCK"}
				       
				    		]
						});
				
				// Create the combo box, attached to the states data store
				var _cbb =  Ext.create('Ext.form.ComboBox', {
				    fieldLabel: 'Choose Weight',
				    store: states,
				    queryMode: 'local',
				    displayField: 'name',
				    valueField: 'abbr',
				    id: 'id_weight',
				    value:'All',
				    listeners: {
				    				select:function( combo, records, eOpts )
				    				{
				    					
				    					Ext.getCmp('idMMS').getStore().load({params: {movementType:records[0].get('abbr')}});
				    				}, scope: this
				    			}
				    
				});
				
				
				return _cbb;
	},
	
	onEvent_Fresh:function()
	{
		Ext.getCmp("idMMS").getStore().load();
		
	}
});



