
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.define('EAP.Grid.QcInspectionDefectGrid', {
    extend: 'Ext.grid.Panel',
    xtype:'qcInspectionDefectsGrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn'
    ],
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    initComponent: function(){

       this.store =  new Ext.data.JsonStore({
    		autoLoad : true,
    		autoSync: true,
    		model: 'EAP.Model.QcInspectionDefectModel',
    		proxy: {
    	        type: 'ajax',
    	        api: {
    	            read: '/enterprise-app/service/getQcInspectionDefectList',
    	            create: '/enterprise-app/service/saveQCInspectionDefect',
    	            update: '/enterprise-app/service/saveQCInspectionDefect',
    	            destroy: '/enterprise-app/service/deleteQcInspectionDefect'
    	        },
    	        reader: {
    	            type: 'json',
    	            root: 'QCInspectionDefectList',
    	            idProperty: 'id',
    	            messageProperty:'message'
    	        },
    	        writer: {
    	            type: 'json',
    	            writeAllFields: true,
    	            root: 'QCInspectionDefectList'
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
    	this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){

                },
                scope: this
            }
        });

        Ext.apply(this, {
            id: 'qcInspectionDefectGrid',
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
            	itemId: 'toptoolbar',
                items: [{

                    iconCls: 'icon-add',
                    id: 'btn_add',
                    text: 'Add',
                    scale : 'medium',
                    scope: this,
                    handler: this.onAddClick
                },
                {

                    iconCls: 'icon-delete',
                    id: 'btn_delete',
                    scale : 'medium',
                    text: 'Delete',
                    scope: this,
                    handler: this.onDeleteClick

                },
                {
					xtype: 'button'	,
					text: 'Refresh'	,
					iconCls: 'icon-fresh'	,
					scope: this	,
					scale: 'medium',
					handler: this.onEvent_Fresh
				}]
            }],
            columns: [{
			            	header: 'id',
			                width: 30,
                 			hidden: true,
			                sortable: true,
			                dataIndex: 'id'

                 		},
                 		{
			            	header: 'Defect code',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'defectCode',
			                editor:
                 			{
		                    	xtype: 'textfield'
		               		}

                 		},
                 		{
			            	header: 'Defect name English',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'defectNameEN',
			                editor:
                 			{
		                    	xtype: 'textfield'
		               		}

                 		},

                 		{
			            	header: 'Defect name VietNam',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'defectNameVN',
			                editor:
                 			{
		                    	xtype: 'textfield'
		               		}

                 		},
                 		{
                 			header: 'Active',
                 			xtype: 'checkcolumn',
                 			id: 'idactive',
				            dataIndex: 'status',
				            flex: 1,
				            sortable: true,
				            scope:this
                 		}],



          selModel: {
            selType: 'cellmodel'
        	}
        });



        this.callParent(arguments);

    },
    onAddClick: function(){

        var rec = new EAP.Model.QcInspectionDefectModel({
        	id:'',
        	defectCode:'',
        	defectNameEN:'',
        	defectCodeVN:'',
        	status: true
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
			title : 'Defect',
			msg : 'Are you sure to delete this  defect',
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
    onEvent_Fresh:function()
    {
    	this.getStore().load();
    }

});
