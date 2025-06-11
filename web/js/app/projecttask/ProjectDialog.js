Ext.define('EAP.Window.ProjectDialog',{
	extend: 'Ext.window.Window',
	modal: true,
    title: 'Select the project',
    width: 750,
    layout:'fit',
    height: 500,
	loadProjectFn : null,
	projectTaskGrid: null,
    initComponent: function(){
		var projectList = Ext.create('EAP.Grid.ProjectGrid',{
			departmentJson: this.departmentJson,
			statusJson: this.statusJson,
			disableEditing : true,
		});	
    	this.bbar = ['->',
    	            { xtype: 'button', scope: this, text: 'OK',handler: this.onOK },
    	            { xtype: 'button', scope: this, text: 'Cancel',handler: this.onCancel }
    	          ];
    	this.items = [projectList];
		this.callParent(arguments);
	},
	onRender: function(){
		this.callParent(arguments);
	},
	onOK: function(){
		//alert(this.items.length);
		var selection = this.items.items[0].getView().getSelectionModel().getSelection();
		//this.loadProjectFn(selection[0].get('id'),selection[0].start_date,selection[0].end_date);
		//alert(selection[0].get('start_date'));
		//Ext.Date.parse(_startDate, "d/m/Y")
		console.info('a');
		var _startdate = selection[0].get('start_date');
		console.info('b');
		var _endDate = selection[0].get('end_date');
		console.info('c');
		this.projectTaskGrid.startDate = _startdate;
		console.info(_startdate);
		this.projectTaskGrid.endDate = _endDate;
		console.info(_endDate);
		this.projectTaskGrid.setTimeSpan(Ext.Date.parse(_startDate, "d/m/Y"),Ext.Date.parse(_endDate, "d/m/Y"));
		console.info('f');
		   taskStore.load({params :  {
			   projectId: selection[0].get('id')
			}});
		   console.info('g');
		this.close();
	},	

	onCancel: function(){
		this.close();
	}
	
});
