Ext.define('EAP.Model.CourierSampleModel', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id',type: 'int',useNull: true},
             {name:'sample_name'},
             {name:'sample_quantity'},
             {name:'sample_weight'},
             {name:'courier_shipment_id'},
             {name:'sample_value'},
             {name:'PS_no'},
             {name:'invoiced',type: 'bool'},
             {name:'posted_PS',type: 'bool'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'sample_name',
        min: 1
    }]
});