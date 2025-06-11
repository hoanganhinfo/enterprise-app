Ext.define('EAP.Window.AttachmentDialog',{
	extend: 'Ext.window.Window',
    title: 'Manage attachment files',
    width: 600,
    bodyStyle: 'padding:10px',
    layout: 'border',
    height: 620,
    uploadUrl: '',
    attachmentFileDS: null,
    taskId: null,
    task: null,
    requester: '',
    requesterId: '',
    departmentId: '',
    initComponent: function(){
//    	this.tbar = [{ xtype: 'filefield', scope: this, fieldLabel: 'Image', buttonText: 'Select Image...'},
//    	            { xtype: 'button', scope: this, text: 'Upload',handler: this.onUpload }
//    	          ];
    	var formUpload = Ext.create('Ext.form.Panel', {
    	    width: 400,
    	    frame: true,
    	    id: 'formUpload',
    	    region: 'north',
    	    hidden: userId == this.task.get('requesterId')?false:true,
    	    layout: {
    	        type: 'table',
    	        // The total column count must be specified here
    	        columns: 2
    	    },
    	    items: [{
    	        xtype: 'filefield',
    	        name: 'attachmentFile',
    	        fieldLabel: 'Photo',
    	        labelWidth: 50,
    	        msgTarget: 'side',
    	        allowBlank: false,
    	        width:500,
    	        buttonText: 'Select Photo...'
    	    },{
    	    	xtype:'button',
    	    	text: 'Upload',
    	    	scope: this,
        	    handler: this.onUpload
        	    
    	    }],
    	    
    	});
    	var attachmentGrid = Ext.create('EAP.Grid.AttachmentGrid', {
			store: null,
			autoScroll: false,
			width: 500,
			height: 500,
		    id: 'attachmentGrid',
		    stateful: true,
		    stateId: 'stateGrid',
		    region: 'center',
		    store: this.attachmentFileDS
		  
		});

    	this.items = [formUpload,attachmentGrid];
	   this.callParent(arguments);
		

	},
	listeners : {
		show: function( dlg,eOpts ){
			this.attachmentFileDS.load({params :  {taskId: selectedTaskId}});
		}
	},
	onRender: function(){
		this.callParent(arguments);
	},
	onUpload: function(){
		var form = Ext.getCmp('formUpload').getForm();
        if(form.isValid()){
            form.submit({
                url: this.uploadUrl,
                scope:this,
                params:{taskId:this.taskId,userId:userId,repositoryId:repositoryId,taskImageFolderId:taskImageFolderId},
                waitMsg: 'Uploading your photo...',
                success: function(fp, o) {
                	this.attachmentFileDS.load({params :  {taskId: selectedTaskId}});
                	//Ext.getCmp('images-view').refresh();
                    
                }
            });
        }
	}
	
	
});
