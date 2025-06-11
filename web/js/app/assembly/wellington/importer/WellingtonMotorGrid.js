Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.require([
             'Ext.form.*',
             'Ext.tip.*',
             'Ext.ux.CheckColumn',
             'Ext.ux.grid.FiltersFeature']);
Ext.define('EAP.Grid.WellingtonMotorGrid',{
		extend: 'Ext.grid.Panel',
		requires: ['Penta.view.SearchTrigger'],
		motorStore: null,
		shipmentStore: null,
		cboShipment: null,
		initComponent:function()
		{
			this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 2,
				listeners : {
					beforeedit : function(e, editor) {

					},
					scope : this
				}
			});
			this.motorStore = new Ext.data.JsonStore({
				autoLoad : true,
				autoSync: true,
				model: 'EAP.Model.WellingtoMotor',
				proxy: {
			        type: 'ajax',
			        api: {
			            read: '/enterprise-app/service/getWellingtonMotorList',
			            create: '/enterprise-app/service/saveWellingtonMotor',
			            update: '/enterprise-app/service/saveWellingtonMotor',
			            destroy: '/enterprise-app/service/deleteWellingtonMotor'
			        }, 
			        reader: {
			            type: 'json',
			            root: 'WellingtonMotorList',
			            idProperty: 'id',
			            messageProperty:'message'
			        },
			        writer: {
			            type: 'json',
			            writeAllFields: true,
			            root: 'WellingtonMotorList'
			        },
			        listeners: {
			            exception: function(proxy, response, operation){
			            Ext.MessageBox.show({
				                title: 'REMOTE EXCEPTION',
				                msg: operation.getError(),
				                icon: Ext.MessageBox.ERROR,
				                buttons: Ext.Msg.OK
			            	});
			        	}
			        }
			        
			    },
			    listeners: {
			    	 write: function(proxy, operation){
				    	if (operation.action == 'create'){
				    		this.autoSync = false;
				    		message = operation.resultSet.message;
				    		var newRec = this.getAt(0);
				    		newRec.set('id', message);
				    		this.autoSync = true;
				    	}
			        }
			    }
			});	
			
			Ext.apply(this,{
							store: this.motorStore,
					        autoScroll: true,
					        cellCls: 'x-type-grid-defect-list',
					        stateful: true,
					        multiSelect: false,
					        autoScroll: true,
					        stateId: 'stateGrid',
					        columns: {
								plugins: [{
									ptype: 'gridautoresizer'
								}],
								items: [{text: 'Motor code',width: 130,sortable : true,dataIndex: 'code',filter: true,editor : {xtype : 'textfield',allowBlank : false}},
								        {text: 'Name',width: 130,sortable : true,dataIndex: 'name', filter: true,editor : {xtype : 'textfield',allowBlank : false}},
								        {text: 'Max qty',sortable : true,width: 100,dataIndex: 'maxQty', filter: true,editor : {xtype : 'textfield',allowBlank : false,readOnly:hasImportPermission=='true'?false:true}},
								        {header: 'Require final test',sortable : true,dataIndex: 'hasFinalTest',xtype: 'checkcolumn',width:60,filter: true,listeners: { beforecheckchange: function () { return hasImportPermission=='true'?true:false; } }},
					                    {header: 'Active',sortable : true,dataIndex: 'active',xtype: 'checkcolumn',width:60,filter: true,listeners: { beforecheckchange: function () { return hasImportPermission=='true'?true:false; }}}]
					        },
					        //height: 380,
					       // width: 400,
					        title: 'Motor',
					        viewConfig: {
					            stripeRows: true,
					            enableTextSelection: true
					        },
					        dockedItems: [{
				                xtype: 'toolbar',
				                hidden: hasImportPermission=='true'?false:true,
				                items: [ {
				                    iconCls: 'icon-add',
				                    text: 'Add motor',
				                    scale : 'medium',
				                    scope: this,
				                    handler: this.onAddClick
				                },{
				                    iconCls: 'icon-delete',
				                    scale : 'medium',
				                    text: 'Remove motor',
				                    disabled: true,
				                    itemId: 'delete',
				                    scope: this,
				                    handler: this.onDeleteClick
				                }]
				            }],
				            plugins: [{
						        	ptype: 'filterbar',
						        	renderHidden: false,
						        	showShowHideButton: true,
						        	showClearAllButton: true
								},this.editing],
							selModel : {
									selType : 'cellmodel'
							}

				});// end apply
					
			this.callParent(arguments);
			this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
		},
		onSelectChange: function(selModel, selections){
				if (selections != null){
					this.down('#delete').setDisabled(selections.length === 0);
				}
		        
		},
		 onAddClick: function(){
		    	
		        var rec = new EAP.Model.WellingtoMotor({
		        	id:'',
		        	code:'',
		        	name: '',
		        	maxQty: 1080,
		        	active: true,
		        	hasFinalTest: true,
		        }), edit = this.editing;

		        edit.cancelEdit();
		        this.store.insert(0, rec);
		        edit.startEditByPosition({
		            row: 0,
		            column: 0
		        });
		    },
		    onDeleteClick: function()
		    {
		    	 var selection = this.getView().getSelectionModel().getSelection()[0];
				Ext.Msg.show({
					title : 'Assy Product Type',
					msg : 'Are you sure to delete this motor',
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
		    }
});