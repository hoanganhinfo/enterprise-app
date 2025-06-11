Ext.define('EAP.Portlet.DefectCodeGrid',{
		extend: 'Ext.grid.Panel',
		required: 	[
						'Ext.data.*',
						'Ext.state.*',
						'Ext.grid.*',
						'Ext.form.ComboBox',
						'Ext.form.FieldSet',
						'Ext.tip.QuickTipManager',
						'Ext.toolbar.TextItem'
					],
		idDefectCode:'',
		GET_DEFECT_CODE_LIST:'/enterprise-app/service/getAssyProductDefectActiveList',
		initComponent:function()
		{
			
			var defectCodeDS = new Ext.data.JsonStore({
							autoLoad : true,
							fields : ['id','defect_code', 'defect_name_vn'],
							proxy: {
						        type: 'ajax',
						        //extraParams :{screentype: '10'}, 
						        url: this.GET_DEFECT_CODE_LIST,
						        reader: {
						            type: 'json',
						            root: 'AssyProductDefectList',
						            idProperty: 'id'
						        }
						    }
						});	 
						
						
								    var sm = Ext.create('Ext.selection.CheckboxModel');
					
			
			Ext.apply(this,{
				 		 
							store: defectCodeDS,
					        autoScroll: true,
					        id: 'defectCodeList_'+this.idDefectCode,
					        cellCls: 'x-type-grid-defect-list',
					        stateful: true,
					        multiSelect: true,
					        autoScroll: true,
					        stateId: 'stateGrid',
					        columns: [
					            {
					                text     : 'Defect code',
					                width: 		100,
					              //  flex     : 1,
					                sortable : false,
					               // width: 120,
					                dataIndex: 'defect_code'
					            },
					            {
					                text     : 'Defect name',
					                sortable : false,
					                width: 380,
					                dataIndex: 'defect_name_vn'
					            }],
					        //height: 380,
					       // width: 400,
					        title: 'Defect code list/ Danh sách lỗi',
					        viewConfig: {
					            stripeRows: true,
					            enableTextSelection: true
					        },
					        selModel : sm

				});// end apply
					
	    this.on('select',function(){
	    	
	    	var selectedDefects = this.getSelectionModel().getSelection(); 
	    	
	    	if(selectedDefects.length> 2)
	    	{
	    		
	    		this.getSelectionModel().deselect(selectedDefects[0],false);
	    	}
	    });
				this.callParent(arguments);
		}
});