Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.require([
             'Ext.ux.CheckColumn',	
             'Ext.ux.grid.FiltersFeature'
         ]);
Ext.define('EAP.Grid.CourierShipment', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.courierShipment',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Penta.view.SearchTrigger'
    ],
    departmentStore: null,
    categoryList: null,
    departmentList:null,
    selectedId : null,
    title: 'Courier shipment',
    viewConfig: {
        emptyText: 'There are no data to display',
        deferEmptyText: false
    },
    initComponent: function(){
    	

        Ext.apply(this, {
            frame: true,
            tools:[{
                type:'plus',
                tooltip: 'Add shipment',
                // hidden:true,
                scope: this,
                handler: this.onAddClick
            },{
                type:'expand',
                tooltip: 'Edit shipment',
                itemId: 'editShipment',
                // hidden:true,
                scope: this,
                handler: this.onEditClick
            },{
                type:'minus',
                tooltip: 'Remove shipment',
                itemId: 'deleteShipment',
                disabled:true,
                scope: this,
                handler: this.onDeleteClick
            },{
                type:'gear',
                tooltip: 'Submit',
                itemId: 'Submit',
                type: 'email',
     	        cls:'tool-email',
                scope: this,
                handler: this.onSubmitClick
            },{
                type:'pin',
                tooltip: 'Approve',
                itemId: 'approveShipment',
                hidden:true,
                scope: this,
                handler: this.onApproveClick
            },{
                type:'unpin',
                tooltip: 'Unapprove',
                id:'UnapproveShipment',
                itemId: 'UnapproveShipment',
                hidden:true,
                scope: this,
                handler: this.onApproveClick
            },{
                type:'gear',
                tooltip: 'Assign tracking no',
                itemId: 'TrackingNo',
                scope: this,
                handler: this.onTrackingClick
            },{
                type:'print',
                tooltip: 'Print',
                itemId: 'print',
                scope: this,
                handler: this.onPrintClick
            }],
            columns: [{header: 'Shipment#',sortable: true,dataIndex: 'id',width:100,filter: true},
                      {header: 'Tracking#',sortable: true,dataIndex: 'trackingNo',width:100,filter: true},
                      {header: 'Sender',sortable: true,dataIndex: 'sender',width:100,filter: true},
                      {header: 'Department',sortable: true,dataIndex: 'department',width:100,filter: true},
                      {header: 'Shipment to company',sortable: true,dataIndex: 'shipmentCompany',width:200,filter: true},
                      {header: 'Shipment to person',sortable: true,dataIndex: 'shipmentContact',width:100,filter: true},
                      {header: 'Shipment to address',sortable: true,dataIndex: 'shipmentAddress',width:200,filter: true},
                      {header: 'Payment by',sortable: true,dataIndex: 'paymentby',width:80,filter: true},
                      {header: 'Shipment by',sortable: true,dataIndex: 'shipmentby',width:80,filter: true},
                      {header: 'Document date', sortable: true,dataIndex: 'document_date',width:100,filter: true,renderer:Ext.util.Format.dateRenderer('d/m/Y'),},
                      {header: 'Reference note', sortable: true,dataIndex: 'reference_note',width:100,filter: true},
                      {header: 'Service type', sortable: true,dataIndex: 'service_type',width:100,filter: true},
                      {header: 'Package qty', sortable: true,dataIndex: 'package_qty',width:100},
                      {header: 'Weight', sortable: true,dataIndex: 'weight',width:80},
                      {header: 'Length', sortable: true,dataIndex: 'length',width:80},
                      {header: 'Width', sortable: true,dataIndex: 'width',width:80},
                      {header: 'Height', sortable: true,dataIndex: 'height',width:80},
                      {header: 'Customs', sortable: true,dataIndex: 'customs',xtype: 'checkcolumn',processEvent: function () { return false; }},
                      {header: 'Status', sortable: true,dataIndex: 'status',width:100},
                      {header: 'Approver', sortable: true,dataIndex: 'approver',width:100,filter: true},
                      {header: 'Created by', sortable: true,dataIndex: 'createdby',width:100,filter: true}
                      ],
           plugins: [{
      		        	ptype: 'filterbar',
      		        	renderHidden: false,
      		        	showShowHideButton: true,
      		        	showClearAllButton: true
      				}],
      		bbar: Ext.create('Ext.PagingToolbar', {
      			             store: this.store,
      			             displayInfo: true,
      			             displayMsg: 'Displaying row {0} - {1} of {2}'
      			          })
        });
       
       
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
       
    },
    onSelectChange: function(selModel, selections){
    	this.down('#editShipment').setDisabled(selections.length === 0);
        this.down('#deleteShipment').setDisabled(selections.length === 0);
        //this.down('#approveShipment').setDisabled(selections.length === 0);
        selectedShipment = this.getView().getSelectionModel().getSelection()[0];
        if (selections.length > 0){
        	var rec = selections[0];
        	this.selectedId = rec.get('id');
        	Ext.getCmp('addSample').setDisabled(false);
        	Ext.getCmp('courierSampleGrid').getStore().load({params:{shipmentId: rec.get('id')}});
        	if (rec.get('approver') == ''){
        		//this.down('#approveShipment').setTooltip('Approve');
        		this.down('#approveShipment').setVisible(true);
        		this.down('#UnapproveShipment').setVisible(false);
        	}else{
        		this.down('#approveShipment').setVisible(false);
        		this.down('#UnapproveShipment').setVisible(true);
        	}
        	
        	
        }else{
        	Ext.getCmp('addSample').setDisabled(true);
        }
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection.get('approver')  != '' || selection.get('createdby') != userName){
    		alert('Only creator can delete unapproved courier shipment');
    		return;
    	}
		Ext.Msg.show({
			title : 'Deletion confirm',
			msg : 'Are you sure to delete this line',
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
		            Ext.getCmp('courierSampleGrid').store.loadData([],false);
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },

    onAddClick: function(){
    	var dlg = Ext.create('EAP.Form.CourierShipmentForm', {
    		shipmentModel: null,
    		shipmentStore: this.store,
    		departmentStore:  this.departmentStore
			});	
		dlg.show();
    },
    onEditClick: function(){
    	var selection = this.getView().getSelectionModel().getSelection()[0];
    	if (selection.get('approver')  != '' || selection.get('createdby') != userName){
    		alert('Only creator can edit unapproved courier shipment');
    	}
    	var dlg = Ext.create('EAP.Form.CourierShipmentForm', {
    		//shipment: 
    		shipmentModel: selection,
    		shipmentStore: this.store,
    		departmentStore:  this.departmentStore,
    		readOnly : selection.get('createdby') != userName || selection.get('approver')  != ''?true:false
			});	
		dlg.show();
    },
    onPrintClick: function(){
    	downloadForm.getForm().doAction('standardsubmit',{
    		url : '/enterprise-app/service/exportCourierShipment',
			   params: {
				   shipmentId : this.selectedId
			   },
			   standardSubmit: true,
			   timeout: 100000,
			   method: 'POST'
			});
		
	},
	onApproveClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection.get('approver') == ''){
        	if (selection.get('emailTo').indexOf(userEmail) == -1){
        		alert('Only department manager can approve this shipment');
        		return;
        	}
        	if (selection.get('status') != 'Submitted'){
        		alert('This shipment isn\'t submmited');
        		return;
        	}
			Ext.Msg.show({
				title : 'Defect code',
				msg : 'Are you sure to approve this line',
				icon : Ext.Msg.QUESTION,
				buttons : Ext.Msg.YESNO,
				scope: this,
				defaultFocus: 2,
				fn : function(buttonId) {
					if (buttonId != 'yes'){
						return;
					}
			        if (selection) {
			        	selection.beginEdit();
			    		selection.set('approver',userName);
			        	selection.set('status','Approved'); // Approved
			        	selection.endEdit();
			        	this.store.commitChanges();
			        	this.down('#approveShipment').setVisible(false);
		        		this.down('#UnapproveShipment').setVisible(true);
			        }
	
				},
				icon : Ext.MessageBox.QUESTION
			}); 
        }else{
        	if (selection.get('approver') != userName){
        		alert('Only approver of this line can unapprove');
        		return;
        	}
        	if (selection.get('status') == 'Shipped'){
        		alert('Cannot unapproved because this shipment is shipped. \nPlease contact HR to remove tracking number first.');
        		return;
        	}
        	Ext.Msg.show({
				title : 'Defect code',
				msg : 'Are you sure to unapprove this line',
				icon : Ext.Msg.QUESTION,
				buttons : Ext.Msg.YESNO,
				scope: this,
				defaultFocus: 2,
				fn : function(buttonId) {
					if (buttonId != 'yes'){
						return;
					}
			        if (selection) {
			        	selection.beginEdit();
			        	selection.set('approver','');
			        	selection.set('status','Submitted'); // Rollback Submit
			        	selection.endEdit();
			        	this.store.commitChanges();
			        	this.down('#approveShipment').setVisible(true);
		        		this.down('#UnapproveShipment').setVisible(false);
			        }
	
				},
				icon : Ext.MessageBox.QUESTION
			});
        }
    },
    onTrackingClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
		
		if (selection){
			if (myOrgs.indexOf('HR') == -1){
				alert('Only HR staff can set Tracking no for shipment'); 
        		return;
			}
			if (selection.get('approver') == ''){
	     		alert('This shipment need to be approved before setting tracking number');
	     		return;
	     
	         }
			Ext.MessageBox.prompt('Assign tracking no to shipment', 'Tracking no:', function(buttonId,value){
				if (buttonId != 'ok'){
					return;
				}
   				selection.set('trackingNo',value.trim());
   				if (value.trim() != ''){
   					selection.set('status','Shipped'); // Shipped
   				}else{
   					if (selection.get('approver') != ''){
   						selection.set('status','Approved'); // Rollback Approved
   					}else{
   						selection.set('status','Submitted'); // Rollback Submit
   					}
   					
   				}
    				
			},this,false,selection.get('trackingNo'));
		}
    },
    onSubmitClick: function(){
    	 var selection = this.getView().getSelectionModel().getSelection()[0];
         if (selection.get('approver') != ''){
     		alert('This shipment already is approved');
     		return;
     
         }
         if (selection.get('createdby') != userName){
      		alert('Only creator can submit this shipment');
      		return;
      
        }
     	Ext.Msg.show({
 				title : 'Defect code',
 				msg : 'Are you sure to submit this shipment',
 				icon : Ext.Msg.QUESTION,
 				buttons : Ext.Msg.YESNO,
 				scope: this,
 				defaultFocus: 2,
 				fn : function(buttonId) {
 					if (buttonId != 'yes'){
 						return;
 					}
 			        if (selection) {
 			        	selection.set('status','Submitted'); 
 			        	//selection.set('emailTo',myOrgEmail);
 			        }
 	
 				},
 				icon : Ext.MessageBox.QUESTION
 			}); 
    }
});