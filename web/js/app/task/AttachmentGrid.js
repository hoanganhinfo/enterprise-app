Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
function fn(index,fileId){
	Ext.Msg.show({
		title : 'Task photo',
		msg : 'Are you sure to delete this photo',
		icon : Ext.Msg.QUESTION,
		buttons : Ext.Msg.YESNO,
		defaultFocus: 2,
		fn : function(buttonId) {
			if (buttonId != 'yes'){
				return;
			}
			new Ext.data.Connection().request({
				method : 'POST',
				url : DELETE_PHOTO_URL,
				params : {
					fileEntryId : fileId
				},
				scriptTag : true,
				success : function(response) {
					//alert('Delete success !!');
					var rs = Ext.decode(response.responseText);
					if (rs.success == true){
						attachmentFileDS.removeAt(index);
						//store.remove(record);
						
					}else{
						Ext.Msg.show({
						title : 'INFORMATION',
						msg : 'Delete failed !!',
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
						msg : 'Delete fail !!',
						minWidth : 200,
						modal : true,
						icon : Ext.Msg.INFO,
						buttons : Ext.Msg.OK
					});		
				}
			});
		},
		icon : Ext.MessageBox.QUESTION
	});
};
Ext.define('EAP.Grid.AttachmentGrid', {
	extend : 'Ext.grid.Panel',
	title : 'Attachment list',
	viewConfig : {
		emptyText : 'There are no attachment file to display',
		deferEmptyText : false
	},
	initComponent : function() {
		Ext.apply(this, {
			frame : true,
			forceFit: true,
			columns : [{header : 'Image name',sortable : true,dataIndex : 'filename'},
			           {header : 'Action',renderer: function(value, metaData, record, rowIndex, colIndex, store) {
			        	   var url = DOWNLOAD_PHOTO_URL+"?fileEntryId="+record.data.id;
			        	   if (selectedTask.get('requesterId') == userId){
			        		   return '<a href='+url+'>Download</a>&nbsp;&nbsp;&nbsp;<a onclick="fn('+rowIndex+','+record.data.id+');">Remove</a>';
			        	   }else{
			        		   return '<a href='+url+'>Download</a>';
			        	   }
			           }
			           }]
		});
		this.callParent(arguments);
		
	},
	listeners : {
	    itemdblclick: function(dv, record, item, index, e) {

	    	var win = new Ext.Window({
	    	    html: '<img src="'+record.get('src')+'" />',
	    	    layout: 'fit',
	    	    title:'View photo',
	    	    modal: false,
	    	    autoScroll: true,
	    	    maximizable: true
	    	});
	    	win.show();
	    	win.maximize();
	    }
	}
});