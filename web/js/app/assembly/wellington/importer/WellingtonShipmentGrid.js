Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.require([
             'Ext.ux.grid.FiltersFeature'
         ]);
Ext.define('EAP.Grid.WellingtonShipmentGrid',{
		extend: 'Ext.grid.Panel',
		required: 	['Penta.view.SearchTrigger'],
		batchNoStore: null,
		shipmentStore: null,
		cboShipment: null,
		initComponent:function()
		{
			
			this.batchNoStore = new Ext.data.JsonStore({
	        	autoLoad : true,
	        	fields: [
	        	            {name: 'batchNo'},
	        	            {name: 'motor'},
	        	            {name: 'shipmentNo'},
	        	            {name: 'qty'},
	        	            {name: 'customerOrder'},
	        	            {name: 'customerRef'},
	        	            {name: 'containerNo'}
	        	        ],
	        	pageSize: 100,
	        	remoteFilter: true,
	        	proxy: {
	                type: 'ajax',
	              //  extraParams :{itemId:userId},
	                url: '/enterprise-app/service/getBatchNo',
	                reader: {
	                    type: 'json',
	                    root: 'BatchList',
	                    idProperty: 'value',
	                    totalProperty: 'totalCount'
	                }
	            },
	            listeners:{
	            	scope: this,
	            	load : function(store, records, successful, eOpts ){

	            	}
	            }
	        }); 	
//			this.shipmentStore = new Ext.data.JsonStore({
//	        	autoLoad : true,
//	        	fields: [
//	        	            {name: 'customerPO'}
//	        	         ],
//	        	//pageSize: 30,
//	        	proxy: {
//	                type: 'ajax',
//	              //  extraParams :{itemId:userId},
//	                //url: '/enterprise-app/service/getWellingtonShipmentList',
//	                url: '/ax-portlet/service/getCustomerPOList',
//	                reader: {
//	                    type: 'json',
//	                    root: 'CustomerPOList',
//	                    idProperty: 'value',
//	                    totalProperty: 'totalCount'
//	                }
//	            }
//	        });	
//			this.cboShipment = Ext.create('Ext.form.field.ComboBox', {
//                id: 'cbShipmentNo-combo',
//                displayField: 'customerPO',
//                valueField: 'customerPO',
//                store: this.shipmentStore,
//                mode: 'remote',  // local
//                triggerAction: 'all',
//                hideTrigger: false,
//                minChars: 1
//        });
			Ext.apply(this,{
							store: this.batchNoStore,
					        autoScroll: true,
					        id: 'defectCodeList_'+this.idDefectCode,
					        cellCls: 'x-type-grid-defect-list',
					        stateful: true,
					        multiSelect: false,
					        autoScroll: true,
					        stateId: 'stateGrid',
					        columns: {
								plugins: [{
									ptype: 'gridautoresizer'
								}],
								items: [{text: 'Motor type',width: 130,sortable : false,dataIndex: 'motor',filter: {type: 'combo', multiSelect: false,editable: true,queryMode: 'local',triggerAction : 'all',store : wellingtonMotorStore,displayField : 'code',valueField : 'code'}},
								        {text: 'Batch no',width: 130,sortable : false,dataIndex: 'batchNo', filter: true},
								        {text: 'Qty',width: 130,sortable : false,dataIndex: 'qty'},
					                    {text: 'Customer order',sortable : false,width: 200,dataIndex: 'customerOrder', filter: true},
					                    {text: 'Customer ref',sortable : false,width: 200,dataIndex: 'customerRef', filter: true},
					                    {text: 'Container no',sortable : false,width: 200,dataIndex: 'containerNo', filter: true}]
					        },
					        //height: 380,
					       // width: 400,
					        title: 'Shipment no',
					        viewConfig: {
					            stripeRows: true,
					            enableTextSelection: true
					        },
					        dockedItems: [{
				                xtype: 'toolbar',
				                hidden: hasAssignShipmentPermission=='true'?false:true,
				                items: [ {
				                    iconCls: 'icon-add',
				                    text: 'Assign shipment no',
				                    scale : 'medium',
				                    scope: this,
				                    handler: this.onAssignShipmentNoClick
				                },{
				                    iconCls: 'icon-delete',
				                    scale : 'medium',
				                    text: 'Remove shipment no',
				                    disabled: true,
				                    itemId: 'delete',
				                    scope: this,
				                    handler: this.onRemoveShipmentNoClick
				                }]
				            }],
				            plugins: [{
						        	ptype: 'filterbar',
						        	renderHidden: false,
						        	showShowHideButton: true,
						        	showClearAllButton: true
								}],				            
					        bbar: Ext.create('Ext.PagingToolbar', {
					            store: this.batchNoStore,
					            displayInfo: true,
					            displayMsg: 'Displaying row {0} - {1} of {2}',
					            emptyMsg: "No data to display"
					        })

				});// end apply
					
			this.callParent(arguments);
			this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
		},
		onSelectChange: function(selModel, selections){
				if (selections != null){
					this.down('#delete').setDisabled(selections.length === 0);
				}
		        
		},
		onAssignShipmentNoClick: function(){
			//alert('onAssignShipmentNoClick');
			var selection = this.getView().getSelectionModel().getSelection()[0];
			
			if (selection){
				var customerOrder = selection.get('customerOrder');
				if (customerOrder != ''){
					alert('The selected batch no# already has customer order.\nYou need remove customer order before assigning again')
					return;
				}
				
				var dlg = Ext.create('EAP.Window.WellingtonShipmentDialog', {
					activeRecord: selection
					});	
				dlg.show();

			}
		},
		onRemoveShipmentNoClick: function(){
		//	alert('onRemoveShipmentNoClick');
	        var selection = this.getView().getSelectionModel().getSelection()[0];
			Ext.Msg.show({
				title : 'Confirmation',
				msg : 'Are you sure to remove customer order for selected batch no',
				icon : Ext.Msg.QUESTION,
				buttons : Ext.Msg.YESNO,
				scope: this,
				defaultFocus: 2,
				fn : function(buttonId) {
					if (buttonId != 'yes'){
						return;
					}
			        if (selection) {
			        	Ext.getBody().mask('Updating data...');
			        	new Ext.data.Connection().request({
							method : 'POST',
							url : '/enterprise-app/service/updateBatchNo',
							params : {
								batchNo : selection.get('batchNo'),
								motor: selection.get('motor'),
								customerOrder: ''
							},
							scriptTag : true,
							success : function(response) {
								//alert('Delete success !!');
								var rs = Ext.decode(response.responseText);
								if (rs.success == true){
									selection.set('customerOrder','');
									selection.set('customerRef','');
									selection.set('containerNo','');
									Ext.getBody().unmask();
									
								}else{
									Ext.getBody().unmask();
									Ext.Msg.show({
									title : 'INFORMATION',
									msg : 'Update failed !!',
									minWidth : 200,
									modal : true,
									icon : Ext.Msg.INFO,
									buttons : Ext.Msg.OK
								});		
								}
							},
							failure : function(response) {
								Ext.getBody().unmask();
								Ext.Msg.show({
									title : 'INFORMATION',
									msg : 'Update fail !!',
									minWidth : 200,
									modal : true,
									icon : Ext.Msg.INFO,
									buttons : Ext.Msg.OK
								});		
							}
						});
			        	
			        }

				},
				icon : Ext.MessageBox.QUESTION
			},this);			
		}
});