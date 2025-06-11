Ext.define('EAP.Model.Attachment', {
    extend: 'Ext.data.Model',
	 fields: [{name: 'id',type: 'int',useNull: true},
	          {name: 'filename',type: 'string'},
	          {name: 'src',type: 'string'}],
    idProperty: 'id'
});