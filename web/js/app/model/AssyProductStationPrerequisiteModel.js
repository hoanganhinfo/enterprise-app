Ext.define('EAP.Model.AssyProductStationPrerequisiteModel', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
             {name:'productType'},
             {name:'productTypeName'},
             {name:'productStation'},
             {name:'active'},
             {name:'status'},
             {name:'inputParams'},
             {name:'transdate'}],
    idProperty: 'id'
});