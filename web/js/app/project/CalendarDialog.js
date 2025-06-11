Ext.define('EAP.Window.CalendarDialog',{
	extend: 'Ext.window.Window',
	requires: ['Gnt.widget.calendar.Calendar',
	           'Gnt.widget.Calendar'],
    title: 'Manage calendar',
    width: 600,
    height: 600,
    bodyStyle: 'padding:10px',
    layout: 'border',
    projectId : null,
    calendar : null,
    SAVE_CALENDAR_URL : '/enterprise-app/service/saveCalendar',
    initComponent: function(){
//    	this.tbar = [{ xtype: 'filefield', scope: this, fieldLabel: 'Image', buttonText: 'Select Image...'},
//    	            { xtype: 'button', scope: this, text: 'Upload',handler: this.onUpload }
//    	          ];
    	var frmCalendar = Ext.create('Gnt.widget.calendar.Calendar', {
    	    width: 400,
    	    calendar: this.calendar,
    	    frame: true,
    	    id: 'frmCalendar',
    	    region: 'north'
    	});
    	frmCalendar.getDayGrid().getStore().on('add',function(store, records, index, eOpts){
    		alert(SAVE_CALENDAR_URL);
			new Ext.data.Connection().request({
				method : 'POST',
				url : this.SAVE_CALENDAR_URL,
				params : {
					ProjectId: this.projectId,
				},
				scriptTag : true,
				success : function(response) {
					//alert('Delete success !!');
					var rs = Ext.decode(response.responseText);
					if (rs.success == true){
						var _data = rs.PmCalendarList;
						var _calendar        = new Gnt.data.Calendar({
							calendarId: 'cal',
							name: 'cal Name',
						    data    : _data
						});

						
						var dlg = Ext.create('EAP.Window.CalendarDialog', {
							calendar: _calendar,
							id: 'test'
							});	
						dlg.show();
						
					}else{
						Ext.Msg.show({
						title : 'INFORMATION',
						msg : 'Error  !!',
						minWidth : 200,
						modal : true,
						icon : Ext.Msg.INFO,
						buttons : Ext.Msg.OK
					});		
					}

				},
				failure : function(response) {
					Ext.Msg.show({
						title : 'INFORMATION',
						msg : 'Error !!',
						minWidth : 200,
						modal : true,
						icon : Ext.Msg.INFO,
						buttons : Ext.Msg.OK
					});		
				}
			},this);    		
    	});
    	frmCalendar.getDayGrid().getStore().on('update',function(store, record, operation, eOpts){
    		alert(record.get('Date'));
    	});
    	this.items = [frmCalendar];
	   this.callParent(arguments);
		

	},
	listeners : {
		show: function( dlg,eOpts ){
		}
	},
	onRender: function(){
		this.callParent(arguments);
	}
});
