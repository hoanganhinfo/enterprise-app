
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.require([
             'Ext.ux.grid.FiltersFeature'
         ]);
Ext.define('OldF.Regrindrate.Grid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn',
        'Penta.view.SearchTrigger'
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
            frame: true,
            autoScroll: true,
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scale : 'medium',
                    scope: this,
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-delete',
                    scale : 'medium',
                    text: 'Delete',
                    //disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                    
                }]
            }],
            plugins: [{
	        	ptype: 'filterbar',
	        	renderHidden: false,
	        	showShowHideButton: true,
	        	showClearAllButton: true
			},this.editing],
            columns: [{header: 'Product code',width: 120,sortable: true,filter: true,dataIndex: 'product_code',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Product name',width: 200,sortable: true,filter: true,dataIndex: 'product_name',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Virgin material code',width: 120,sortable: true,filter: true,dataIndex: 'virgin_material_code',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Virgin material name',width: 200,sortable: true,filter: true,dataIndex: 'virgin_material_name',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Masterbatch code',width: 120,sortable: true,filter: true,dataIndex: 'masterbatch_code',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Masterbatch name',width: 200,sortable: true,filter: true,dataIndex: 'masterbatch_name',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Regrind resin code',width: 120,sortable: true,filter: true,dataIndex: 'regrind_resin_code',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Regrind resin name',width: 200,sortable: true,filter: true,dataIndex: 'regrind_resin_name',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Color rate(%)',width: 80,sortable: true,xtype: 'numbercolumn',dataIndex: 'color_rate',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Regrind Rate(%)',width: 80,sortable: true,dataIndex: 'regrind_rate',xtype:'numbercolumn',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Constant Scrap(%)',width: 120,sortable: true,xtype: 'numbercolumn',dataIndex: 'constant_scrap',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Runner Weight(g)',width: 80,sortable: true,xtype: 'numbercolumn',dataIndex: 'runner_weight',editor:{xtype: 'textfield',allowBlank: false}},
                 	  {header: 'Product Weight(g)',width: 80,sortable: true,xtype: 'numbercolumn',dataIndex: 'product_weight',editor:{xtype: 'textfield',allowBlank: false}}
                 ],
          selModel: {
            selType: 'cellmodel'
        	}
        });
        this.callParent(arguments);
        
    },
    onAddClick: function(){
        var rec = new OldF.Mold.Regrindrate({
        	id :'',
            product_code:'',
            product_name:'',
            virgin_material_code:'',
            virgin_material_name:'',
            masterbatch_code:'',
            masterbatch_name:'',
            regrind_resin_code:'',
            regrind_resin_name:'',
            color_rate:'',
            regrind_rate:'' ,
            constant_scrap:'',
            runner_weight: '',
            product_weight: ''
            
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
			title : 'Regrind rate',
			msg : 'Are you sure to delete this regrind rate code',
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
    }
    
    
});









