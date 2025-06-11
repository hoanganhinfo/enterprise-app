
var GET_MOLD_LIST='/enterprise-app/service/getMoldList';
var SAVE_MOLD_LIST='/enterprise-app/service/saveInjMold';
var DELETE_MOLD_LIST='/enterprise-app/service/deleteInjMold';


var moldStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.Mold',
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
            root: 'InjMoldList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'InjMoldList'
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
	
	var _panel = Ext.create('OldF.Mold.MoldList',{
		store: moldStore,
	  width: '100%',
	  height: 500,
	  renderTo: 'InjMoldPanel'
	});
	
//	var _mainfrm = Ext.create('Ext.tab.Panel',{
//	 renderTo: 'InjMoldPanel',
//	 width: '100%',
//	 height: '100%',
//	 items:[_panel],
//	 listeners: {
//        	tabchange: function(tabPanel, newTab,oldTab,opts)
//        	{
//        		print("-----------------da------------------");
//        		Ext.Message.show("Error","Serial must be 5 or 6 digits</br>Serial phải là 5 hoặc 6 chữ số");	
//           	}
//       }
//	});
	
});

