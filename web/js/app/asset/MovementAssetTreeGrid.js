Ext.Loader.setConfig({
    enabled: true
});

Ext.define('EAP.Grid.MovementAssetTreeGrid', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    collapsible: true,
    useArrows: true,
    rootVisible: true,
    singleExpand: true,
    changedCategory: '',
    historyStore: null,
    parentWindow: null,
    changedAssetId: '',
    isAssetAdmin : false,
    permissionId : -1,
    selectedAsset: null,
    title: 'Asset list',
    viewConfig: {
        emptyText: 'There are no assets to display',
        deferEmptyText: false
    },
    initComponent: function(){
    //	this.createCategoryList();



        Ext.apply(this, {
            frame: true,
           // plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                   // iconCls: 'icon-delete',
                    text: 'Select asset',
                    id: 'selectAsset',
                    disabled: true,
                    itemId: 'select',
                    scale : 'medium',
                    scope: this,
                    handler: this.onSelectAsset
                }]
            }],
            columns: [{header: 'Asset code',flex: 1,sortable: true,dataIndex: 'assetCode',width:500,xtype: 'treecolumn'},
		              {header: 'Name',flex: 1,sortable: true,dataIndex: 'assetName'},
                      {header: 'Category',flex: 1,sortable: true,dataIndex: 'categoryId',
            			renderer:function(value,metaData,record){
            				return record.data.categoryName;
                		}},

                      {header: 'Description',flex: 1,sortable: true,dataIndex: 'description'}],
          selModel: {
            selType: 'cellmodel'
        	}
        });

        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);


    },
    onSelectChange: function(selModel, selections){
        this.down('#select').setDisabled(selections.length === 0);

    },

    onSync: function(){
        this.store.sync();
    },
    onSelectAsset: function(){
    	assetTreeStore.getProxy().setExtraParam('isDelete', 'no');
    	var parentAsset = this.getView().getSelectionModel().getSelection()[0];
    	if (isNaN(parentAsset.get('id'))){
    		this.selectedAsset.set('parentId', 0);
    	}else{
    		this.selectedAsset.set('parentId', parentAsset.get('id'));
    	}
    	if (parentAsset.isRoot()){
    		var rootNode = assetTreeStore.getRootNode();

    		if (this.selectedAsset.get('categoryId') != selectedCategoryId){
    			this.selectedAsset.remove();
    		}else{
    			rootNode.appendChild(this.selectedAsset);
    		}
    	}else{
    		var destinationnode = assetTreeStore.getNodeById(parentAsset.get('id'));

	    	if (Ext.isEmpty(destinationnode) == false){
	    		destinationnode.appendChild(this.selectedAsset);
	    	}else{
	    		this.selectedAsset.remove();
	    	}
    	}
    	this.up('window').close();


    }
});