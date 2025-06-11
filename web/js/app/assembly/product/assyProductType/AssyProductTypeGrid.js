
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.define('Ass.AssyProductType.Grid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn'
    ],
    title : 'Product type',
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
            frame: true,
            id: 'idassyGrid',
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scale : 'medium',
                    scope: this,
                    handler: this.onAddClick
                }, 
                {
                    iconCls: 'icon-delete',
                    scale : 'medium',
                    text: 'Delete',
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                    
                },
                {
                    iconCls: 'icon-fresh',
                    scale : 'medium',
                    text: 'Refresh',
                    itemId: 'refresh',
                    scope: this,
                    handler: this.onFresh
                    
                }]
            }],
            columns: [{
			            	header: 'Product type',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'product_type',
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: false
		               		}
                 		},
                 		{
			            	header: 'Product type name',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'product_type_name',
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: false
		               		}
                 		},{
			            	header: 'Prefix function',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'prefix_function',
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: false
		               		}
                 		},{
			            	header: 'Serial size',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'serial_size',
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: false
		               		}
                 		},{
			            	header: 'padding',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'padding',
			                editor: 
                 			{
		                    	xtype: 'textfield'
		               		}
                 		},{
                 			header: 'Auto result',
                 			xtype: 'checkcolumn',
                 			dataIndex: 'autoresult',
				            flex: 1,
				            sortable: true,
				            scope:this
                 		},{
	                 		header: 'Use Tester',
	             			xtype: 'checkcolumn',
	             			dataIndex: 'tester',
				            flex: 1,
				            sortable: true,
				            scope:this
             			},{
			            	header: 'reportUrl',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'reportUrl',
			                editor: 
                 			{
		                    	xtype: 'textfield'
		               		}
                 		}],
                 		
                 		
                 
          selModel: {
            selType: 'cellmodel'
        	}
        });
        this.callParent(arguments);
        
    },
	listeners : {
		select: function( dv, record, index, eOpts )
		{
			selectedProductType = record.get('id');
			if (!Ext.isEmpty(selectedProductType)){
				assyProjectStationStore.load({scope : this, params :  {productTypeId: selectedProductType}});
			}
		},
	    itemdblclick: function(dv, record, item, index, e) 
	    {
						
	    }
	},    
    onAddClick: function(){
        var rec = new EAP.Model.AssyProductType({
        	id:'',
        	product_type:'',
        	serial_size : '0',
        	autoresult: 0,
        	autoresult: 0
        	
            
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
			msg : 'Are you sure to delete this product type',
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
    onFresh:function()
    {
    	Ext.getCmp("idassyGrid").getStore().load();
    }
    
    
});

