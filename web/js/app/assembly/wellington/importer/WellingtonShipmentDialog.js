Ext.define('EAP.Window.WellingtonShipmentDialog',{
	extend: 'Ext.window.Window',
    title: 'Assign customer order to batch no',
    width: 300,
    bodyStyle: 'padding:10px',
    modal: true,
    layout: {
        type: 'table',
        columns: 1
    },
    height: 190,
    activeRecord: null,
    isProccessing: false,
    updateBatchNoURL : '/enterprise-app/service/updateBatchNo',
    initComponent: function(){
		this.shipmentStore = new Ext.data.JsonStore({
        	autoLoad : true,
        	fields: [
        	            {name: 'customerPO'}
        	         ],
        	//pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                //url: '/enterprise-app/service/getWellingtonShipmentList',
                url: '/ax-portlet/service/getCustomerPOList',
                reader: {
                    type: 'json',
                    root: 'CustomerPOList',
                    idProperty: 'customerPO',
                    totalProperty: 'totalCount'
                }
            }
        });	
		this.shipmentStore.load();

		this.containerStore = new Ext.data.JsonStore({
        	autoLoad : true,
        	fields: [
        	            {name: 'containerNo'}
        	         ],
        	//pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                //url: '/enterprise-app/service/getWellingtonShipmentList',
                url: '/ax-portlet/service/getContainerList',
                reader: {
                    type: 'json',
                    root: 'ContainerList',
                    idProperty: 'containerNo',
                    totalProperty: 'totalCount'
                }
            }
        });	
		this.containerStore.load();

    	this.bbar = ['->',
    	            { xtype: 'button', scope: this, text: 'OK',handler: this.onSave },
    	            { xtype: 'button', scope: this, text: 'Cancel',handler: this.onClose }
    	          ];
    	this.items = [{
		    	   xtype:'combo',
				   fieldLabel : 'Customer PO#',
//		    		labelWidth: 260,
				   id: 'cbCustomerPO',
	                displayField: 'customerPO',
	                valueField: 'customerPO',
	                store: this.shipmentStore,
	                mode: 'remote',  // local
	                triggerAction: 'all',
	                hideTrigger: false,
	                minChars: 1,
                   scope: this,
                   //minChars: 4
		    },{
		    	   xtype:'combo',
				   fieldLabel : 'Container no#',
//		    		labelWidth: 260,
				   id: 'cbContainer',
	                displayField: 'containerNo',
	                valueField: 'containerNo',
	                store: this.containerStore,
	                mode: 'remote',  // local
	                triggerAction: 'all',
	                hideTrigger: false,
	                minChars: 1,
                   scope: this,
                   //minChars: 4
		    }];
		      // alert(this.departmentJsonData);
		
		this.callParent(arguments);
		
	},
	onRender: function(){
		this.callParent(arguments);
	},
	onSave: function() {
		if (this.isProccessing == true){
			return;
		}
		
		if (Ext.getCmp("cbCustomerPO").getRawValue() == '' ||
				Ext.getCmp("cbContainer").getRawValue() == ''){
			Ext.Msg.alert('Please select customer order or container no');
			return;
		}
		this.isProccessing = true;
		Ext.getBody().mask('Processing');
		new Ext.data.Connection().request({
			method : 'POST',
			url : this.updateBatchNoURL,
			scope: this,
			params : {
				batchNo : this.activeRecord.get('batchNo'),
				motor: this.activeRecord.get('motor'),
				customerOrder: Ext.getCmp('cbCustomerPO').getRawValue(),
				containerNo		: Ext.getCmp('cbContainer').getRawValue(),
			},
			scriptTag : true,
			success : function(response) {

				//alert('Delete success !!');
				var rs = Ext.decode(response.responseText);
				if (rs.success == true){
					this.activeRecord.set('customerOrder',Ext.getCmp('cbCustomerPO').getRawValue());
					this.activeRecord.set('customerRef',rs.customerRef);
					this.activeRecord.set('containerNo',Ext.getCmp('cbContainer').getRawValue());
					Ext.getBody().unmask();
//					alert('Update success');
					this.close();
				}else{
					Ext.getBody().unmask();
					Ext.Msg.show({
					title : 'INFORMATION',
					msg : 'Update failed !!',
					minWidth : 200,
					modal : true,
					icon : Ext.Msg.INFO,
					buttons : Ext.Msg.OK
				});		
				}
			
			},
			failure : function(response) {
				Ext.getBody().unmask();
				Ext.Msg.show({
					title : message['general.information'],
					msg : 'Save fail !!',
					minWidth : 200,
					modal : true,
					icon : Ext.Msg.INFO,
					buttons : Ext.Msg.OK
				});
				this.isProccessing = false;
			}
			
		});
	},
	onClose: function(){
		this.close();
	}
	
});
