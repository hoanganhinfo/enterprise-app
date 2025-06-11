Ext.define('EAP.Form.ProductFilterForm', {
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
	defaults : {
		bodyStyle : 'padding:10px'
	},
	initComponent : function() {
		this.bbar = [{
			xtype : 'button',
			scope : this,
			text : 'View',
			handler : this.onView
		}],
		
		this.items = [new Ext.form.ComboBox({
			id : 'cboProductType',
			inputId: 'cbProductType',
			store : new Ext.data.JsonStore({
				autoLoad : true,
				//fields : ['id', 'product_type','product_type_name'],
				model: 'EAP.Model.AssyProductType',
				proxy: {
			        type: 'ajax',
			        url: GET_ASSY_PRODUCT_TYPE_LIST_URL,
			        reader: {
			            type: 'json',
			            root: 'AssyProductTypeList',
			            idProperty: 'id'
			        }
			    }
			}),
			allowBlank: false,
			msgTarget: 'side',		
			labelAlign: 'right',
		    fieldLabel: 'Product type',	      
			displayField : 'product_type',
			valueField : 'id',
			//flex: 2,
			typeAhead : true,
			editable: false,
			width : 250,
			maxWidth: 250,
			// hideTrigger:true,
			triggerAction : 'all',
			queryMode : 'remote',
			minChars : 1,
			listeners: {
				select: function(combo,record,opt){
					this.exportUrl = record[0].get('reportUrl');
	        	},
	        	scope : this
			}		
		}), {
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
			width : 250,
			maxWidth : 250
		}, {
			xtype : 'label',
			html: '&nbsp;<b>Use * for wildcard search</b>',
	        cellCls: 'x-type-cell-left'
			
		},{
        	fieldLabel: 'Date tested from',
        	name: 'datetestedFrom',
        	labelAlign: 'right',
        	id: 'datetestedFrom',
        	allowBlank : false,
        	submitFormat: 'd/m/Y',
        	value: new Date(),
			format: 'd/m/Y',
        	width: 200,
	    	margin: '4 4 4 4',
        	xtype: 'datefield'
        	
        },{
        	fieldLabel: 'Date tested to',
        	name: 'datetestedTo',
        	labelAlign: 'right',
        	allowBlank : false,
			id: 'datetestedTo',
        	format: 'd/m/Y',
        	value: new Date(),
        	submitFormat: 'd/m/Y',
        	width: 200,
	    	margin: '4 4 4 4',
        	xtype: 'datefield',
        	cellCls: 'x-type-cell-left'
        	//colspan: 4
        	
        } ],
		this.callParent(arguments);
	},
	onView : function() {
		var _fromDate = Ext.getCmp('datetestedFrom').getValue();
		var _toDate = Ext.getCmp('datetestedTo').getValue();
		if (Ext.isEmpty(Ext.getCmp('cboProductType').getValue())){
			Ext.Msg.alert('Error', 'Please select product type');
			return;
		}
		if (!Ext.isDate(_fromDate) || !Ext.isDate(_toDate)){
			Ext.Msg.alert('Error','Please select date');
			return;
		}
		if (_fromDate > _toDate){
			Ext.Msg.alert('Error', 'From date cannot be greater than To date');
			return;
		}
		
		Ext.Ajax.request({
			url : GET_PRODUCT_TEST_LOG_URL,
			params : {
				productType : Ext.getCmp('cboProductType').getValue(),
				serial : Ext.getCmp('txtSerialNo').getValue(),
				datetestedFrom : Ext.getCmp('datetestedFrom').getValue(),
				datetestedTo : Ext.getCmp('datetestedTo').getValue()
			},
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var productLogDS = new Ext.data.JsonStore({
					fields : data.fieldData,
					data : data.productLogList
				});
				//Ext.getCmp('test-log-grid').removeAll();
				Ext.fly('test-log-grid').update('');
				var grid = Ext.create('Ext.grid.Panel', {
					store : productLogDS,
					columns : data.columnData,
					stripeRows : true,
					height : 500,
					id: 'testGrid',
					width : '100%',
					renderTo : 'test-log-grid',
					title : 'Product test logs',
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
				    dockedItems: [{
				        xtype: 'toolbar',
				        dock: 'top',
				        items: [{
				        	xtype: 'button', 
				        	text: 'Export to Excel',
				        	handler : this.onExport,
				        	hidden: (this.exportUrl == '' || this.exportUrl == null)?false:true,
				        	formatter: new Ext.ux.exporter.csvFormatter.CsvFormatter({
				        		separator: "#",
				        	    extension: "xls",
				        	})
				            },{
				    			xtype : 'button',
				    			scope : this,
				    			hidden: (this.exportUrl != '' && this.exportUrl != null)?false:true,
				    			text : 'Export to excel',
				    			handler : this.onExportExcel
				    		}]
				    }]

				});
				productLogDS.sort([{
					property : 'datetimetested',
					direction : 'ASC'
				},{
					property : 'serial',
					direction : 'ASC'
				}]);
			},
			scope : this
		});

	},
	onExport : function() {
		var exporter = Ext.create('EAP.GridExporter', {
			dateFormat : 'Y-m-d g:i'
		});
		exporter.exportGrid(Ext.getCmp('testGrid'));
//		this.getForm().doAction('standardsubmit', {
//			url : this.exportUrl,
//			params : {
//				myOrgs : myOrgs,
//				userId : userId,
//				departmentId : Ext.getCmp('cbDepartment1').getValue(),
//				priorityId : Ext.getCmp('cbPriority1').getValue(),
//				statusId : Ext.getCmp('cbStatus1').getValue(),
//				requestDateFrom : Ext.getCmp('requestDateFrom').getRawValue(),
//				requestDateTo : Ext.getCmp('requestDateTo').getRawValue()
//			},
//			standardSubmit : true,
//			timeout : 100000,
//			method : 'POST'
//		});
	},
	onExportExcel: function(){
		
		this.getForm().doAction('standardsubmit',{
			   url: '/enterprise-app/service/'+this.exportUrl,
			   params: {
				   productType : Ext.getCmp('cboProductType').getValue(),
					serial : Ext.getCmp('txtSerialNo').getValue(),
					datetestedFrom : Ext.getCmp('datetestedFrom').getValue(),
					datetestedTo : Ext.getCmp('datetestedTo').getValue() 
			   },
			   standardSubmit: true,
			   timeout: 100000,
			   method: 'POST'
			});
	}

});
