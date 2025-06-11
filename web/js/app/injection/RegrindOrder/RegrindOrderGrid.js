Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');


Ext.define('OldF.Regrindorder.Grid',{
	extend: 'Ext.grid.Panel',
	requires: 	[
					'Ext.grid.plugin.CellEditing',
					'Ext.form.field.Text',
					'Ext.toolbar.TextItem',
					'Ext.ux.CheckColumn'
				],
	
	initComponent:function()
	{
		function pctChange(val, meta, record, rowIndex, colIndex, store) 
		{
			if(record.get('regrind_shortage') == 1)
			{
				 return '<span style="color:red;">' + val + '%</span>';
				
			}
			else
			{
				return '<span style="color:black;">' + val + '%</span>';
			}
	        return val;
    	}
		
		var checkItem = Ext.create('Ext.selection.CheckboxModel',{checkOnly: true});
		this.Editting = Ext.create('Ext.grid.plugin.CellEditing',{ clicksToEdit: 1, listeners: {scope: this }});
	
		 
		Ext.apply(this,{
			enableLocking : true,
			columnLines: true,
			
			id: 'idManagerOrder',
			dockedItems:	[{
									xtype: 'toolbar',
									items:	[
												this.createFilterWithWeight(),
												this.createFilterWithApproved(),
												{
													xtype: 'button'	,
													text: 'View'	, 	
													iconCls: 'icon-view',
													scale: 'medium',
													scope: this	,
													handler: this.onEvent_New
															
												},
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
			columns: 	[
						{
			            	header: 'virgin_material_code',
			            	width: 120,
			                sortable: true,
			                hidden: true,
			                dataIndex: 'virgin_material_code'
                 		},
                 		{
			            	header: 'regrind_material_code',
			            	width: 120,
			                sortable: true,
			                hidden: true,
			                dataIndex: 'regrind_material_code'
                 		},
                 		{
			            	header: 'part_code',
			            	width: 120,
			                sortable: true,
			                hidden: true,
			                dataIndex: 'part_code'
                 		},
                 		
						{
			            	header: 'Order date',
			            	width: 120,
			                sortable: true,
			                dataIndex: 'order_date'
                 		},
                 		{
			            	header: 'Mold code',
			            	width: 150,
			                sortable: true,
			                dataIndex: 'mold_code'
                 		},
                 		{
			            	header: 'Part name',
			            	width: 300,
			                sortable: true,
			                dataIndex: 'part_name'
                 		},
                 		{
			            	header: 'Color',
			            	width: 80,
			                sortable: true,
			                dataIndex: 'color'
			                
                 		},
                 		{
			            	header: 'Cavity',
			            	width: 70,
			                dataIndex: 'cavity'
			                
			                
                 		},
                 		{
			            	header: 'Runner ratio',
//			                flex: 1,
			            	width: 150,
			                sortable: true,
			                dataIndex: 'runner_ratio'
			               
                 		},
                 		{
			            	header: 'Weight of regrind theorically',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                dataIndex: 'weight_regrind_theorically'
			                
                 		},
                 		{
			            	header: 'Part qty prepared',
//			                flex: 1,
			            	width: 160,
			                sortable: true,
			                dataIndex: 'part_qty_prepared'
			                
			                
                 		},
                 		{
			            	header: 'Virgin material name',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                dataIndex: 'virgin_material_name'
			                
                 		},
                 		{
			            	header: 'Virgin material weight',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                dataIndex: 'virgin_material_weight'
			                
                 		},
                 		{
			            	header: 'Regrind material name',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                dataIndex: 'regrind_material_name'
			                
                 		},
                 		{
			            	header: 'Regrind material weight',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                xtype: 'numbercolumn',
			                dataIndex: 'regrind_material_weight'
			                
                 		},
                 		{
			            	header: 'Regrind rate',
//			                flex: 1,
			            	width: 120,
			                sortable: true,
			                xtype: 'numbercolumn',
			                renderer : pctChange,
			                dataIndex: 'regrind_rate'
			                
                 		},
                 		{
			            	header: 'Masterbatch name',
//			                flex: 1,
			            	width: 250,
			                sortable: true,
			                dataIndex: 'masterbatch_name'
			                
                 		},
                 		{
			            	header: 'Masterbatch weight',
//			                flex: 1,
			            	width: 140,
			                sortable: true,
			                xtype: 'numbercolumn',
			                dataIndex: 'masterbatch_weight'
			                
                 		},
                 		{
			            	header: 'Masterbatch rate',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                xtype: 'numbercolumn',
			                dataIndex: 'masterbatch_rate'
			               
                 		}, 
                 		{
			            	header: 'Mixed material code',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                dataIndex: 'mixed_material_code'
			                
                 		},
                 		{
			            	header: 'Mixed material name',
//			                flex: 1,
			            	width: 300,
			                sortable: true,
			                dataIndex: 'mixed_material_name'
			                
                 		},
                 		{
			            	header: 'Mixed material weight',
//			                flex: 1,
			            	width: 200,
			                sortable: true,
			                xtype: 'numbercolumn',
			                dataIndex: 'mixed_material_weight'
			                
                 		},
                 		{
			            	header: 'Operator name',
			            	width: 100,
			                sortable: true,
			                dataIndex: 'userName'
			                
                 		},
                 		{
                 			 header: 'Approved',
							 xtype: 'checkcolumn',
							 dataIndex: 'order_status',
							 width: 55,
							 scope: this,
							 //locked   : true,
							 listeners: {
                                            checkchange: function (checkcolumn, recordIndex, checked, eOpts) 
                                            {
                                            	//alert(checked+' '+checkcolumn+' '+recordIndex+ ' '+eOpts);
                                            	if(checked == true)
                                            	{
                                            		var _ID = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('id');
	                                            	var _VMN = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('virgin_material_name');
	                                            	var _RMN = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('regrind_material_name');
	                                            	var _RR = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('regrind_rate');
	                                            	var _MC = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('mold_code');
	                                            	var _PN = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('part_name');
	                                            	var _C = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('color');
	                                            	var _MMW = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('mixed_material_weight');
	                                            	
	                                            	var _VMC =  Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('virgin_material_code');
	                                            	var _RMC = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('regrind_material_code');
	                                            	var _PC = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('part_code');
	                                            	//alert(_ID);
	                                            	
	                                            	new Ext.data.Connection().request({
														method : 'POST',					
											    		url : GET_SAVE_MMS,
											    		params : {
											    			 		userName: userName,
											    					 id:'',
											    					 transdate:'',
											    					 mixed_material_code:'',
														             virgin_material_name:_VMN,
														             regrind_material_name:_RMN,
														             regrind_rate:_RR,
														             color:_C,
														             mold_code:_MC,
														             part_name:_PN,
														             weight:_MMW,
														             
														             virgin_material_code:_VMC,
														             regrind_material_code:_RMC,
														             part_code:_PC,
														             idorder: _ID
											    				 }
														});
													var _IDO = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('id');								
													new Ext.data.Connection().request({
														method : 'POST',					
											    		url : UPDATE_REGRIND_OTHER_URL,
											    		params : {
											    					 id: _IDO,
																	 orderStatus:'16' 
																	
											    				 }
													});
                                            	}
                                            	else
                                            	{
                                            		var _IDDE = Ext.getCmp('idManagerOrder').getStore().getAt(recordIndex).get('id');
                                            		new Ext.data.Connection().request({
														method : 'POST',					
											    		url : GET_DELETE_MMS,
											    		params : {
														             idorder: _IDDE
											    				 }
														});
														
														new Ext.data.Connection().request({
														method : 'POST',					
											    		url : UPDATE_REGRIND_OTHER_URL,
											    		params : {
											    					 id: _IDDE,
																	 orderStatus:'1' 
																	
											    				 }
													});
                                            	}
                                        	}, scope: this
                                        }
							 
							 
                 		}]
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
						        {"abbr":"OUT", "name":"OUT"}
				       
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
				    value:'All'
				    
				});
				
				
				return _cbb;
	},
	createFilterWithApproved:function()
	{
				// The data store containing the list of states
				var states = Ext.create('Ext.data.Store', {
				    fields: ['abbr', 'name'],
				    data : [
						        {"abbr":"", "name":"ALL"},
						        {"abbr":"FALSE",  "name":"NOT APPROVED" },
						        {"abbr":"TRUE", "name":"APPROVED"}
				       
				    		]
						});
				
				// Create the combo box, attached to the states data store
				var _cbb =  Ext.create('Ext.form.ComboBox', {
				    fieldLabel: 'Choose Approve',
				    store: states,
				    queryMode: 'local',
				    displayField: 'name',
				    valueField: 'abbr',
				    id: 'id_approved',
				    value:'All'
				});
				
				return _cbb;
	}
	
	,onEvent_New:function()
	{
		
		//alert(Ext.getCmp('id_approved').getValue( ) + ' '+Ext.getCmp('id_weight').getValue( ));
		Ext.getCmp('idManagerOrder').getStore().load({params: {movementType:Ext.getCmp('id_weight').getValue( ),approved:Ext.getCmp('id_approved').getValue( )}});
	},
	onEvent_Fresh:function()
	{
		Ext.getCmp("idManagerOrder").getStore().load();
		
	}
});


