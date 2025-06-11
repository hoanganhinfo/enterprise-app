var SET_STATUS_FOR_PROJECT_URL='/enterprise-app/service/setStatusForProject';
var SAVE_CALENDAR_URL='/enterprise-app/service/saveCalendar';
var DELETE_CALENDAR_URL='/enterprise-app/service/deleteCalendar';
var GET_CALENDAR_LIST_URL='/enterprise-app/service/getCalendarByProject';
Ext.onReady(function(){
	    Ext.tip.QuickTipManager.init();
			var main = Ext.create('EAP.Grid.ProjectGrid',{
			renderTo:'demoPanel',
			height: 500,
			departmentJson: departmentJsonData,
			statusJson: statusJsonData,
	    	width: 'auto'
		});	
		
});
