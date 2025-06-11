Ext.define('EAP.Form.QCInspectionOrder', {
	extend : 'Ext.form.Panel',
//	border : true,
//	bodyBorder : true,
	layout : {
		type : 'table',
		columns : 3,
		tableAttrs : {
			style : {
				width : '100%',
				 bodyStyle: 'border:0 none'
			}
		}
	},
	title: 'QC Inspection Order',
	itemId: 'qcInspectionOrder',
	inspectionTableStore : null,
	inspectionLineStore : null,
	dateFrom: new Date(),
	dateTo: new Date(),
	itemId : '',
	transType : '',
	defaults : {
		//bodyStyle : 'padding:10px'
	},
	initComponent : function() {
		
		this.items = [ {
			xtype : 'textfield', // 2
			id : 'txtItemcode',
			inputId : 'itemCode',
			labelAlign : 'right',
			//maxLength : 20,
			colspan : 2,
			//enforceMaxLength : true,
			fieldLabel : 'Item code',
			msgTarget : 'side',
			enableKeyEvents : true,
			height : 22,
			width : 400,
			maxWidth : 400
		},{
			xtype : 'textfield', // 2
			id : 'txtItemname',
			inputId : 'Itemname',
			labelAlign : 'left',
			maxLength : 20,
			labelWidth: 80,
			enforceMaxLength : true,
			fieldLabel : 'Item name',
			msgTarget : 'side',
			enableKeyEvents : true,
			height : 22,
			width : 400,
			maxWidth : 400,
			//cellCls: 'x-type-cell-left',
			colspan: 2
		},{
        	fieldLabel: 'Date inspected from',
        	name: 'dateinspectedFrom',
        	labelAlign: 'right',
        	id: 'dateinspectedFrom',
        	allowBlank : false,
        	submitFormat: 'd/m/Y',
        	value: new Date(),
			format: 'd/m/Y',
        	width: 200,
	    	margin: '4 4 4 4',
        	xtype: 'datefield'
        	
        },{
        	fieldLabel: 'Date inspected to',
        	name: 'dateinspectedTo',
        	labelAlign: 'right',
        	allowBlank : false,
			id: 'dateinspectedTo',
        	format: 'd/m/Y',
        	value: new Date(),
        	submitFormat: 'd/m/Y',
        	width: 200,
	    	margin: '4 4 4 4',
        	xtype: 'datefield',
        	//cellCls: 'x-type-cell-left'
        	//colspan: 4
        	
        }, Ext.create('Ext.form.field.ComboBox', {
        	id : 'cbTransTypeFilter',
			inputId: 'cboTransTypeFilter',
			store : allTransTypeStore,
			labelAlign: 'right',
			fieldLabel: 'Transaction type',	      
			displayField : 'name',
			valueField : 'value',
			editable: false,
			value: 0,
			labelWidth: 80,
//			width: 200,
//			//allowBlank: true,
//			msgTarget: 'side',
	        triggerAction : 'all',
	    	queryMode : 'local',
	    	margin: '4 4 4 4'
    	}), {
			xtype : 'button',
			scope : this,
			text : 'View',
			colspan: 3,
			margin: '15 5 5 5',
			width: 100,
			handler : this.onView
		},{
			xtype : 'inspectionInputPanel',
			inspectionTableStore : this.inspectionTableStore,
			inspectionLineStore : this.inspectionLineStore,
			colspan: 3,
		    height: 500,
		}],
		this.callParent(arguments);
	},
	onRender: function(){
		this.callParent(arguments);
	},
	onView : function() {
		//Ext.getBody().mask('Loading data...');
		this.itemId = Ext.getCmp('txtItemcode').getValue();
		this.itemName = Ext.getCmp('txtItemname').getValue();
		this.dateFrom = Ext.getCmp('dateinspectedFrom').getValue();
		this.dateTo = Ext.getCmp('dateinspectedTo').getValue();
		this.transType = Ext.getCmp('cbTransTypeFilter').getValue();
		this.inspectionTableStore.getProxy().setExtraParam("itemId", this.itemId);
		this.inspectionTableStore.getProxy().setExtraParam("itemName", this.itemName)
		this.inspectionTableStore.getProxy().setExtraParam("dateinspectedFrom", this.dateFrom);
		this.inspectionTableStore.getProxy().setExtraParam("dateinspectedTo", this.dateTo)
		this.inspectionTableStore.getProxy().setExtraParam("transType", this.transType)
		
		
		this.inspectionTableStore.load({params:{
			itemId:  this.itemId,
			dateinspectedFrom :  this.dateFrom,
			dateinspectedTo :this.dateTo,
			transType : this.transType,
			page : 1,
			start: 0
			}});

	}
});

