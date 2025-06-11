Ext.Loader.setConfig({
    enabled: true
});
Ext.define('EAP.Grid.AssetLocationGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    title: 'Asset location list',
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    header: false,
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
                },'->',this.departmentList]
            }],
            columns: [{
	            	header: 'Location code',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'locationCode',
	                field: {
	                    type: 'textfield'
	                }
                 },{
	            	header: 'Location name',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'locationName',
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
			msg : 'Are you sure to delete this asset location',
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
        var rec = new EAP.Model.AssetLocation({
        	locationCode: '',
        	locationName: ''

        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
    }
});