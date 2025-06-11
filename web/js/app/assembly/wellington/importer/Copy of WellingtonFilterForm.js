Ext.define('EAP.Form.WellingtonFilterForm', {
	extend : 'Ext.form.Panel',
	border : true,
	bodyBorder : true,
	exportUrl : '',
	layout : {
		type : 'table',
		columns : 4,
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
	dateFrom: '',
	dateTo: '',
	serial : '',
	status : '',
	batchNo : '',
	itemNumber: '',
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
		this.batchNoStore = new Ext.data.JsonStore({
        	autoLoad : true,
        	fields: [
        	            {name: 'value'},
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
            	load : function(store, records, successful, eOpts ){
//            		if (Ext.getCmp('txtBatchNo').keepValue != '@'){
//	            		Ext.getCmp('txtBatchNo').setRawValue(Ext.getCmp('txtBatchNo').keepValue);
//            		}
            	}
            }
        }); 
		this.items = [ {
			xtype : 'textfield', // 2
			id : 'txtSerialNo',
			inputId : 'SerialNo',
			labelAlign : 'right',
			maxLength : 20,
			enforceMaxLength : true,
			fieldLabel : 'Serial number',
			msgTarget : 'side',
			enableKeyEvents : true,
			height : 22,
			width : 350,
			maxWidth : 350
		},{
			  xtype:'combo',
			   fieldLabel:'Item number',
			   fieldLabel : '&nbsp;<b>Use * for wildcard search</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Item number',
	    		labelWidth: 260,
			   id:'itemNumber',
			   name:'itemNumber',
			   colspan: 2,
			   cls: 'x-item-combo',
			   valueField: 'code',
			   displayField:'code',
			   queryMode:'local',
			   store: wellingtonMotorStore,
			   editable: false,
			   autoSelect:true,
			   width : 400,
			   maxWidth : 400,
			   forceSelection:true
		},{
			xtype:'combo',
			id : 'cbViewBy',
			inputId: 'cboViewBy',
			store : viewByData,
			labelAlign: 'right',
			fieldLabel: 'View by',	      
			displayField : 'type',
			name : 'type',
			value: 'Packing result',
			editable: false,
			width: 200,
			allowBlank: true,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '4 4 4 4'
		},new Ext.form.field.ComboBox({
            selectOnTab: true,
			id : 'txtBatchNo',
			autoSelect: false,
			inputId : 'BatchNo',
            displayField : 'value',
    		valueField : 'value',
    		//fieldLabel : '&nbsp;<b>Use * for wildcard search</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Batch No',
    		fieldLabel : 'Batch No#',
    		//labelWidth: 260,
            store: this.batchNoStore,
            width : 600,
			maxWidth : 600,
			multiSelect: true,
			colspan: 3,
            keepValue : '@',
            typeAhead: false,
            queryParam: 'batchNo',
            scope: this,
            matchFieldWidth: false,
            pageSize: 50,
            minChars: 9999999999,
            listConfig: {
                   loadingText: 'Searching...',
                   emptyText: 'No matching batch number found.',
                   width: 250
//                   // Custom rendering template for each item
//                   getInnerTpl: function() {
//                       return '<div class="search-item">' +
//                           '<h3><span>{itemId}  -  {itemName}</span></h3>' +
//                       '</div>';
//                   }
            },
            listeners:{
            	select :function( combo, records, eOpts ){
            		//var rawValue = combo.getRawValue();
//            		for(var i=0;i<records.length;i++){
//            			var _value = records[i].get('value');
//            			if (combo.keepValue.indexOf(_value) == -1){
//            				combo.keepValue = combo.keepValue + ","+_value;
//            			}
//            		}
//            		combo.keepValue = combo.keepValue.replace('@,','');
//            		combo.setRawValue(combo.keepValue);
            		
            	},
            	change : function(combo, newValue, oldValue, eOpts ){
//            		combo.keepValue = combo.keepValue+newValue;
//            		combo.setRawValue(combo.keepValue);
//            		console.log(newValue);
//            		if (newValue == ''){
//            			combo.keepValue  = '@';
//            			combo.setRawValue('');
//            			
//            		}else if (newValue == '@'){
//            			combo.setRawValue('');
//            		}
            		
            		
            	}
            }
        }),{
			xtype:'combo',
			id : 'cbStatus',
			inputId: 'cboStatus',
			store : this.statusStore,
			labelAlign: 'right',
			fieldLabel: 'Status',	      
			displayField : 'name',
			valueField : 'value',
			//value: 1,
			width: 200,
			editable: false,
			allowBlank: true,
			msgTarget: 'side',
	    	triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '4 4 4 4'
		},{
        	fieldLabel: 'Date tested from',
        	name: 'datetestedFrom',
        	labelAlign: 'right',
        	id: 'datetestedFrom',
        	//allowBlank : false,
        	//submitFormat: 'Y-m-d H:i:s',
        	//value: new Date(),
			format: 'd/m/Y',
        	width: 200,
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
        	width: 200,
	    	margin: '4 4 4 4',
        	xtype: 'datefield',
        	cellCls: 'x-type-cell-left'
        	//colspan: 4
        	
        },	
		 {
			xtype : 'button',
			scope : this,
			text : 'View',
			colspan: 3,
			margin: '15 5 5 5',
			width: 100,
			handler : this.onView
		} ],
		this.callParent(arguments);
	},
	onView : function() {
		Ext.getBody().mask('Loading data...');
		this.serial = Ext.getCmp('txtSerialNo').getValue();
		this.dateFrom =  Ext.getCmp('datetestedFrom').getRawValue();
		this.dateTo = Ext.getCmp('datetestedTo').getRawValue();
		this.status = Ext.getCmp('cbStatus').getValue();
		this.viewBy = Ext.getCmp('cbViewBy').getValue();
		this.batchNo = Ext.getCmp('txtBatchNo').getValue();
		this.itemNumber = Ext.getCmp('itemNumber').getValue();
		if (this.serial == '' && this.batchNo == ''){
			
			if (this.dateFrom == null && this.dateFrom == null){
				alert('Please select date tested for filter');
				return;
			}
		}
		Ext.Ajax.request({
			url : '/enterprise-app/service/getWellingtonTestLogs',
			params : {
				serial : this.serial,
				datetestedFrom : this.dateFrom,
				datetestedTo : this.dateTo,
				status : this.status,
				batchNo : this.batchNo,
				itemNumber: this.itemNumber,
				isLatest : this.viewBy=='Full result'?false:true,
				start : 0,
				
				limit: 100
			},
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var productLogDS = new Ext.data.JsonStore({
					pageSize: 100,
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
							itemNumber: this.itemNumber,
							isLatest : this.viewBy=='Full result'?false:true,
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
				var grid = Ext.create('Ext.grid.Panel', {
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
				var loadMask = new Ext.LoadMask(grid, {
		            store: productLogDS
		        });
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
		//alert(this.dateFrom);
		this.getForm().doAction('standardsubmit',{
			   url: '/enterprise-app/service/getWellingtonTestLogs',
			   params: {
				   serial : this.serial,
					datetestedFrom : this.dateFrom,
					datetestedTo : this.dateTo,
					status :  this.status,
					batchNo : this.batchNo,
					itemNumber: this.itemNumber,
					isLatest : this.viewBy=='Full result'?false:true,
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
