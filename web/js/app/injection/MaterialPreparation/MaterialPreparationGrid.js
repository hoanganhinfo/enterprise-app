
var GET_MOLD_LIST_BY_COLOR_MOLD = '/enterprise-app/service/getMoldListByColorAndMold';
var GET_REGRIND_RATE_LIST_BY_MOLDCODE = '/enterprise-app/service/getMoldRegrindRateByProductCode';



Ext.define('Inj.Grid.MaterialPreparationGrid',{
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
		_MMStore: null,
		_virgin_material_name: null,
		_regrind_material_name: null,
		_regrind_rate: null,
		title : 'Please select a product in list',
		initComponent:function()
		{
								
			
			this._MMStore = new Ext.data.JsonStore({
				    
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
				        		//alert(store.first().get('product_name'));
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
						
						_product_weight = store.first().get('product_weight');
						_runner_weight =  store.first().get('runner_weight');
						_regrind_rate =   store.first().get('regrind_rate');
						_color_rate =   store.first().get('color_rate');
						_constant_scrap =store.first().get('constant_scrap');
						if (!Ext.isNumeric(_color_rate)){
							_color_rate = 0;					
						}
						if (!Ext.isNumeric(_regrind_rate)){
							_regrind_rate = 0;					
						}
						if (!Ext.isNumeric(_constant_scrap)){
							_constant_scrap = 0;					
						}
						this._virgin_material_name = store.first().get('virgin_material_name');
						this._regrind_material_name = store.first().get('regrind_resin_name');
						
						
					 
						
						Ext.getCmp('id_new_resin_code').setRawValue(store.first().get('virgin_material_code'));
						Ext.getCmp('id_new_resin_name').setRawValue(store.first().get('virgin_material_name'));
						
						Ext.getCmp('id_regrind_resin_code').setRawValue(store.first().get('regrind_resin_code'));
						Ext.getCmp('id_regrind_resin_name').setRawValue(store.first().get('regrind_resin_name'));
						
						Ext.getCmp('id_masterbatch_code').setRawValue(store.first().get('masterbatch_code'));
						Ext.getCmp('id_masterbatch_name').setRawValue(store.first().get('masterbatch_name'));
						
						//alert(_regrind_rate + ' || '+_color_rate );
						var fixValue = parseFloat(Math.pow(10,2));
						var aa1 = parseFloat(_regrind_rate)/100 * 20;
						
						var bb1 = parseFloat(_color_rate)/100 * 20;
						var aa = parseInt(Math.round(aa1 * fixValue)) / fixValue;
						var bb = parseInt(Math.round(bb1 * fixValue)) / fixValue;
						
						//Ext.getCmp('id_regrind_resin_20kg').setRawValue(aa);
						//	Ext.getCmp('id_masterbatch_20kg').setRawValue(bb);
						
						Ext.getCmp('frmInput').setTitle('For each 20kg new resin, consume '+aa+'kg regrind resin with '+bb+'kg materbatch')
						
						_check_store = true;
						  this._MMStore.load({params:{virgin_material_name:this._virgin_material_name ,regrind_material_name:this._regrind_material_name,regrind_rate: _regrind_rate,color:_color_select }});
						  // enable fields
							Ext.getCmp('id_real_new_material_weight').setDisabled(false);
							Ext.getCmp('id_real_regrind_weight').setDisabled(false);
							Ext.getCmp('id_real_masterbatch_weight').setDisabled(false);
							Ext.getCmp('id_mixed_material_weight_used').setDisabled(false);
							Ext.getCmp('real_cavity_number').setDisabled(false);		
							Ext.getCmp('id_parts_quantity_planned').setDisabled(false);
							
							Ext.getCmp('id_start_production').setDisabled(false);
							Ext.getCmp('id_regrind_shortage').setDisabled(false);
						  
						 //----
						Ext.getCmp('id_total_new_resin_weight').setRawValue('');
					    Ext.getCmp('id_total_regrind_resin_weight').setRawValue('');
						Ext.getCmp('id_total_masterbatch_weight').setRawValue('');
						Ext.getCmp('real_cavity_number').setRawValue('');
						
						Ext.getCmp('id_parts_quantity_prepared').setRawValue('');
						Ext.getCmp('id_parts_quantity_planned').setRawValue('');
						Ext.getCmp('id_mixed_material_weight_used').setRawValue('');
						
						
						Ext.getCmp('id_real_new_material_weight').setRawValue('');
						Ext.getCmp('id_real_regrind_weight').setRawValue('');
						Ext.getCmp('id_real_masterbatch_weight').setRawValue('');
						
						Ext.getCmp('id_regrind_shortage').setRawValue(false);
						Ext.getCmp('id_start_production').setRawValue(false);
						
					}
					else
					{
						_check_store = false;
						
						_product_weight = 0.0;
						_runner_weight =  0.0;
						_regrind_rate =   0.0;
						_color_rate =0.0;
						_constant_scrap = 0.0;
						_total_material_weight =0.0;
						
						 _regrind_shortage =0;
						 _color_select ='';
						 _moldNumber_select='';
						 _product_code_select='';
						 _product_name_select='';
						 _MMS_Regrind_material_name ='';
						
						
						Ext.getCmp('id_new_resin_code').setRawValue('');
						Ext.getCmp('id_new_resin_name').setRawValue('');
						
						Ext.getCmp('id_regrind_resin_code').setRawValue('');
						Ext.getCmp('id_regrind_resin_name').setRawValue('');
						
						Ext.getCmp('id_masterbatch_code').setRawValue('');
						Ext.getCmp('id_masterbatch_name').setRawValue('');
						Ext.getCmp('id_mixed_material_internal_code').setRawValue('');
						Ext.getCmp('id_mixed_material_weight_available').setRawValue('');
						// disable fields
						Ext.getCmp('id_real_new_material_weight').setDisabled(true);
						Ext.getCmp('id_real_regrind_weight').setDisabled(true);
						Ext.getCmp('id_real_masterbatch_weight').setDisabled(true);
						Ext.getCmp('id_mixed_material_weight_used').setDisabled(true);
						Ext.getCmp('real_cavity_number').setDisabled(true);		
						Ext.getCmp('id_parts_quantity_planned').setDisabled(true);
						
						Ext.getCmp('id_start_production').setDisabled(true);
						Ext.getCmp('id_regrind_shortage').setDisabled(true);
						//----
						Ext.getCmp('id_total_new_resin_weight').setRawValue('');
					    Ext.getCmp('id_total_regrind_resin_weight').setRawValue('');
						Ext.getCmp('id_total_masterbatch_weight').setRawValue('');
						Ext.getCmp('real_cavity_number').setRawValue('');
						
						Ext.getCmp('id_parts_quantity_prepared').setRawValue('');
						Ext.getCmp('id_parts_quantity_planned').setRawValue('');
						Ext.getCmp('id_mixed_material_weight_used').setRawValue('');
						
						
						Ext.getCmp('id_real_new_material_weight').setRawValue('');
						Ext.getCmp('id_real_regrind_weight').setRawValue('');
						Ext.getCmp('id_real_masterbatch_weight').setRawValue('');
						
						Ext.getCmp('id_regrind_shortage').setRawValue(false);
						Ext.getCmp('id_start_production').setRawValue(false);
						var _msg = 'Selected product has no regrind rate data for calculator.\nPlease setup regrind rate before use.';
						Ext.MessageBox.show({title: 'Exception', msg: _msg,icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); 
					}
				},this);
		
				this._MMStore.on('load',function( store, records, successful, eOpts){
					
					if(store.count() > 0)
					{
						
						_MMS_Regrind_material_name = store.first().get('regrind_material_name');
						Ext.getCmp('id_mixed_material_internal_code').setRawValue(store.first().get('mixed_material_code'));
						Ext.getCmp('id_mixed_material_weight_available').setRawValue(store.first().get('weight'));
				
					}
					else
					{
						Ext.getCmp('id_mixed_material_internal_code').setRawValue('');
						Ext.getCmp('id_mixed_material_weight_available').setRawValue('');
					}
				},this);
				
				
				
				
			
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
			
			
						
			var sm = Ext.create('Ext.selection.CheckboxModel',{mode: 'single',
			listeners: {
				select: function( sm, record, index, eOpts )
						{
							if(index < 0)
							{
								Ext.getCmp('id_real_new_material_weight').setDisabled(true);
								Ext.getCmp('id_real_regrind_weight').setDisabled(true);
								Ext.getCmp('id_real_masterbatch_weight').setDisabled(true);
								Ext.getCmp('id_mixed_material_weight_used').setDisabled(true);
								Ext.getCmp('real_cavity_number').setDisabled(true);		
								Ext.getCmp('id_parts_quantity_planned').setDisabled(true);
								
								Ext.getCmp('id_start_production').setDisabled(true);
								Ext.getCmp('id_regrind_shortage').setDisabled(true);
							}
							else
							{
								Ext.getCmp('id_real_new_material_weight').setDisabled(false);
								Ext.getCmp('id_real_regrind_weight').setDisabled(false);
								Ext.getCmp('id_real_masterbatch_weight').setDisabled(false);
								Ext.getCmp('id_mixed_material_weight_used').setDisabled(false);
								Ext.getCmp('real_cavity_number').setDisabled(false);		
								Ext.getCmp('id_parts_quantity_planned').setDisabled(false);
								
								Ext.getCmp('id_start_production').setDisabled(false);
								Ext.getCmp('id_regrind_shortage').setDisabled(false);
							}
							
						}
			}
			});
			
			var _grid= Ext.apply(this,{
				 		 
							store: moldStore,
					        autoScroll: true,
					        id: 'defectCodeList_',
					        stateful: true,
					        multiSelect: false,
					        autoScroll: true,
					        stateId: 'stateGrid',
					        id: 'idgrid',
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
					            },
					            {
					                text     : 'Cavity',
					                sortable : false,
					                flex: 1,
					                dataIndex: 'cavity'
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