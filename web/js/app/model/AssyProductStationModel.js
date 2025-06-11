Ext.define('EAP.Model.AssyProductStation', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name:'product_type'},
             {name:'station'},
             {name:'product_params'},
             {name:'product_params_name'},
             {name:'product_params_size'},
             {name:'product_params_colspan'},
             {name:'product_params_width'},
             {name:'product_params_value'},
             {name:'negative_value'},
             {name:'product_defects'},
             {name:'product_defects_name'},
             {name: 'step', type: 'int'},
             {name: 'prerequisite'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'station',
        min: 1
    }]
});