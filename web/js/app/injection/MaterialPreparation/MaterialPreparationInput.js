Ext.define('Inj.Panel.MaterialPreparationInput',{
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
		height: 400,
		bodyPadding: 5,
		title: ' ',
		layout:{ type : 'table', columns: 5 },
		tdAttrs: {
            style: {
            	padding: '5px'
            }
        },
		border: true,
		initComponent:function()
		{
			this.items  = [		{
								xtype: 'textfield', // line 1
								fieldLabel: 'New resin code',
								labelAlign: 'top',
								width:'200',
								readOnly:true,
								id: 'id_new_resin_code',
								inputId: 'inputId_new_resin_code'
								},{
									xtype: 'textfield',
									fieldLabel: 'New resin name',
									labelAlign: 'top',
									width:'200',
									readOnly:true,
									id: 'id_new_resin_name',
									inputId: 'inputId_new_resin_name'
								},{
									xtype: 'textfield',
									fieldLabel: 'Proposed new resin weight'+_kg,
									labelAlign: 'top',
									fieldStyle: 'text-align: right;',
									width:'200',
									readOnly:true,
									size: 5,
									id: 'id_total_new_resin_weight'
								},{
									xtype: 'textfield',
									fieldLabel: 'Actual new resin weight'+_kg,
									labelAlign: 'top',
									fieldStyle: 'text-align: right;',
									width:'200',
									allowBlank: false,
									enableKeyEvents: true,
									id: 'id_real_new_material_weight',
									inputId: 'inputId_real_new_material_weight',
									maskRe: /[0-9.]/,
									listeners: 	{
										keyup( f, e, eOpts )	{
											calculate();
										},
			          					scope: this
									}
								},{
									xtype: 'checkbox',
									rowspan: 3,
									fieldLabel: 'Regrind Shortage',
									labelAlign: 'right',
									name:'startproduction',
									inputValue: '1',
								    id        : 'id_regrind_shortage'
								},{
									xtype: 'textfield', //line 2
									fieldLabel: 'Regrind resin code',
									width:'200',
									labelAlign: 'top',
									readOnly:true,
									id: 'id_regrind_resin_code',
									inputId:'inputId_regrind_resin_code'
									
								},{
									xtype: 'textfield',
									fieldLabel: 'Regrind resin name',
									width:'200',
									labelAlign: 'top',
									readOnly:true,
									id: 'id_regrind_resin_name',
									inputId: 'inputId_regrind_resin_name'
									
								},{
									xtype: 'textfield',
									fieldLabel: 'Proposed regrind resin weight'+_kg,
									fieldStyle: 'text-align: right;',
									width:'200',
									labelAlign: 'top',
									readOnly:true,
									size: 5,
									id: 'id_total_regrind_resin_weight'
									
								},{
									xtype: 'textfield',
									fieldLabel: 'Actual regrind resin weight'+_kg,
									fieldStyle: 'text-align: right;',
									width:'200',
									labelAlign: 'top',
									allowBlank: false,
									enableKeyEvents: true,
									maskRe: /[0-9.]/,
									inputId: 'inputId_real_regrind_weight',
									id: 'id_real_regrind_weight',
									listeners: 	{
										keyup( f, e, eOpts )	{
											calculate();
										},
			          					scope: this
									}
								},{
									xtype: 'textfield', //line 3
									fieldLabel: 'MasterBatch code',
									width:'200',
									labelAlign: 'top',
									readOnly:true,
									id: 'id_masterbatch_code',
									inputId:'inputId_masterbatch_code'
								},{
									xtype: 'textfield',
									fieldLabel: 'MasterBatch name',
									width:'200',
									labelAlign: 'top',
									readOnly:true,
									id: 'id_masterbatch_name',
									inputId: 'inputId_masterbatch_name'
									
								},{
									xtype: 'textfield',
									fieldLabel: 'Proposed masterbatch weight'+_g,
									fieldStyle: 'text-align: right;',
									width:'200',
									labelAlign: 'top',
									readOnly:true,
									size: 5,
									
									id: 'id_total_masterbatch_weight'
									
								},{
									xtype: 'textfield',
									fieldLabel: 'Actual masterbatch weight'+_g_s,
									fieldStyle: 'text-align: right;',
									width:'200',
									labelAlign: 'top',
									allowBlank: false,
									enableKeyEvents: true,
									maskRe: /[0-9.]/,
									inputId:'inputId_real_masterbatch_weight',
									id: 'id_real_masterbatch_weight',
									listeners: 	{
										keyup( f, e, eOpts )	{
											calculate();
										},
			          					scope: this
									}
									
								}
			               ]
				this.callParent(arguments);
		}
})
