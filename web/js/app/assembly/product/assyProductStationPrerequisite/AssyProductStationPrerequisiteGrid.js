
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/ewi-theme/js/extjs4.1/examples/ux');
Ext.define('Assy.AssyProductStationPrerequisiteGrid.Grid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn'
    ],
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    productTypeList: null,
    productTypeDS : null,
    productStationList : null,
    productStationDS : null,
    productType: '',
    productStation : '',
    initComponent: function(){ 
    	this.productTypeDS = new Ext.data.JsonStore({
    		autoLoad : true,
    		//fields : ['id', 'product_type','product_type_name'],
    		model: 'EAP.Model.AssyProductType',
    		proxy: {
    	        type: 'ajax',
    	        url: GET_ASSY_PRODUCT_TYPE_LIST_URL,
    	        reader: {
    	            type: 'json',
    	            root: 'AssyProductTypeList',
    	            idProperty: 'id'
    	        }
    	    }
    	});
    	this.productStationDS = new Ext.data.JsonStore({
    		model: 'EAP.Model.AssyProductStation',
    		proxy: {
    	        type: 'ajax',
    	        url: GET_ASSY_PRODUCT_STATION_LIST_URL,
    	        extraParams: {productTypeId: this.productType}, 
    	        reader: {
    	            type: 'json',
    	            root: 'AssyProductStationList',
    	            idProperty: 'id'
    	        },
    			listeners: {
    				beforeload: function(){
    					Ext.apply(this.proxy.extraParams,{
    						//'productTypeId': _selectedProductType
    					});

    				},
        			scope: this
    			}
    	    }
    	});    	
    	this.productTypeList = new Ext.form.ComboBox({
    		id : 'cboProductType',
    		inputId: 'cbProductType',
    		store : this.productTypeDS,
    		allowBlank: false,
    		msgTarget: 'side',		
    		labelAlign: 'left',
    	    fieldLabel: 'Product type',	      
    		displayField : 'product_type',
    		valueField : 'id',
    		flex: 2,
    		typeAhead : true,
    		editable: false,
    		width : 250,
    		maxWidth: 250,
    		// hideTrigger:true,
    		triggerAction : 'all',
    		queryMode : 'remote',
    		minChars : 1,
    		listeners: {
    			select: function(combo,record,opt){
    				//selectedProductType = record[0].data.id;
    				this.productType = record[0].get('id');
    				this.productStationList.setRawValue('');
    				this.productStationList.getStore().load({
    					params:{productTypeId: this.productType},
    					callback: function(){
    					}
    					});
    			},
    			scope: this
    		}		
    	});		


    	this.productStationList = new Ext.form.ComboBox({
    		id : 'cboProductStation',
    		inputId: 'cbProductStation',
    		store : this.productStationDS,
    		allowBlank: false,
    		msgTarget: 'side',		
    		labelAlign: 'left',
    	    fieldLabel: 'Station',
    	    labelWidth: 50,
    	    flex: 1,
    		displayField : 'station',
    		valueField : 'id',
    		typeAhead : true,
    		editable: false,
    		width : 200,
    		maxWidth: 200,
    		// hideTrigger:true,
    		triggerAction : 'all',
    		queryMode : 'local',
    		minChars : 1,
    		listeners: {
    			select: function(combo,record,opt){
    				this.productStation = record[0].get('id');
    				this.productType = record[0].get('product_type');
    				this.getStore().load({
    					params:{productTypeId: this.productType,productStationId: this.productStation},
    					callback: function(){
    					}
    					});    				
            	},
    			scope: this
    		}		
    	});    	
       this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function(e, editor){
                        
                },
                scope: this
            }
        });
        
        Ext.apply(this, {
            id: 'idGridAssyProductDefect',
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
            	itemId: 'toptoolbar',
                items: [this.productTypeList,this.productStationList]
            }],
            columns: [{
            	header: 'id',
                flex: 1,
                sortable: true,
                dataIndex: 'id'
                
     		},{
            	header: 'Product type',
                flex: 1,
                sortable: true,
                dataIndex: 'productTypeName'
                
     		},{
			            	header: 'Transaction date',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'transdate'
			                
                 		},{
			            	header: 'Result',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'status'
			                
                 		},{
                 			header: 'Active',
                 			xtype: 'checkcolumn',
                 			id: 'idactive',
				            dataIndex: 'active',
				            flex: 1,
				            sortable: true,
				            scope:this
                 		},{
			            	header: 'Input parameters',
			                flex: 1,
			                sortable: true,
			                dataIndex: 'inputParams'
			                
                 		}],
                 		
                 		
                 
          selModel: {
            selType: 'cellmodel'
        	}
        });
        this.callParent(arguments);
       
    }
    
});
