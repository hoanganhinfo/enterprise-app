Ext.Loader.setConfig({
    enabled: true
});
Ext.define('EAP.view.AssetView',{
	extend: 'Ext.form.Panel',
	alias: 'widget.assetView',
	border : 0,
	bodyBorder : true,
    width: '100%',
	bodyCls: 'x-type-frm',
    title: 'Asset list',
    layout:'fit',
    asetDepartmentJson : null,
    departmentJson: null,
    isAssetAdmin : false,
    permissionId : -1,
 //   categoryList: null,
    departmentList:null,
    assetOwnerList: null,
    historyStore: null,
	initComponent: function()
	{
    	this.createDepartmentList();
    	this.createCategoryList();
    	assetGrid = Ext.create('EAP.Grid.AssetTreeGrid', {
			    //store: assetDS,
				//region: 'center',
		        store: assetTreeStore,
		 	    id: 'assetList',
		 	    cellCls: 'x-type-grid-defect-list',
		 	    stateful: true,
		 	   // departmentJson: this.departmentJson,
		 	    permissionId: this.permissionId,
		 	    isAssetAdmin: this.isAssetAdmin,
		 	    hidden: true,
		 	    hidenMode: 'display',
		 	    historyStore: this.historyStore,
		 	    height: '100%',
		 	    stateId: 'stateGrid',
		 	    collapsible: false

			});
    	assetButtonView = Ext.create('EAP.view.AssetButtonView', {
		    //store: assetDS,
			//region: 'north',
	        //store: assetDS,
	 	    id: 'assetButtonView',
	 	    hidden: false,
	 	    hidenMode: 'display',
	 	    permissionId: this.permissionId,
		 	 //   departmentJson: this.departmentJson,
		 	    historyStore: this.historyStore,
		 	    height: '100%',
	 	    collapsible: false

		});
    	this.items = [assetGrid,assetButtonView];
	    this.dockedItems = [{
	        xtype: 'toolbar',
	        dock: 'top',
	        items: [{
                text: 'Menu',
                columnWidth: 250,
                id : 'menu',
                menu: [
                	{text: 'View',columnWidth: 250,
                		menu:[{text: 'List',scope: this,handler: this.onViewList},
                			{text: 'Grid',scope: this,handler: this.onViewGrid}]

               },{
            	   text: 'Action',id : 'menuAction',columnWidth: 250,
                  	menu:[{text: 'Create task',id: 'newTask',scope: this,scale : 'medium',handler: this.onCreateTask},
                  		{text: 'Create asset',id: 'newAsset',scope: this,scale : 'medium',handler: this.onAddAssetClick, hidden: assetManager == null ? true : false},
                  		{text: 'Create part',id: 'newPart',scope: this,scale : 'medium',handler: this.onAddPartClick, hidden: true},
                  		{text: 'Delete asset', id: 'removeAsset', disabled: true, hidden: assetManager == null ? true : false, itemId: 'delete', scale : 'medium', scope: this, handler: this.onDeleteClick}]
              },{
               	text: 'Setup',
               	id : 'menuSetup',
               	columnWidth: 250,
               	hidden: assetSystem == null ? true : false,
               	menu:[{
                       // iconCls: 'icon-delete',
                       text: 'Asset category',
                       id: 'assetCategory',
                       //disabled: true,
                       //itemId: 'delete',
                       scale : 'medium',
                       scope: this,
                       handler: this.onOpenCategory
                   },{
                      // iconCls: 'icon-delete',
                       text: 'Asset location',
                       id: 'assetLocation',
                       //disabled: true,
                       //itemId: 'delete',
                       scale : 'medium',
                       scope: this,
                       handler: this.onOpenLocation
                   },{
                       // iconCls: 'icon-delete',
                       text: 'Permission',
                       id: 'assetPermission',
                       disabled: isAdmin == "true"?false:true,
                       //itemId: 'delete',
               		iconCls:'icon-find',
                      scope: this,
                       handler: this.onOpenPermissionWin
                   }]
               }]

            },'->',this.assetOwnerList,this.departmentList,categoryList,
            {
            	xtype: 'combobox',
                id: 'cboLocation',
                fieldLabel: 'Location',
                store: assetLocationStore,
                queryMode: 'local',
                displayField: 'locationCode',
                valueField: 'locationCode',
        		labelAlign: 'right',
        		labelWidth: 70,
                width: 200,
                editable: true,
                scope: this,
            },{
            	xtype: 'combobox',
                id: 'cboRequestTypeFilter',
                fieldLabel: 'Request type',
                store: taskRequestTypeStore,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
        		labelAlign: 'right',
        		labelWidth: 70,
                width: 200,
                editable: true,
                scope: this,
            },{
            	xtype:'textfield',
            	fieldLabel : 'Asset',
            	labelAlign: 'right',
            	labelWidth: 50,
                columnWidth: 160,
                id : 'assetSearch'
            },{
            	xtype: 'button',
            	text: 'Search',
            	scope: this,
            	handler: this.onSearch
            }]
	    }];
	    /*
	    this.departmentList.on('select',function(combo, records, eOpts){
        	activeDepartment = records[0];
        	categoryList.getStore().load({params:{departmentId: records[0].get('orgId')}});
        	this.isAssetAdmin = records[0].get('isAdmin');
        	this.permissionId = records[0].get('permissionId');
        	Ext.getCmp('newItem').hide();
        	Ext.getCmp('removeAsset').hide();
    		//Ext.getCmp('addAssetHistory').hide();
    		//Ext.getCmp('removeAssetHistory').hide();
    		Ext.getCmp('assetCategory').hide();
        	console.log(this.permissionId);
        	if (this.permissionId >=2){
        		Ext.getCmp('newItem').show();
        		Ext.getCmp('addAssetHistory').show();
        	}
        	if (this.permissionId >=3){
        		Ext.getCmp('removeAsset').show();
        		Ext.getCmp('removeAssetHistory').show();
        		Ext.getCmp('assetCategory').show();
        	}
//        	if (this.isAssetAdmin == true){
//        		Ext.getCmp('newItem').show();
//            	Ext.getCmp('removeAsset').show();
//            	Ext.getCmp('addAssetHistory').show();
//            	Ext.getCmp('removeAssetHistory').show();
//        	}else{
//        		Ext.getCmp('newItem').hide();
//            	Ext.getCmp('removeAsset').hide();
//            	Ext.getCmp('addAssetHistory').hide();
//            	Ext.getCmp('removeAssetHistory').hide();
//        	}
        	//this.categoryList.select(this.categoryList.getStore().getAt(0));
        },this);
        */
		this.callParent(arguments);
		/*
		categoryList.on('select',function(combo, records, eOpts){
			if (assetGrid != null){
				assetGrid.changedAssetId = '';
			}
        	activeAssetCategory = records[0];
        	selectedCategoryId = records[0].get('id');
        	this.historyStore.removeAll();
        	if (Ext.getCmp('viewType').getRawValue() == 'Data Tree'){
        		if (!Ext.isEmpty(records[0].get('id'))){
        			assetGrid.getStore().load({params:{departmentName:activeDepartment.get('orgName'), categoryId:  records[0].get('id')}});
        		}


        	}else{
        		assetButtonView.renderAsset(activeDepartment, activeAssetCategory);

        	}
        	//

        },this);
        */
        this.departmentList.getStore().loadData(Ext.decode(this.departmentJson));
        this.on('afterrender', function(editor,e){
        	//alert(e.field);
        	//activeDepartment = this.departmentList.getStore().getAt(0);
        	//this.departmentList.select(this.departmentList.getStore().getAt(0));
	        //this.departmentList.fireEvent('select',  this.departmentList,this.departmentList.getStore().getRange(0,0));

	        //Ext.getCmp('viewType').select('Data List');
        	activeViewMode = 'Grid';
        },this);
        this.onSearch();

	},
	onSearch: function(){
		var ownerName = Ext.getCmp('cboOwner').getRawValue();
		var departmentName = Ext.getCmp('cboDepartmentFilter').getRawValue();
		var categoryId = Ext.getCmp('cboCategory').getValue();
		var locationCode = Ext.getCmp('cboLocation').getValue();
		var requestType = Ext.getCmp('cboRequestTypeFilter').getValue();
		var name = Ext.getCmp('assetSearch').getValue();
		console.log(ownerName);
		console.log(departmentName);
		console.log(departmentName);
		console.log(locationCode);
		console.log(requestType);
		console.log(name);


		assetButtonView.renderAsset(ownerName, departmentName, categoryId, locationCode, requestType, name);
		assetGrid.getStore().load({params:{ownerName: ownerName, departmentName:departmentName, categoryId:  categoryId,
			locationCode: locationCode, requestType: requestType, name: name}});

	},
	onViewList: function(){
		activeViewMode = 'List';
		assetGrid.show();
		assetButtonView.hide();
	},
	onViewGrid: function(){
		activeViewMode = 'Grid';
		assetGrid.hide();
		assetButtonView.show();
	},
    createDepartmentList: function(){
    	var departmentStore = new Ext.data.JsonStore({
    	    fields: [
    	        {type: 'int', name: 'orgId'},
    	        {type: 'string', name: 'orgName'},
    	        {type: 'int', name: 'permissionId'},
    	        {type: 'boolean', name: 'isAdmin'}


    	    ],
    		listeners: {
    			load: function( store, records, successful, eOpts){
    				//this.departmentList.select(this.departmentList.getStore().getAt(0));
    		        //this.departmentList.fireEvent('select',  this.departmentList,this.departmentList.getStore().getRange(0,0));
   				 this.departmentList.fireEvent('select',  this.departmentList,records);
				 if (categoryList.getStore().getTotalCount() > 0){
 		        	categoryList.select(this.categoryList.getStore().getAt(0));
 		        }
				this.departmentList.select(store.getAt(2));

            	},
            	scope:this
    		}
    	});

    	// Simple ComboBox using the data store
    	this.departmentList = Ext.create('Ext.form.field.ComboBox', {
    		id : 'cboDepartmentFilter',
    		inputId: 'cbDepartmentFilter',
    		fieldLabel: 'Department',
    	    displayField: 'orgName',
    	    labelAlign: 'right',
    	    valueField : 'orgId',
    	    width: 180,
    	    editable: true,
    	    cls: 'x-type-cboscreen',
    	    labelWidth: 80,
    	    store: departmentStore,
    	    queryMode: 'local',
    	    typeAhead: true
    	});
    	this.assetOwnerList = Ext.create('Ext.form.field.ComboBox', {
    		id : 'cboOwner',
    		inputId: 'cbOwner',
    		fieldLabel: 'Asset owner',
    	    displayField: 'orgName',
    	    labelAlign: 'right',
    	    valueField : 'orgId',
    	    width: 180,
    	    editable: true,
    	    cls: 'x-type-cboscreen',
    	    labelWidth: 80,
    	    store: departmentStore,
    	    queryMode: 'local',
    	    typeAhead: true
    	});

    },

    createCategoryList:function () {
    	categoryList = new Ext.form.ComboBox({
    		id : 'cboCategory',
    		inputId: 'cbCategory',
    		store : assetCategoryStore,
    		fieldLabel: 'Category',
    		displayField : 'categoryname',
    		valueField : 'id',
    		typeAhead : true,
    		loadingText : 'Searching...',
    		labelAlign: 'right',
    		labelWidth: 70,
    		width: 220,
    		editable: true,
    		msgTarget: 'side',
    		maxWidth: 220,
    		// hideTrigger:true,
    		queryMode : 'local',
    		minChars : 1
    	});

    },

    onDeleteClick: function(){
        var selection = assetGrid.getView().getSelectionModel().getSelection()[0];
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
		        	var selectedNode = assetGrid.store.getNodeById(selection.get('id'));
		        	selectedNode.remove();
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },
    onAddPartClick: function(){
    	newAssetNode = null;
    	var edit = assetGrid.editing;
		//edit.cancelEdit();
    	var parentAsset = assetGrid.getView().getSelectionModel().getSelection()[0];
    	assetTreeStore.autoSync = false;
    	parentAsset.set('leaf',false);
    	assetTreeStore.autoSync = true;
        var parentNode = assetGrid.store.getNodeById(parentAsset.get('id'));
        //var _startDate = parentNode.get("StartDate");
       // var duration = parentNode.get("EndDate") - parentNode.get("StartDate")
        //var _endDate = new Date();
        //_endDate.setUTCFullYear(_startDate.getFullYear(),_startDate.getMonth(),_startDate.getDate());
        //_endDate.setHours(23,59,59);

        newAssetNode = parentNode.appendChild({
        	id: null,
        	assetCode : parentAsset.get('assetCode')+'-New part',
        	parentId: parentAsset.get('id'),
        	leaf: true,
        	categoryId: categoryList.getValue(),
        	categoryName: categoryList.getRawValue(),
        	description: '',
        	distributor:'',
        	expiredDate: new Date(),
        	manufacturer:'',
        	purchasedDate: new Date(),
        	serial:'',
        	store:'',
        	storeAddress:'',
        	status: ''

        });
        parentNode.expand();

    },
    onAddAssetClick: function(){
    	newAssetNode = null;
    	var edit = assetGrid.editing;
    	var treeNode = assetGrid.getRootNode();
        newAssetNode = treeNode.appendChild({
        	id: null,
        	assetCode : 'New code1',
        	assetName: 'New asset name',
        	parentId: 0,
        	leaf: true,
        	//categoryId: categoryList.getValue(),
        	//categoryName: categoryList.getRawValue(),
        	categoryId: 0,
        	categoryName: '',
        	description: '',
        	distributor:'',
        	expiredDate: new Date(),
        	manufacturer:'',
        	purchasedDate: new Date(),
        	serial:'',
        	store:'',
        	storeAddress:'',
        	status: 'Available',
        	owner: ''

        });


    },
    onOpenCategory: function(){
    	var assetCategoryWin = new Ext.Window({
    		id: 'assetCategoryWin',
    	    layout: 'fit',
    	    title: 'Asset category',
    	    autoScroll: false,
    	    //width:600,
    	    items: [Ext.create('EAP.Grid.AssetCategoryGrid', {
    	    		store: assetCategoryStore,
    	    	    id: 'assetCategoryList',
    	    	    cellCls: 'x-type-grid-defect-list',
    	    	    stateful: true,
    	    	    departmentJson: this.departmentJson,
    	    	    height: 400,
    	    	    width:450,
    	    	    stateId: 'stateGrid'

    	    	})],
    	         listeners: {
    	        	 close: function(panel,eOpts){
    	        		 //categoryList.getStore().load({params:{departmentId: this.departmentList.getValue()}});
    	        		 categoryList.getStore().load();

    	        	 },

    	        	 scope: this
    	         }
   	     });
    	assetCategoryWin.show();
    },
    onOpenLocation: function(){
    	var assetLocationWin = new Ext.Window({
    		id: 'assetLocationWin',
    	    layout: 'fit',
    	    title: 'Asset location',
    	    autoScroll: false,
    	    //width:600,
    	    items: [Ext.create('EAP.Grid.AssetLocationGrid', {
    	    		store: assetLocationStore,
    	    	    id: 'assetLocationList',
    	    	    cellCls: 'x-type-grid-defect-list',
    	    	    stateful: true,
    	    	    height: 400,
    	    	    width:450,
    	    	    stateId: 'stateGrid'

    	    	})],
    	         listeners: {
    	        	 close: function(panel,eOpts){

    	        	 },

    	        	 scope: this
    	         }
   	     });
    	assetLocationWin.show();
    },
    onMoveAssetClick: function(){
    },
    onOpenPermissionWin: function(){
    	var assetPermissionWin = new Ext.Window({
    		id: 'assetPermissionWin',
    	    layout: 'fit',
    	    title: 'Asset permission',
    	    autoScroll: false,
    	    items: [Ext.create('EAP.Grid.AssetPermissionGrid', {
    	    		store: assetPermissionDS,
    	    	    id: 'assetPermissionList',
    	    	    cellCls: 'x-type-grid-defect-list',
    	    	    stateful: true,
    	    	    departmentJson: this.departmentJson,
    	    	    height: 400,
    	    	    width:450,
    	    	    stateId: 'stateGrid'

    	    	})],
    	         listeners: {
    	        	 close: function(panel,eOpts){
    	        		 //this.categoryList.getStore().load({params:{departmentId: this.departmentList.getValue()}});

    	        	 },

    	        	 scope: this
    	         }
   	     });
    	assetPermissionWin.show();
    },
    onCreateTask: function(){
    	if (activeAsset == null){
    		alert('Please select an asset to create task.');
    		returnl;
    	}
		var dlg = Ext.create('EAP.Window.Task', {
			 title: 'Add new task',
			 requesterId: userId,
			 requester: userName,
			 departmentStore: departmentStore,
			 userStore: userStore,
			 scopeStore: scopeStore,
			 priorityStore : priorityStore,
			 statusStore : statusStore,
			 taskActionStore: taskActionStore,
			 assetCategoryStore: null,
			 assetStore: assetStore,
			 asset: activeAsset,
			 locationStore: null,
			 taskRequestTypeStore: taskRequestTypeStore,
			 saveUrl: SAVE_TASK_URL,
			 reloadFn: function (){
				 assignedTaskDS.load({params:{assetId:  activeAssetId}});

			 }
			});
		dlg.show();
    }
});
