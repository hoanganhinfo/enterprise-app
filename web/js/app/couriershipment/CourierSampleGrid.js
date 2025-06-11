Ext.Loader.setConfig({
    enabled: true
});
Ext.define('EAP.Grid.CourierSample', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.courierSample',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    title: 'Sample',
    viewConfig: {
        emptyText: 'There are no data to display',
        deferEmptyText: false
    },
    initComponent: function(){
    	
        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            listeners: {
                beforeedit: function(e, editor){
                	var selection = Ext.getCmp('courierShipmentGrid').getView().getSelectionModel().getSelection()[0];
                	if (selection.get('approver')  != '' || selection.get('createdby') != userName){
                		//alert('Only creator can edit data');
                		return false;
                	}
                	return true;
                },
                scope: this
            }
        });

        Ext.apply(this, {
            frame: true,
            plugins: [this.editing],
            tools:[{
                type:'plus',
                tooltip: 'Add sample',
                id : 'addSample',
                disabled:true,
                // hidden:true,
                scope: this,
                handler: this.onAddClick
            },{
                type:'minus',
                tooltip: 'Remove sample',
                itemId: 'deleteSample',
                disabled:true,
                scope: this,
                handler: this.onDeleteClick
            }],
            columns: [{header: 'Sample description',sortable: true,dataIndex: 'sample_name',width:200,field: {type: 'textfield'}},
                      {header: 'Quantity',sortable: true,dataIndex: 'sample_quantity',width:100,field: {type: 'numberfield'}},
                      {header: 'Weight (kg)',sortable: true,dataIndex: 'sample_weight',width:100,field: {type: 'numberfield'}},
                      {header: 'Value (USD per item)',sortable: true,dataIndex: 'sample_value',width:100,field: {type: 'numberfield'}},
                      {header: 'Invoice?', sortable: true,dataIndex: 'invoiced',xtype: 'checkcolumn'},
                      {header: 'Post PS?', sortable: true,dataIndex: 'posted_PS',xtype: 'checkcolumn'},
                      {header: 'PO#', sortable: true,dataIndex: 'PS_no',width:100,field: {type: 'numberfield'}}
                      ],
          selModel: {
            selType: 'cellmodel'
        	}
        });
       
       
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    onSelectChange: function(selModel, selections){
        this.down('#deleteSample').setDisabled(selections.length === 0);
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
    	var selection = Ext.getCmp('courierShipmentGrid').getView().getSelectionModel().getSelection()[0];
    	console.log(selection.get('id'));
    	if (selection.get('approver')  != ''){
    		alert('This courier is already approved');
    		return false;
    	}
    	if (selection.get('createdby') != userName){
    		alert('Only creator can delete sample to this shipment');
    		return;
    	}
    	
    	
    	
        selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Defect code',
			msg : 'Are you sure to delete this sample',
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
		            if (selection.get('status')  == 'Submitted'){
			            selection.beginEdit();
			            selection.set('status','Open');
			            selection.endEdit();
			            courierShipmentDS.commitChanges();
		            }
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },

    onAddClick: function(){
    	var selection = Ext.getCmp('courierShipmentGrid').getView().getSelectionModel().getSelection()[0];
    	console.log(selection.get('id'));
    	if (selection.get('approver')  != ''){
    		alert('This courier is already approved');
    		return false;
    	}
    	if (selection.get('createdby') != userName){
    		alert('Only creator can add sample to this shipment');
    		return;
    	}
    	
    	
    	var rec = new EAP.Model.CourierSampleModel({
        	id: null,
        	courier_shipment_id: selection.get('id')
            
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
      
    }
    
  
});