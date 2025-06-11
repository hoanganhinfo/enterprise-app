var GET_PROJECT_TYPE_LIST_URL='/enterprise-app/service/getProjectTypeList';
var SAVE_PROJECT_TYPE_URL='/enterprise-app/service/saveProjectType';
var DELETE_PROJECT_TYPE_URL='/enterprise-app/service/deleteProjectType';

var myList = new Ext.data.JsonStore({
	autoLoad: true,
	autoSync: true,
	model: 'EAP.Model.ProjectType',
	proxy: {
        type: 'ajax',
        api: {
            read:		GET_PROJECT_TYPE_LIST_URL,
            create: 	SAVE_PROJECT_TYPE_URL,
            update: 	SAVE_PROJECT_TYPE_URL,
            destroy: 	DELETE_PROJECT_TYPE_URL
        }, 
        reader: {
            type: 'json',
            root: 'PmProjectTypeList',
            idProperty: 'id',
            messageProperty:'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'PmProjectTypeList'
        },
        listeners: {
            exception: function(proxy, response, operation){
            Ext.MessageBox.show({
	                title: 'REMOTE EXCEPTION',
	                msg: operation.getError(),
	                icon: Ext.MessageBox.ERROR,
	                buttons: Ext.Msg.OK
            	});
        	}
        }
        
    },
    listeners: {
    	 write: function(proxy, operation){
	    	if (operation.action == 'create'){
	    		this.autoSync = false;
	    		message = operation.resultSet.message;
	    		var newRec = this.getAt(0);
	    		newRec.set('id', message);
	    		this.autoSync = true;
	    	}
        }
    }
  
});


Ext.onReady(function(){
	    var projectTypeMain = Ext.create('EAP.Grid.ProjectTypeGrid',{
	    	renderTo: 'projectTypePanel',
	    	width: 'auto',
	    	height: 500,
	    	store: myList
	    });
});
