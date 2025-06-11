Ext.define('EAP.Model.QCInspectionTable', {
    extend: 'Ext.data.Model',
	 fields: [{name: 'id',type: 'int',useNull: true},
	          {name: 'itemId',type: 'string'},
	          {name: 'itemName',type: 'string'},
	          {name: 'vendorId',type: 'string'},
	          {name: 'vendorName',type: 'string'},
	          {name: 'orderNo',type: 'string'},
	          {name: 'partQty',type: 'float'},
	          {name: 'checkedQty',type: 'float'},
	          {name: 'criticalQty',type: 'int'},
	          {name: 'majorQty',type: 'int'},
	          {name: 'minorQty',type: 'int'},
	          {name: 'result',type: 'string'},
	          {name: 'resultName',type: 'string'},
	          {name: 'accepted',type: 'boolean'},
	          {name: 'defectName',type: 'string'},
	          {name: 'memo',type: 'string'},
	          {name:'transType'},
	          {name:'transTypeId',type: 'int'},
	          {name: 'transDate',
	        	  convert: function (value, record) {
	         		 	if (Ext.isDate(value)){
	         		 		return Ext.Date.format(value, 'd/m/Y');
	         	 		}else{
	         	 			return value;
	         	 		}
	         	      }},
	          {name: 'inspectedDate',
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
       	      {name: 'receiveDate',
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
	          {name: 'inspector',type: 'string'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'itemId',
        min: 1
    },{
        type: 'length',
        field: 'itemName',
        min: 1
    }]
});