
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.require([
             'Ext.ux.grid.FiltersFeature'
         ]);
Ext.define('OldF.Mold.MoldList', {
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
            columns: [	
                 		{header: 'Mold Code',width: 100,sortable: true,dataIndex: 'moldCode',filter: true,editor:{xtype: 'textfield',allowBlank: false}},
                 		{header: 'Product Code',width: 100,sortable: true,dataIndex: 'productCode',filter: true,editor:{xtype: 'textfield',allowBlank: false}},
                 		{header: 'Product Name',width: 200,sortable: true,dataIndex: 'productName',filter: true,editor:{xtype: 'textfield',allowBlank: false}},
                 		{header: 'Project Name',width: 200,sortable: true,dataIndex: 'projectName',filter: true,editor:{xtype: 'textfield',allowBlank: false}},
                 		{header: 'Color',width: 100,sortable: true,dataIndex: 'color',filter: true,editor:{xtype: 'textfield',allowBlank: false}},
                 		{header: 'Cavity Number',width: 100,sortable: true,dataIndex: 'cavity',xtype: 'numbercolumn',filter: true,editor:{xtype: 'textfield',allowBlank: false}}
                 ],
          selModel: {
            selType: 'cellmodel'
        	}
        });
        this.callParent(arguments);
        
    },
    onAddClick: function(){
    	var rec = new EAP.Model.Mold({
        	id:'',
        	moldCode:'',
        	productCode:'',
        	productName:'',
        	cavity:''
            
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
			title : 'Mold',
			msg : 'Are you sure to delete this Mold code',
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









