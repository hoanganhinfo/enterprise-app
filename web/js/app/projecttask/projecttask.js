/**
 * Project task list
 * 
 * @author anhph
 * @copyright (c) 2013, by Anhphan
 * @date 16 Oct 2013
 * @version $Id$
 * 
 */
var GET_TASK_TREE_URL = '/enterprise-app/service/getTaskTree';
var SAVE_PROJECT_TASK_URL = '/enterprise-app/service/saveProjectTask';
var DELETE_PROJECT_TASK_URL = '/enterprise-app/service/deleteProjectTask';
var ganttPanel;

var taskStore = Ext.create('Gnt.data.TaskStore', {
	autoLoad : true,
	autoSync: true,
	model: 'EAP.Model.ProjectTask',
	proxy : {
//		type : 'memory',
		type: 'ajax',
		extraParams :{ projectId:_projectId},
        api: {
			read: GET_TASK_TREE_URL,
            create: SAVE_PROJECT_TASK_URL,
            update: SAVE_PROJECT_TASK_URL,
            destroy: DELETE_PROJECT_TASK_URL
        },
		reader : {
			type : 'json',
			root: 'taskTree',
            idProperty: 'Id',
            messageProperty:'message'
		},
        writer: {
            type: 'json',
            writeAllFields: true,
            root: 'taskTree'
        }

	},
    listeners: {
        write : function(store,oper,e){
     		var rs = oper.getResultSet();
			var selection = ganttPanel.getView().getSelectionModel().getSelection()[0];
			if (selection == null) return;			
     		var parentNode = store.getNodeById(selection.get('Id'));
     		if (parentNode == null) return;
     		var newNode = parentNode.findChild("Id", null, false);
     		if (newNode == null) return;
     		if (rs.message != '-1'){
     			if (newNode != null){
     				newNode.set('Id', rs.message);
     			}
     		}
     	},
     	update: function(store, record, operation, eOpts ){
			  var _Enddate = record.get("EndDate");
			  var _StartDate = record.get("StartDate");
			  if (_Enddate.getHours() == 0 && _Enddate.getMinutes() == 0 && _Enddate.getSeconds() == 0){
				  _Enddate.setHours(23,59,59);
				  record.set("EndDate",_Enddate);	
			  }
			  if (record.get("PercentDone") == 100){
				  record.set("Status","Completed");
			  }else{
				  var _MS_PER_DAY = 1000 * 60 * 60 * 24;
				  var curDate = new Date();
				  var _durationDays = record.getDuration("d");//record.get('Duration');
				  var _percentDone  = record.get('PercentDone');
				  var utc1 = Date.UTC(_StartDate.getFullYear(), _StartDate.getMonth(), _StartDate.getDate());
				  var utc2 = Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
				  
				  var datediff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
				  console.log('_durationDays: '+ _durationDays + 'datediff: ' + datediff);
				  if (datediff == 0){
					  record.set("Status","On schedue");  
				  }else if(datediff < 0){
					  record.set("Status","Open");
				  }else{
					  var _done = 0;
					  if (_durationDays > 0){
					   _done = (datediff*100)/_durationDays;
					  }
					  if (_done > 100){
						  _done = 100;
					  }
					  if (_percentDone < _done){
						  record.set("Status","Late");
					  }else{
						  record.set("Status","On schedue");
					  }
				  }
				  
				  
			  }
     	}
     }

});

Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();
	// turn on validation errors beside the field globally
	ganttPanel = Ext.create('EAP.Grid.ProjectTaskGrid', {
		departmentJson: departmentJsonData,
		statusJson: statusJsonData,
		taskStore : taskStore,
		startDate :  Ext.Date.parse(_startDate, "d/m/Y"),
		endDate : Ext.Date.parse(_endDate, "d/m/Y"), 
	    id: 'taskList',
	});
	var frm = Ext.create('Ext.tab.Panel', {
		id : 'mainFrm',
		height : '100%',
		width : '100%',
		items : [ganttPanel],
		renderTo : 'projectTaskPanel'

	});

});