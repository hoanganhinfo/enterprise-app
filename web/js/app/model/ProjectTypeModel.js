Ext.define('EAP.Model.ProjectType', {
    extend: 'Ext.data.Model',
    fields: [{name:'id'	},
   			 {name:'name'},
   			{name: 'status'}],
    idProperty: 'id',
    validations: [{
                 type: 'length',
                 field: 'name',
                 min: 1
             }]             
});


