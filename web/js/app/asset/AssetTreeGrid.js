Ext.Loader.setConfig({
    enabled: true
});

Ext.define('EAP.Grid.AssetTreeGrid', {
    extend: 'Ext.tree.Panel',
    alias : 'widget.assetTreeGrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    collapsible: true,
    useArrows: true,
    rootVisible: false,
    singleExpand: true,
    //departmentJson: null,
    categoryList: null,
    departmentList:null,
    changedCategory: '',
    historyStore: null,
    //changedAssetId: '',
    isAssetAdmin : false,
    permissionId : -1,
    title: 'Asset master',
    viewConfig: {
        emptyText: 'There are no assets to display',
        deferEmptyText: false
    },
    initComponent: function(){
    	this.createCategoryList();
        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            listeners: {
                beforeedit: function(e, editor){
                	if (assetManager == null){
                		return false;
                	}

                	/*
                	if (this.historyStore.getCount() > 0){
                		alert('You cannot edit when asset has transaction');
                		return false;
                	}
                	*/
                	//console.log(this.permissionId);
                	/*
                	if (this.permissionId > 0){
                		return true;
                	}else{
                		return false;
                	}
                	*/
                        //return this.isAssetAdmin;
                },
                scope: this
            }
        });

        Ext.apply(this, {
            frame: true,
            plugins: [this.editing],

            columns: [{header: 'Asset code',flex: 1,sortable: true,dataIndex: 'assetCode',width:500,xtype: 'treecolumn',
		            	editor: {
		                    xtype: 'textfield',
		                    allowBlank: false
		                }},
		                {header: 'Name',flex: 1,sortable: true,dataIndex: 'assetName',
	                    	  editor: {
	  		                    xtype: 'textfield',
	  		                    allowBlank: false
	  		                }},
                      {header: 'Category',flex: 1,sortable: true,dataIndex: 'categoryId',
            			renderer:function(value,metaData,record){
            				return record.data.categoryName;
                		},
                          editor: new Ext.form.field.ComboBox({
                              selectOnTab: true,
                              displayField : 'categoryname',
                      		   valueField : 'id',
                              store: assetCategoryStore,
                              listClass: 'x-combo-list-small',
                              scope: this,
                              queryMode : 'local',
                              listeners:{
                            	  change: function(combo, records, eOpts ){
		                       		 //  console.log(records[0].get('categoryname'));
		                       	//	 var selection = this.getView().getSelectionModel().getSelection()[0];
		                       		//selection.set('categoryId', records[0].get('id'))
		                       	//	selection.set('categoryName', records[0].get('categoryname'))
		                       		  // this.result = records[0].get('id');
		                       	   				this.changedCategory = combo.getRawValue();
		                          			},
		                          	scope: this
                          		}
                          })},
                      {header: 'Manufacturer',flex: 1,sortable: true,dataIndex: 'manufacturer',editor: {
		                    xtype: 'textfield',
		                    allowBlank: false
		                }},
		                {header: 'Model',flex: 1,sortable: true,dataIndex: 'model',editor: {
		                    xtype: 'textfield',
		                    allowBlank: true
		                }},
                      {header: 'Serial',flex: 1,sortable: true,dataIndex: 'serial',
                    	  editor: {
  		                    xtype: 'textfield',
  		                    allowBlank: false
  		                }},
                      {header: 'Distributor',flex: 1,sortable: true,dataIndex: 'distributor',
                    	  editor: {
  		                    xtype: 'textfield',
  		                    allowBlank: false
  		                }},
                      {header: 'Purchased date',flex: 1,sortable: true,dataIndex: 'purchasedDate',
                    	  editor: new Ext.form.DateField({
                              format: 'd/m/Y',
                              submitFormat: 'd/m/Y'
                          })},
                      {header: 'Waranty',flex: 1,sortable: true,dataIndex: 'warranty',
                    	  editor: {
  		                    xtype: 'textfield',
  		                    allowBlank: false
  		                }},
                      {header: 'Expired date',flex: 1,sortable: true,dataIndex: 'expiredDate',
                    	  editor: new Ext.form.DateField({
                              format: 'd/m/Y',
                              submitFormat: 'd/m/Y'
                          })},
                      {header: 'Store name',flex: 1,sortable: true,dataIndex: 'store',
                    	  editor: {
  		                    xtype: 'textfield',
  		                    allowBlank: true
  		                }},
                      {header: 'Store address',flex: 1,sortable: true,dataIndex: 'storeAddress',
                    	  editor: {
  		                    xtype: 'textfield',
  		                    allowBlank: false
  		                }},
  		              {header: 'Asset owner',flex: 1,sortable: true,dataIndex: 'owner',
  	            			renderer:function(value,metaData,record){
  	            				return record.data.owner;
  	                		},
  	                          editor: new Ext.form.field.ComboBox({
  	                              selectOnTab: true,
  	                              displayField : 'name',
  	                      		   valueField : 'name',
  	                              store: ownerStore,
  	                              listClass: 'x-combo-list-small',
  	                              scope: this,
  	                              queryMode : 'local',
  	                              listeners:{
  	                            	  select: function(combo, records, eOpts ){
  			                       		 //  console.log(records[0].get('categoryname'));
  			                       	//	 var selection = this.getView().getSelectionModel().getSelection()[0];
  			                       		//selection.set('categoryId', records[0].get('id'))
  			                       	//	selection.set('categoryName', records[0].get('categoryname'))
  			                       		   this.result = records[0].get('name');
  			                       	   			//	this.changedCategory = combo.getRawValue();
  			                          			},
  			                          	scope: this
  	                          		}
  	                          })},
  		              {header: 'Department',flex: 1,sortable: true,dataIndex: 'department'},
  		              {header: 'Location',flex: 1,sortable: true,dataIndex: 'locationCode'},
  		              {header: 'Employee',flex: 1,sortable: true,dataIndex: 'employee'},
		              {header: 'Employee No',flex: 1,sortable: true,dataIndex: 'employeeNo'},
                      {header: 'Status',flex: 1,sortable: true,dataIndex: 'statusText'},
                      {header: 'Current task',flex: 1,sortable: true,dataIndex: 'requestType'},
                      {header: 'Description',flex: 1,sortable: true,dataIndex: 'description',
                    	  editor: {
  		                    xtype: 'textfield',
  		                    allowBlank: true
  		                }}],
          selModel: {
            selType: 'cellmodel'
        	}
        });


        this.callParent(arguments);

        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);

        this.on('edit', function(editor,e){
        	if(e.field == 'categoryId' && this.changedCategory != ''){
            	e.record.set('categoryId', e.value);
            	e.record.set('categoryName', this.changedCategory);
            	changedCategory = '';
            	//e.column.render();
            }
        },this);


    },
    onSelectChange: function(selModel, selections){
    	Ext.getCmp('removeAsset').setDisabled(assetManager != null && selections.length === 0);
    	//Ext.getCmp('moveAsset').setDisabled(selections.length === 0);
       // this.up('#delete').setDisabled(selections.length === 0);
        //this.up('#moveAsset').setDisabled(selections.length === 0);
        if (selections.length > 0){
        	if (selections[0].get('id') != null &&	activeAssetId != selections[0].get('id')){
        		//this.changedAssetId = selections[0].get('id');
        		activeAssetId = selections[0].get('id');
	        	this.historyStore.load({params:{assetId:  activeAssetId}});
	        	assignedTaskDS.load({params:{assetId:  activeAssetId}});

        	}
    	}
    },

    onSync: function(){
        this.store.sync();
    },
    createCategoryList:function () {
    	var ds = new Ext.data.JsonStore({
    		//autoLoad : true,
    		//fields : ['id', 'categoryname'],
    		model : 'EAP.Model.AssetCategory',
    		proxy: {
    	        type: 'ajax',
    	      //  extraParams :{departmentId: this.departmentList.getValue()},
    	        url: GET_ASSET_CATEGORY_LIST,
    	        reader: {
    	            type: 'json',
    	            root: 'AssetCategoryList',
    	            idProperty: 'id'
    	        }
    	    },
    	    listeners: {
    			load: function( store, records, successful, operation, eOpts ){
    				//this.changedAssetId = '';
    				activeAssetId = '';
    				this.historyStore.removeAll();

    				if (store.getTotalCount() > 0){
    					this.categoryList.select(store.getAt(0));
    					 this.categoryList.fireEvent('select',  this.categoryList,records);

    					his.getStore().load({params:{departmentId: activeDepartment.get('orgId'),categoryId:  records[0].get('id')}});
    				}else{
    					this.categoryList.setValue('');
    					this.categoryList.setRawValue('');
    					//this.getStore().removeAll();
    				}


            	},
            	scope:this
    		}
    	});

    	 this.categoryList = new Ext.form.ComboBox({
    		id : 'cboCategoryLine',
    		inputId: 'cbCategoryLine',
    		store : ds,
    		labelAlign: 'right',
    	    fieldLabel: 'Category',
    		displayField : 'categoryname',
    		valueField : 'id',
    		typeAhead : true,
    		loadingText : 'Searching...',
    		labelWidth: 70,
    		width: 220,
    		editable: false,
    		msgTarget: 'side',
    		maxWidth: 220,
    		// hideTrigger:true,
    		queryMode : 'local',
    		minChars : 1
    	});

    },

});