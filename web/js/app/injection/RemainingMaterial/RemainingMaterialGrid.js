
var GET_MOLD_LIST_BY_COLOR_MOLD = '/enterprise-app/service/getMoldListByColorAndMold';
var GET_REGRIND_RATE_LIST_BY_MOLDCODE = '/enterprise-app/service/getMoldRegrindRateByProductCode';
var GET_MIXED_MATERIAL_MAX_CODE_URL = '/enterprise-app/service/getMixedMaterialWithMaxMMCode';


Ext.define('OldF.RemainingMaterial.GridPanel',{
		extend: 'Ext.grid.Panel',
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
		_RRStore: null,
//		_MMStore: null,
//		_MMSCodeMax: null,
//		_virgin_material_name: null,
//		_regrind_material_name: null,
//		_regrind_rate: null,
		
		initComponent:function()
		{
//			this._MMSCodeMax = new Ext.data.JsonStore({
//				    autoLoad : true,
//					autoSync: true,
//				    storeId: 'myStoreMMSCodeMax',
//				   
//				    proxy: {
//				        type: 'ajax',
//				        api: { read: GET_MIXED_MATERIAL_MAX_CODE_URL },
//				        reader: {
//				            type: 'json',
//				            root: 'InjMixedMaterialList',
//				            idProperty: 'mixed_material_code'
//				        }
//				    },
//				    listeners: {
//				        	load: function(store, records, successful, eOpts){
//				        		
//				        	}
//				    },
//				    fields: ['mixed_material_code_existing'],
//		
//					exception: function(proxy, response, operation)
//							{
//					            Ext.MessageBox.show({
//						                title: 'REMOTE EXCEPTION',
//						                msg: operation.getError(),
//						                icon: Ext.MessageBox.ERROR,
//						                buttons: Ext.Msg.OK
//					            	});
//				        	},
//				        	scope: this
//				});
				
//			this._MMStore = new Ext.data.JsonStore({
//				 _MMStore = new Ext.data.JsonStore({
//				    
//				    storeId: 'myStoreMMs',
//				   
//				    proxy: {
//				        type: 'ajax',
//				        api: { read: GET_MIXED_MATERIAL_LIST_URL },
//				        reader: {
//				            type: 'json',
//				            root: 'InjMixedMaterialList',
//				            idProperty: 'mixed_material_code'
//				        }
//				    },
//				    listeners: {
//				        	load: function(store, records, successful, eOpts){
//				        		
//				        	}
//				    },
//				    fields: [{name: 'id', type: 'int'},{name:'transdate', type: 'date'}, 
//				    		 'mixed_material_code','virgin_material_name','regrind_material_name',
//				    		 {name:'regrind_rate', type: 'double'},'color','mold_code',	 'part_name',
//						     {name:'weight', type: 'double'}],
//		
//					exception: function(proxy, response, operation)
//							{
//					            Ext.MessageBox.show({
//						                title: 'REMOTE EXCEPTION',
//						                msg: operation.getError(),
//						                icon: Ext.MessageBox.ERROR,
//						                buttons: Ext.Msg.OK
//					            	});
//				        	}
//				});
			
			
			this._RRStore = new Ext.data.JsonStore({
				    
				    storeId: 'myStore',
				   
				    proxy: {
				        type: 'ajax',
				        api: { read: GET_REGRIND_RATE_LIST_BY_MOLDCODE },
				        reader: {
				            type: 'json',
				            root: 'InjRegrindRateList',
				            idProperty: 'product_code'
				        }
				    },
				    listeners: {
				        	load:function(store, records, successful, eOpts){
				        		
				        	}
				    },
				    fields: ['product_code', 'product_name','virgin_material_code','virgin_material_name',
				    		 'masterbatch_code','masterbatch_name','regrind_resin_code','regrind_resin_name',	 
						    {name:'color_rate', type: 'double'}, {name:'regrind_rate', type:'double'},
						    {name:'constant_scrap', type: 'double'}, {name:'runner_weight', type:'double'},
						    {name:'product_weight', type:'double'}],
						    
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
			
												
				this._RRStore.on('load',function( store, records, successful, eOpts){
					
					if(store.count() > 0)
					{
// 						this._virgin_material_name = store.first().get('virgin_material_name');
//						this._regrind_material_name = store.first().get('regrind_resin_name');
//						this._regrind_rate =   store.first().get('regrind_rate');
						
						_vvirgin_material_name = store.first().get('virgin_material_name');
						_rregrind_material_name = store.first().get('regrind_resin_name');
						_rregrind_rate =   store.first().get('regrind_rate');
						
						Ext.getCmp('id_new_resin_code').setRawValue(store.first().get('virgin_material_code'));
						Ext.getCmp('id_new_resin_name').setRawValue(store.first().get('virgin_material_name'));
						
						Ext.getCmp('id_regrind_resin_code').setRawValue(store.first().get('regrind_resin_code'));
						Ext.getCmp('id_regrind_resin_name').setRawValue(store.first().get('regrind_resin_name'));
						
						Ext.getCmp('id_mixed_material_weight_send_back').setRawValue('');
						Ext.getCmp('id_new_material_weight_send_back').setRawValue('');
						Ext.getCmp('id_regrind_rate').setRawValue('');
						
						_check_store = true;
//						 this._MMStore.load({params:{virgin_material_name:this._virgin_material_name ,regrind_material_name:this._regrind_material_name,regrind_rate: this._regrind_rate,color:_color_select },scope: this});
						 	 
						
					}
					else
					{
						_check_store = false;
						Ext.getCmp('id_new_resin_code').setRawValue('');
						Ext.getCmp('id_new_resin_name').setRawValue('');
						
						Ext.getCmp('id_regrind_resin_code').setRawValue('');
						Ext.getCmp('id_regrind_resin_name').setRawValue('');
						
						Ext.getCmp('id_mixed_material_weight_send_back').setRawValue('');
						Ext.getCmp('id_new_material_weight_send_back').setRawValue('');
						Ext.getCmp('id_regrind_rate').setRawValue('');
						
						
						
					}
				},this);
		
//				this._MMStore.on('load',function( store, records, successful, eOpts){
//					 _MMStore.on('load',function( store, records, successful, eOpts){
//					
//					if(store.count() > 0)
//					{
//						
//						Ext.getCmp('id_mixed_material_code').setRawValue(store.first().get('mixed_material_code'));
//						Ext.getCmp('id_existing').setRawValue(true);
//						
//						
//					}
//					else
//					{
//						Ext.getCmp('id_existing').setRawValue(false);
//						Ext.getCmp('id_mixed_material_code').setRawValue(this._MMSCodeMax.first().get('mixed_material_code_existing'));
//					}
//					
//				},this);
				
				
				
				
			
					var moldStore = new Ext.data.JsonStore({
					autoLoad : true,
					autoSync: true,
					model: 'EAP.Model.Mold',
					fields : ['productCode','productName', 'cavity'],
					proxy: {
				        type: 'ajax',
				        api: {
				            read: GET_MOLD_LIST_BY_COLOR_MOLD
				        }, 
				        reader: {
				            type: 'json',
				            root: 'InjMoldList',
				            idProperty: 'id',
				            messageProperty:'message'
				        },
				        
				        listeners: {
				            exception: function(proxy, response, operation){
				            Ext.MessageBox.show({
					                title: 'REMOTE EXCEPTION',
					                msg: operation.getError(),
					                icon: Ext.MessageBox.ERROR,
					                buttons: Ext.Msg.OK
				            	});
				        	}
				        }
				        
				    }
				    
				});
			
			
						
			var sm = Ext.create('Ext.selection.CheckboxModel',{
				mode: 'single',
				listeners: 
				{
					select: function( sm, record, index, eOpts )
					{
						if(index < 0)
						{
							Ext.getCmp('id_regrind_rate').setDisabled(true);
							Ext.getCmp('id_mixed_material_weight_send_back').setDisabled(true);
							Ext.getCmp('id_new_material_weight_send_back').setDisabled(true);
						}
						else
						{
							Ext.getCmp('id_regrind_rate').setDisabled(false);
							Ext.getCmp('id_mixed_material_weight_send_back').setDisabled(false);
							Ext.getCmp('id_new_material_weight_send_back').setDisabled(false);
						}
					}
				}
			});
			
			
			var _grid= Ext.apply(this,{
				 		 
							store: moldStore,
					        autoScroll: true,
					        id: 'defectCodeList_',
					       // cellCls: 'x-type-grid-defect-list',
					        stateful: true,
					        multiSelect: false,
					       // autoScroll: true,
					        stateId: 'stateGrid',
					        id: 'idgrid',
					      //  moldJson: departmentJsonData,
					        columns: [
					            {
					                text     : 'Product Code',
					                flex     : 1,
					                sortable : false,
					             
					                dataIndex: 'productCode'
					            },
					            {
					                text     : 'Product Name',
					                sortable : false,
					                flex: 1,
					                dataIndex: 'productName'
					            }],
					       
					        
					        viewConfig: {
					            stripeRows: true,
					            enableTextSelection: true
					        },
					        selModel : sm,
					        listeners: {
					        				itemclick: function(dv, record, item, index, e) 
					        					{
					        						
					        						_product_code_select = record.get('productCode');
					        						_product_name_select = record.get('productName');
					        						
												 	this._RRStore.load({params:{product_code: record.get('productCode') }});	
												 	
												},scope:this
					        			}

				});// end apply
	   			
				this.callParent(arguments);
		}
		
		
});