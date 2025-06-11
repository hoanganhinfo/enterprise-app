Ext.define('Inj.Panel.MaterialPreparationMix',{
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
		title: 'Utilize available mixed material if have',
		layout:{ type : 'table', columns: 3 },
		border: true,
		initComponent:function()
		{
			this.items = [
							this.column_1(),
						
							this.column_2(),
							
							this.column_3()
						],
							
			
					
				this.callParent(arguments);
		},
		column_1:function()
		{
			var _panel = Ext.create('Ext.panel.Panel',{
				width: 250,
				height: 'auto',
				border: false,
				items: 	[
							
							{
								xtype: 'label',
								text:'Mixed material internal code: '
							},
							{
								xtype: 'textfield',
								width: 230,
								readOnly:true,
								id: 'id_mixed_material_internal_code',
								inputId: 'inputId_mixed_material_internal_code'
							}
							
						]
			});
			return _panel;
		},
		column_2:function()
		{
			var _panel = Ext.create('Ext.panel.Panel',{
				width: 250,
				height: 'auto',
				border: false,
				items: 	[
							
							{
								xtype: 'label',
								html:'Mixed material weight available'+_kg
							},
							{
								xtype: 'textfield',
								width: 230,
								readOnly:true,
								fieldStyle: 'text-align: right;',
								id: 'id_mixed_material_weight_available',
								inputId:'inputId_mixed_material_weight_available'
							}
							
						]
			});
			return _panel;
		},
		column_3:function()
		{
			var _panel = Ext.create('Ext.panel.Panel',{
				width: 250,
				height: 'auto',
				border: false,
				items: 	[
							
							{
								xtype: 'label',
								html:'Mixed material weight used'+_kg_s
							},
							{
								xtype: 'textfield',
								width: 230,
								allowBlank: false,
								enableKeyEvents: true,
								fieldStyle: 'text-align: right;',
								maskRe: /[0-9.]/,
								fieldStyle: 'text-align: right;',
								id: 'id_mixed_material_weight_used',
								inputId:'inputId_mixed_material_weight_used',
								listeners: {
									keyup( f, e, eOpts )	{
										calculate();
									},
												change: function(field , newValue, oldValue, eOpts)
												{
//													if(_check_store == false)
//													{
//														var _msg = 'Selected product has no regrind rate data for calculator.\nPlease setup regrind rate before use.';
//														Ext.MessageBox.show({title: 'Exception', msg: _msg,icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); 
//														return;
//														
//													}
//													var _cavity  = Ext.getCmp('real_cavity_number').getRawValue();
//													var _parts_quantity_planned = Ext.getCmp('id_parts_quantity_planned').getRawValue();
//													var _id_MM_weight_used = Ext.getCmp('id_mixed_material_weight_used').getRawValue();
//													
//													if(_cavity.trim().length >0 && _id_MM_weight_used.trim().length >0)
//													{
//														var _cavityFloat = parseFloat(_cavity);
//														if(_cavityFloat > 0.0)
//														{
//															_total_material_weight = (parseFloat(_parts_quantity_planned) * (_product_weight + _runner_weight/_cavityFloat));
//															var _tick_box_start_production = Ext.getCmp('id_start_production').getValue();
//															var _tick_box_regrind_shortage = Ext.getCmp('id_regrind_shortage').getValue();
//															//alert(_tick_box_start_production+' '+_tick_box_regrind_shortage);
//															if(_tick_box_start_production == true)
//															{
//																//alert(_tick_box_start_production+' '+_tick_box_regrind_shortage);
//																_total_material_weight = _total_material_weight *1.03 *_constant_scrap;
//															}
//															else
//															//if(_tick_box_regrind_shortage == true)
//															{
//																//alert(_tick_box_start_production+' '+_tick_box_regrind_shortage);
//																_total_material_weight = _total_material_weight *1.03;
//															}
////															if(_tick_box_start_production== false && _tick_box_regrind_shortage == false)
////															{
////																alert("Please tick checkbox");
////															}
//															//_total_material_weight = parseFloat(_parts_quantity_planned) * (_product_weight + _runner_weight/_cavityFloat);
//														}
//														else
//														{
//															alert('cavity must be > 0');
//															return;
//														}
//													}
//													else
//													{
////														alert('please check input');
//														return;
//													}
//													
//													
//													var TOTAL_NEW_RESIN_WEIGHT = (1-(_regrind_rate/100)) *( _total_material_weight - parseFloat(Ext.getCmp('id_mixed_material_weight_used').getRawValue()));
//													var TOTAL_REGRIND_RESIN_WEIGHT = (_regrind_rate/100) *( _total_material_weight - parseFloat(Ext.getCmp('id_mixed_material_weight_used').getRawValue()));
//													var MASTERBATCH_WEIGHT = ( _total_material_weight - parseFloat(_id_MM_weight_used))* (_color_rate/100);
//													
//													//------------
//													var fixValue = parseFloat(Math.pow(10,3));
//													
//													var TOTAL_NEW_RESIN_WEIGHT_Round = parseInt(Math.round(TOTAL_NEW_RESIN_WEIGHT * fixValue)) / fixValue;
//													var TOTAL_REGRIND_RESIN_WEIGHT_Round = parseInt(Math.round(TOTAL_REGRIND_RESIN_WEIGHT * fixValue)) / fixValue;
//													var MASTERBATCH_WEIGHT_Round = parseInt(Math.round(MASTERBATCH_WEIGHT * fixValue)) / fixValue;
//													
//													//--------------
//													//TOTAL_NEW_RESIN_WEIGHT = round_number(TOTAL_NEW_RESIN_WEIGHT,3);
//													Ext.getCmp('id_total_new_resin_weight').setRawValue(TOTAL_NEW_RESIN_WEIGHT_Round);
//													Ext.getCmp('id_total_regrind_resin_weight').setRawValue(TOTAL_REGRIND_RESIN_WEIGHT_Round);
//													Ext.getCmp('id_total_masterbatch_weight').setRawValue(MASTERBATCH_WEIGHT_Round*1000);
												}
											}
							}
							
						]
			});
			return _panel;
		},
		round_number: function (dec,fix) 
		{
				var fixValue = parseFloat(Math.pow(10,fix));
				var retValue = parseInt(Math.round(dec * fixValue)) / fixValue;
				return retValue;
		}
		
		
		
		
		
		
});