
var GET_ASSYPT_LIST='/enterprise-app/service/getAssyProductTypeList';
var SAVE_ASSYPT_LIST='/enterprise-app/service/saveAssyProductType';
var DELETE_ASSYPT_LIST='/enterprise-app/service/deleteAssyProductType';
var GET_ASSY_STATION_LIST='/enterprise-app/service/getAssyProductStationList';
var SAVE_ASSY_STATION_LIST='/enterprise-app/service/saveAssyProductStation';
var DELETE_ASSY_STATION_LIST='/enterprise-app/service/deleteAssyProductStation';
var GET_ASSY_PRODUCT_DEFECT_ACTIVE_LIST = '/enterprise-app/service/getAssyProductDefectActiveList';
var GET_ASSY_PARAM__LIST='/enterprise-app/service/getAssyParameterList';
var selectedProductType = '';
var assyPMStore = new Ext.data.JsonStore({
	
	autoLoad : true,
	fields : [{name: 'id'},{ name: 'parameter_code'},{ name: 'parameter_name'}],
	proxy: {
        type: 'ajax',
        url:GET_ASSY_PARAM__LIST,
        reader: 
        {
            type: 'json',
            root: 'AssyParameterList',
            idProperty: 'id'
        }
    }
});
// Defect Store
var assyPDStore = new Ext.data.JsonStore({
	
	autoLoad : true,
	fields : [{name: 'id'},{ name: 'defect_code'},{ name: 'defect_name_en'},{ name: 'defect_name_vn'}],
	proxy: {
        type: 'ajax',
        url:GET_ASSY_PRODUCT_DEFECT_ACTIVE_LIST,
        reader: 
        {
            type: 'json',
            root: 'AssyProductDefectList',
            idProperty: 'id'
        }
    }
});

var assyProjectTypeStore = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.AssyProductType',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_ASSYPT_LIST,
            create: SAVE_ASSYPT_LIST,
            update: SAVE_ASSYPT_LIST,
            destroy: DELETE_ASSYPT_LIST
        }, 
        reader: {
            type: 'json',
            root: 'AssyProductTypeList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssyProductTypeList'
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
var assyProjectStationStore = new Ext.data.JsonStore({
	autoLoad : false,
	autoSync: true,
	model: 'EAP.Model.AssyProductStation',
	proxy: {
        type: 'ajax',
        api: {
            read: GET_ASSY_STATION_LIST,
            create: SAVE_ASSY_STATION_LIST,
            update: SAVE_ASSY_STATION_LIST,
            destroy: DELETE_ASSY_STATION_LIST
        }, 
        reader: {
            type: 'json',
            root: 'AssyProductStationList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssyProductStationList'
        },
        listeners: {
        				load: function(store, records, successful, eOpts)
			        	{
			        		alert('load AssyProductStation jsonStore');
			        	},
			            exception: function(proxy, response, operation)
			            {
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

	var assyProductTypeGrid = Ext.create('Ass.AssyProductType.Grid',{
	  store: assyProjectTypeStore,
	  width: '100%',
	  height: 300
	});
	
	var AssyProductStationGrid = Ext.create('Assy.AssyProductStation.Grid',{
		  store: assyProjectStationStore,
		  width: '100%',
		  height: 250
		});	
	
	var frmVendorPerformancePanel = Ext.create('Ext.tab.Panel', {
    	id: 'frmVendorPerformancePanel',
        border: false,
        autoScroll: true,
        items: [assyProductTypeGrid],
        renderTo: 'AssyProductType'
        
    });
	var frmVendorLinePanel = Ext.create('Ext.tab.Panel', {
    	id: 'frmVendorLinePanel',
        border: false,
        autoScroll: true,
        items: [AssyProductStationGrid],
        renderTo: 'AssyProductStation'
        
    });		
		
});

