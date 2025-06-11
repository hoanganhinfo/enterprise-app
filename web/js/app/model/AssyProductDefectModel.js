Ext.define('EAP.Model.AssyProductDefect', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name: 'defect_code'},
             {name: 'defect_name_en'},
             {name: 'defect_name_vn'},
             {name: 'status'}],
             
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'defect_code',
        min: 1
    }]
});