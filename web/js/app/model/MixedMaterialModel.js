Ext.define('EAP.Model.MixedMaterial', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'int',useNull: true},
    		 {name: 'transdate'},
             {name:'mixed_material_code'},
             {name:'virgin_material_name'},
             {name:'regrind_material_name'},
             {name: 'regrind_rate', type: 'double'},
             {name:'color'},
             {name: 'mold_code'},
             {name:'part_name'},
             {name: 'userName'},
             {name: 'idorder', type:'int'},
             {name:'weight',type:'double'}],
    idProperty: 'id',
    validations: [{
        type: 'length',
        field: 'mixed_material_code',
        min: 1
    }]
});
