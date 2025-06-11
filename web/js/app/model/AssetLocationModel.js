Ext.define('EAP.Model.AssetLocation', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'locationCode','locationName'],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'locationCode',
        min: 1
    }]
});