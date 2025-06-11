Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.define('Assy.AssyParameter.Grid', {
	extend : 'Ext.grid.Panel',
	requires : [ 'Ext.grid.plugin.CellEditing', 'Ext.form.field.Text',
			'Ext.toolbar.TextItem', 'Ext.ux.CheckColumn' ],

	viewConfig : {
		emptyText : 'There are no records to display',
		deferEmptyText : false
	},
	initComponent : function() {
		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			listeners : {
				beforeedit : function(e, editor) {

				},
				scope : this
			}
		});

		Ext.apply(this, {
			frame : true,
			id : 'idassyParameterGrid',
			plugins : [ this.editing ],
			dockedItems : [ {
				xtype : 'toolbar',
				items : [ {
					iconCls : 'icon-add',
					text : 'Add',
					scale : 'medium',
					scope : this,
					handler : this.onAddClick
				}, {
					iconCls : 'icon-delete',
					scale : 'medium',
					text : 'Delete',
					itemId : 'delete',
					scope : this,
					handler : this.onDeleteClick

				}, {
					iconCls : 'icon-fresh',
					scale : 'medium',
					text : 'Refresh',
					itemId : 'fresh',
					scope : this,
					handler : this.onFresh

				}]
			} ],
			columns : [ {
				header : 'Parameter code',
				flex : 1,
				sortable : true,
				dataIndex : 'parameter_code',
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				header : 'Parameter Name',
				flex : 1,
				sortable : true,
				dataIndex : 'parameter_name',
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				header : 'Parameter size',
				flex : 1,
				sortable : true,
				dataIndex : 'parameter_size',
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			},{
				header : 'Parameter colspan',
				flex : 1,
				sortable : true,
				dataIndex : 'parameter_colspan',
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			},{
				header : 'Parameter width',
				flex : 1,
				sortable : true,
				dataIndex : 'parameter_width',
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			},{
				header : 'Parameter value',
				flex : 1,
				sortable : true,
				dataIndex : 'parameter_value',
				editor : {
					xtype : 'textfield',
					allowBlank : true
				}
			},{
               	 header: 'Negative value',
            	 xtype: 'checkcolumn',
                 dataIndex: 'negative_value',
                 width: 55
             },{
				header : 'Validate URL',
				flex : 1,
				sortable : true,
				dataIndex : 'validateUrl',
				editor : {
					xtype : 'textfield',
					allowBlank : true
				}
			}],

			selModel : {
				selType : 'cellmodel'
			}
		});
		this.callParent(arguments);

	},
	onAddClick : function() {
		var rec = new EAP.Model.AssyParameter({
			id : '',
			parameter_name : '',
			parameter_size: 0,
			parameter_colspan: 1,
			parameter_width: 250,
			negative_value: false

		}), edit = this.editing;

		edit.cancelEdit();
		this.store.insert(0, rec);
		edit.startEditByPosition({
			row : 0,
			column : 0
		});
	},
	onDeleteClick : function() {

		var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Assy Product Type',
			msg : 'Are you sure to delete this product type',
			icon : Ext.Msg.QUESTION,
			buttons : Ext.Msg.YESNO,
			scope : this,
			defaultFocus : 2,
			fn : function(buttonId) {
				if (buttonId != 'yes') {
					return;
				}
				if (selection) {
					this.store.remove(selection);
				}

			},
			icon : Ext.MessageBox.QUESTION
		});
	},
	onFresh : function() {
		this.getStore().load();
	}

});
