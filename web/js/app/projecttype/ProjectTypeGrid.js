Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Ext.ux', '/enterprise_app/js/extjs4.1/examples/ux');


Ext.define('EAP.Grid.ProjectTypeGrid',{
	extend: 'Ext.grid.Panel',
	requires: 	[
					'Ext.grid.plugin.CellEditing',
					'Ext.form.field.Text',
					'Ext.toolbar.TextItem',
					'Ext.ux.CheckColumn'
				],

	initComponent:function()
	{
		var checkItem = Ext.create('Ext.selection.CheckboxModel',{mode: 'SINGLE'});
		this.Editting = Ext.create('Ext.grid.plugin.CellEditing',{ clicksToEdit: 1, listeners: {scope: this }});
	 //	this.cellEditting = Ext.create('Ext.grid.plugin.CellEditing',{ clicksToEdit: 1, listeners: {scope: this}});

		Ext.apply(this,{
			selModel: checkItem,
			id: 'idPT',
			frame: true,
			fieldDefaults: { msgTarget: 'side'},
			plugins: [this.Editting],
			dockedItems:	[{
									xtype: 'toolbar',
									items:	[
												{xtype: 'button'	,text: 'New'	, 	iconCls: 'icon-add'		,scope: this	,scale: 'medium',handler: this.onEvent_New		},
												{xtype: 'button'	,text: 'Delete'	, 	iconCls: 'icon-delete'	,scope: this	,scale: 'medium',handler: this.onEvent_Delete	},
												{xtype: 'button'	,text: 'Fresh'	,	iconCls: 'icon-fresh'	,scope: this	,scale: 'medium',handler: this.onEvent_Fresh	}
											]
							}],
			columns: 		[
								{header: 'Name'			,flex: 1		,dataIndex: 'name'	,editor: { xtype: 'textfield',  allowBlank: true } },
								{header: 'Active',xtype: 'checkcolumn',dataIndex: 'status',width: 55}
							]
		});
		this.callParent(arguments);
	}
	,onEvent_New:function()
	{
		var rec = new EAP.Model.ProjectType({
			name: '',
			status: true
		});
		var editing = this.Editting;
		editing.cancelEdit();
		this.store.insert(0,rec);
		editing.startEditByPosition({row: 0, column: 0});


	}
	,onEvent_Delete:function()
	{
		var selection = this.getView().getSelectionModel().getSelection();
		Ext.Msg.alert({
			title: 'Project type',
			msg: 'Are you sure to delete',
			icon: Ext.MessageBox.QUESTION,
			buttons: Ext.MessageBox.YESNO,
			scope: this,
			fn: function(ButtonID)
			{
				if(ButtonID != 'yes')
				return;
				if(selection.length>0)
				{
					for(var i = 0 ; i< selection.length; i++)
					{
						this.store.remove(selection[i]);

					}
				}


			}
		});

	}
	,onEvent_Fresh:function()
	{
		Ext.getCmp("idPT").getStore().load();
	}
});


