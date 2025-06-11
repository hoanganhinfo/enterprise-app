
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.define('Assy.AssyProductDefect.Grid', {
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
            id: 'idGridAssyProductDefect',
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
                    
                },
                {
					xtype: 'button'	,
					text: 'Refresh'	,	
					iconCls: 'icon-fresh'	,
					scope: this	,
					scale: 'medium',
					handler: this.onEvent_Fresh	
				}]
            }],
            columns: [{
			            	header: 'id',
			                width: 30,
                 			hidden: true,
			                sortable: true,
			                dataIndex: 'id'
			                
                 		},
                 		{
			            	header: 'Defect code',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'defect_code',
			                editor: 
                 			{
		                    	xtype: 'textfield'
		               		}
			                
                 		},
                 		{
			            	header: 'Defect name English',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'defect_name_en',
			                editor: 
                 			{
		                    	xtype: 'textfield'
		               		}
			                
                 		},
                 		
                 		{
			            	header: 'Defect name VietNam',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'defect_name_vn',
			                editor: 
                 			{
		                    	xtype: 'textfield'
		               		}
			                
                 		},
                 		{
                 			header: 'Active',
                 			xtype: 'checkcolumn',
                 			id: 'idactive',
				            dataIndex: 'status',
				            flex: 1,
				            sortable: true,
				            scope:this
                 		}],
                 		
                 		
                 
          selModel: {
            selType: 'cellmodel'
        	}
        });
			
		
		
        this.callParent(arguments);
       
    },
    onAddClick: function(){
    	
        var rec = new EAP.Model.AssyProductDefect({
        	id:'',
        	defect_code:'',
        	defect_name_en:'',
        	defect_code_vn:'',
        	status: false
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
			title : 'Assy Product Defect',
			msg : 'Are you sure to delete this product defect',
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
    onEvent_Fresh:function()
    {
    	this.getStore().load();
    }
    
});
