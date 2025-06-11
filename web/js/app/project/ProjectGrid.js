Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');

Ext.define('EAP.Grid.ProjectGrid',{ 
		extend: 'Ext.grid.Panel',
		requires: [ 'Ext.data.*',
					'Ext.state.*',
					'Ext.grid.*',
					'Ext.form.ComboBox',
					'Ext.form.FieldSet',
					'Ext.tip.QuickTipManager',
					'Ext.toolbar.TextItem'],
		disableEditing : false,			
		departmentList: null,
		departmentJson: null,		
		projectTypeList: null,
		statusList: null,
		statusJson: null,
		changedDepartment: '',
		changedProjectType: '',
		GET_PROJECT_LIST_URL: '/enterprise-app/service/getProjectList',
		SAVE_PROJECT_URL: '/enterprise-app/service/saveProject',
		DELETE_PROJECT_URL: '/enterprise-app/service/deleteProject',
		GET_ACTIVE_PROJECT_TYPE_URL : '/enterprise-app/service/getActiveProjectTypeList',
		GET_HOLIDAY_CALENDAR_URL:  '/enterprise-app/service/getCalendarByProject',
		initComponent: function()
		{
			this.setupStore();
			this.onCreateDepartmentList();
			this.onCreateProjectType();
			this.onCreateStatusList();
			//this.onCreateStatus();
			//var cellCheck = Ext.create('Ext.selection.CheckboxModel',{mode: 'SINGLE'});
			this.cellEditting = Ext.create('Ext.grid.plugin.CellEditing',{ clicksToEdit: 2, listeners: {
				beforeedit: function(editor,opt){
					 if (this.disableEditing == true)
						    return false;
				},
				scope: this}}); 
			
			Ext.apply(this,{
				//selModel: cellCheck,
				frame: true,
				id: 'idPM',
				plugins: [this.cellEditting],
				dockedItems:[{xtype: 'toolbar',
							  items: [{xtype: 'button', hidden: this.disableEditing, width: 80	,iconCls: 'icon-add'	,text: 'New'	,id: 'idNew'	,scope: this	,scale: 'medium', handler: this.onEventNew},
							  		  {xtype: 'button', hidden: this.disableEditing, width: 80	,iconCls: 'icon-delete'	,text: 'Delete'	,id: 'idDelete'	,scope: this	,scale: 'medium', handler: this.onEventDelete},
							  		  {xtype: 'button', hidden: this.disableEditing, width: 80	,iconCls: 'icon-task'	,text: 'Task'	,id: 'idTask'	,scope: this	,scale: 'medium', handler: this.onOpenTask},
							  		  {xtype: 'button', hidden: this.disableEditing, width: 80	,iconCls: 'icon-calendar'	,text: 'Calendar'	,id: 'idCalendar'	,scope: this	,scale: 'medium', handler: this.onShowCalendar},
							  		  '->',
							  		  this.departmentList,
							  		  this.projectTypeList,
							  		  this.statusList,
							  		  {xtype: 'button', width: 80	,iconCls: 'icon-find'	,text: 'View'	,id: 'idView'	,scope: this	,scale: 'medium', handler: this.onEventView}
							  		  
							  		  ]
							  
 							  }],
				columns:[
							{header:'Project name'		,flex:1	,dataIndex:'name'				,editor:{ xtype:'textfield',allowBlank:false} },
							{header: 'Project type',flex: 1,sortable: true,dataIndex: 'projectTypeId',
		            			renderer:function(value,metaData,record){
		            				return record.data.projectType;
		                		},
		                          editor: new Ext.form.field.ComboBox({
		                              selectOnTab: true,
		                              displayField : 'name',
		                      		   valueField : 'id',
		                              store: this.projectTypeList.getStore(),
		                              listClass: 'x-combo-list-small',
		                              scope: this,
		                              queryMode : 'local',
		                              listeners:{
				                       	   change: function(combo, records, eOpts ){
				                       		   			this.getStore().autoSync = false;
				                       	   				this.changedProjectType = combo.getRawValue(); 
				                          			},
				                          	scope: this
		                          		}
		                          })},
							{header: 'Department',flex: 1,sortable: true,dataIndex: 'department_id',
		            			renderer:function(value,metaData,record){
		            				return record.data.departmentName;
		                		},
		                          editor: new Ext.form.field.ComboBox({
		                              selectOnTab: true,
		                              displayField : 'orgName',
		                      		   valueField : 'orgId',
		                              store: this.departmentList.getStore(),
		                              listClass: 'x-combo-list-small',
		                              scope: this,
		                              queryMode : 'local',
		                              listeners:{
				                       	   change: function(combo, records, eOpts ){
				                       		   			this.getStore().autoSync = false;
				                       	   				this.changedDepartment = combo.getRawValue(); 
				                          			},
				                          	scope: this
		                          		}
		                          })},							
							{header:'Customer'			,flex:1	,dataIndex:'clientname'			,editor:{ xtype:'textfield',allowBlank:false} },
							{header:'Project manager'	,flex:1	,dataIndex:'manager'			,editor:{ xtype:'textfield',allowBlank:false} },
							{header:'Start date'		,flex:1	,dataIndex:'start_date'			,editor: new Ext.form.DateField({ format: 'd/m/Y', submitFormat: 'd/m/Y'})},
							{header: 'Finish date'		,flex:1	,dataIndex:'end_date'			,editor: new Ext.form.DateField({ format: 'd/m/Y', submitFormat: 'd/m/Y'})},
							{header:'Status'			,flex:1	,dataIndex:'status'				,editor:{ xtype:'textfield',allowBlank:false} }
						]
					
			});
			this.callParent(arguments);
			var loadMask = new Ext.LoadMask(this, {
	            store: this.store 
	        });

			this.departmentList.getStore().loadData(Ext.decode(this.departmentJson));
			this.statusList.getStore().loadData(Ext.decode(this.statusJson));
//			this.on('beforeedit', function(editor, e) {
//				  if (this.disableEditing == true)
//				    return false;
//				},this);
	        this.on('edit', function(editor,e){
	        	if(e.field == 'department_id' && this.changedDepartment != '' && this.getStore().autoSync == false){
	        		this.getStore().autoSync = true;
	        		e.record.beginEdit();
	            	e.record.set('department_id', e.value);
	            	e.record.set('departmentName', this.changedDepartment);
	            	e.record.endEdit();
	            	changedDepartment = '';
	            }else if(e.field == 'projectTypeId' && this.changedProjectType != '' && this.getStore().autoSync == false){
	            	this.getStore().autoSync = true;
	        		e.record.beginEdit();
	            	e.record.set('projectTypeId', e.value);
	            	e.record.set('projectType', this.changedProjectType);
	            	e.record.endEdit();
	            	changedProjectType = '';
	            }
	        },this);
	        
	        
		},
		setupStore: function(){
			this.store = new Ext.data.JsonStore({
				autoLoad: true,
				autoSync: true,
				model: 'EAP.Model.Project',
				proxy: {
			        type: 'ajax',
			        api: {
			            read:this.GET_PROJECT_LIST_URL,
			            create: this.SAVE_PROJECT_URL,
			            update: this.SAVE_PROJECT_URL,
			            destroy: this.DELETE_PROJECT_URL
			        }, 
			        reader: {
			            type: 'json',
			            root: 'PmProjectList',
			            idProperty: 'id',
			            messageProperty:'message'
			        },
			        writer: {
			            type: 'json',
			            writeAllFields: true,
			            root: 'PmProjectList'
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
		},
		onEventNew:function()
		{
			
			var item = new EAP.Model.Project({
				name: '',
				projectTypeId: this.projectTypeList.getValue(),
				projectType: this.projectTypeList.getRawValue(),
				department_id: this.departmentList.getValue(),
				departmentName: this.departmentList.getRawValue(),
				clientname: '',
				manager: '',
				start_date: new Date(),
				end_date: new Date()
			});
			var edit = this.cellEditting;
			edit.cancelEdit();
			this.store.insert(0,item);
			edit.startEditByPosition({row: 0, column: 0});
			
		},
		onEventDelete:function()
		{
			 var selection = this.getView().getSelectionModel().getSelection();
			 
			 Ext.Msg.show({
			 	title: 'eProject',
			 	msg: 'Are you sure to delete this project',
			 	scope: this,
			 	icon: Ext.MessageBox.QUESTION,
			 	buttons: Ext.MessageBox.YESNO,
			 	fn: function(buttonId)
			 	{
			 		if(buttonId != 'yes')
			 		return;
			 		if(selection.length > 0)
					 {
					 	for(var i=0;i<selection.length; i++)
					 	{
					 		this.store.remove(selection[i]);
					 	}
					 }
			 		
			 	}
			 	
			 });
		},
		
		onEventExcel:function(){
			
		},
		onOpenTask: function(){
			 var selection = this.getView().getSelectionModel().getSelection();
			var url = location.href;
			window.location.assign(url.replace("project-list","project-task")+"?projectId="+selection[0].get('id'));
//			var currentPageUrl = "";
//			if (typeof this.href === "undefined") {
//			    currentPageUrl = document.location.toString().toLowerCase();
//			}
//			else {
//			    currentPageUrl = this.href.toString().toLowerCase();
//			}
		},
		onEventView:function(){
			Ext.getCmp("idPM").getStore().load({scope : this, params :  {
					departmentId: this.departmentList.getValue(),
					projectTypeId: this.projectTypeList.getValue(),
					statusId: this.statusList.getValue()
				}});
			
			
		},
		
		onCreateDepartmentList:function(){

    	var departmentStore = new Ext.data.JsonStore({
//    	    fields: [ 
//    	        {type: 'int', name: 'orgId'},
//    	        {type: 'string', name: 'orgName'},
//    	        {type: 'boolean', name: 'isAdmin'}
//    	        
//    	    ],
    		model: 'EAP.Model.Department',
    		listeners: {
    			load: function( store, records, successful, eOpts){
    				//this.departmentList.select(this.departmentList.getStore().getAt(0));
    		        //this.departmentList.fireEvent('select',  this.departmentList,this.departmentList.getStore().getRange(0,0));
    		        
    				this.departmentList.select(store.getAt(0));
    				 this.departmentList.fireEvent('select',  this.departmentList,records);
//    				 if (this.categoryList.getStore().getTotalCount() > 0){
//     		        	this.categoryList.select(this.categoryList.getStore().getAt(0));
//     		        }
            	},
            	scope:this
    		}	
    	});
    	
	    	// Simple ComboBox using the data store
	    	this.departmentList = Ext.create('Ext.form.field.ComboBox', {
	    		id : 'cboDepartment',
	    		inputId: 'cbDepartment',
	    		fieldLabel: 'Department',
	    	    displayField: 'orgName',
	    	    labelAlign: 'right',
	    	    valueField : 'orgId',
	    	    width: 200,
	    	    editable: false,
	    	    cls: 'x-type-cboscreen',
	    	    store: departmentStore,
	    	    queryMode: 'local',
	    	    typeAhead: true
	    	});			
		},
		
		onCreateStatusList:function(){

	    	var statusStore = new Ext.data.JsonStore({
	    	    fields: [ 
	    	        {type: 'int', name: 'value'},
	    	        {type: 'string', name: 'name'}
	    	    ],
	    		listeners: {
	    			load: function( store, records, successful, eOpts){
	    				//this.departmentList.select(this.departmentList.getStore().getAt(0));
	    		        //this.departmentList.fireEvent('select',  this.departmentList,this.departmentList.getStore().getRange(0,0));
	    		        
	    				this.statusList.select(store.getAt(0));
	    				 this.statusList.fireEvent('select',  this.statusList,records);
	//    				 if (this.categoryList.getStore().getTotalCount() > 0){
	//     		        	this.categoryList.select(this.categoryList.getStore().getAt(0));
	//     		        }
	            	},
	            	scope:this
	    		}	
	    	});
    	
    	// Simple ComboBox using the data store
	    	this.statusList = Ext.create('Ext.form.field.ComboBox', {
	    		id : 'cboStatus',
	    		inputId: 'cbStatus',
	    		fieldLabel: 'Status',
	    	    displayField: 'name',
	    	    labelAlign: 'right',
	    	    valueField : 'value',
	    	    width: 200,
	    	    editable: false,
	    	    store: statusStore,
	    	    queryMode: 'local',
	    	    typeAhead: true
	    	});			
		},		
		onCreateProjectType: function(){
			var ds = new Ext.data.JsonStore({
	    		autoLoad : true,
	    		//fields : ['id', 'name'],
	    		model: 'EAP.Model.ProjectType',
	    		proxy: {
	    	        type: 'ajax',
	    	      //  extraParams :{departmentId: this.departmentList.getValue()},
	    	        url: this.GET_ACTIVE_PROJECT_TYPE_URL,
	    	        reader: {
	    	            type: 'json',
	    	            root: 'PmProjectTypeList',
	    	            idProperty: 'id'
	    	        }
	    	    },
	    	    listeners: {
	    			load: function( store, records, successful, operation, eOpts ){
	    				var _projectType = new EAP.Model.ProjectType({
	    					id: 0,
	    					name: '  '
	    				});
	    				store.insert(0,_projectType);
	            	},
	            	scope:this
	    		}	
	    	});

	    	 this.projectTypeList = new Ext.form.ComboBox({
	    		id : 'cboProjectType',
	    		inputId: 'cbProjectType',
	    		store : ds,
	    		labelAlign: 'right',
	    	    fieldLabel: 'Project type',	      
	    		displayField : 'name',
	    		valueField : 'id',
	    		typeAhead : true,
	    		loadingText : 'Searching...',
	    		labelWidth: 70,
	    		width: 220,
	    		editable: false,
	    		msgTarget: 'side',
	    		maxWidth: 220,
	    		// hideTrigger:true,
	    		queryMode : 'local',
	    		minChars : 1
	    	});
		},
		onShowCalendar: function(){
			 var selection = this.getView().getSelectionModel().getSelection();
			// load calendar first
			new Ext.data.Connection().request({
				method : 'POST',
				url : this.GET_HOLIDAY_CALENDAR_URL,
				params : {
					projectId: selection[0].get('id')
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
							projectId :  selection[0].get('id'),
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

		}
		
		
});


