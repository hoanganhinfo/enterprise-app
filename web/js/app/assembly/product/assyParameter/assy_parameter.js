
var GET_ASSYP_LIST='/enterprise-app/service/getAssyParameterList';
var SAVE_ASSYP_LIST='/enterprise-app/service/saveAssyParameter';
var DELETE_ASSYP_LIST='/enterprise-app/service/deleteAssyParameter';


var moldStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.AssyParameter',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_ASSYP_LIST,
            create: SAVE_ASSYP_LIST,
            update: SAVE_ASSYP_LIST,
            destroy: DELETE_ASSYP_LIST
        }, 
        reader: {
            type: 'json',
            root: 'AssyParameterList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssyParameterList'
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
	
	var _panel = Ext.create('Assy.AssyParameter.Grid',{
		store: moldStore,
	  	width: '100%',
	  	height: 500,
	  	renderTo: 'AssyParameter'
	});
	
});

