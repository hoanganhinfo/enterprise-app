Ext.define('EAP.Model.Permission', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{name:'userId',type:'int'},
    {name:'userName'},
    {name:'orgId',type:'int'},
    {name:'permissionId',type:'int'},
    {name:'permissionName'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'userName',
        min: 1
    },{
        type: 'length',
        field: 'permissionName',
        min: 1
    }]
});