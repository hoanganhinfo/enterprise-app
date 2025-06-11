Ext.define('EAP.Model.Department', {
    extend: 'Ext.data.Model',
    fields: [{name:'orgId'	},
   			 {name:'orgName'},
   			{name: 'permissionId',type: 'int'}],
    idProperty: 'orgId',
    validations: [{
                 type: 'length',
                 field: 'orgName',
                 min: 1
             }]             
});


