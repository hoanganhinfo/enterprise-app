Ext.define('EAP.Model.QCInspectionLine', {
    extend: 'Ext.data.Model',
	 fields: [{name: 'id',type: 'int',useNull: true},
	          {name: 'inspectorId',type: 'int'},
	          {name: 'defectCode',type: 'string'},
	          {name: 'defectName',type: 'string'},
	          {name: 'defectQty',type: 'int'},
	          {name: 'memo',type: 'string'},
	          {name: 'defectLevel',type: 'string'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'defectName',
        min: 1
    },{
        type: 'length',
        field: 'defectQty',
        min: 1
    }]
});