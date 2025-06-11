// Define the model for a Screen
Ext.define('EAP.Model.WellingtoMotor', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',type: 'int',useNull: true},
        {type: 'string', name: 'code'},
        {type: 'string', name: 'name'},
        {name: 'active'},
        {name: 'hasFinalTest'},
        {type: 'int', name: 'maxQty'}
    ],
    validations: [{
        type: 'length',
        field: 'code',
        min: 1
    }]
});
var wellingtonMotorsData = [
	{"code":"ECR01A0193","name":"ECR01A0193"},
	{"code":"ECR01A0241","name":"ECR01A0241"},
	{"code":"ECR01A0242","name":"ECR01A0242"},
	{"code":"ECR01A0243","name":"ECR01A0243"},
	{"code":"ECR01A0283","name":"ECR01A0283"},
	{"code":"ECR01A0B93","name":"ECR01A0B93"},
	{"code":"ECR01A0C13","name":"ECR01A0C13"},
	{"code":"ECR01B0016","name":"ECR01B0016"},
	{"code":"ECR01B0242","name":"ECR01B0242"},
	{"code":"ECR01B0655","name":"ECR01B0655"},
	{"code":"ECR01B0A76","name":"ECR01B0A76"},
	{"code":"ECR01B0C95","name":"ECR01B0C95"},
	{"code":"ECR01BX893","name":"ECR01BX893"},
	{"code":"ECR82P0081","name":"ECR82P0081"},
	{"code":"ECR82P0152","name":"ECR82P0152"},
	{"code":"ECR82PIA11","name":"ECR82PIA11"},
	{"code":"ECR82PIA12","name":"ECR82PIA12"},
	{"code":"ECR82PX081","name":"ECR82PX081"},
	{"code":"ECR82PX021","name":"ECR82PX021"},
	{"code":"ECR92PIA12","name":"ECR92PIA12"},
	{"code":"ECR2-0141" ,"name":"ECR2-0141"},
	{"code":"ECR2-0191" ,"name":"ECR2-0191"},
	{"code":"ECR2-0201" ,"name":"ECR2-0201"}
	];


