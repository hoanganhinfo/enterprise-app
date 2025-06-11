/**
 * Asset list
 * 
 * @author anhph
 * @copyright (c) 2013, by Anhphan
 * @date 12 September 2013
 * @version $Id$
 * 
 */

var GET_COURIER_SHIPMENT_LIST='/enterprise-app/service/getCourierShipmentList';
var SAVE_COURIER_SHIPMENT_LIST = '/enterprise-app/service/saveCourierShipment';
var DELETE_COURIER_SHIPMENT_LIST = '/enterprise-app/service/deleteCourierShipment';

var GET_COURIER_SAMPLE_LIST='/enterprise-app/service/getCourierSampleList';
var SAVE_COURIER_SAMPLE_LIST = '/enterprise-app/service/saveCourierSample';
var DELETE_COURIER_SAMPLE_LIST = '/enterprise-app/service/deleteCourierSample';
Ext.Ajax.useDefaultXhrHeader = false;
Ext.Ajax.cors = true;
var selectedShipment;
var courierShipmentDS = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	pageSize: 100,
	remoteSort: true,
	remoteFilter: true,
	sorters: [{
	     property: 'id',
	     direction: 'ASC' // or 'ASC'
	   }],
	model: 'EAP.Model.CourierShipmentModel',
	proxy: {
        type: 'ajax',
        extraParams :{companyId: companyId},
        api: {
            read: GET_COURIER_SHIPMENT_LIST,
            create: SAVE_COURIER_SHIPMENT_LIST,
            update: SAVE_COURIER_SHIPMENT_LIST,
            destroy: DELETE_COURIER_SHIPMENT_LIST
        }, 
        reader: {
            type: 'json',
            root: 'CourierShipmentList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'CourierShipmentList'
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

var courierSampleDS = new Ext.data.JsonStore({
	//autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.CourierSampleModel',
	proxy: {
        type: 'ajax',
        //extraParams :{departmentId: '1'},
        api: {
            read: GET_COURIER_SAMPLE_LIST,
            create: SAVE_COURIER_SAMPLE_LIST,
            update: SAVE_COURIER_SAMPLE_LIST,
            destroy: DELETE_COURIER_SAMPLE_LIST
        }, 
        reader: {
            type: 'json',
            root: 'CourierSampleList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'CourierSampleList'
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
    	beforesync: function(opts,eOpts){
    		if (selectedShipment
    				&& ( selectedShipment.get('approver')  != ''
    				|| selectedShipment.get('createdby') != userName
    				|| selectedShipment.get('status')  == 'Approved')){
        		this.rejectChanges();
        		return false;
        	}
    	},
        write: function(proxy, operation){
	    	if (operation.action == 'create'){
	    		this.autoSync = false;
	    		message = operation.resultSet.message;
	    		var newRec = this.getAt(0);
	    		newRec.set('id', message);
	    		this.autoSync = true;
	    	}
	    	if (selectedShipment && selectedShipment.get('status')  == 'Submitted'){
	    		selectedShipment.beginEdit();
	    		selectedShipment.set('status','Open');
	    		selectedShipment.endEdit();
	    		courierShipmentDS.commitChanges();
	    	}
        }
    }
});
var departmentStore = new Ext.data.JsonStore({
    fields: [ 
        {type: 'int', name: 'orgId'},
        {type: 'string', name: 'orgName'}
    ]
});
departmentStore.loadData(Ext.decode(departmentJsonData));
var downloadForm = Ext.create('Ext.form.Panel',{
    timeout: 60000
  });
var shipmentToDS = new Ext.data.JsonStore({
	autoLoad : true,
	fields: [ 
	         {type: 'int', name: 'id'},
	         {type: 'string', name: 'company'},
	         {type: 'string', name: 'address'},
	         {type: 'string', name: 'contactperson'}
	     ],
	remoteSort: false, //true for server sorting
	sorters: [{
		property: 'company',
	    direction: 'ASC' // or 'ASC'
	}],	     
	proxy: {
        type: 'jsonp',
        url: 'http://portal.ewi.vn:8080/ax-portlet/service/getCustAddressView',
        reader: {
            type: 'json',
            root: 'CustAddressList',
            idProperty: 'id'
        }
    }
});
Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();
	// turn on validation errors beside the field globally
	Ext.form.Labelable.msgTarget = 'side';
	Ext.create('Ext.panel.Panel', {
    	id: 'mainFrm',
    	height: 600,
        width: '100%',
        layout: {
            type: 'border'
        },
    	items: [{
            region: 'center',
            xtype: 'courierShipment',
            id: 'courierShipmentGrid',
            store: courierShipmentDS,
            height: 300,
            departmentStore : departmentStore
            
        },{
            region: 'south',
            xtype: 'courierSample',
            id: 'courierSampleGrid',
            title: 'Sample',
            height: 200,
            store: courierSampleDS,
            split: true,
            collapsible: true
            
            
        }],
        renderTo: 'CourierShipmentPanel'
        
    });
    
	
});