var GET_PROJECT_TYPE_LIST_URL='/enterprise-app/service/getProjectTypeList';
var SAVE_PROJECT_TYPE_URL='/enterprise-app/service/saveProjectType';
var DELETE_PROJECT_TYPE_URL='/enterprise-app/service/deleteProjectType';
var GET_MIXED_MATERIAL_LIST_URL='/enterprise-app/service/getMixedMaterialByCode';
var _check_store = true;
//var _size = 1000;
var _product_weight =0.0;
var _runner_weight =0.0;
var _total_material_weight =0.0;
var _regrind_rate =0.0;
var _color_rate = 0.0;
var _constant_scrap = 0.0;
var _regrind_shortage =0;

var _color_select;
var _moldNumber_select;
var _product_code_select;
var _product_name_select;

var _MMS_Regrind_material_name ='';

var _check_start_production;
var _check_regrind_shortage;

var _kg_s = '<font color = "red">(kg)*</font>';
var _g_s  = '<font color = "red">(g)*</font> ';
var _kg = '<font color = "red">(kg)</font>';
var _g  = '<font color = "red">(g)</font>';
var _bb  = '<font color = "red"> * </font>';



Ext.onReady(function(){
	  
	 	
	    var _inputs = Ext.create('Inj.Panel.MaterialPreparationInput',{
	   
	    width: 'auto',
	    height: 'auto',
	    id: 'frmInput'
	    });
	    
	    var _mixs = Ext.create('Inj.Panel.MaterialPreparationMix',{
	  
	    width: 'auto',
	    height: 'auto',
	    id:'frmMix'
	    });
	    
	    
	    var _actions = Ext.create('Inj.Panel.MaterialPreparationAction',{
	    width: 'auto',
	    height: 'auto',
	    id:'frmAction'
	    });
	    
	   
	    
	   
	    
	    var _operators = Ext.create('Ext.form.Panel',{
							border: false,
							items: [{
										xtype: 'label',
										text:'Operator: '+userName,
										margin: '25,10,0,0',
										id: 'id_lbl_operator',
										inputId: 'inputId_lbl_operator'
									}]});
			
		var _select = Ext.create('Inj.Panel.MaterialPreparationSelect',{
	     width: 'auto',
	     height: 'auto'
	    // _grid1: _operators,
	    // id:'frmSelect'
	    });							
									
									
		 var _grid = Ext.create('Inj.Grid.MaterialPreparationGrid',{
	     width: 'auto',
	     height: 150,
	     id:'frmGrid',
	        columnWidth: 0.7,
	    });		
	  
		 var  pnProductSetting = Ext.create('Ext.form.Panel',{	
		 	layout: 'column',
		 	width: '100%',
		 	height: '100%',
		 	border: false,
		 	items: 	[_grid,
		 				{
		 					type: 'panel',
		 					layout: { type : 'vbox'},
		 					margin: '5,15,5,0',
		 					bodyPadding: 5,
					        columnWidth: 0.3,
					        items: 	[	{
					        				xtype: 'numberfield',
					        				fieldLabel: 'Real cavity number'+_bb,
											labelAlign: 'top',
											width: 230,
											maxLength:3,
											minValue: 1,
											fieldStyle: 'text-align: right;',
											allowBlank: false,
											id: 'real_cavity_number',
											inputId: 'inputId_real_cavity',
											enableKeyEvents: true,
											listeners: 	{
												keyup( f, e, eOpts )	{
													calculate();
												},
					          					scope: this
											}
											
					        				
					        			},
										{
											xtype: 'numberfield',
											fieldLabel: 'Parts quantity planned'+_bb,
											minValue: 1,
											labelAlign: 'top',
											width: 230,
											scale   : 'large',
											fieldStyle: 'text-align: right;',
											allowBlank: false,
											id: 'id_parts_quantity_planned',
											enableKeyEvents: true,
											listeners: 	{
												keyup( f, e, eOpts )	{
													calculate();
												},
					          					scope: this
											}
										},
										{
							   				 checkboxToggle:false,
					           				 defaultType: 'checkbox', 
					           				 width: 230,
					           				 border: false,
					           				 items:  [{
								           				boxLabel:'Start production',
														name:'startproduction1',
														inputValue:'1',
									                    id        : 'id_start_production',
									                    listeners: 	{
									          					change: function( checkbox, newValue, oldValue, eOpts )
									          					{
									          						//alert(newValue);
									          						calculate();
																
									          					},
									          					scope: this
									          				}
									                  }]
									          
									           
										} ]
					      
		 				}
		 			]
		 
		 });						
									

		 Ext.create('Ext.panel.Panel', {
		    width: '100%',
		    height: '100%',
		   // layout:{type: 'hbox' , align: 'stretch'},
		    border: false,
		    //frame: true,
			items: [{
				xtype: 'label',
				text:'Operator: '+userName,
				margin: '5,5,0,0',
				id: 'id_lbl_operator',
				inputId: 'inputId_lbl_operator'
			},_select,pnProductSetting,_inputs,_mixs,
    			{
    				xtype: 'panel',
    				 border: false,
    				layout: { type : 'hbox', align:'center' ,pack: 'center'},
    				items : [_actions]
    			}
				  ],
		    renderTo: 'MaterialPreparationPanel',
		    id:'idMainPanel'
		    
		});
//		Ext.getCmp('idMainPanel').getEl().on('keydown', function( e, t, eOpts )
//		{
//		    if (e.getKey()== Ext.EventObject.ENTER) 
//		    { 
//		    										_total_material_weight = 0.0;
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
//													if(_parts_quantity_planned.trim().length >0 && _cavity.trim().length >0 )//&& _id_MM_weight_used.trim().length >0)
//													{
//														var _cavityFloat = parseFloat(_cavity);
//														if(_cavityFloat > 0.0)
//														{															
//															
//															_total_material_weight = (parseFloat(_parts_quantity_planned) * (parseFloat(_product_weight) + parseFloat(_runner_weight)/parseFloat(_cavityFloat)));
//															//alert(_total_material_weight +' => '+parseFloat(_parts_quantity_planned) +' || '+ (parseFloat(_product_weight) +' || '+ parseFloat(_runner_weight)+' || '+parseFloat(_cavityFloat)));
//															var _tick_box_start_production = Ext.getCmp('id_start_production').getValue();
//															var _tick_box_regrind_shortage = Ext.getCmp('id_regrind_shortage').getValue();
//															
//															if(_tick_box_start_production == true)
//															{
//																_total_material_weight = _total_material_weight *1.03 + parseFloat(_constant_scrap);
//																
//															}
//															else
//															{
//																_total_material_weight = _total_material_weight *1.03;
//															}
//															
//															//alert(_tick_box_start_production);
//														}
//														else
//														{
//															alert('cavity must be > 0');
//															_total_material_weight =0.0;
//															return;
//														}
//													}
//													else
//													{
//														_total_material_weight =0.0;
//														return;
//													}
//													
//													if(_id_MM_weight_used.trim().length <= 0)
//													{
//														_id_MM_weight_used = 0.0;
//													}
//													//alert('sau: '+_total_material_weight + ' || '+_regrind_rate);
////													var TOTAL_NEW_RESIN_WEIGHT = (1-(_regrind_rate/100)) *( _total_material_weight - parseFloat(Ext.getCmp('id_mixed_material_weight_used').getRawValue()));
////													var TOTAL_REGRIND_RESIN_WEIGHT = (_regrind_rate/100) *( _total_material_weight - parseFloat(Ext.getCmp('id_mixed_material_weight_used').getRawValue()));
//													//alert(((_regrind_rate/100))+' || '+ _total_material_weight +' || '+parseFloat(_id_MM_weight_used) + ' || '+_color_rate);
//													var TOTAL_NEW_RESIN_WEIGHT = ((1-(_regrind_rate/100)) *( _total_material_weight - parseFloat(_id_MM_weight_used)))/1000;
//													var TOTAL_REGRIND_RESIN_WEIGHT = ((_regrind_rate/100) *( _total_material_weight - parseFloat(_id_MM_weight_used)))/1000;
//													var MASTERBATCH_WEIGHT = (( _total_material_weight - parseFloat(_id_MM_weight_used))* parseFloat(_color_rate/100))/1000;
//													
//													
//													//------------
//													var fixValue = parseFloat(Math.pow(10,1));
//													
//													var TOTAL_NEW_RESIN_WEIGHT_Round = parseInt(Math.round(TOTAL_NEW_RESIN_WEIGHT * fixValue)) / fixValue;
//													var TOTAL_REGRIND_RESIN_WEIGHT_Round = parseInt(Math.round(TOTAL_REGRIND_RESIN_WEIGHT * fixValue)) / fixValue;
//													var MASTERBATCH_WEIGHT_Round = parseInt(Math.round(MASTERBATCH_WEIGHT * fixValue)) / fixValue;
//													
//													//--------------
//													
//													Ext.getCmp('id_total_new_resin_weight').setRawValue(TOTAL_NEW_RESIN_WEIGHT_Round);
//													Ext.getCmp('id_total_regrind_resin_weight').setRawValue(TOTAL_REGRIND_RESIN_WEIGHT_Round);
//													Ext.getCmp('id_total_masterbatch_weight').setRawValue(MASTERBATCH_WEIGHT_Round*1000);
//													
//													
//													//--------------------other ------------------
//												
//												
//												var REAL_NEW_RESIN_WEIGHT = Ext.getCmp('id_real_new_material_weight').getRawValue();
//												var REAL_REGRIND_WEIGHT = Ext.getCmp('id_real_regrind_weight').getRawValue();
//												var REAL_CAVITY_NUMBER =Ext.getCmp('real_cavity_number').getRawValue();
//												var MIXED_MATERIAL_WEIGHT_USED = Ext.getCmp('id_mixed_material_weight_used').getRawValue();
//												
////												if(REAL_NEW_RESIN_WEIGHT!='' && REAL_CAVITY_NUMBER!='' && MIXED_MATERIAL_WEIGHT_USED!='' && REAL_REGRIND_WEIGHT!='')
//												
//												if(REAL_NEW_RESIN_WEIGHT =='')
//												{
//													REAL_NEW_RESIN_WEIGHT = 0.0;	
//												}
//												if(MIXED_MATERIAL_WEIGHT_USED =='')
//												{
//													MIXED_MATERIAL_WEIGHT_USED =0.0;
//												}
//												if(REAL_REGRIND_WEIGHT =='')
//												{
//													REAL_REGRIND_WEIGHT = 0.0;
//												}
//												
//												
//												if( REAL_CAVITY_NUMBER!='')
//												{
//													var PARTS_QUANTITY_PREPARED =(parseFloat(REAL_NEW_RESIN_WEIGHT) + parseFloat(REAL_REGRIND_WEIGHT) + parseFloat(MIXED_MATERIAL_WEIGHT_USED)) /((_product_weight +_runner_weight)/ parseFloat(REAL_CAVITY_NUMBER));
//													
//													//alert(PARTS_QUANTITY_PREPARED +' || '+parseInt(PARTS_QUANTITY_PREPARED));
//													Ext.getCmp('id_parts_quantity_prepared').setRawValue(parseInt(PARTS_QUANTITY_PREPARED));
//													
//													/*var fixValue = parseFloat(Math.pow(10,3));
//													var PARTS_QUANTITY_PREPARED_Round = parseInt(Math.round(PARTS_QUANTITY_PREPARED * fixValue)) / fixValue;
//													Ext.getCmp('id_parts_quantity_prepared').setRawValue(PARTS_QUANTITY_PREPARED_Round);*/
//												}
//												else
//												{
//													Ext.getCmp('id_parts_quantity_prepared').setRawValue('');
//												}
//		    }
//		});
		//disable field upon starting
		Ext.getCmp('id_real_new_material_weight').setDisabled(true);
		Ext.getCmp('id_real_regrind_weight').setDisabled(true);
		Ext.getCmp('id_real_masterbatch_weight').setDisabled(true);
		Ext.getCmp('id_mixed_material_weight_used').setDisabled(true);
		Ext.getCmp('real_cavity_number').setDisabled(true);		
		Ext.getCmp('id_parts_quantity_planned').setDisabled(true);
		Ext.getCmp('id_start_production').setDisabled(true);
		Ext.getCmp('id_regrind_shortage').setDisabled(true);

});

