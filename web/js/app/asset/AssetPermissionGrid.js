Ext.Loader.setConfig({
    enabled: true
});
Ext.define('EAP.Grid.AssetPermissionGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    departmentList:null,
    departmentJson: null,
    userDataJson : null,
    userStore : null,
    permissionDataJson : null,
    permissionStore : null,
    title: 'Asset permission',
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    changedUser: '',
    changedPermission: '',
    header: false,
    initComponent: function(){
    	this.createDepartmentList();
    	this.userStore = new Ext.data.JsonStore({
            fields: [ 
                {type: 'int', name: 'userId'},
                {type: 'string', name: 'userName'}
            ]
        });
        this.userStore.loadData(Ext.decode(userJsonData));
        this.userStore.sort('userName', 'ASC');
        this.permissionStore = new Ext.data.JsonStore({
            fields: [ 
                {type: 'int', name: 'permissionId'},
                {type: 'string', name: 'permissionName'}
            ]
        });
        this.permissionStore.loadData(Ext.decode(permissionJsonData));
        this.permissionStore.sort('permissionId', 'ASC');    	
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
            columns: [{header: 'User',flex: 1,sortable: true,dataIndex: 'userId',
    			renderer:function(value,metaData,record){
    				return record.data.userName;
        		},
                  editor: new Ext.form.field.ComboBox({
                      selectOnTab: true,
                      displayField : 'userName',
              		   valueField : 'userId',
                      store: this.userStore,
                      listClass: 'x-combo-list-small',
                      scope: this,
                      queryMode : 'local',
                      listeners:{
                       	   change: function(combo, records, eOpts ){
                          				//alert(combo.getRawValue());
                       	   			//alert(changedUOM);
                          			//	alert(this.getXType());
                       	   				this.changedUser = combo.getRawValue(); 
                          			},
                          	scope: this
                  		}
                  })},{header: 'Permission',flex: 1,sortable: true,dataIndex: 'permissionId',
          			renderer:function(value,metaData,record){
        				return record.data.permissionName;
            		},
                      editor: new Ext.form.field.ComboBox({
                          selectOnTab: true,
                          displayField : 'permissionName',
                  		   valueField : 'permissionId',
                          store: this.permissionStore,
                          listClass: 'x-combo-list-small',
                          scope: this,
                          queryMode : 'local',
                          listeners:{
                           	   change: function(combo, records, eOpts ){
                              				//alert(combo.getRawValue());
                           	   			//alert(changedUOM);
                              			//	alert(this.getXType());
                           	   				this.changedPermission = combo.getRawValue(); 
                              			},
                              	scope: this
                      		}
                      })}
                 ],
          selModel: {
            selType: 'cellmodel'
        	},
        });
        this.callParent(arguments);
        
        this.departmentList.getStore().loadData(Ext.decode(this.departmentJson));
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        this.on('afterrender', function(editor,e){
        	//alert(e.field);
        	this.departmentList.select(this.departmentList.getStore().getAt(0));
        	this.departmentList.fireEvent('select', this.departmentList,this.departmentList.getStore().getRange(0,0));
	        
        },this);
        this.departmentList.on('change',function(field,newValue,oldValue,option){
        	assetPermissionDS.load({params:{departmentId: newValue}});
        });
        this.departmentList.getStore().loadData(Ext.decode(this.departmentJson));
        this.on('edit', function(editor,e){
        	//alert(e.field);
        	if(e.field == 'userId' && this.changedUser != ''){
        		console.log('userId'+this.changedUser);
        		e.record.beginEdit();
            	e.record.set('userId', e.value);
            	e.record.set('userName', this.changedUser);
            	e.record.endEdit();
            	assetPermissionDS.sync();
            	changedUser = '';
            	//e.column.render();
            }else if(e.field == 'permissionId' && this.changedPermission != ''){
            	console.log('permissionId'+this.changedPermission);
            	e.record.beginEdit();
            	e.record.set('permissionId', e.value);
            	e.record.set('permissionName', this.changedPermission);
            	e.record.endEdit();
            	changedPermission = '';
            	assetPermissionDS.sync();
            	//e.column.render();
            }
        },this);
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
			msg : 'Are you sure to delete this permission',
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
        var rec = new EAP.Model.Permission({
        	id: null,
        	permissionId: null,
        	userName: '',
        	permissioName : '',
        	orgId: this.departmentList.getValue()
            
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
    			
            	},
            	scope:this
    		}	
    	});
    	
    	// Simple ComboBox using the data store
    	this.departmentList = Ext.create('Ext.form.field.ComboBox', {
    		id : 'cboDepartment2',
    		inputId: 'cbDepartment2',
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