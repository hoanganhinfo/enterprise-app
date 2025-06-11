Ext.Loader.setConfig({
    enabled: true
});
Ext.define('EAP.Grid.AssetGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    departmentJson: null,
    categoryList: null,
    departmentList:null,
    changedCategory: '',
    historyStore: null,
    changedAssetId: '',
    isAssetAdmin : false,
    title: 'Asset list',
    viewConfig: {
        emptyText: 'There are no assets to display',
        deferEmptyText: false
    },
    initComponent: function(){
    	this.createDepartmentList();
    	this.createCategoryList();

        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                        return this.isAssetAdmin;
                },
                scope: this
            }
        });

        Ext.apply(this, {
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'New asset',
                    id: 'newAsset',
                    scope: this,
                    scale : 'medium',
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-delete',
                    text: 'Remove asset',
                    id: 'removeAsset',
                    disabled: true,
                    itemId: 'delete',
                    scale : 'medium',
                    scope: this,
                    handler: this.onDeleteClick
                },'->',this.departmentList,this.categoryList]
            }],
            columns: [{header: 'Asset name',flex: 1,sortable: true,dataIndex: 'assetName',width:500,
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
                              store: this.categoryList.getStore(),
                              listClass: 'x-combo-list-small',
                              scope: this,
                              queryMode : 'local',
                              listeners:{
		                       	   change: function(combo, records, eOpts ){
		                          				//alert(combo.getRawValue());
		                       	   			//alert(changedUOM);
		                          			//	alert(this.getXType());
		                       	   				this.changedCategory = combo.getRawValue();
		                          			},
		                          	scope: this
                          		}
                          })},
                      {header: 'Manufacturer',flex: 1,sortable: true,dataIndex: 'manufacturer',editor: {
		                    xtype: 'textfield',
		                    allowBlank: false
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
  		                    allowBlank: false
  		                }},
                      {header: 'Store address',flex: 1,sortable: true,dataIndex: 'storeAddress',
                    	  editor: {
  		                    xtype: 'textfield',
  		                    allowBlank: false
  		                }},
                      {header: 'Status',flex: 1,sortable: true,dataIndex: 'status'}],
          selModel: {
            selType: 'cellmodel'
        	}
        });
        this.departmentList.on('select',function(combo, records, eOpts){
        	this.categoryList.getStore().load({params:{departmentId: records[0].get('orgId')}});
        	this.isAssetAdmin = records[0].get('isAdmin');
        	if (this.isAssetAdmin == true){
        		Ext.getCmp('newAsset').show();
            	Ext.getCmp('removeAsset').show();
            	Ext.getCmp('addAssetHistory').show();
            	Ext.getCmp('removeAssetHistory').show();
        	}else{
        		Ext.getCmp('newAsset').hide();
            	Ext.getCmp('removeAsset').hide();
            	Ext.getCmp('addAssetHistory').hide();
            	Ext.getCmp('removeAssetHistory').hide();
        	}
        	//this.categoryList.select(this.categoryList.getStore().getAt(0));
        },this);

        this.callParent(arguments);
        this.categoryList.on('select',function(combo, records, eOpts){

        	this.changedAssetId = '';
        	this.historyStore.removeAll();
        	this.getStore().load({params:{categoryId:  records[0].get('id')}});

        },this);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        this.on('edit', function(editor,e){
        	//alert(e.field);
        	if(e.field == 'categoryId' && this.changedCategory != ''){
            	e.record.set('categoryId', e.value);
            	e.record.set('categoryName', this.changedCategory);
            	changedCategory = '';
            	e.column.render();
            }
        },this);
        this.departmentList.getStore().loadData(Ext.decode(this.departmentJson));
        this.on('afterrender', function(editor,e){
        	//alert(e.field);
        	this.departmentList.select(this.departmentList.getStore().getAt(0));
	        this.departmentList.fireEvent('select',  this.departmentList,this.departmentList.getStore().getRange(0,0));

        },this);
    },
    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
        if (selections.length > 0){
        	if (selections[0].get('id') != null &&
        			this.changedAssetId != selections[0].get('id')){
        		this.changedAssetId = selections[0].get('id');
	        	this.historyStore.load({params:{assetId:  selections[0].get('id')}});

        	}
    	}
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Defect code',
			msg : 'Are you sure to delete this asset',
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
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },

    onAddClick: function(){
    	if (this.categoryList.getRawValue() == '') return;
        var rec = new EAP.Model.Asset({
        	id: null,
        	assetName: '',
        	categoryId: this.categoryList.getValue(),
        	categoryName: this.categoryList.getRawValue(),
        	description: '',
        	distributor:'',
        	expiredDate: new Date(),
        	manufacturer:'',
        	purchasedDate: new Date(),
        	serial:'',
        	store:'',
        	storeAddress:'',
        	status: 'Available'

        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
    },

    createDepartmentList: function(){
    	var departmentStore = new Ext.data.JsonStore({
    	    fields: [
    	        {type: 'int', name: 'orgId'},
    	        {type: 'string', name: 'orgName'},
    	        {type: 'boolean', name: 'isAdmin'}

    	    ],
    		listeners: {
    			load: function( store, records, successful, eOpts){
    				//this.departmentList.select(this.departmentList.getStore().getAt(0));
    		        //this.departmentList.fireEvent('select',  this.departmentList,this.departmentList.getStore().getRange(0,0));
   				 this.departmentList.fireEvent('select',  this.departmentList,records);
				 if (this.categoryList.getStore().getTotalCount() > 0){
 		        	this.categoryList.select(this.categoryList.getStore().getAt(0));
 		        }
				this.departmentList.select(store.getAt(2));

            	},
            	scope:this
    		}
    	});

    	// Simple ComboBox using the data store
    	this.departmentList = Ext.create('Ext.form.field.ComboBox', {
    		id : 'cboDepartment',
    		inputId: 'cbDepartment',
    		fieldLabel: 'Department',
    	    displayField: 'orgName',
    	    labelAlign: 'right',
    	    valueField : 'orgId',
    	    width: 320,
    	    editable: false,
    	    cls: 'x-type-cboscreen',
    	    labelWidth: 130,
    	    store: departmentStore,
    	    queryMode: 'local',
    	    typeAhead: true
    	});

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
    				this.changedAssetId = '';
    				this.historyStore.removeAll();
    				 var firstRow = new  Ext.create('EAP.Model.AssetCategory', {
    		        		id: -1,
    		        		categoryname :'Setup category',
    		        		departmentId: 0

    		            });
    				 store.insert(0,firstRow);
    		        	var secondRow = new  Ext.create('EAP.Model.AssetCategory', {
    		        		id: -2,
    		        		categoryname :'   ',
    		        		departmentId: 0

    		            });
    		        	store.insert(1,secondRow);
    				if (store.getTotalCount() > 2){
    					this.categoryList.select(store.getAt(2));
    					 this.categoryList.fireEvent('select',  this.categoryList,records);

    					//this.getStore().load({params:{departmentId: this.departmentList.getValue(),categoryId:  records[0].get('id')}});
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
    		id : 'cboCategory',
    		inputId: 'cbCategory',
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

    }
});