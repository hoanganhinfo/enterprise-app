
var GET_MIXED_MATERIAL_LIST ='/enterprise-app/service/getMixedMaterialList';
var GET_SAVE_MMS ='/enterprise-app/service/saveMixedMaterial';


var regrindorderStore = new Ext.data.JsonStore({
	autoLoad : true,
	//autoSync: true,
	model: 'EAP.Model.MixedMaterial',
	proxy: {
        type: 'ajax',
        api: {
              read: GET_MIXED_MATERIAL_LIST

        }, 
        reader: {
            type: 'json',
            root: 'InjMixedMaterialList',
            idProperty: 'id',
            messageProperty:'message'
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
			
			var _panel = Ext.create('OldF.MixedMaterialStock.Grid',{
			  store: regrindorderStore,
			  width: '100%',
			  height: 400,
			  id: 'InjMixedMaterialMain',
			  renderTo: 'InjMixedMaterial'
			});
	
});

