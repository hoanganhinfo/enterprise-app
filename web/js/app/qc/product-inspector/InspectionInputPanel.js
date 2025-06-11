/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('EAP.Grid.InspectionInputPanel', {
    extend: 'Ext.form.Panel',
    inspectionTableStore : null,
	inspectionLineStore : null,
	itemId: 'inspectionInputPanel',
    xtype: 'inspectionInputPanel',
    inspectionId : '',
    selectedRecord : null,
    layout: {
        type: 'border'
    },
    initComponent: function(){

     
        Ext.apply(this, {
            items: [ {
        		xtype : 'qcInspectionOrderGrid',
        		store: this.inspectionTableStore,
        	    id: 'qcInspectionOrderGrid',
        	    cellCls: 'x-type-grid-defect-list',
        	    stateful: true,
        	    height: 500,
        	    region: 'west',
                width: '70%',
                split: true
        	},{
                region: 'center',
                xtype : 'qcInspectionLineGrid',
                store: this.inspectionLineStore,
                id: 'qcInspectionLineGrid',
            }]
        });
        this.callParent(arguments);
    }
});
