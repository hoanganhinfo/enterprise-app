Ext.define('EAP.Model.ProjectTask', {
    extend: 'Gnt.model.Task',
	 fields: [{name: 'Id',type: 'int',useNull: true},
	          {name: 'Description',type: 'string'},
	          {name: 'Status',type: 'string'},
	          {name: 'parentId',type: 'int'},
	          {name: 'leaf',type: 'boolean'},
	          {name: 'expanded',type: 'boolean'}],	            	      
    idProperty: 'Id'
});