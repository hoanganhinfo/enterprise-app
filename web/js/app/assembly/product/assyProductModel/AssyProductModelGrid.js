
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.define('Assy.AssyProductModel.Grid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn'
    ],
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    initComponent: function(){ 
				
       this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                        
                },
                scope: this
            }
        });
        
        Ext.apply(this, {
            id: 'idassypmGrid',
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
            	itemId: 'toptoolbar',
                items: [{
                	
                    iconCls: 'icon-add',
                    id: 'btn_add',
                    text: 'Add',
                    scale : 'medium',
                    scope: this,
                    handler: this.onAddClick
                }, 
                {
                	
                    iconCls: 'icon-delete',
                    id: 'btn_delete',
                    scale : 'medium',
                    text: 'Delete',
                    scope: this,
                    handler: this.onDeleteClick
                    
                },'->',this.onCreateAPT()]
            }],
            columns: [{
			            	header: 'Product model',
			                sortable: true,
			                dataIndex: 'product_model',
			                width: 200,
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: false
		               		}
                 		},
                 		{
			            	header: 'Product model name',
			                sortable: true,
			                width: 200,
			                dataIndex: 'product_model_name',
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: true
		               		}
                 		
                 		},{
                 			header: 'Allow duplicate',
                 			xtype: 'checkcolumn',
                 			id: 'allowDuplicate',
                 			width: 100,
				            dataIndex: 'allowDuplicate',
				            sortable: true,
				            scope:this
                 		},{
			            	header: 'Validate function on client',
			                sortable: true,
			                width: 200,
			                dataIndex: 'validateFnOnClent',
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: true
		               		}
			                
                 		},{
			            	header: 'Validate function on server',
			                sortable: true,
			                width: 200,
			                dataIndex: 'validateFnOnServer',
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: true
		               		}
			                
                 		},{
                 			header: 'Active',
                 			xtype: 'checkcolumn',
                 			id: 'idactive',
				            dataIndex: 'status',
				            width: 100,
				            sortable: true,
				            scope:this
                 		},{
                 			header: 'product_type',
                 			disabled: true,
                 			hidden: true,
			                sortable: true,
			                dataIndex: 'product_type',
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                    	id: 'id_product_type',
		                    	scope: this
		               		}
                 		}],
                 		
                 		
                 
          selModel: {
            selType: 'cellmodel'
        	}
        });
			
		
		
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    onSelectChange: function(selModel, selections){
    	
    },
    onAddClick: function(){
    	
        var rec = new EAP.Model.AssyProductModel({
        	id:'',
        	product_model:'',
        	status: true,
        	product_type:Ext.getCmp("cbAssPTNumber").getValue()
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
    },
    onDeleteClick: function()
    {
    	 var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Assy Product Type',
			msg : 'Are you sure to delete this product model',
			icon : Ext.Msg.QUESTION,
			buttons : Ext.Msg.YESNO,
			scope: this,
			defaultFocus: 2,
			fn : function(buttonId) {
				if (buttonId != 'yes'){
					return;
				}
		        if (selection) {
		            this.store.remove(selection);
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },
    
    onCreateAPT:function()
    {
    	
    	var storeAPT = new Ext.data.JsonStore({
						autoLoad : true,
						autoSync: true,
						fields : ['id','product_type'],
						proxy: {
					        type: 'ajax',
					        api: {
					            read: GET_ASSYPT_LIST
					        }, 
					        reader: {
					            type: 'json',
					            root: 'AssyProductTypeList',
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
    				var _cbb =  Ext.create('Ext.form.ComboBox', {
										id: 'cbAssPTNumber',
										fieldLabel:'Select Product Type ',
										labelWidth: 140,
										value :'Select',
										store : storeAPT,
										displayField : 'product_type',
										valueField : 'id',
										typeAhead : true,
										editable: false,
										allowBlank: false,
										msgTarget: 'side',
										triggerAction : 'all',
										queryMode : 'local',
										selectOnTab: true,
										lazyRender: true,
										scope:this,
										listeners:{
														select:function(combo, records, eOpts)
														{
															var _select = records[0].get('id');
															if(_select != null)
															{
																Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_add').setDisabled(false);
																Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_delete').setDisabled(false);
//																Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_product_param').setDisabled(false);
																Ext.getCmp('idassypmGrid').getStore().load({params:{product_type: _select}});
															}
															else
															{
																Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_add').setDisabled(true);
																Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_delete').setDisabled(true);
																Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_product_param').setDisabled(true);
																
															}
															
															
														},scope: this
													}
				    
						});
						return _cbb;
    }
});
