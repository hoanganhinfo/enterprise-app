// Define the model for report
Ext.define('Report', {
    extend: 'Ext.data.Model',
    fields: [
        {type: 'int', name: 'id'},
        {type: 'string', name: 'text'},
        {type:'string', name:'url'}
    ],
    idProperty: 'id'
});

var ProductionReports = [
              {id:11,text:"Activation test",leaf : true, url:"/ewi/service/exportActivationTestToExcel?qcinspected=false&EWIQC=false&_3rdQC=false"},
              {id:12,text:"Automated test",leaf : true, url:"/ewi/service/exportAutomatedTestToExcel?qcinspected=false&EWIQC=false&_3rdQC=false"},
              {id:13,text:"Hipot test",leaf : true, url:"/ewi/service/exportHipotTestToExcel?qcinspected=false&EWIQC=false&_3rdQC=false"},
              {id:14,text:"Rework",leaf : true, url:"/ewi/service/exportReworkedTestToExcel"}
          ];
var QualityReports = [{id:14,text:"Component",leaf : true, url:"/ewi/service/exportComponentTestToExcel"},
                         {id:11,text:"Activation test",leaf : true, url:"/ewi/service/exportActivationTestToExcel?qcinspected=true&EWIQC=true&_3rdQC=true"},
                         {id:12,text:"Automated test",leaf : true, url:"/ewi/service/exportAutomatedTestToExcel?qcinspected=true&EWIQC=true&_3rdQC=true"},
                         {id:13,text:"Hipot test",leaf : true, url:"/ewi/service/exportHipotTestToExcel?qcinspected=true&EWIQC=true&_3rdQC=true"}
                         
                     ];

var groupProd1={id:1,text:"Group 1",leaf:false, expanded: true, children: ProductionReports};
var groupQuality1={id:1,text:"Group 1",leaf:false, expanded: true, children: QualityReports};


var store1 = Ext.create('Ext.data.TreeStore', {
    model: 'Report',
    proxy: {
        type: 'memory'
    },
    folderSort: true
});


