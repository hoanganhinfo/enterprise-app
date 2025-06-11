var GET_PROJECT_TYPE_LIST_URL='/enterprise-app/service/getProjectTypeList';
var SAVE_PROJECT_TYPE_URL='/enterprise-app/service/saveProjectType';
var DELETE_PROJECT_TYPE_URL='/enterprise-app/service/deleteProjectType';
var GET_MIXED_MATERIAL_LIST_URL='/enterprise-app/service/getMixedMaterialByCode';
var GET_MIXED_MATERIAL_LIST_BY_RATE_VIRGIN_URL='/enterprise-app/service/getMixedMaterialByRateAndVirginCode';
	
var _color_select;
var _moldNumber_select;
var _product_code_select;
var _product_name_select;

var _cuu;


var _mixed_material_code ;
var _regrind_material_name;

//----------------auto increase id------------

var _MMSCodeMax = null;
var _MMStore = null;
var	_vvirgin_material_name;	
var	_rregrind_material_name;			

//--------------------------------------------

var _kg = '<font color = "red">(kg)</font>'+': ';

Ext.onReady(function(){

	    var _actions = Ext.create('OldF.RemainingMaterial.Action',{
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
			
		var _select = Ext.create('OldF.RemainingMaterial.Select',{
	     width: 'auto',
	     height: 'auto',
	     border: false
	    });							
									
									
		 var _grid = Ext.create('OldF.RemainingMaterial.GridPanel',{
	     width: 'auto',
	     height: 200,
	    
	     id:'frmGrid'
	    });		

	    var _inputsM = Ext.create('OldF.MixedMaterial.Input',{
	     width: 'auto',
	     height: 'auto',
	     margin: '10,1,10,1',
//	     border: false,
	     id:'frmInputM'
	    });	
	    var _inputsV = Ext.create('OldF.VirginMaterial.Input',{
	     width: 'auto',
	     height: 'auto',
	     margin: '10,1,10,1',
//	     border: false,
	     id:'frmInputV'
	    });
		var _inputGroup = Ext.create('Ext.form.Panel',{	
		 	layout: 'column',
		 	width: '100%',
		 	height: '100%',
		 	border: false,
		 	items: 	[
		 				{
		 					xtype: 'panel',
		 					layout: {type: 'vbox' ,align: 'stretch' },
		 					
					        columnWidth: 0.75,
					        border: false,
					        items:[_inputsM,_inputsV]
					       
		 				},
		 				{
		 					xtype: 'panel',
		 					layout: { type : 'vbox',align: 'center'},
		 					title: '',
					        columnWidth: 0.25,
					        margin: '1,1,1,1',
					        border: false,
					        style: 'margin:0 auto;margin-top:30px;',
					        items:	[
					        			{
											xtype: 'label',
											text:'Mixed material code: '
										},
										{
											xtype: 'textfield',
											width: 170,
											readOnly:true,
											//disabled : true,
											id: 'id_mixed_material_code'
											
										},
					        			{
					        				 checkboxToggle:false,
					           				 defaultType: 'checkbox',
					           				 width: 170,
					           				 border: false,
					           				 items:  [{
								           				boxLabel:'Existing',
														name:'existing',
														inputValue:'1',
														readOnly: true,
									                    id        : 'id_existing'
									                    
									                  }]
					        			}
					        		]
					       
		 				}
		 				
		 			]
		 
		 });	

		 
	    Ext.create('Ext.panel.Panel', {
		    width: '100%',
		    height: '100%',
		    layout:{type: 'hbox' , align: 'stretch'},
		    border: false,
		    items: [{
		        			xtype:'panel',
					        flex: 0.05,
					         border: false
		        
		    		},
		    		{
			    			xtype: 'panel',
					        flex: 1,
					        layout: {type: 'vbox' ,align: 'stretch' },
					         border: false,
					        items: 	[
					        			_operators,_select,_grid,_inputGroup,/*_inputsM,_inputsV,/*_mixs,*/
					        			{
					        				xtype: 'panel',
					        				border: false,
					        				layout: { type : 'hbox', align:'center' ,pack: 'center'},
					        				items : [_actions]
					        			}
					        		]																	
		    		},
		    		{
		       				xtype:'panel',
					        flex: 0.05,
					         border: false
		    		}],
		    renderTo: 'RemainingMaterial'
		});
		
		Ext.getCmp('id_regrind_rate').setDisabled(true);
		Ext.getCmp('id_mixed_material_weight_send_back').setDisabled(true);
		Ext.getCmp('id_new_material_weight_send_back').setDisabled(true);

});
