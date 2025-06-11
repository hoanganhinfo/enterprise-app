Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.define('EAP.Grid.AssetCategoryGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn'
    ],
    title: 'Asset category list',
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });

        Ext.apply(this, {
            frame: true,
            plugins: [this.editing],
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
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                },'->',departmentCombo]
            }],
            columns: [{
	            	header: 'Category name',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'categoryname',
	                field: {
	                    type: 'textfield'
	                }
                 }],
          selModel: {
            selType: 'cellmodel'
        	},
        });
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        this.on('afterrender', function(editor,e){
        	//alert(e.field);
        	departmentCombo.select(departmentCombo.getStore().getAt(0));
        	departmentCombo.fireEvent('select', departmentCombo,departmentCombo.getStore().getRange(0,0));

        },this);
    },

    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Defect code',
			msg : 'Are you sure to delete this asset category',
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

    onAddClick: function(){
        var rec = new EAP.Model.AssetCategory({
        	assetCategoryName: '',
        	departmentId: Ext.getCmp('cboDepartment').getValue()

        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
    }
});