
Ext.define('EAP.Portlet.LastedTestGrid',{
	extend: 'Ext.grid.Panel',
	requires: 	[
					'Ext.data.*',
					'Ext.state.*',
					'Ext.grid.*',
					'Ext.form.ComboBox',
					'Ext.form.FieldSet',
					'Ext.tip.QuickTipManager',
					'Ext.toolbar.TextItem'
				],
	idLastedTestGrid: '',
	station : null,
	GET_TEN_PRODUCT_TEST_LIST: '/enterprise-app/service/getTenProductTestList',
	DELETE_PRODUCT_TEST_URL : '/enterprise-app/service/deleteProductTest',
	initComponent:function()
	{
		
		var TestDs = new Ext.data.JsonStore({
			autoLoad: false,
			fields: 	['testid','serial','datetested','status','inputParams'],
			proxy:	{
						type: 'ajax',
						url: this.GET_TEN_PRODUCT_TEST_LIST,
						reader:	{
									type:'json',
									root:'testList',
									idProprety:'testid'
								}
					}
		});
		TestDs.load({params:{sessionId: sessionId,operator: operatorName, station: this.station }});
		Ext.apply(this,{
	        autoScroll: true,
	        cellCls: 'x-type-grid-test-result',
	        stateful: true,
	        columnLines: true,
	        border: 1,
	        store: TestDs,
	       // id: 'id_LastedTestGrid'+this.idLastedTestGrid,
	       // inputId: 'inputId_LastedTestGrid'+this.idLastedTestGrid,
	        columns: [],
	        title: 'Last 10 test result /10 kết quả kiểm tra gần nhất',
	        viewConfig: {
	            stripeRows: true,
	            enableTextSelection: true
	        }
		});
		this.callParent(arguments);
		this.on('beforeselect',function(_grid,_rec, index){
			if (selectedGrid != null){
				selectedGrid.getSelectionModel().deselectAll();	
			}
			
		},this);
		this.on('select',function(_grid,_rec, index){
			selectedGrid = this;
		},this);		
		Ext.getBody().on('keypress',function(e,t){
			
			//Ext.Msg.alert('id_LastedTestGrid');
			switch(e.getKey())
			{
				case e.DELETE:
				{
				//	var getidx = this.idActionPanel;
				//	alert(this);
					//Ext.Msg.alert('id_LastedTestGrid'+getidx); return;
					
					var selectedTest = selectedGrid.getSelectionModel().getSelection();
					if (selectedTest.length == 1){
	    				var testId = selectedTest[0].get('testid');
	    				Ext.Msg.show({
	    					title : 'Activation test',
	    					msg : 'Are you sure to delete this test</br>Bạn có muốn xóa mẫu kiểm tra này không',
	    					icon : Ext.Msg.QUESTION,
	    					buttons : Ext.Msg.YESNO,
	    					scope:this,
	    					defaultFocus: 2,
	    					fn : function(buttonId) {
	    						if (buttonId != 'yes'){
	    							 selectedGrid.getSelectionModel().deselectAll();
	    							return;
	    						} 
	    						new Ext.data.Connection().request({
	    							method : 'POST',
	    							url : '/enterprise-app/service/deleteProductTest',
	    							params : {
	    								testId : testId
	    							},
	    							scope:this,
	    							scriptTag : true,
	    							success : function(response) {
	    								//alert('Delete success !!');
	    								var rs = Ext.decode(response.responseText);
	    								if (rs.success == true){
	    									selectedGrid.getStore().remove(selectedTest[0]);
	    									
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
	    			}
					e.stopEvent();
  		    		return;
	    			break;
				} 
			}
		});
	}	
});
