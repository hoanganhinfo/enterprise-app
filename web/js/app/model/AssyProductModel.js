Ext.define('EAP.Model.AssyProductModel', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name:'product_model'},
             {name:'status'},
             {name:'product_type'},
             {name:'product_model_name'},
             {name:'validateFnOnClent'},
             {name:'validateFnOnServer'},
             {name : 'allowDuplicate', type: 'bool'}],
             
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'product_model',
        min: 1
    }]
});