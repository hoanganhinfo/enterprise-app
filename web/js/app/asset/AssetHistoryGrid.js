Ext.Loader.setConfig({
    enabled: true
});
Ext.define('EAP.Grid.AssetHistoryGrid', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.assetHistoryGrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    title: 'History',
    viewConfig: {
        emptyText: 'There are no history to display',
        deferEmptyText: false
    },
    departmentStore: null,
    initComponent: function(){

    	this.departmentStore = new Ext.data.JsonStore({
    	    fields: [
    	        {type: 'int', name: 'orgId'},
    	        {type: 'string', name: 'orgName'},
    	        {type: 'int', name: 'permissionId'},
    	        {type: 'boolean', name: 'isAdmin'}


    	    ]
    	});
    	this.departmentStore.loadData(Ext.decode(departmentJsonData));
        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            listeners: {
                beforeedit: function(e, editor){
                	var ret = false;
                	 var selection = this.getView().getSelectionModel().getSelection()[0];
                	 console.log(selection);
                	 if (selection) {
                		 if (selection.get('actionBy') == null || selection.get('actionBy') == ''){
                			 ret = true;
                		 }
                	 }
                	 return ret;
                        //return this.assetGrid.isAssetAdmin;
                },
                scope: this
            }
        });

        Ext.apply(this, {
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                itemId: 'asset_history_toolbar',
                items: [{
                    text: 'Transaction',
                    iconCls: 'icon-action',
                    id: 'addAssetHistory',
                    scale : 'medium',
                    menu: {
                        items: [{text: 'Hand-over',iconCls: 'edit', scope: this,handler: function(){this.onAddClick(6,'Hand-over');}},
                                {text: 'Loan',iconCls: 'edit', scope: this,handler: function(){this.onAddClick(7,'Loan');}},
                                {text: 'Repair',iconCls: 'edit', scope: this,handler: function(){this.onAddClick(8,'Repair');}},
                                {text: 'Return',iconCls: 'edit', scope: this,handler: function(){this.onAddClick(9,'Return');}},
                                {text: 'Dispose',iconCls: 'edit', scope: this,handler: function(){this.onAddClick(10,'Dispose');}},
                                {text: 'Note',iconCls: 'edit', scope: this,handler: function(){this.onAddClick(24,'Note');}}
                        ]
                    }
                }, {
                    iconCls: 'icon-delete',
                    text: 'Remove',
                    id: 'removeAssetHistory',
                    disabled: true,
                    itemId: 'delete',
                    scale : 'medium',
                    scope: this,
                    handler: this.onDeleteClick
                },{
                    text: 'Action',
                    iconCls: 'icon-action',
                    id: 'workflowHistoryAsset',
                    scale : 'medium',
                    menu: {
                        items: [{text: 'Submit',iconCls: 'edit', scope: this,handler: function(){this.onWorkflowClick(23,'submit');}},
                                {text: 'Approve',iconCls: 'edit', scope: this,handler: function(){this.onWorkflowClick(16,'approve');}},
                                {text: 'Reject',iconCls: 'edit', scope: this,handler: function(){this.onWorkflowClick(21,'reject');}}
                        ]
                    }
                },'->',
                {
                	xtype:'label',
                	id: 'lblAssetText',
                	width: 300,
                	html: '',
                }]
            }],
            columns: [{header: 'Transaction',flex: 1,sortable: false,dataIndex: 'transType'},
                      {header: 'Transaction date',flex: 1,sortable: false,dataIndex: 'startDate',
                    	  editor: new Ext.form.DateField({
                              format: 'd/m/Y',
                              submitFormat: 'd/m/Y'
                          })},

                      {header: 'Employee name',flex: 1,sortable: false,dataIndex: 'employee',field: {type: 'textfield'}},
                      {header: 'Employee No',flex: 1,sortable: false,dataIndex: 'employeeNo',field: {type: 'textfield'}},
                      {header: 'Department',sortable: false,dataIndex: 'department',
              			renderer:function(value,metaData,record){
           				return record.data.department;
	               		},
	                         editor: new Ext.form.field.ComboBox({
	                             selectOnTab: true,
	                             displayField : 'orgName',
	                     		   valueField : 'orgName',
	                             store: this.departmentStore,
	                             editable: false,
	                             queryMode: 'local',
	                             scope: this,
	                             listeners:{
	                                 			 select: function(combo, records,opt) {

	                                 				//this.resultName = records[0].get('name');
	                                 				this.result = records[0].get('orgName');

	                                            },
	                                 	scope: this
	                         		}
	                         })},
                     {header: 'Location',sortable: false,dataIndex: 'locationCode',
               			renderer:function(value,metaData,record){
            				return record.data.locationCode;
 	               		},
 	                         editor: new Ext.form.field.ComboBox({
 	                             selectOnTab: true,
 	                             displayField : 'locationCode',
 	                     		   valueField : 'locationCode',
 	                             store: assetLocationStore,
 	                             editable: false,
 	                             queryMode: 'local',
 	                             scope: this,
 	                             listeners:{
 	                                 			 select: function(combo, records,opt) {
 	                                 				this.result = records[0].get('locationCode');

 	                                            },
 	                                 	scope: this
 	                         		}
 	                         })},
                      {header: 'Memo',flex: 1,sortable: false,dataIndex: 'memo',field: {type: 'textfield'}},
                      {header: 'Value',flex: 1,sortable: false,dataIndex: 'value',field: {type: 'textfield'}},
                      {header: 'Created by',flex: 1,sortable: false,dataIndex: 'createdBy'},
                      {header: 'Created date',flex: 1,sortable: false,dataIndex: 'createdDate'},
                      {header: 'Action status',flex: 1,sortable: false,dataIndex: 'actionStatus'},
                      {header: 'Action by',flex: 1,sortable: false,dataIndex: 'actionBy'},
                      {header: 'Action date',flex: 1,sortable: false,dataIndex: 'actionDate'}],
          selModel: {
            selType: 'cellmodel'
        	},
        });
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        //assetHistoryDS.sort('startDate', 'DESC');
        assetHistoryDS.sort();
    },

    onSelectChange: function(selModel, selections){
    	var selection = this.getView().getSelectionModel().getSelection()[0];
        this.down('#delete').setDisabled(selections.length === 0 || selection.get('actionBy') != '');
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Defect code',
			msg : 'Are you sure to delete this record',
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
		            var asset = assetGrid.getView().getSelectionModel().getSelection()[0];
		            if (asset != null){
			            var lastHistory = this.store.last();
			            asset.set('status',lastHistory.get('transType'));
		            }
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },

    onAddClick: function(actionType,actionName){
    	//var asset = assetGrid.getView().getSelectionModel().getSelection()[0];
    	if (Ext.isEmpty(activeAssetId)){
    		alert('You don\'t select asset for this action');
    		return;
    	}
        var rec = new EAP.Model.AssetHistory({
        	id: null,
        	assetId: activeAssetId,
        	startDate: new Date(),
        	//transDate: new Date(),
        	transTypeId: actionType,
        	transType:actionName,
        	createdBy: userName,
        	createdDate: new Date(),
        	actionBy: '',
        	actionDate: null,
        	actionStatus: 22

        })
//        edit = this.editing;

//        edit.cancelEdit();
        this.store.insert(0, rec);
       // assetHistoryDS.sort('id', 'DESC');
//        edit.startEditByPosition({
//            row: this.store.count,
//            column: 0
//        });
        //asset.set('status',actionName);
        //this.store.sort();
    },
    onWorkflowClick: function(actionType, actionName){

        var assetHistory = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Workflow action',
			msg : 'Are you sure to ' + actionName,
			icon : Ext.Msg.QUESTION,
			buttons : Ext.Msg.YESNO,
			scope: this,
			defaultFocus: 2,
			fn : function(buttonId) {
				if (buttonId != 'yes'){
					return;
				}
		        if (assetHistory) {
		        	assetHistory.set('actionBy', userName);
		        	assetHistory.set('actionStatusId', actionType);
		        	assetHistory.set('actionStatus', actionName);
		        	assetHistory.set('actionDate', new Date());
		            this.store.update(assetHistory);

	            	assetHistoryDS.sort();

            		var asset = assetGrid.getView().getSelectionModel().getSelection()[0];
            		console.log(asset);
            		if (assetHistory.get("actionStatusId") == 16){
            	    	assetTreeStore.suspendAutoSync();
            	    	asset.set('department', assetHistory.get('department'));
            	    	asset.set('locationCode', assetHistory.get('locationCode'));
		            	asset.set('employee', assetHistory.get('employee'));
		            	asset.set('employeeNo', assetHistory.get('employeeNo'));
		            	assetTreeStore.sync();
		            	assetTreeStore.resumeAutoSync();
            	    }

	            	/*
	            	var allRecords = assetHistoryDS.getRange();
	            	for (var i in allRecords) {
	            		var record = allRecords[i];

	            	    if (record.get("actionStatusId") == 16){
	            	    	assetTreeStore.suspendAutoSync();
	            	    	asset.set('department', record.get('department'));
			            	asset.set('employee', record.get('employee'));
			            	asset.set('employeeNo', record.get('employeeNo'));
			            	asset.set('status', record.get('transTypeId'));
			            	asset.set('statusText', record.get('transType'));
			            	if (record.get('transTypeId') == 9){
			            		asset.set('status', '5');
			            		asset.set('statusText', 'Available');
			            	}

			            	assetTreeStore.sync();
			            	assetTreeStore.resumeAutoSync();
			            	break;
	            	    }

	            	}
	            	*/
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },
    loadText: function(newText){
    	Ext.getCmp('lblAssetText').setText("Asset : " +newText+"     ");

    }
});