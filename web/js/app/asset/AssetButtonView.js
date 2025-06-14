Ext.Loader.setConfig({
    enabled: true
});Ext.define('EAP.view.AssetButtonView',{
	extend: 'Ext.form.Panel',
	alias: 'widget.assetDataView',
	border : 0,
	bodyBorder : true,
	//layout: { type: 'hbox', pack: 'left'},
	idInputInfo:'',
	defaults: {bodyStyle: 'padding:10px'},
//	 width: '100%',
	bodyCls: 'x-type-frm',
	that: null,
	layout: {
        type: 'table',
        // The total column count must be specified here
        columns: 10
    },
    paramFieldMap: new Map(),
	initComponent: function()
	{
		this.callParent(arguments);
	},
	renderAsset: function(ownerName, departmentName, assetCategoryId, locationCode, requestType, name){
		that = this;
		that.removeAll();
		that.doLayout();
		new Ext.data.Connection().request({
			method : 'GET',
			url : GET_ASSET_LIST,
			scope: this,
			params : {ownerName: ownerName,
				departmentName : departmentName,
				categoryId: assetCategoryId,
				locationCode: locationCode,
				requestType: requestType,
				name: name,
			},
			scriptTag : true,
			success : function(response) {
				//alert('Delete success !!');
				var i = 0;
				var paramFieldCtl;
				var rs = Ext.decode(response.responseText);
				if (rs.success == true){
					var assets = rs.AssetList;
					Ext.each(assets,function(asset){
						var clsFormat = 'x-btn-none';
						console.log(asset);
						switch(asset.requestTypeId){
							case 1: clsFormat= 'x-btn-urgent';break; //Urgent
							case 2: clsFormat= 'x-btn-safety';break; //Safety
							case 3: clsFormat= 'x-btn-corrective';break; //Corrective
							case 4: clsFormat= 'x-btn-preventive';break; //Preventive
							case 5: clsFormat= 'x-btn-maintenance';break; //Maintenance
							case 6: clsFormat= 'x-btn-improvement';break; //Improvement
						}
						console.log(clsFormat);
					     var txt = '<html>'+asset.assetCode+'<br>'+asset.assetName+'</html>'
						 paramFieldCtl = new Ext.Button({
							id : asset.id,
							name: asset.assetCode,
							text: txt,
							margin:  '8 8 0 8',
							ui:'plain',
							baseCls: 'x-btn-asset',
							cls: clsFormat,
						    width : 100,
						    height: 100,
						    listeners: {
				    			click: function( obj, e, eOpts){
				    				console.log(that.items.items);
				    				Ext.each(that.items.items, function(btn){
				    					console.log(btn);
				    					btn.removeCls('x-btn-select');
				    				});
				    				activeAssetId = obj.id;
				            		assetHistoryDS.load({params:{assetId:  obj.id}});
				            		obj.addCls('x-btn-select');
				            		assignedTaskDS.load({params:{assetId:  obj.id}});
				            	},
				            	scope:this
				    		}

						});

						 that.add(paramFieldCtl);

					});

					that.doLayout();
				}
			},
			failure : function(response) {

			}
		});
	}
});
