
var SAVE_ASSYPD_LIST ='/enterprise-app/service/saveAssyProductStationPrerequisite';
var DELETE_ASSYPD_LIST='/enterprise-app/service/deleteAssyProductStationPrerequisite';
var GET_ASSYPD_LIST ='/enterprise-app/service/getAssyProductStationPrerequisiteList';
var GET_ASSY_PRODUCT_TYPE_LIST_URL = '/enterprise-app/service/getAssyProductTypeList';
var GET_ASSY_PRODUCT_MODEL_LIST_URL = '/enterprise-app/service/getAssyProductModelListByAPT';
var GET_ASSY_PRODUCT_STATION_LIST_URL = '/enterprise-app/service/getAssyProductStationList';


var _store = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.AssyProductStationPrerequisiteModel',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_ASSYPD_LIST,
            create: SAVE_ASSYPD_LIST,
            update: SAVE_ASSYPD_LIST,
            destroy: DELETE_ASSYPD_LIST
        }, 
        reader: {
            type: 'json',
            root: 'AssyProductStationPrerequisiteList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssyProductStationPrerequisiteList'
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


Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();

	var _panel = Ext.create('Assy.AssyProductStationPrerequisiteGrid.Grid',{
	
	  store: _store,
	  width: '100%',
	  height: 500,
	 
	  renderTo: 'AssyProductStationPrerequisite'
	});
	
});

