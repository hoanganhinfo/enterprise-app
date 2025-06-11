Ext.define('EAP.Model.AssetCategory', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'categoryname',{name:'departmentId',type:'int'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'categoryname',
        min: 1
    }]
});