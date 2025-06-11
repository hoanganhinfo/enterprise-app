Ext.define('EAP.Model.Mold', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name:'moldCode'},
             {name:'productCode'},
             {name:'productName'},
             {name:'projectName'},
             {name:'color'},
             {name:'cavity',type:'int'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'moldCode',
        min: 1
    }]
});