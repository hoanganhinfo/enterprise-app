/**
 * Asset category list
 * 
 * @author anhph
 * @copyright (c) 2013, by Anhphan
 * @date 12 September 2013
 * @version $Id$
 * 
 */
var GET_ASSET_CATEGORY_LIST='/enterprise-app/service/getAssetCategoryList';
var SAVE_ASSET_CATEGORY_URL = '/enterprise-app/service/saveAssetCategory';
var DELETE_ASSET_CATEGORY_URL = '/enterprise-app/service/deleteAssetCategory';
var departmentStore = new Ext.data.JsonStore({
    fields: [ 
        {type: 'int', name: 'orgId'},
        {type: 'string', name: 'orgName'}
    ]
});
departmentStore.loadData(Ext.decode(departmentJsonData));
// Simple ComboBox using the data store
var departmentCombo = Ext.create('Ext.form.field.ComboBox', {
	id : 'cboDepartment',
	inputId: 'cbDepartment',
	fieldLabel: 'Department',
    displayField: 'orgName',
    labelAlign: 'right',
    valueField : 'orgId',
    width: 320,
    editable: false,
    cls: 'x-type-cboscreen',
    labelWidth: 130,
    store: departmentStore,
    queryMode: 'local',
    typeAhead: true
});

var assetCategoryCodeDS = new Ext.data.JsonStore({
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.AssetCategory',
	proxy: {
        type: 'ajax',
        extraParams :{departmentId: '1'},
        api: {
            read: GET_ASSET_CATEGORY_LIST,
            create: SAVE_ASSET_CATEGORY_URL,
            update: SAVE_ASSET_CATEGORY_URL,
            destroy: DELETE_ASSET_CATEGORY_URL
        }, 
        reader: {
            type: 'json',
            root: 'AssetCategoryList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'AssetCategoryList'
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
var assetCategoryGrid;	

Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();
	// turn on validation errors beside the field globally
	Ext.form.Labelable.msgTarget = 'side';
	assetCategoryGrid = Ext.create('EAP.Grid.AssetCategoryGrid', {
	    store: assetCategoryCodeDS,
	    id: 'assetCategoryList',
	    cellCls: 'x-type-grid-defect-list',
	    stateful: true,
	    height: 400,
	    stateId: 'stateGrid'
	  
	});
    var frm = Ext.create('Ext.form.Panel', {
    	id: 'mainFrm',
        bodyPadding: 5,  // Don't want content to crunch against the borders
        height: '100%',
        width: '100%',
    	items: [assetCategoryGrid],
        renderTo: 'assetCategoryPanel'
    });
    //departmentCombo.setValue(1);
    departmentCombo.on('change',function(field,newValue,oldValue,option){
    	assetCategoryCodeDS.load({params:{departmentId: newValue}});
    });
	
});