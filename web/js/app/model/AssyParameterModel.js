Ext.define('EAP.Model.AssyParameter', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name:'parameter_code'},
             {name:'parameter_name'},
             {name:'parameter_size',type: 'int'},
             {name:'parameter_colspan',type: 'int'},
             {name:'parameter_width',type: 'int'},
             {name:'parameter_value'},
             {name:'negative_value'}],
             
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'parameter_code',
        min: 1
    },{
        type: 'length',
        field: 'parameter_name',
        min: 1
    }]
});