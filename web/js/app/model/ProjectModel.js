Ext.define('EAP.Model.Project', {
    extend: 'Ext.data.Model',
    fields: [{name:'id'				},
   			 {name:'name'			},
             {name:'projectTypeId'	},
             {name:'projectType'	},
             {name:'department_id'	},
             {name:'departmentName'	},
             {name:'clientname'		},
             {name:'manager'		},
             {name:'start_date'		,
	          convert: function (value, record) 
	          			{
	            		 	if (Ext.isDate(value))
	            		 		{
	     		 					return Ext.Date.format(value, 'd/m/Y');
	     	 					}
	     	 					else
	     	 					{
	            	 				return value;
	            	 			}
	         	      	}
         	 },
             {name:'end_date'		,
              convert: function(value, record)
              {
		              		if(Ext.isDate(value))
		              		{
		              			return Ext.Date.format(value,'d/m/Y');
		              		}
		              		else
		              		{
		              			return value;
		              		}
              }
             },
             {name:'status'}],
             idProperty: 'id',
             validations: [{
                 type: 'length',
                 field: 'name',
                 min: 1
             }]
});
          //type: 'date', dateFormat: 'n/j h:ia'