function calculate(){
	 
	_total_material_weight = 0.0;
	var _cavity  = Ext.getCmp('real_cavity_number').getValue();
	if (!Ext.isNumeric(_cavity)){
		_cavity = 0;
		Ext.getCmp('real_cavity_number').setValue(0);
	}
	if (_cavity <=0){
		alert('Real cavity must be > 0');
		return;
	}
	var _parts_quantity_planned = Ext.getCmp('id_parts_quantity_planned').getValue();
	if (!Ext.isNumeric(_parts_quantity_planned)){
		_parts_quantity_planned = 0;
		Ext.getCmp('id_parts_quantity_planned').setValue(0);
	}
	var _id_MM_weight_used = Ext.getCmp('id_mixed_material_weight_used').getValue();
	var _tick_box_start_production = Ext.getCmp('id_start_production').getValue();
	var _tick_box_regrind_shortage = Ext.getCmp('id_regrind_shortage').getValue();
	_total_material_weight = _parts_quantity_planned *( _product_weight+ (_runner_weight/_cavity))*1.03;
	if(_tick_box_start_production == true)
	{
		_total_material_weight = _total_material_weight  + _total_material_weight*(_constant_scrap/100) ;
		
	}
	if (!Ext.isNumeric(_total_material_weight)){
		_total_material_weight = 0;
	}

	console.log("_total_material_weight;" +_total_material_weight);
	if(_id_MM_weight_used.trim().length <= 0)
	{
		_id_MM_weight_used = 0.0;
	}
	//alert('sau: '+_total_material_weight + ' || '+_regrind_rate);
//	var TOTAL_NEW_RESIN_WEIGHT = (1-(_regrind_rate/100)) *( _total_material_weight - parseFloat(Ext.getCmp('id_mixed_material_weight_used').getRawValue()));
//	var TOTAL_REGRIND_RESIN_WEIGHT = (_regrind_rate/100) *( _total_material_weight - parseFloat(Ext.getCmp('id_mixed_material_weight_used').getRawValue()));
	//alert(((_regrind_rate/100))+' || '+ _total_material_weight +' || '+parseFloat(_id_MM_weight_used) + ' || '+_color_rate);
	var TOTAL_NEW_RESIN_WEIGHT = ((1-(_regrind_rate/100)) *( _total_material_weight - _id_MM_weight_used))/1000;
	var TOTAL_REGRIND_RESIN_WEIGHT = ((_regrind_rate/100) *( _total_material_weight - _id_MM_weight_used))/1000;
	var MASTERBATCH_WEIGHT = (( _total_material_weight - parseFloat(_id_MM_weight_used)*1000)* parseFloat(_color_rate/100))/1000;
	
	console.log("_color_rate:"+_color_rate)
	console.log("_id_MM_weight_used:"+_id_MM_weight_used)
	console.log("TOTAL_NEW_RESIN_WEIGHT:"+TOTAL_NEW_RESIN_WEIGHT)
	console.log("TOTAL_REGRIND_RESIN_WEIGHT:"+TOTAL_REGRIND_RESIN_WEIGHT)
	console.log("MASTERBATCH_WEIGHT:"+MASTERBATCH_WEIGHT)
	
	//------------
//	var fixValue = parseFloat(Math.pow(10,1));
//	
//	var TOTAL_NEW_RESIN_WEIGHT_Round = parseInt(Math.round(TOTAL_NEW_RESIN_WEIGHT * fixValue)) / fixValue;
//	var TOTAL_REGRIND_RESIN_WEIGHT_Round = parseInt(Math.round(TOTAL_REGRIND_RESIN_WEIGHT * fixValue)) / fixValue;
//	var MASTERBATCH_WEIGHT_Round = parseInt(Math.round(MASTERBATCH_WEIGHT * fixValue)) / fixValue;
	
	//--------------
	
	Ext.getCmp('id_total_new_resin_weight').setRawValue(TOTAL_NEW_RESIN_WEIGHT.toFixed(2));
	Ext.getCmp('id_total_regrind_resin_weight').setRawValue(TOTAL_REGRIND_RESIN_WEIGHT.toFixed(2));
	MASTERBATCH_WEIGHT =  MASTERBATCH_WEIGHT*1000;
	Ext.getCmp('id_total_masterbatch_weight').setRawValue(MASTERBATCH_WEIGHT.toFixed(2));
	
	
	//--------------------other ------------------

	
	var REAL_NEW_RESIN_WEIGHT = Ext.getCmp('id_real_new_material_weight').getValue()*1000;
	var REAL_REGRIND_WEIGHT = Ext.getCmp('id_real_regrind_weight').getValue()*1000;
	var MIXED_MATERIAL_WEIGHT_USED = Ext.getCmp('id_mixed_material_weight_used').getRawValue()*1000;
	
	
	var PARTS_QUANTITY_PREPARED =(REAL_NEW_RESIN_WEIGHT+ REAL_REGRIND_WEIGHT + MIXED_MATERIAL_WEIGHT_USED) /((_product_weight +_runner_weight)/ _cavity);
	Ext.getCmp('id_parts_quantity_prepared').setRawValue(parseInt(PARTS_QUANTITY_PREPARED));

//	
//	if( REAL_CAVITY_NUMBER!='')
//	{
//	}
//	else
//	{
//		Ext.getCmp('id_parts_quantity_prepared').setValue(0);
//	}

}