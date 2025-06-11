Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.define('Inj.Panel.MaterialPreparationAction',{
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
		_MMs: null,
		SAVE_REGRIND_ORDER_URL:'/enterprise-app/service/saveRegrindOrder',
		width: 'auto',
		height: 'auto',
		layout:{ type : 'table', columns: 3  },
		defaults: { bodyStyle: 'padding:10px' },
		border: false,
		margin: '10,0,30,0',
		initComponent:function()
		{
			
			this.items = [
							this.createTextbox()
							,
							{
								border: false
							},
							
							{
								  xtype: 'button', 
								  name: 'btnOK',
								  text : 'OK',
								  scale   : 'large',
								  width: 200,
								  height: 50,
								  cls: 'x-btn-default-large-fail-edited',
								  handler : this.onSuccess,
								  scope : this
							}
							
						],
							
			
					
				this.callParent(arguments);
		},
		createTextbox:function()
		{
			var _panel = Ext.create('Ext.form.Panel',{
				border: false,
				items: [{
								xtype: 'label',
								text: 'Parts quantity prepared: '
							},
							{
								xtype: 'textfield',
								width: 230,
								readOnly:true,
								fieldStyle: 'text-align: right;',
								border: false,
								id: 'id_parts_quantity_prepared',
								inputId: 'inpputId_parts_quantity_prepared'
						}]
							});
							return _panel;
		
		},
		onSuccess:function()
		{
			 
			
			/*
			var s1 =	Ext.getCmp('id_new_resin_code').getRawValue();
			var s2 =	Ext.getCmp('id_regrind_resin_code').getRawValue();
			var s3 =	Ext.getCmp('id_masterbatch_code').getRawValue();
				 
			var s4 =	Ext.getCmp('id_new_resin_name').getRawValue();
			var s5 =	Ext.getCmp('id_regrind_resin_name').getRawValue();
			var s6 =	Ext.getCmp('id_masterbatch_name').getRawValue();
				
				
			var s7 =	Ext.getCmp('id_real_new_material_weight').getRawValue();
			var s8 =	Ext.getCmp('id_real_regrind_weight').getRawValue();
			var s9 =	Ext.getCmp('id_real_masterbatch_weight').getRawValue();
				 
			var s10 =	Ext.getCmp('id_mixed_material_internal_code').getRawValue();
			var s11 =	Ext.getCmp('id_mixed_material_weight_used').getRawValue();
				
			var s12 =	Ext.getCmp('real_cavity_number').getRawValue();
			var s13 =	Ext.getCmp('id_parts_quantity_prepared').getRawValue();
			var _molde = _moldNumber_select;
			*/
			
			var moldCode_check =_moldNumber_select;//select
			if(moldCode_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'You have not selected Mold Code!',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var	color_check = _color_select;//select
			if(color_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'You have not selected Color',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}

			if (_product_code_select == null){
				Ext.MessageBox.show({title: 'Error', msg: 'Please select product in grid',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK});
//				alert('Please select product in grid');
				return;
			}
			
			var cavity_check = Ext.getCmp('real_cavity_number').getRawValue();
			if(cavity_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Real Cavity Number is null',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var  plannedPartQty_check =Ext.getCmp('id_parts_quantity_planned').getRawValue();
			if(plannedPartQty_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Parts quantity planned cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var  preparedPartQty_check =Ext.getCmp('id_parts_quantity_prepared').getRawValue();
			if(preparedPartQty_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Part quantity prepared cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
							 
			var virginMaterialCode_check = Ext.getCmp('id_new_resin_code').getRawValue();
			if(virginMaterialCode_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'New resin code cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var virginMaterialName_check =Ext.getCmp('id_new_resin_name').getRawValue();
			if(virginMaterialName_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'New resin name cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var virginMaterialWeight_check = Ext.getCmp('id_real_new_material_weight').getRawValue();
			if(virginMaterialWeight_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Real new material weight cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
							
			var regrindMaterialCode_check = Ext.getCmp('id_regrind_resin_code').getRawValue();
			if(regrindMaterialCode_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Regrind resin code cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var regrindMaterialName_check = Ext.getCmp('id_regrind_resin_name').getRawValue();
			if(regrindMaterialName_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Regrind resin name cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var  regrindMaterialWeight_check = Ext.getCmp('id_real_regrind_weight').getRawValue();
			if(regrindMaterialWeight_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Real regrind weight cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
		
			var  masterbatchCode_check = Ext.getCmp('id_masterbatch_code').getRawValue();
			if(masterbatchCode_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Masterbatch code cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var  masterbatchName_check = Ext.getCmp('id_masterbatch_name').getRawValue();
			if(masterbatchName_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Masterbatch name cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			var  masterbatchWeight_check = Ext.getCmp('id_real_masterbatch_weight').getRawValue();
			if(masterbatchWeight_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Real masterbatch weight cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
		
			
			var mixedMaterialWeight_check = '-'+Ext.getCmp('id_mixed_material_weight_used').getRawValue();
			if(mixedMaterialWeight_check.trim().length <= 0) { Ext.MessageBox.show({title: 'Error', msg: 'Mixed material weight used cannot be empty',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK}); return;}
			
			if(Ext.getCmp('id_regrind_shortage').getRawValue() == true)
			_regrind_shortage = 1;
			else
			_regrind_shortage = 0;
			
			Ext.MessageBox.show({
			 	title: 'Message', 
			 	msg: 'Do you want to save',
			 	icon: Ext.MessageBox.QUESTION, 
			 	buttons: Ext.MessageBox.OKCANCEL,
			 	fn: function(buttonId)
			 	{
						if(buttonId == 'ok')
						{
							new Ext.data.Connection().request({
										method : 'POST',					
							    		url : this.SAVE_REGRIND_ORDER_URL,
							    		params : {
				    					  userName : userName,
				    					  moldCode:_moldNumber_select,//select
										  color : _color_select,//select
										  partCode :  _product_code_select ,//select
										  partName : _product_name_select,//select
										  //--------varies------------
										  runner_weight: _runner_weight,
										  product_weight:_product_weight,
										  //------------------
										  cavity : Ext.getCmp('real_cavity_number').getRawValue(),
										  preparedPartQty :Ext.getCmp('id_parts_quantity_prepared').getRawValue(),
										 
										  virginMaterialCode : Ext.getCmp('id_new_resin_code').getRawValue(),
										  virginMaterialName :Ext.getCmp('id_new_resin_name').getRawValue(),
										  virginMaterialWeight : Ext.getCmp('id_real_new_material_weight').getRawValue(),
										
										  regrindMaterialCode : Ext.getCmp('id_regrind_resin_code').getRawValue(),
										  regrindMaterialName : Ext.getCmp('id_regrind_resin_name').getRawValue(),
										  regrindMaterialWeight : Ext.getCmp('id_real_regrind_weight').getRawValue(),
										 
										
										  masterbatchCode : Ext.getCmp('id_masterbatch_code').getRawValue(),
										  masterbatchName : Ext.getCmp('id_masterbatch_name').getRawValue(),
										  masterbatchWeight : Ext.getCmp('id_real_masterbatch_weight').getRawValue()/1000, // convert g -> kg
										 
										 mixedMaterialCode:Ext.getCmp('id_mixed_material_internal_code').getRawValue(),
										 mixedMaterialName : _MMS_Regrind_material_name,
										 mixedMaterialWeight : '-'+Ext.getCmp('id_mixed_material_weight_used').getRawValue(),
										 regrind_shortage: _regrind_shortage
										
				    				 },
				    				 success: function(response)
				    				 {
				    				 	var rs = Ext.decode(response.responseText);
	    								if (rs.success == true)
	    								{
	    										_product_weight = 0.0;
												_runner_weight =  0.0;
												_regrind_rate =   0.0;
												_color_rate =0.0;
												_constant_scrap = 0.0;
												_total_material_weight =0.0;
												
//												Ext.getCmp('id_new_resin_code').setRawValue('');
//												Ext.getCmp('id_new_resin_name').setRawValue('');
//												
//												Ext.getCmp('id_regrind_resin_code').setRawValue('');
//												Ext.getCmp('id_regrind_resin_name').setRawValue('');
//												
//												Ext.getCmp('id_masterbatch_code').setRawValue('');
//												Ext.getCmp('id_masterbatch_name').setRawValue('');
												
												Ext.getCmp('id_mixed_material_internal_code').setRawValue('');
												Ext.getCmp('id_mixed_material_weight_available').setRawValue('');
												//----
												Ext.getCmp('id_total_new_resin_weight').setRawValue('');
											    Ext.getCmp('id_total_regrind_resin_weight').setRawValue('');
												Ext.getCmp('id_total_masterbatch_weight').setRawValue('');
												Ext.getCmp('real_cavity_number').setRawValue('');
												
												Ext.getCmp('id_parts_quantity_prepared').setRawValue('');
												Ext.getCmp('id_parts_quantity_planned').setRawValue('');
												Ext.getCmp('id_mixed_material_weight_used').setRawValue('');
												
												
												Ext.getCmp('id_real_new_material_weight').setRawValue('');
												Ext.getCmp('id_real_regrind_weight').setRawValue('');
												Ext.getCmp('id_real_masterbatch_weight').setRawValue('');
												
												Ext.getCmp('id_regrind_shortage').setRawValue(false);
												Ext.getCmp('id_start_production').setRawValue(false);
												
												
	    								}
	    								else
	    								{
	    									Ext.MessageBox.show({title: 'Error', msg: 'Something went wrong. Please check again',icon: Ext.MessageBox.ERROR, buttons: Ext.Msg.OK});
	    								}
				    				 },
				    				 failure : function(response) 
				    				 {
				    				 	
				    				 }
								});
						}
						else
						{
							
						}
			 	},
			 	scope: this
			 	
			 });
		}
});