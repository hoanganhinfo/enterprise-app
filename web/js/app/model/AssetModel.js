Ext.define('EAP.Model.Asset', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id',type: 'int',useNull: true},
	         {name: 'parentId',type: 'int'},
	         {name: 'leaf',type: 'boolean'},
	         //{name: 'expanded',type: 'boolean'},
	         {name:'assetCode'},
             {name:'assetName'},
             {name:'categoryId',type:'int'},
             {name:'categoryName'},
             {name:'employee'},
             {name:'employeeNo'},
             {name:'department'},
             {name:'description'},
             {name:'distributor'},
             {name:'expiredDate',
            	 convert: function (value, record) {
            	        //Convert date type that .NET can bind to DateTime
            	       // var date = new Date();
            	        //alert(value);
            		 	if (Ext.isDate(value)){
            		 		return Ext.Date.format(value, 'd/m/Y');
            	 		}else{
            	 			return value;
            	 		}
            	      }},
             {name:'manufacturer'},
             {name:'model'},
             {name:'purchasedDate',
            	 convert: function (value, record) {
            		 	if (Ext.isDate(value)){
     		 				return Ext.Date.format(value, 'd/m/Y');
     	 				}else{
            	 			return value;
            	 		}
         	      }},
             {name:'serial'},
             {name: 'status'},
             {name: 'statusText'},
             {name:'store'},
             {name:'storeAddress'},
             {name:'warranty'},
             {name:'locationCode'},
             {name:'owner'},
             {name:'requestType'},
             {name:'requestTypeId', type:'int'}],
    idProperty: 'id'
});