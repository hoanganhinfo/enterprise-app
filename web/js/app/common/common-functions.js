/**
 * @author    hienht
 * @copyright (c) 2008, by Unicom
 * @date      1. November 2008
 */
 
function createLiveCombo(ds, cboId, width, valueField, displayField) {
    // Custom rendering Template
    var resultTpl = new Ext.XTemplate(
        '<tpl for="."><div class="search-item">',
            '<h3><span>{' + displayField + '}<br/></h3>',
        '</div></tpl>'
    );
    var cbo = new Ext.form.ComboBox({
    	id: cboId,
        store: ds,
        valueField : valueField,
        typeAhead: true,
        loadingText: 'Searching...',
        width: width,
        hideTrigger: true,
        minChars : 1,
        tpl: resultTpl,
        stateful: false, ///
        itemSelector: 'div.search-item',
        enableKeyEvents: true,
        cls: 'x-type-livecombo',
        onSelect: function(record) { 
        	var val = this.getRawValue();
        	if (val.length != 0){
        		var lastpos = val.lastIndexOf(',');
        		val = val.substring(0,lastpos+1);
        	}
        	this.setRawValue(val + record.get(valueField));
        	this.collapse();
        }
    });
    cbo.addListener('keydown',function(textfield,e) {
    	var code = e.getKey();
    	if ((code >=65 && code <= 90) ||
	    	(code >=96 && code <= 105) || 
	    	code == Ext.EventObject.BACKSPACE || 
	    	code == Ext.EventObject.DELETE ||
	    	code == Ext.EventObject.LEFT ||
	    	code == Ext.EventObject.RIGHT ||
	    	code == 188 || code == 16 ||
	    	code == 35 || code == 36) 
		{
    		if (textfield.getRawValue().length == 0){
    			cbo.setValue("");
    		}
    	}
    	else {
    		e.stopEvent();
    		return;
    	}
    });
    cbo.addListener('beforequery',function(queryEvent) {
     	var queryString = queryEvent.query;
     	var lastpos = queryString.lastIndexOf(',');
     	var length = queryString.length;
     	if (lastpos==length-1) {
     		queryEvent.cancel = true;
     	}
     	if (lastpos > 0) {
     		queryEvent.query = queryString.substring(lastpos+1);
     	}
    });
    return cbo;
}

/* Check if toDate greater/equal with fromDate or not */
function checkTwoDate(fromDateId, toDateId) {
	var fromDate = new Date( Ext.getCmp(fromDateId).getValue() );
	var toDate = new Date( Ext.getCmp(toDateId).getValue() );
	return toDate >= fromDate;
}

function decorateStr(str) {
	return '<font style="font-weight: bold">' + str + '</font>';
}

function enableTbbuttons(btnIds) {
	for(var i= 0; i < btnIds.length; i++) {
		Ext.getCmp(btnIds[i]).enable();
	}
}
function disableTbbuttons(btnIds) {
	for(var i= 0; i < btnIds.length; i++) {
		Ext.getCmp(btnIds[i]).disable();
	}
}

function get(elementId) {
	return document.getElementById(elementId);
}