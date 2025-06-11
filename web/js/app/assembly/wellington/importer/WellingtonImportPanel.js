Ext.define('EAP.Portlet.WellingtonImportPanel',{
	extend: 'Ext.form.Panel',
	 width: 500,
     //frame: true,
     title: 'Data import',
     bodyPadding: '10 10 0',
     defaults: {
         //anchor: '100%',
         allowBlank: false,
         msgTarget: 'side',
         labelWidth: 200
     },
	initComponent: function(){
		this.bbar = [{
	        text: 'Import',
	        handler: function(){
				Ext.Msg.show({
					title : 'Import data',
					msg : 'Are you sure to import Wellington test to server',
					icon : Ext.Msg.QUESTION,
					buttons : Ext.Msg.YESNO,
					defaultFocus: 2,
					fn : function(buttonId) {
						if (buttonId == 'yes'){

						var form = this.up('form').getForm();
		                form.submit({
		                    url: '/enterprise-app/service/uploadWellingtonTest',
		                    waitMsg: 'Uploading wellington test data...',
		                    params : {
		                    	motorType : Ext.getCmp('motorType').getRawValue(),
		                    },
		                    success: function(frm, action) {
		                    	alert('Finishing importing data');
		                        //msg('Success', 'Processed file "' + o.result.file + '" on the server');
		                    },
		                    failure: function(frm,action){
		                    	var error = action.result.msg;
		                    	var line = action.result.line;
		                    	if (error == 'packingdate'){
		                    		alert('Cannot import packing data file because wrong packing date format at line '+line+'.\nPacking date format must looks like \"04-Aug-2014 07:36:33 AM\" ')
		                    	}else if (error == 'invaliddata'){
		                    		
		                    		alert('Cannot import final data file because of invalid data at line '+line+'.\nPlease check your final test data" ')
		                    	}
		                    }
		                });
						}
					},
					icon : Ext.MessageBox.QUESTION,
					scope: this
				});
	        	
	            
	        }
	    },{
	        text: 'Reset',
	        handler: function() {
	            this.up('form').getForm().reset();
	        }
	    }],
		this.items= [{
			xtype:'combo',
			   fieldLabel:'Item number',
			   id:'motorType',
			   name:'motorType',
			   valueField: 'code',
			   displayField:'code',
			   queryMode:'local',
			   editable: false,
			   store: wellingtonMotorStore,
			   autoSelect:true,
			   width : 500,
			   maxWidth : 500,
			   forceSelection:true
		},{
            xtype: 'filefield',
            id: 'form-file-function-test',
            name:'functionTestFile',
            allowBlank :true,
            emptyText: 'Select a final test  file',
            fieldLabel: 'Final test  data file',
			width : 500,
			maxWidth : 500,
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            }
        },{
            xtype: 'filefield',
            id: 'form-file-packing',
            allowBlank :true,
            name:'packingFile',
            emptyText: 'Select a packing  file',
            fieldLabel: 'Packing data file',
			width : 500,
			maxWidth : 500,
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            }
        }],
		this.callParent(arguments);
		
	}

});
