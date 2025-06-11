Ext.Loader.setConfig({
    enabled: true
});
Ext.define('EAP.Grid.AssetCategoryGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    departmentList:null,
    departmentJson: null,
    title: 'Asset category list',
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    header: false,
    initComponent: function(){
    	this.createDepartmentList();
        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });

        Ext.apply(this, {
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scale : 'medium',
                    scope: this,
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-delete',
                    scale : 'medium',
                    text: 'Delete',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                },'->',this.departmentList]
            }],
            columns: [{
	            	header: 'Category name',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'categoryname',
	                field: {
	                    type: 'textfield'
	                }
                 }],
          selModel: {
            selType: 'cellmodel'
        	},
        });
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        this.on('afterrender', function(editor,e){
        	//alert(e.field);
        	this.departmentList.select(this.departmentList.getStore().getAt(0));
        	this.departmentList.fireEvent('select', this.departmentList,this.departmentList.getStore().getRange(0,0));

        },this);
        this.departmentList.on('change',function(field,newValue,oldValue,option){
        	assetCategoryStore.load({params:{departmentId: newValue}});
        });
        this.departmentList.getStore().loadData(Ext.decode(this.departmentJson));
    },

    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Defect code',
			msg : 'Are you sure to delete this asset category',
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
        var rec = new EAP.Model.AssetCategory({
        	assetCategoryName: '',
        	departmentId: Ext.getCmp('cboDepartment').getValue()

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
    		id : 'cboDepartment1',
    		inputId: 'cbDepartment1',
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
});