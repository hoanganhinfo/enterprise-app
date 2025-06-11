Ext.define("EAP.GridExporter", {
dateFormat : 'Y-m-d g:i',

exportGrid: function(grid) {
	var data, filename, link;
	data = this._getCSV(grid);
	if (window.navigator.msSaveBlob) { // IE
    	console.log('IE');
    	var blob = new Blob([data], {type:  "text/plain;charset=utf-8;"});
    	window.navigator.msSaveOrOpenBlob(blob, "export.csv")

    } else {
    	console.log('Firefox/Chrome');
        uriContent = "data:application/csv;filename=download.csv," + encodeURIComponent(data);
        link = document.getElementById('downloadLink');
        link.setAttribute('href', uriContent);
        link.setAttribute('download', "export.csv");
        link.click();

    }
},

_escapeForCSV: function(string) {
    if (string.match(/,/)) {
        if (!string.match(/"/)) {
            string = '"' + string + '"';
        } else {
            string = string.replace(/,/g, ''); // comma's and quotes-- sorry, just loose the commas
        }
    }
    return string;
},

_getFieldText: function(fieldData) {
    var text;

    if (fieldData == null || fieldData == undefined) {
        text = '';

    } else if (fieldData._refObjectName && !fieldData.getMonth) {
        text = fieldData._refObjectName;

    } else if (fieldData instanceof Date) {
        text = Ext.Date.format(fieldData, this.dateFormat);

    } else if (!fieldData.match) { // not a string or object we recognize...bank it out
        text = '';

    } else {
        text = fieldData;
    }

    return text;
},

_getFieldTextAndEscape: function(fieldData) {
    var string  = this._getFieldText(fieldData);

    return this._escapeForCSV(string);
},

_getCSV: function (grid) {
    var cols    = grid.columns;
    var store   = grid.store;
    var data    = '';

    var that = this;
    Ext.Array.each(cols, function(col, index) {
        if (col.hidden != true) {
            data += that._getFieldTextAndEscape(col.text) + ',';
        }
    });
    data += "\n";

    store.each(function(record) {
        var entry       = record.getData();
        Ext.Array.each(cols, function(col, index) {
            if (col.hidden != true) {
                var fieldName   = col.dataIndex;
                var text        = entry[fieldName];

                data += that._getFieldTextAndEscape(text) + ',';
            }
        });
        data += "\n";
    });

    return data;
},

_ieGetGridData : function(grid, sheet) {
    var that            = this;
    var resourceItems   = grid.store.data.items;
    var cols            = grid.columns;

    Ext.Array.each(cols, function(col, colIndex) {
        if (col.hidden != true) {
            console.log('header: ', col.text);
            sheet.cells(1,colIndex + 1).value = col.text;
        }
    });

    var rowIndex = 2;
    grid.store.each(function(record) {
        var entry   = record.getData();

        Ext.Array.each(cols, function(col, colIndex) {
            if (col.hidden != true) {
                var fieldName   = col.dataIndex;
                var text        = entry[fieldName];
                var value       = that._getFieldText(text);

                sheet.cells(rowIndex, colIndex+1).value = value;
            }
        });
        rowIndex++;
    });
},

_ieToExcel: function (grid) {
    if (window.ActiveXObject){
        var  xlApp, xlBook;
        try {
            xlApp = new ActiveXObject("Excel.Application"); 
            xlBook = xlApp.Workbooks.Add();
        } catch (e) {
            Ext.Msg.alert('Error', 'For the export to work in IE, you have to enable a security setting called "Initialize and script ActiveX control not marked as safe" from Internet Options -> Security -> Custom level..."');
            return;
        }

        xlBook.worksheets("Sheet1").activate;
        var XlSheet = xlBook.activeSheet;
        xlApp.visible = true; 

       this._ieGetGridData(grid, XlSheet);
       XlSheet.columns.autofit; 
    }
}});