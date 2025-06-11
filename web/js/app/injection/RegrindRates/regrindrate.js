
var GET_MOLD_LIST ='/enterprise-app/service/getMoldRegrindRate';
var SAVE_MOLD_LIST='/enterprise-app/service/saveInjRegrindRate';
var DELETE_MOLD_LIST='/enterprise-app/service/deleteInjRegrindRate';


var regrindrateStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'OldF.Mold.Regrindrate',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_MOLD_LIST,
            create: SAVE_MOLD_LIST,
            update: SAVE_MOLD_LIST,
            destroy: DELETE_MOLD_LIST
        }, 
        reader: {
            type: 'json',
            root: 'InjRegrindRateList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'InjRegrindRateList'
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
	
	var _panel = Ext.create('OldF.Regrindrate.Grid',{
	 store: regrindrateStore,
	  width: '100%',
	  height: 550,
	  renderTo: 'RegrindRates'
	});
	
});

