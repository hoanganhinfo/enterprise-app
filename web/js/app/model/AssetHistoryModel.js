Ext.define('EAP.Model.AssetHistory', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id',type: 'int',useNull: true},
             {name:'description'},
             {name:'assetId',type:'int'},
             {name:'employee'},
             {name:'employeeNo'},
             {name:'department'},
             {name:'locationCode'},
             {name:'memo'},
             {name:'transType'},
             {name:'transTypeId',type: 'int'},
             {name:'startDate',
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
            	      /*
             {name:'endDate',
            	 convert: function (value, record) {
            		 	if (Ext.isDate(value)){
     		 				return Ext.Date.format(value, 'd/m/Y');
     	 				}else{
            	 			return value;
            	 		}
         	      }},*/
            // {name:'transDate'},
             {name:'createdBy'},
             {name:'createdDate',
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
             {name:'actionStatus'},
             {name:'actionStatusId',type: 'int'},
             {name:'actionBy'},
             {name:'actionDate',
            	 convert: function (value, record) {
            	        //Convert date type that .NET can bind to DateTime
            	       // var date = new Date();
            	        //alert(value);
            		 	if (Ext.isDate(value)){
            		 		return Ext.Date.format(value, 'd/m/Y');
            	 		}else{
            	 			return value;
            	 		}
            	      }}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'assetId',
        min: 1
    },{
        type: 'length',
        field: 'startDate',
        min: 1
    }]
});