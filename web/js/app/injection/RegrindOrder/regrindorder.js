
var GET_REGRIND_ORDER_LIST ='/enterprise-app/service/getRegrindOrderList';
var GET_SAVE_MMS ='/enterprise-app/service/saveMixedMaterial';
var GET_DELETE_MMS ='/enterprise-app/service/deleteMixedMaterialByIdOrder';
var UPDATE_REGRIND_OTHER_URL ='/enterprise-app/service/updateRegrindOrderWithStatus';

var regrindorderStore = new Ext.data.JsonStore({
	autoLoad : true,
	//autoSync: true,
	model: 'OldF.Mold.RegrindOrder',
	proxy: {
        type: 'ajax',
        api: {
              read: GET_REGRIND_ORDER_LIST
			 
        }, 
        reader: {
            type: 'json',
            root: 'InjROList',
            idProperty: 'id',
            messageProperty:'message'
        },
		 writer: {
		            type: 'json',
		            writeAllFields: true,
		            root: 'InjROList'
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
        
    }
});


Ext.onReady(function() {
			Ext.tip.QuickTipManager.init();
			
			var _panel = Ext.create('OldF.Regrindorder.Grid',{
			  store: regrindorderStore,
			  width: '100%',
			  height: 400,
			 id: 'frmRegrindorder1',
			  renderTo: 'InjRegrindOrder'
			});
	
//	var _mainfrm = Ext.create('Ext.tab.Panel',{
//	 renderTo: 'InjRegrindOrder',
//	// title: 'Regrind 1 Rates',
//	 
//	 width: '100%',
//	 height: 500,
//	 items:[_panel]
//	
//	});
	
});

