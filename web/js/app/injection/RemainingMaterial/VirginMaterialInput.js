
var GET_MOLD_LIST = '/enterprise-app/service/getMoldList';
var GET_MOLD_LIST_BY_COLOR = '/enterprise-app/service/getMoldListByColor';


Ext.define('OldF.VirginMaterial.Input',{
		extend: 'Ext.form.Panel',
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
//		border: false,
		layout:{ type : 'table', columns: 4 },
		initComponent:function()
		{
				this.items = [
								this.column1(),
								this.column2(),
								this.column3()
							],
							
				this.callParent(arguments);
		},
		column1:function()
		{
			
			var _panelColumn = Ext.create('Ext.panel.Panel',{
			width: 150,
			height: 'auto',
			border: false,
			items:	[
						{
							xtype: 'label',
							text:'New resin code: '
						},
						{
							xtype: 'textfield',
							width: 130,
							readOnly:true,
							id: 'id_new_resin_code'
							
						}
					]
			});
			return _panelColumn;
		},
		column2:function()
		{
			var _panelColumn = Ext.create('Ext.panel.Panel',{
			width: 150,
			height: 'auto',
			border: false,
			items:	[
						{
							xtype: 'label',
							text:'New resin name: '
						},
						{
							xtype: 'textfield',
							width: 130,
							readOnly:true,
							id: 'id_new_resin_name'
							
						}
					]
			});
			return _panelColumn;
		},
		column3:function()
		{
			var _panelColumn = Ext.create('Ext.panel.Panel',{
			width: 210,
			height: 'auto',
			border: false,
			
			colspan: 2,
			items:	[
						{
							xtype: 'label',
							html:'New material weight send back '+_kg
						},
						{
							xtype: 'textfield',
							width: 160,
							maskRe: /[0-9.]/,
							id: 'id_new_material_weight_send_back'
						}
					]
			});
			return _panelColumn;
		}
		
		
		
});













