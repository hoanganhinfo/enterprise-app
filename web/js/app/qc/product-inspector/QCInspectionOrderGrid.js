Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.define('EAP.Grid.QCInspectionOrderGrid', {
    extend: 'Ext.grid.Panel',
    xtype:'qcInspectionOrderGrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn'
    ],
    //title: 'Asset category list',
    itemStore : null,
    vendorStore : null,
    selectedHTMLRow : null,
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false,
        getRowClass: function(record, rowIndex, rowParams, store) {
        		var cls = '';
        	  if (record.get('transTypeId') == 1) cls =  'rowIncoming ';
        	  else if (record.get('transTypeId') == 2) cls =  'rowInjection ';
        	  else if (record.get('transTypeId') == 3) cls =  'rowSMT ';
        	  else if (record.get('transTypeId') == 4) cls =  'rowOutcoming ';
        	  if (record.get('id') != null &&
        			  record.get('id') == this.up('#inspectionInputPanel').inspectionId){
        		  cls += 'x-selected-row';
        	  }

        	  return cls;

       }
    },
    itemName: '',
    vendorName: '',
    resultName:'',
    result: '',
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });
        this.itemStore = new Ext.data.JsonStore({
        	//autoLoad : true,
        	fields: [
        	            {name: 'itemId'},
        	            {name: 'itemName'}
        	        ],
        	pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                url: '/ax-portlet/service/getItems',
                reader: {
                    type: 'json',
                    root: 'ItemList',
                    idProperty: 'itemId',
                    totalProperty: 'totalCount'
                }
            }
        });
        this.vendorStore = new Ext.data.JsonStore({
        	//autoLoad : true,
        	fields: [
        	            {name: 'vendorId'},
        	            {name: 'vendorName'}
        	        ],
        	pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                url: '/ax-portlet/service/getVendors',
                reader: {
                    type: 'json',
                    root: 'VendorList',
                    idProperty: 'vendorId',
                    totalProperty: 'vendorName'
                }
            }
        });
        Ext.apply(this, {
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [ {
                	fieldLabel: 'Received date',
                	name: 'txtworkingDate',
                	labelAlign: 'right',
                	id: 'workingDate',
                	//allowBlank : false,
                	submitFormat: 'd/m/Y',
                	value: new Date(),
        			format: 'd/m/Y',
                	width: 200,
        	    	margin: '4 4 4 4',
                	xtype: 'datefield'

                },Ext.create('Ext.form.field.ComboBox', {
            		id : 'cbTransType',
            		inputId: 'cboTransType',
            		fieldLabel: 'Type',
            	    displayField: 'name',
            	    labelAlign: 'right',
            	    valueField : 'value',
            	    width: 200,
            	    editable: false,
            	    labelWidth: 50,
            	    store: transTypeStore,
            	    queryMode: 'local',
            	    typeAhead: true
            	}),{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scale : 'medium',
                    scope: this,
                    handler: this.onAddClick
                },{
                    iconCls: 'icon-delete',
                    scale : 'medium',
                    text: 'Delete',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                },{
                    iconCls: 'icon-excel',
                    scale : 'medium',
                    text: 'Export excel',
                    //disabled: true,
                    itemId: 'exportExcel',
                    scope: this,
                    handler: this.onExportClick
                },{
                    iconCls: 'icon-defect',
                    scale : 'medium',
                    text: 'Defects',
                   // disabled: true,
                    itemId: 'defects',
                    scope: this,
                    handler: this.onOpenDefect
                }]
            }],
            columns: [{header: 'Received date',flex: 1,sortable: true,dataIndex: 'receiveDate',
            	  editor: new Ext.form.DateField({
                      format: 'd/m/Y',
                      submitFormat: 'd/m/Y'
                  })}, {header: 'Inspected date',flex: 1,sortable: true,dataIndex: 'inspectedDate',
          	  editor: new Ext.form.DateField({
                  format: 'd/m/Y',
                  submitFormat: 'd/m/Y'
              })},{header: 'Item id',flex: 1,sortable: true,dataIndex: 'itemId',
      			renderer:function(value,metaData,record){
    				return record.data.itemId;
        		},
                  editor: new Ext.form.field.ComboBox({
                      selectOnTab: true,
                      displayField : 'itemId',
              		   valueField : 'itemId',
                      store: this.itemStore,
                      width:400,
                      cls: 'x-item-combo',
                      typeAhead: false,
                      queryParam: 'itemId',
	                  hideLabel: true,
	                  hideTrigger:true,
                      scope: this,
                      pageSize: 50,
                      minChars: 4,
                      listConfig: {
	                         loadingText: 'Searching...',
	                         emptyText: 'No matching items found.',

	                         // Custom rendering template for each item
	                         getInnerTpl: function() {
	                             return '<div class="search-item">' +
	                                 '<h3><span>{itemId}  -  {itemName}</span></h3>' +
	                             '</div>';
	                         }
                      },
                      listeners:{
                       	   change: function(combo, newRec,oldRec, eOpts ){
                          				//alert(combo.getRawValue());
                       	   			//alert(changedUOM);
                          			//	alert(this.getXType());
                       	   			//	this.itemName = newRec.record.get('itemName');
                          			},
                          			 select: function(combo, records,opt) {
                          				this.itemName = records[0].get('itemName');
                                        // alert(record.get('name') + ' clicked');
                                     },
                          	scope: this
                  		}
                  })},{
	            	header: 'Item name',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'itemName',
	                width:200,
	                field: {
	                    type: 'textfield',
	                    width:400
	                }
                 },{header: 'Vendor',flex: 1,sortable: true,dataIndex: 'vendorId',
           			renderer:function(value,metaData,record){
        				return record.data.vendorId;
            		},
                      editor: new Ext.form.field.ComboBox({
                          selectOnTab: true,
                          displayField : 'vendorId',
                  		   valueField : 'vendorId',
                          store: this.vendorStore,
                          width:400,
                          cls: 'x-item-combo',
                          typeAhead: false,
                          queryParam: 'vendorId',
    	                  hideLabel: true,
    	                  hideTrigger:true,
                          scope: this,
                          pageSize: 50,
                          minChars: 1,
                          listConfig: {
    	                         loadingText: 'Searching...',
    	                         emptyText: 'No matching vendor found.',

    	                         // Custom rendering template for each item
    	                         getInnerTpl: function() {
    	                             return '<div class="search-item">' +
    	                                 '<h3><span>{vendorId}  -  {vendorName}</span></h3>' +
    	                             '</div>';
    	                         }
                          },
                          listeners:{
                           	   change: function(combo, newRec,oldRec, eOpts ){
                              				//alert(combo.getRawValue());
                           	   			//alert(changedUOM);
                              			//	alert(this.getXType());
                           	   			//	this.itemName = newRec.record.get('itemName');
                              			},
                              			 select: function(combo, records,opt) {
                              				this.vendorName = records[0].get('vendorName');
                                            // alert(record.get('name') + ' clicked');
                                         },
                              	scope: this
                      		}
                      })},{
                    	  header: 'Order#',
      	                flex: 1,
      	                sortable: true,
      	                dataIndex: 'orderNo',
      	                field: {
      	                    type: 'textfield',
      	                    width:200
      	                }
                      },{
	            	header: 'Total Qty',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'partQty',
	                field: {
	                    type: 'textfield',
	                    width:200
	                }
                 },{
	            	header: 'Inspected Qty',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'checkedQty',
	                field: {
	                    type: 'textfield'

	                }
                 },{
	            	header: 'Critical Qty',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'criticalQty'
                 },{
	            	header: 'Major Qty',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'majorQty'
                 },{
	            	header: 'Minor Qty',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'minorQty'
                 },{header: 'Result',sortable: true,dataIndex: 'resultName',
        			renderer:function(value,metaData,record){
     				return record.data.resultName;
         		},
                   editor: new Ext.form.field.ComboBox({
                       selectOnTab: true,
                       displayField : 'name',
               		   valueField : 'name',
                       store: statusTypeStore,
                       editable: false,
                       queryMode: 'local',
                       scope: this,
                       listeners:{
                           			 select: function(combo, records,opt) {

                           				//this.resultName = records[0].get('name');
                           				this.result = records[0].get('value');

                                      },
                           	scope: this
                   		}
                   })}],
          selModel: {
            selType: 'cellmodel'
        	},
        	bbar: Ext.create('Ext.PagingToolbar', {
                 store: this.store,
                 displayInfo: true,
                 displayMsg: '<span style="background-color:blue">&nbsp;&nbsp;&nbsp;&nbsp;</span> Incoming&nbsp;&nbsp;&nbsp;&nbsp;<span style="background-color:SaddleBrown">&nbsp;&nbsp;&nbsp;&nbsp;</span> Injection&nbsp;&nbsp;&nbsp;&nbsp;<span style="background-color:magenta">&nbsp;&nbsp;&nbsp;&nbsp;</span> SMT&nbsp;&nbsp;&nbsp;&nbsp;<span style="background-color:#088A08">&nbsp;&nbsp;&nbsp;&nbsp;</span> Outgoing&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displaying row {0} - {1} of {2}',
                 emptyMsg: "No data to display"
             })
        });
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        this.store.on('load', function(store, records, successful, eOpts){
        	this.down('#exportExcel').setDisabled(false);
        },this);
        this.on('edit', function(editor,e){
        	//alert(e.field);
        	var edit = this.editing;
        	this.getStore().suspendAutoSync();

        	if(e.field == 'itemId'){
        		e.record.set('itemName', this.itemName);
            }
        	if(e.field == 'vendorId'){
        		e.record.set('vendorName', this.vendorName);
            }
        	if(this.result != ''){
        		//alert(this.result);
        		//e.record.set('resultName', this.resultName);
        		e.record.set('result', this.result);
            }
        	this.getStore().sync();
        	this.result = '';
        	//Ext.get(this.selectedHTMLRow).addCls('x-selected-row');

        },this);
        this.on('select',function(_grid, record, index, eOpts ){
//        	if (this.selectedHTMLRow != null){
//        		Ext.get(this.selectedHTMLRow).removeCls('x-selected-row');
//        	}
        	for(var i=0;i<this.store.getCount();i++){
        		var row = this.getView().getNode(i); // Getting HtmlElement here
            	Ext.get(row).removeCls('x-selected-row');
        	}
        	row = this.getView().getNode(index); // Getting HtmlElement here
        	Ext.get(row).addCls('x-selected-row');
        	this.selectedHTMLRow = row;
        },this);
    },

    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
        if (selections.length > 0 && selections[0].get('id') != null){
        	this.up('#inspectionInputPanel').inspectionId = selections[0].get('id');
        	this.up('#inspectionInputPanel').selectedRecord = selections[0];
        	this.up('#inspectionInputPanel').inspectionLineStore.load({params:{inspectorId:  selections[0].get('id')}});
    	}

    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Defect code',
			msg : 'Are you sure to delete selected row',
			icon : Ext.Msg.QUESTION,
			buttons : Ext.Msg.YESNO,
			scope: this,
			defaultFocus: 2,
			fn : function(buttonId) {
				if (buttonId != 'yes'){
					return;
				}
		        if (selection) {
		            this.store.remove(selection);
		            this.store.sync();
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },

    onAddClick: function(){
    	if (Ext.getCmp('cbTransType').getRawValue() == ''){
    		Ext.Msg.show({
    			title : 'New line',
    			msg : 'Please select transaction type before creating new line',
    			icon : Ext.Msg.INFO,
    			buttons : Ext.Msg.OK,
    			scope: this,
    			defaultFocus: 2,
    			fn : function(buttonId) {
    				if (buttonId != 'yes'){
    					return;
    				}
    		        if (selection) {
    		            this.store.remove(selection);
    		        }

    			},
    			icon : Ext.MessageBox.INFO
    		});
    		return;
    	}
        var rec = new EAP.Model.QCInspectionTable({
        	inspectedDate: Ext.getCmp('workingDate').getValue(),//new Date(),
        	receiveDate:  Ext.getCmp('workingDate').getValue(),//new Date(),
        	itemId: '',
        	transTypeId: Ext.getCmp('cbTransType').getValue(),
        	itemName: '',
        	accepted: false,
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
    },
    onExportClick : function(){
		Ext.getBody().mask('Exporting data to excel...');
//		this.inspectionTableStore.getProxy().setExtraParam("itemId", this.itemId);
//		this.inspectionTableStore.getProxy().setExtraParam("dateinspectedFrom", this.dateFrom);
//		this.inspectionTableStore.getProxy().setExtraParam("dateinspectedTo", this.dateTo)
		Ext.Ajax.request({
			url : GET_QC_INSPECTION_TABLE_LIST,
			params : {
				itemId:  this.store.getProxy().extraParams.itemId,
				dateinspectedFrom :  this.store.getProxy().extraParams.dateinspectedFrom,
				dateinspectedTo : this.store.getProxy().extraParams.dateinspectedTo,
				transType: this.store.getProxy().extraParams.transType,
				start : -1,
				limit: PAGE_SIZE
			},
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var _JSONExporter = new JSONExporter();
				var obj = Ext.decode("{\"InspectionTableList\":["+data.InspectionTableList+"]}");

				_JSONExporter.exportCSV(obj.InspectionTableList,'QC Inspection DataSheet',true,"QC_Inspection_datasheet");
				//JSONToCSVConvertor("{\"InspectionTableList\":["+data.InspectionTableList+"]}",'data',true);
				Ext.getBody().unmask();
			},
			failure: function(response, opts) {
				Ext.getBody().unmask();
		    },
			scope: this
		});
    },
    onOpenDefect : function(){
        var dlg = Ext.create('Ext.window.Window', {
            title: 'Inspection Defect',
            id:'frmDefects',
            height: 400,
            width: 500,
            layout: 'fit',
            modal: true,
            items: {
        		xtype : 'qcInspectionDefectsGrid',
        		store: this.inspectionTableStore,
        	    id: 'qcInspectionDefectsGrid',
        	    stateful: true,
        	    height: 400,
            },
            listeners:
            {
        	   'show' : function(grid,opts)
        	   	{
//        	   		if(selectedAPTItems == null)
//        	   		return;
//        	   		var _pds = Ext.getCmp('idassypmGrid').getSelectionModel().getSelection()[0].get('product_defects').split(';');
//
//        	   		for(var i =0;i <= _pds.length; i++)
//        	   		{
//        	   			if(assyPDStore == null)
//        	   			return;
//        	   			var _pd  =  assyPDStore.findRecord('id',_pds[i]);
//        	   			if(_pd!=null)
//        	   			{
//        	   				Ext.getCmp('gridAPD').getSelectionModel().select(_pd,true);
//        	   			}
//
//        	   		}

        		},scope: this
    		}
        });
        dlg.show();
    }

});