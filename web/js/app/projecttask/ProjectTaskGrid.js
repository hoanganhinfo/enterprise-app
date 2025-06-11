Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.define('EAP.Grid.ProjectTaskGrid', {
    extend: 'Gnt.panel.Gantt',
    requires : [
                'Gnt.plugin.TaskContextMenu',
                'Gnt.column.StartDate',
                'Gnt.column.EndDate',
                'Gnt.column.Duration',
                'Gnt.column.PercentDone',
                'Sch.plugin.TreeCellEditing',
                'Sch.plugin.Pan'
            ],
    departmentJson: null,  
    statusJson: null,
    departmentList:null,    
    title: 'Task list',
    height : 600,
	width : 1000,
	title: 'Task planning',
	viewPreset : 'weekAndDay',
	recalculateParents: false,
	tooltipTpl : new Ext.XTemplate(
            '<ul class="taskTip">',
                '<li><strong>Task: </strong>{Name}</li>',
                '<li><strong>Start: </strong>{StartDate}</li>',
                '<li><strong>Duration: </strong> {Duration}d</li>',
                '<li><strong>Progress: </strong>{PercentDone}%</li>',
            '</ul>'
        ).compile(),
	startDate : new Date(2013, 0, 1),
	endDate : new Date(2013, 2, 15),    
	lockedGridConfig : {
	    width: 350,
	    title : 'Task Section',
	    collapsible : true
	},
	schedulerConfig: {
	    collapsible : true,
	    columnWidth: 50
	},
    initComponent: function(){
    	//this.createDepartmentList();
    	this.editing = Ext.create('Sch.plugin.TreeCellEditing', {
            clicksToEdit: 2
        });
        Ext.apply(this, {
            frame: true,
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    id: 'newAsset',
                    text : 'New task',
                    scope: this,
                    scale : 'medium',
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-delete',
                    id: 'removeAsset',
                    disabled: true,
                    text : 'Delete task',
                    itemId: 'delete',
                    scale : 'medium',
                    scope: this,
                    handler: this.onDeleteClick
                },'->',{
                    iconCls: 'icon-project',
                    id: 'project',
                    text : 'Select project',
                    scope: this,
                    scale : 'medium',
                    handler: this.onSelectProject
                }]
            }],
            columns: [{xtype : 'treecolumn',header : 'Tasks',sortable : false,dataIndex : 'Name',width : 200, editor:{xtype:'textfield',allowBlank:false}},
		           {header : 'Start date',sortable : false,dataIndex : 'StartDate',width : 70,editor: new Ext.form.DateField({
                       format: 'd-m-Y',
                       submitFormat: 'd-m-Y'
                   }),renderer:Ext.util.Format.dateRenderer('d-m-Y')},
		           {header : 'To date',sortable : false,dataIndex : 'EndDate',instantUpdate:false,width : 70,editor: new Ext.form.DateField({
		        	   format: 'd-m-Y',
                       submitFormat: 'd-m-Y',		        	   
                       listeners: {
                   	    select: function(_datefield, _date,opts) {
                   	    	try {

                   	    	  }
                   	    	  catch (e) {
                   	    	    alert(e.message);
                   	    	  }
                   	    },
                   	 scope: this
                   	  }
                   }),renderer:Ext.util.Format.dateRenderer('d-m-Y')},
                   {header : 'Status',sortable : false,dataIndex : 'Status',width : 70},
                   {header : '% Done',sortable : false,dataIndex : 'PercentDone',width : 70,editor:{xtype:'numberfield',maxValue: 100,minValue: 0}}],
		     plugins: [
		                Ext.create("Sch.plugin.Pan"),
		                Ext.create("Gnt.plugin.TaskContextMenu"),
		                this.editing        
		            ]		           
        });
       
       
        this.callParent(arguments);
       // this.departmentList.getStore().loadData(Ext.decode(this.departmentJson));
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);

     
    },
    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Delete project task',
			msg : 'Are you sure to delete this task',
			icon : Ext.Msg.QUESTION,
			buttons : Ext.Msg.YESNO,
			scope: this,
			defaultFocus: 2,
			fn : function(buttonId) {
				if (buttonId != 'yes'){
			
					return;
				}
		        if (selection) {
		        	var parentNode = this.store.getNodeById(selection.get('parentId'));
		        	if (parentNode.isRoot() == false && parentNode.hasChildNodes() == false){
		        		parentNode.set('leaf',true);
		        	}
		            this.store.remove(selection);
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },

    onAddClick: function(){
   // 	if (this.categoryList.getRawValue() == '') return;
    //	this.getStore().autoSync = false;
		var edit = this.editing;
		//edit.cancelEdit();
    	var parentTask = this.getView().getSelectionModel().getSelection()[0];
        parentTask.set('leaf',false);
        var parentNode = this.store.getNodeById(parentTask.get('Id'));
        var _startDate = parentNode.get("StartDate");
       // var duration = parentNode.get("EndDate") - parentNode.get("StartDate")
        var _endDate = new Date();
        _endDate.setUTCFullYear(_startDate.getFullYear(),_startDate.getMonth(),_startDate.getDate());
        _endDate.setHours(23,59,59);
        parentNode.expand();
        var newTaskNode = parentNode.appendChild({
        	id: null,
        	Name: 'New task',
        	parentId: parentTask.get('Id'),
        	StartDate :  _startDate,
			EndDate :  _endDate,
        	leaf: true,
        	Status: 'Pending'
        });
//        edit.cancelEdit();
   //     this.getStore().autoSync = true;
    },
    onSelectProject: function(){
		var dlg = Ext.create('EAP.Window.ProjectDialog', {
			 userId: userId,
			 departmentJson: this.departmentJson,
			 statusJson : this.statusJson,
			 loadProjectFn: this.onLoadProject,
			 projectTaskGrid : this
			});	
		dlg.show();
    },
   onLoadProject : function(_projectId,_startDate,_endDate){
	   alert(this.getXType());
	   this.startDate = _startDate;
	   this.endDate = _endDate;
	   this.setTimeSpan(_startDate,_endDate);
	   taskStore.load({params :  {
		   projectId:_projectId
		}});
		 
    	//this.getStore.load();
    }
});