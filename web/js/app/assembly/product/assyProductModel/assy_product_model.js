
var SAVE_ASSYPM_LIST='/enterprise-app/service/saveAssyProductModel';
var DELETE_ASSYPM_LIST='/enterprise-app/service/deleteAssyProductModel';
var GET_ASSYPT_LIST='/enterprise-app/service/getAssyProductTypeList';
var GET_ASSYPMbyATP_LIST='/enterprise-app/service/getAssyProductModelListByAPT';




var moldStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.AssyProductModel',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_ASSYPMbyATP_LIST,
            create: SAVE_ASSYPM_LIST,
            update: SAVE_ASSYPM_LIST,
            destroy: DELETE_ASSYPM_LIST
        }, 
        reader: {
            type: 'json',
            root: 'AssyProductModelList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssyProductModelList'
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

	var _panel = Ext.create('Assy.AssyProductModel.Grid',{
	  store: moldStore,
	  width: '100%',
	  height: 500,
	  renderTo: 'AssyProductModel'
	});
		Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_add').setDisabled(true);
    	Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_delete').setDisabled(true);
});

