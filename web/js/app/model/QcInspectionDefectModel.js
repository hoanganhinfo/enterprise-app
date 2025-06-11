Ext.define('EAP.Model.QcInspectionDefectModel', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name: 'defectCode'},
             {name: 'defectNameEN'},
             {name: 'defectNameVN'},
             {name: 'status'}],
             
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'defectCode',
        min: 1
    }]
});