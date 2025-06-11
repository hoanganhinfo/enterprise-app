Ext.define('OldF.Mold.Regrindrate', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name:'product_code'},
             {name:'product_name'},
             {name:'virgin_material_code'},
             {name:'virgin_material_name'},
             {name:'masterbatch_code'},
             {name:'masterbatch_name'},
             {name:'regrind_resin_code'},
             {name:'regrind_resin_name'},
             {name:'color_rate'    ,type: 'double'},
             {name:'regrind_rate'  ,type: 'double'},
             {name:'constant_scrap',type: 'double'},
             {name:'runner_weight' ,type: 'double'},
             {name:'product_weight',type: 'double'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'product_code',
        min: 1
    }]
});