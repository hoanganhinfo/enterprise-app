Ext.define('EAP.Model.AssyProductType', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name:'product_type'},
             {name:'product_type_name'},
             {name:'prefix_function'},
             {name:'serial_size'},
             {name:'padding'},
             {name:'autoresult'},
             {name:'tester',type: 'int',
                 convert: function (v, record) {
                     return typeof v === 'boolean' ? (v === true ? 1 : 0) : v;
                 }},
             {name:'reportUrl'}],
             
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'product_type',
        min: 1
    }]
});