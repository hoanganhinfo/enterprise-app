
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.define('Assy.AssyProductStation.Grid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn'
    ],
    title : 'Station for product',
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    initComponent: function(){ 
				
       this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            listeners: {
                beforeedit: function(e, editor){
                        
                },
                scope: this
            }
        });
        
        Ext.apply(this, {
            id: 'idassypmGrid',
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
            	itemId: 'toptoolbar',
                items: [{
                	
                    iconCls: 'icon-add',
                    id: 'btn_add',
                    text: 'Add',
                    scale : 'medium',
                    scope: this,
                    handler: this.onAddClick
                }, 
                {
                	
                    iconCls: 'icon-delete',
                    id: 'btn_delete',
                    scale : 'medium',
                    text: 'Delete',
                    scope: this,
                    handler: this.onDeleteClick
                    
                },
                {
                	iconCls: 'icon-product',
                    id: 'btn_product_param',
                    scale : 'medium',
                    text: 'Product Param',
                    scope: this,
                    handler: this.onOpenAPR
                    
                },{
                	iconCls: 'icon-ld',
                    id: 'btn_product_defect',
                    scale : 'medium',
                    text: 'Product defects',
                    scope: this,
                    handler: this.onOpenAPD
                    
                }]
            }],
            columns: [
                 		{
			            	header: 'Station',
			                sortable: true,
			                dataIndex: 'station',
			                width: 100,
			                editor: 
                 			{
		                    	xtype: 'textfield',
		                   		allowBlank: false
		               		}
                 		},
                 		{
			            	header: 'Test parameter',
			                sortable: true,
			                width: 400,
			                dataIndex: 'product_params_name'
			                
                 		},
                 		{
                 			header: 'Step',
                 			sortable: true,
			                dataIndex: 'step',
			                editor: 
                 			{
		                    	xtype: 'textfield'
		               		}
                 		},
                 		{
                 			header: 'Product defects',
                 			hidden: true,
			                sortable: true,
			                width: 400,
			                dataIndex: 'product_defects'
                 		},{
                 			
                 			header: 'Prerequisite condition',
			                sortable: true,
			                dataIndex: 'prerequisite',
			                width: 100,
			                editor: 
                 			{
		                    	xtype: 'textfield'
		               		}
                 		
                 			
                 		}],
                 		
                 		
                 
          selModel: {
            selType: 'cellmodel'
        	}
        });
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        
    },
    onSelectChange: function(selModel, selections){
    	Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_product_param').setDisabled(false);
    	Ext.getCmp('idassypmGrid').getDockedItems()[0].items.get('btn_product_defect').setDisabled(false);
    	
    },
     
    onAddClick: function(){
    	
        var rec = new EAP.Model.AssyProductStation({
        	id:'',
        	product_type: selectedProductType,
        	station: '',
        	step: 1
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
    },
    onDeleteClick: function()
    {
    	 var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Assy Product Type',
			msg : 'Are you sure to delete this station',
			icon : Ext.Msg.QUESTION,
			buttons : Ext.Msg.YESNO,
			scope: this,
			defaultFocus: 2,
			fn : function(buttonId) {
				if (buttonId != 'yes'){
					return;
				}
		        if (selection) {
		            this.store.remove(selection);
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },
	onOpenAPR:function()
	{
		var assyPMStore1 = Ext.create('Ext.data.Store',{
			autoLoad : true,
			fields : [{name: 'id'}, { name: 'parameter_code'},{ name: 'parameter_name'}],
			proxy: {
		        type: 'ajax',
		        url:GET_ASSY_PARAM__LIST,
		        reader: 
		        {
		            type: 'json',
		            root: 'AssyParameterList',
		            idProperty: 'id'
		        }
		    }
		});
		
    	
    	
        	   			 
    	var sm = Ext.create('Ext.selection.CheckboxModel');
        var selectedAPTItems = Ext.getCmp('idassypmGrid').getSelectionModel().getSelection()[0];
      
        Ext.create('Ext.window.Window', {
            title: 'Product Parameters',
            id:'frmAPM',
            height: 400,
            width: 500,
            layout: 'fit',
            modal: true,
            items: { 
                xtype: 'grid',
                id: 'gridAPT',
                border: false,
                selModel : sm,
                stateful: true,
    	        multiSelect: true,
                columns: [ 
                     {text: 'Parameter code',sortable : false,flex: 1,dataIndex: 'parameter_code'},                          
                     {text: 'Parameter name',sortable : false,flex: 1,dataIndex: 'parameter_name'}
                 ],
                store: assyPMStore,
                dockedItems: 
                [{
                    xtype: 'toolbar',
                    items: 
                    [{
                        iconCls: 'icon-add',
                        text: 'Save',
                        scope: this,
                        scale : 'medium',
                        handler: function()
                        {
	                    	var selectedParams = Ext.getCmp('gridAPT').getSelectionModel().getSelection();
	                		var _parameter_code_str = '';
	                		var _parameter_name_str = '';
	                		for(var i=0;i<selectedParams.length;i++)
	                		{
	                			var param_code = selectedParams[i].get('id');
	                			var param_name = selectedParams[i].get('parameter_name');
	                			_parameter_code_str += param_code + ';';
	                			_parameter_name_str += param_name + ';';
	                			
	                		}
	                		selectedAPTItems.set('product_params',_parameter_code_str);
	                		selectedAPTItems.set('product_params_name',_parameter_name_str);
	                		
    						Ext.getCmp('frmAPM').close();
                    	}
                    }, 
                    {
	                        iconCls: 'icon-delete',
	                        text: 'Close',
	                        scale : 'medium',
	                        scope: this,
	                        handler: function()
	                        {
	                    		Ext.getCmp('frmAPM').close();
                    		
                    		}
                  	}]
               }]
            },
            listeners:
            {
        	   'show' : function(grid,opts)
        	   	{
        	   		if(selectedAPTItems == null) return;
        	   		var _pps = Ext.getCmp('idassypmGrid').getSelectionModel().getSelection()[0].get('product_params').split(';');
        	   		
        	   		for(var i =0;i <= _pps.length; i++)
        	   		{
        	   			if(assyPMStore == null)
        	   				 return;
        	   			
        	   			var _pp  =  assyPMStore.findRecord('id',_pps[i]);
        	   			
        	   			if(_pp!=null)
        	   			{
        	   				Ext.getCmp('gridAPT').getSelectionModel().select(_pp,true);
        	   			}
        	   			
        	   		}
        	   		
        		},scope: this
    		}
        }).show();
	},
	onOpenAPD:function()
		{
				 
	    	var sm = Ext.create('Ext.selection.CheckboxModel');
	        var selectedAPTItems = Ext.getCmp('idassypmGrid').getSelectionModel().getSelection()[0];
	      
	        Ext.create('Ext.window.Window', {
	            title: 'Product Defect',
	            id:'frmAPD',
	            height: 400,
	            width: 1000,
	            layout: 'fit',
	            modal: true,
	            items: { 
	                xtype: 'grid',
	                id: 'gridAPD',
	                border: false,
	                selModel : sm,
	                stateful: true,
	    	        multiSelect: true,
	                columns: [ 
	                     {text: 'Defect code'			,sortable : false,flex: 0.3	,dataIndex: 'defect_code'},                          
	                     {text: 'Defect name Enligh'	,sortable : false,flex: 1	,dataIndex: 'defect_name_en'},
	                     {text: 'Defect name VietNam'	,sortable : false,flex: 1	,dataIndex: 'defect_name_vn'}
	                 ],
	                store: assyPDStore,
	                dockedItems: 
	                [{
	                    xtype: 'toolbar',
	                    items: 
	                    [{
	                        iconCls: 'icon-add',
	                        text: 'Save',
	                        scope: this,
	                        scale : 'medium',
	                        handler: function()
	                        {
		                    	var selectedDefects = Ext.getCmp('gridAPD').getSelectionModel().getSelection();
		                		var _defect_code_str = '';
		                		for(var i=0;i<selectedDefects.length;i++)
		                		{
		                			var defect_code = selectedDefects[i].get('id');
		                			_defect_code_str += defect_code + ';';
		                			
		                		}
		                		selectedAPTItems.set('product_defects',_defect_code_str);
		                		
	    						Ext.getCmp('frmAPD').close();
	                    	}
	                    }, 
	                    {
		                        iconCls: 'icon-delete',
		                        text: 'Close',
		                        scale : 'medium',
		                        scope: this,
		                        handler: function()
		                        {
		                    		Ext.getCmp('frmAPD').close();
	                    		
	                    		}
	                  	}]
	               }]
	            },
	            listeners:
	            {
	        	   'show' : function(grid,opts)
	        	   	{
	        	   		if(selectedAPTItems == null)
	        	   		return;
	        	   		var _pds = Ext.getCmp('idassypmGrid').getSelectionModel().getSelection()[0].get('product_defects').split(';');
	        	   		
	        	   		for(var i =0;i <= _pds.length; i++)
	        	   		{
	        	   			if(assyPDStore == null)
	        	   			return;
	        	   			var _pd  =  assyPDStore.findRecord('id',_pds[i]);
	        	   			if(_pd!=null)
	        	   			{
	        	   				Ext.getCmp('gridAPD').getSelectionModel().select(_pd,true);
	        	   			}
	        	   			
	        	   		}
	        	   		
	        		},scope: this
	    		}
	        }).show();
		}    
});
