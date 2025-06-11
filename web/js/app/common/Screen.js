// Define the model for a Screen
Ext.define('Screen', {
    extend: 'Ext.data.Model',
    fields: [
        {type: 'int', name: 'code'},
        {type: 'string', name: 'name'}
    ]
});
var screenData = [
              {"code":1,"name":"Activation test"},
              {"code":2,"name":"Automated test"},
              {"code":3,"name":"Hipot test"},
              {"code":4,"name":"Component test"},
              {"code":5,"name":"Rework"}              
          ];