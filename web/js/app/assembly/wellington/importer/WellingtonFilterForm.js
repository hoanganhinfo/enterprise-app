Ext.define('EAP.Form.WellingtonFilterForm', {
	extend : 'Ext.form.Panel',
	border : true,
	bodyBorder : true,
	exportUrl : '',
	layout : {
		type : 'table',
		columns : 3,
		tableAttrs : {
			style : {
				//width : '100%'
				 bodyStyle: 'border:0 none'
			}
		}
	},
	title: 'Data View',
	statusStore: null,
	batchNoStore : null,
	shipmentStore: null,
	customerRefStore: null,
	customerOrderStore: null,
	dateFrom: '',
	dateTo: '',
	serial : '',
	status : '',
	batchNo : '',
	shipmentNo: '',
	customerRef: '',
	customerOrder : '',
	containerNo: '',
	itemNumber: '',
	qcTested : false,
	viewBy: '',
	defaults : {
		bodyStyle : 'padding:10px'
	},
	initComponent : function() {
//		this.bbar = [{
//			xtype : 'button',
//			scope : this,
//			text : 'View',
//			handler : this.onView
//		}],
		this.shipmentStore = new Ext.data.JsonStore({
        	autoLoad : true,
        	fields: [
        	            {name: 'shipmentNo'}
        	         ],
        	//pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                url: '/enterprise-app/service/getWellingtonShipmentList',
                reader: {
                    type: 'json',
                    root: 'ShipmentList',
                    idProperty: 'value',
                    totalProperty: 'totalCount'
                }
            }
        });  
		this.customerRefStore = new Ext.data.JsonStore({
        	autoLoad : true,
        	fields: [
        	            {name: 'customerRef'}
        	         ],
        	//pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                url: '/ax-portlet/service/getCustomerRefList',
                reader: {
                    type: 'json',
                    root: 'CustomerRefList',
                    idProperty: 'customerRef',
                    totalProperty: 'totalCount'
                }
            }
        });
		this.customerOrderStore = new Ext.data.JsonStore({
        	autoLoad : true,
        	fields: [
        	            {name: 'customerPO'}
        	         ],
        	//pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                url: '/ax-portlet/service/getCustomerOrderByRef',
                reader: {
                    type: 'json',
                    root: 'CustomerPOList',
                    idProperty: 'customerPO',
                    totalProperty: 'totalCount'
                }
            }
        });
		this.containerStore = new Ext.data.JsonStore({
        	autoLoad : true,
        	fields: [
        	            {name: 'containerNo'}
        	         ],
        	//pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                //url: '/enterprise-app/service/getWellingtonShipmentList',
                url: '/ax-portlet/service/getContainerList',
                reader: {
                    type: 'json',
                    root: 'ContainerList',
                    idProperty: 'containerNo',
                    totalProperty: 'totalCount'
                }
            }
        });	
		this.items = [{
			xtype:'panel',
			border: false,
			width:600,
			layout : {
				type : 'hbox'
				
			},
			items:[ {
				xtype : 'textfield', // 2
				id : 'txtSerialNo',
				name : 'serial',
				//inputId : 'SerialNo',
				labelAlign : 'right',
				maxLength : 20,
				enforceMaxLength : true,
				fieldLabel : 'Serial number',
				msgTarget : 'side',
				enableKeyEvents : true,
				height : 22,
				width : 350,
				maxWidth : 350
			}, {
				//xtype: 'label',
		        //forId: 'myFieldId',
		        html: '<b>Use * for wildcard search</b>',
		        margin: '0 0 0 0'
			}]
		},{
			  xtype:'combo',
			   fieldLabel:'Item number',
			   fieldLabel : 'Item number',
//	    		labelWidth: 260,
			   id:'cbItemNumber',
			   labelAlign: 'right',
			   name:'itemNumber',
			   cls: 'x-item-combo',
			   valueField: 'code',
			   displayField:'code',
			   queryMode:'local',
			   store: wellingtonMotorStore,
			   editable: false,
			   autoSelect:true,
			   width : 250,
			   maxWidth : 250,
			   forceSelection:true
		},{
			xtype:'combo',
			id : 'cbViewBy',
			//inputId: 'cboViewBy',
			store : viewByData,
			labelAlign: 'right',
			fieldLabel: 'View by',	      
			displayField : 'type',
			name : 'type',
			value: 'Packing result',
			editable: false,
			width: 250,
			allowBlank: true,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '4 4 4 4'
		},{
			xtype:'panel',
			width:600,
			border: false,
			layout : {
				type : 'hbox'
			},
			items: [{
				xtype : 'textfield', // 2
				id : 'txtBatchNo',
				name: ' batchNo',
				//inputId : 'BatchNo',
				labelAlign : 'right',
				//maxLength : 20,
				//enforceMaxLength : true,
				fieldLabel : 'Batch no#',
				colspan: 2,
				msgTarget : 'side',
				//enableKeyEvents : true,
				height : 22,
				width : 500,
				maxWidth : 500
			},{
				xtype : 'button', // 2
				id : 'btnBatchNo',
				text:'...',
				scope: this,
				handler: this.onOpenBatchNo,	
			}]
		} ,{
        	fieldLabel: 'Date tested from',
        	name: 'datetestedFrom',
        	labelAlign: 'right',
        	id: 'datetestedFrom',
        	//allowBlank : false,
        	//submitFormat: 'Y-m-d H:i:s',
        	//value: new Date(),
			format: 'd/m/Y',
        	width: 250,
	    	margin: '4 4 4 4',
        	xtype: 'datefield'
        	
        },{
        	fieldLabel: 'Date tested to',
        	name: 'datetestedTo',
        	labelAlign: 'right',
        	//allowBlank : false,
			id: 'datetestedTo',
        	format: 'd/m/Y',
        	//value: new Date(),
        	//submitFormat: 'Y-m-d H:i:s',
        	width: 250,
	    	margin: '4 4 4 4',
        	xtype: 'datefield',
        	cellCls: 'x-type-cell-left'
        	//colspan: 4
        	
        },{
			xtype:'panel',
			width:600,
			border: false,
			layout : {
				type : 'hbox'
			},
			items: [{
				xtype:'combo',
				id : 'cbCustomerRef',
				name: 'customerRef',
				store : this.customerRefStore,
				labelAlign: 'right',
				fieldLabel: 'Customer ref',	      
				displayField : 'customerRef',
				valueField : 'customerRef',
				//value: 1,
				width: 250,
				editable: true,
				allowBlank: true,
				msgTarget: 'side',
		    	triggerAction : 'all',
		    	queryMode : 'local',
		    	margin: '4 4 4 4',
		    	listeners: {
		    		scope: this,
		    		change: function(combo, newValue, oldValue, eOpts ){
		    			//alert(records[0].get('customerRef'));
		    			this.customerOrderStore.load({params:{customerRef:newValue}});
		    			Ext.getCmp('cbCustomerOrder').setRawValue('');
		    		}
		    	}
			},{
				xtype:'combo',
				id : 'cbCustomerOrder',
				name: 'customerOrder',
				hideLabel: true,
				store : this.customerOrderStore,
				labelAlign: 'right',
				fieldLabel: 'Customer order',	      
				displayField : 'customerPO',
				valueField : 'customerPO',
				//value: 1,
				width: 120,
				editable: true,
				allowBlank: true,
				msgTarget: 'side',
		    	triggerAction : 'all',
		    	queryMode : 'local',
		    	margin: '4 4 4 4'
			},{
				xtype:'combo',
				id : 'cbStatus',
				name: 'status',
				store : this.statusStore,
				labelAlign: 'right',
				fieldLabel: 'Status',	      
				displayField : 'name',
				valueField : 'value',
				//value: 1,
				labelWidth: 50,
				width: 130,
				editable: false,
				allowBlank: true,
				msgTarget: 'side',
		    	triggerAction : 'all',
		    	queryMode : 'local',
		    	margin: '4 4 4 4'
			}]
		},{
			xtype:'combo',
			id : 'cbContainerNo',
			name: 'containerNo',
			store : this.containerStore,
			labelAlign: 'right',
			fieldLabel: 'Container no',	      
			displayField : 'containerNo',
			valueField : 'containerNo',
			//value: 1,
			width : 250,
			maxWidth : 250,
			editable: true,
			allowBlank: true,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '4 4 4 4'
		},{
			xtype : 'checkbox',
			id	  : 'ckQCTested',
			name: 'qcTested',
			labelAlign: 'right',
			scope : this,
			fieldLabel  : 'QC Tested',
			inputValue  : 'Y',
			colspan: 2,
			margin: '15 5 5 5',
			width: 100
		} ,{

			xtype:'panel',
			width:600,
			border: false,
			layout : {
				type : 'hbox'
			},
			items: [{
				xtype : 'button',
				scope : this,
				text : 'View',
				margin: '15 5 5 5',
				width: 100,
				handler : this.onView
			},{
				xtype : 'button',
				scope : this,
				text : 'Clear',
				margin: '15 5 5 5',
				width: 100,
				handler : function(){
					Ext.getCmp('txtSerialNo').setValue('');
					Ext.getCmp('datetestedFrom').setValue('');
					Ext.getCmp('datetestedTo').setValue('');
					Ext.getCmp('cbStatus').setRawValue('');
					Ext.getCmp('cbViewBy').setValue('Packing result');
					Ext.getCmp('txtBatchNo').setValue('');
					Ext.getCmp('cbItemNumber').setRawValue('');
					Ext.getCmp('cbCustomerRef').setRawValue('');
					Ext.getCmp('cbCustomerOrder').setRawValue('');
					Ext.getCmp('cbContainerNo').setRawValue('');
					Ext.getCmp('ckQCTested').setValue(false);
					
				}
			}]
		
		}],
		this.callParent(arguments);
	},
	onView : function() {
		
		this.serial = Ext.String.trim(Ext.getCmp('txtSerialNo').getValue().trim());
		this.dateFrom =  Ext.String.trim(Ext.getCmp('datetestedFrom').getRawValue());
		this.dateTo = Ext.String.trim(Ext.getCmp('datetestedTo').getRawValue());
		this.status = Ext.getCmp('cbStatus').getValue();
		this.viewBy = Ext.getCmp('cbViewBy').getValue();
		this.batchNo = Ext.String.trim(Ext.getCmp('txtBatchNo').getValue());
		this.itemNumber = Ext.getCmp('cbItemNumber').getValue();
		this.customerRef = Ext.String.trim(Ext.getCmp('cbCustomerRef').getRawValue());
		this.customerOrder = Ext.String.trim(Ext.getCmp('cbCustomerOrder').getRawValue());
		this.containerNo = Ext.String.trim(Ext.getCmp('cbContainerNo').getRawValue());
		this.qcTested = Ext.getCmp('ckQCTested').getValue();
		
		if (this.serial == '' && this.batchNo == '' && this.customerRef == '' && this.customerOrder == ''
			&& this.containerNo == ''){
			
			if (this.dateFrom == '' || this.dateFrom == ''){
				alert('Please select date tested if you don\'t fill in serial/batch/customer ref/customer order/container no');
				return;
			}
		}
		Ext.getBody().mask('Loading data...');
		Ext.Ajax.request({
			url : '/enterprise-app/service/getWellingtonTestLogs',
			params : {
				serial : this.serial,
				datetestedFrom : this.dateFrom,
				datetestedTo : this.dateTo,
				status : this.status,
				batchNo : this.batchNo,
				shipmentNo: this.shipmentNo,
				itemNumber: this.itemNumber,
				customerRef: this.customerRef,
				customerOrder: this.customerOrder,
				containerNo: this.containerNo,
				isLatest : this.viewBy=='Full result'?false:true,
				qcTested	:	this.qcTested,
				start : 0,
				limit: 1080
			},
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var productLogDS = new Ext.data.JsonStore({
					pageSize: 1080,
					fields : data.fieldData,
					data : data.productLogList,
					sortOnFilter: false,
					//autoload: true,
					proxy: {
						type: 'ajax',
				        url : '/enterprise-app/service/getWellingtonTestLogs',
				        extraParams: {
				        	//serial : Ext.getCmp('txtSerialNo').getValue(),
							//datetestedFrom : Ext.getCmp('datetestedFrom').getValue(),
							//datetestedTo : Ext.getCmp('datetestedTo').getValue(),
				        	serial : this.serial,
							datetestedFrom : this.dateFrom,
							datetestedTo : this.dateTo,
							status :  this.status,
							batchNo : this.batchNo,
							shipmentNo: this.shipmentNo,
							customerRef: this.customerRef,
							customerOrder: this.customerOrder,
							containerNo: this.containerNo,
							itemNumber: this.itemNumber,
							isLatest : this.viewBy=='Full result'?false:true,
							qcTested	:	this.qcTested,
				        }, 
				        reader: {
				            type: 'json',
				            root: 'productLogList',
				            totalProperty: 'totalCount'
				        }
				    }
				});
				productLogDS.totalCount = data.totalCount
				//pagingToolbar.onLoad(); ; 
				//Ext.getCmp('test-log-grid').removeAll();
				Ext.fly('test-log-grid').update('');
				var editing = Ext.create('Ext.grid.plugin.CellEditing', {
		            clicksToEdit: 1
		        });
				Ext.create('Ext.grid.Panel', {
					store : productLogDS,
					columns : data.columnData,
					stripeRows : true,
					height : 500,
					id: 'testGrid',
					width : '100%',
					renderTo : 'test-log-grid',
					title : 'Wellington test logs',
					viewConfig : {
						emptyText : 'There are no logs to display',
						deferEmptyText : false,
						enableRowBody : true,
//						forceFit : true,
//						autoFill: true,
						getRowClass : function(row, index) {
							var cls = '';
							var data = row.data;
							if (data.status == "Failed") {
								cls = 'highlighted-row';
							}
							return cls;
						}
					},
				    plugins: [editing],
				    dockedItems: [{
				        xtype: 'toolbar',
				        dock: 'top',
				        items: [/*{
				        	xtype: 'exporterbutton', 
				        	text: 'Export-to-Excel',
				        	formatter: new Ext.ux.exporter.csvFormatter.CsvFormatter({
				        		separator: ",",
				        	    extension: "xls",
				        	})
				            },*/{
				    			xtype : 'button',
				    			scope : this,
				    			text : 'Export to excel',
				    			handler : this.onExportAll
				    		}]
				    }],
				    // paging bar on the bottom
			        bbar: Ext.create('Ext.PagingToolbar', {
			            store: productLogDS,
			            displayInfo: true,
			            displayMsg: 'Displaying row {0} - {1} of {2}',
			            emptyMsg: "No data to display"
			        }),

				});
//				var loadMask = new Ext.LoadMask(grid, {
//		            store: productLogDS
//		        });
//				productLogDS.sort([{
//					property : 'datetested',
//					direction : 'ASC'
//				},{
//					property : 'serial',
//					direction : 'ASC'
//				}]);
				Ext.getBody().unmask();
			
			},
			scope: this
		});

	},
	onExport : function() {
		var exporter = Ext.create('EAP.GridExporter', {
			dateFormat : 'Y-m-d g:i'
		});
		exporter.exportGrid(Ext.getCmp('testGrid'));
	},
	onExportAll : function(){
		this.getForm().doAction('standardsubmit',{
			   url: '/enterprise-app/service/getWellingtonTestLogs',
			   params: {
				    serial : this.serial,
					datetestedFrom : this.dateFrom,
					datetestedTo : this.dateTo,
					status :  this.status,
					batchNo : this.batchNo,
					shipmentNo: this.shipmentNo,
					customerRef: this.customerRef,
					customerOrder: this.customerOrder,
					containerNo: this.containerNo,
					itemNumber: this.itemNumber,
					isLatest : this.viewBy=='Full result'?false:true,
					qcTested	:	this.qcTested,
					start : -1,
					limit: 100,
			   },
			   standardSubmit: true,
			   timeout: 100000,
			   method: 'POST'
			});
//		Ext.getBody().mask('Exporting data to excel...');
//		Ext.Ajax.request({
//			url : '/enterprise-app/service/getWellingtonTestLogs',
//			params : {
//				serial : Ext.getCmp('txtSerialNo').getValue(),
//				datetestedFrom : Ext.getCmp('datetestedFrom').getValue(),
//				datetestedTo : Ext.getCmp('datetestedTo').getValue(),
//				batchNo : Ext.getCmp('txtBatchNo').getValue(),
//				isLatest : Ext.getCmp('cbViewBy').getValue()=='Full result'?false:true,
//				start : -1,
//				limit: 100,
//				status :  this.status
//			},
//			success : function(response) {
//				var data = Ext.decode(response.responseText);
//				this.JSONToCSVConvertor("{\"productLogList\":["+data.productLogList+"]}",'data',true);
//				Ext.getBody().unmask();
//			}, 
//			failure: function(response, opts) {
//				Ext.getBody().unmask();
//		    },
//			scope: this
//		});	
	},
	onOpenBatchNo: function(){
		this.batchNoStore = new Ext.data.JsonStore({
        	autoLoad : true,
        	fields: [
        	            {name: 'batchNo'},
        	            {name: 'name'}
        	        ],
        	pageSize: 30,
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
            		var batchNoList =  this.batchNo.split(',');
    				for(var i=0;i<=batchNoList.length;i++){
    					var batchNo = store.findRecord('batchNo',batchNoList[i]);
    					if (batchNo != null){
    						Ext.getCmp('gridMotor').getSelectionModel().select(batchNo,true);
    					}
    				}
            	}
            }
        }); 
		this.batchNo = Ext.getCmp('txtBatchNo').getValue();
		this.batchNo = this.batchNo.replace(" ","");
		this.selectedBatchNo = this.batchNo;
		var sm = new Ext.selection.CheckboxModel({
    			checkOnly:true,
    			listeners: {
    				scope: this,
                	select: function( grid,record, index, eOpts ){
                		var _value = record.get('batchNo');
                		if (this.selectedBatchNo == ','){
                			this.selectedBatchNo = '';
                		}
                		if (this.selectedBatchNo.indexOf(_value) == -1){
                			this.selectedBatchNo = this.selectedBatchNo+","+_value;
                		}
                		console.log(this.selectedBatchNo);
                	},
                	deselect: function( grid, record, index, eOpts ){
                		var _value = record.get('batchNo');
                		if (this.selectedBatchNo.indexOf(_value) != -1){
                			this.selectedBatchNo = this.selectedBatchNo.replace(_value,"");
                			this.selectedBatchNo = this.selectedBatchNo.replace(",,",",");
                		}
                		if (this.selectedBatchNo == ','){
                			this.selectedBatchNo = '';
                		}
                		console.log(this.selectedBatchNo);
                	}
                	
                } 
        	});
        
        Ext.create('Ext.window.Window', {
            title: 'Select batchno',
            id:'frmBatchNo',
            height: 400,
            width: 400,
            layout: 'fit',
            modal: true,
            items: { 
                xtype: 'grid',
                id: 'gridMotor',
                border: false,
                selModel : sm,
                stateful: true,
    	        multiSelect: true,
                columns: [ 
                     {text: 'Batch no',sortable : false,width: 120,dataIndex: 'batchNo'}
                 ],
                store: this.batchNoStore,
                plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })],
               // selModel: {selType: 'cellmodel'},
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        text: 'Select',
                        scope: this,
                        handler: function(){
                        	var firstChar = this.selectedBatchNo.substring(0,1);
                        	if (firstChar == ','){
                        		this.selectedBatchNo = this.selectedBatchNo.substring(1,this.selectedBatchNo.length);
                        	}
                        	this.selectedBatchNo = this.selectedBatchNo.replace(",,",",");
                        	this.batchNo = this.selectedBatchNo;
                        	Ext.getCmp('txtBatchNo').setValue(this.batchNo);
    						Ext.getCmp('frmBatchNo').close();
                    	}
                    }, {
                        text: 'Close',
                        scope: this,
                        handler: function(){
                    		Ext.getCmp('frmBatchNo').close();
                    		
                    	}
                    }]
                }],
                // paging bar on the bottom
		        bbar: Ext.create('Ext.PagingToolbar', {
		            store: this.batchNoStore,
		            displayInfo: true,
		            displayMsg: 'Displaying row {0} - {1} of {2}',
		            emptyMsg: "No data to display"
		        }),
            },
            listeners:{
            	scope: this,
        	   'show' : function(grid,opts){
    				var batchNoList =  this.batchNo.split(',');
    				for(var i=0;i<=batchNoList.length;i++){
    					var batchNo = this.batchNoStore.findRecord('value',batchNoList[i]);
    					if (batchNo != null){
    						Ext.getCmp('gridMotor').getSelectionModel().select(batchNo,true);
    					}
    				}
        		}
        		
    		}
        }).show();		
	},
	JSONToCSVConvertor: function(JSONData, ReportTitle, ShowLabel){
		//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
		//alert(JSONData);
		var obj = Ext.decode(JSONData);
	    //var arrData = typeof JSONData != 'object' ? JSON.parse(obj) : obj;
	    var arrData = obj.productLogList;
	    var CSV = '';    
	    //Set Report title in first row or line
	    
	    //CSV += ReportTitle + '\r\n\n';

	    //This condition will generate the Label/Header
	    if (ShowLabel) {
	        var row = "";
	        
	        //This loop will extract the label from 1st index of on array
	        for (var index in arrData[0]) {
	            
	            //Now convert each value to string and comma-seprated
	            row += index + ',';
	        }

	        row = row.slice(0, -1);
	        
	        //append Label row with line break
	        CSV += row + '\r\n';
	    }
	    
	    //1st loop is to extract each row
	    for (var i = 0; i < arrData.length; i++) {
	        var row = "";
	        
	        //2nd loop will extract each column and convert it in string comma-seprated
	        for (var index in arrData[i]) {
	            row += '' + arrData[i][index] + ',';
	        }

	        row.slice(0, row.length - 1);
	        
	        //add a line break after each row
	        CSV += row + '\r\n';
	    }

	    if (CSV == '') {        
	        alert("Invalid data");
	        return;
	    }   
	    
	    //Generate a file name
	    var fileName = "Wellington_test_";
	    //this will remove the blank-spaces from the title and replace it with an underscore
	    fileName += ReportTitle.replace(/ /g,"_");   
	    
	    //Initialize file format you want csv or xls
	    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
	    
	    // Now the little tricky part.
	    // you can use either>> window.open(uri);
	    // but this will not work in some browsers
	    // or you will not get the correct file extension    
	    
	    //this trick will generate a temp <a /> tag
	    var link = document.createElement("a");    
	    link.href = uri;
	    
	    //set the visibility hidden so it will not effect on your web-layout
	    link.style = "visibility:hidden";
	    link.download = fileName + ".csv";
	    
	    //this part will append the anchor tag and remove it after automatic click
	    document.body.appendChild(link);
	    link.click();
	    document.body.removeChild(link);		
	}

});
