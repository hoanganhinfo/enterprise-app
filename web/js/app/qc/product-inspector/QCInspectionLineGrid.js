Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/enterprise-app/js/extjs4.1/examples/ux');
Ext.define('EAP.Grid.QCInspectionLineGrid', {
    extend: 'Ext.grid.Panel',
    xtype:'qcInspectionLineGrid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.ux.CheckColumn'
    ],
    //title: 'Asset category list',
    viewConfig: {
        emptyText: 'There are no records to display',
        deferEmptyText: false
    },
    defectStore: null,
    defectCode: '',
    defectName : '',
    initComponent: function(){
    	this.defectStore =  new Ext.data.JsonStore({
        	autoLoad : true,
    		model: 'EAP.Model.QcInspectionDefectModel',
        	//pageSize: 30,
        	proxy: {
                type: 'ajax',
              //  extraParams :{itemId:userId},
                url: '/enterprise-app/service/getQcInspectionDefectActiveList',
                reader: {
                    type: 'json',
                    root: 'QCInspectionDefectList',
                    idProperty: 'id'
                }
            }
        });
        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });

        Ext.apply(this, {
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scale : 'medium',
                    itemId: 'addInspectionLine',
                    disabled: true,
                    scope: this,
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-delete',
                    scale : 'medium',
                    text: 'Delete',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                }]
            }],
            columns: [{header: 'Defect name',sortable: true,dataIndex: 'defectCode',
      			renderer:function(value,metaData,record){
    				return record.data.defectName;
        		},
                  editor: new Ext.form.field.ComboBox({
                      selectOnTab: true,
                      displayField : 'defectNameEN',
              		   valueField : 'defectCode',
              		   id:'defect_col',
                      store: this.defectStore,
                      editable: false,
                      cls: 'x-defect-combo',
                      queryMode: 'local',
                      matchFieldWidth: false,
                      scope: this,
                      //minChars: 4,
                      listConfig: {
	                         loadingText: 'Searching...',
	                         emptyText: 'No matching items found.',
	                         width: 250,
	                         // Custom rendering template for each item
	                         getInnerTpl: function() {
	                             return '<div class="search-item">' +
	                                 '<h3><span>{defectCode}  -  {defectNameEN}</span></h3>' +
	                             '</div>';
	                         }
                      },
                      listeners:{
                          			 select: function(combo, records,opt) {
                          				this.defectName = records[0].get('defectNameEN');

                                     },
                          	scope: this
                  		}
                  })}, {
	            	header: 'Defect qty',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'defectQty',
	                field: {
	                    type: 'textfield'
	                }
                 },{header: 'Defect level',sortable: true,dataIndex: 'defectLevel',
//           			renderer:function(value,metaData,record){
//        				return record.data.defectLevelName;
//            		},
                      editor: new Ext.form.field.ComboBox({
                          selectOnTab: true,
                          displayField : 'name',
                  		   valueField : 'name',
                          store: defectLevelStore,
                          editable: false,
                          queryMode: 'local',
                          scope: this,
                          listeners:{
                              			 select: function(combo, records,opt) {
//                              				this.defectLevelName = records[0].get('defectLevelName');

                                         },
                              	scope: this
                      		}
                      })},{
	            	header: 'Memo',
	                flex: 1,
	                sortable: true,
	                dataIndex: 'memo',
	                field: {
	                    type: 'textfield'
	                }
                 }],
          selModel: {
            selType: 'cellmodel'
        	},
        });
        this.callParent(arguments);
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        this.store.on('load', function( store, records, successful, eOpts){
        	this.down('#addInspectionLine').setDisabled(false);
        	//alert(e.field);
        	//departmentCombo.select(departmentCombo.getStore().getAt(0));
        	//departmentCombo.fireEvent('select', departmentCombo,departmentCombo.getStore().getRange(0,0));

        },this);
        this.on('edit', function(editor,e){
        	//alert(e.field);
        	if(e.field == 'defectCode'){
            	e.record.set('defectName', this.defectName);
            }
        	var totalCritical = 0;
        	var totalMajor = 0;
        	var totalMinor = 0;
        	this.store.each(function(r) {
        		var level = r.get('defectLevel');
        		if (level == 'Critical'){
        			totalCritical+=r.get('defectQty');
        		}else if(level == 'Major'){
        			totalMajor+=r.get('defectQty');
        		}else if(level == 'Minor'){
        			totalMinor+=r.get('defectQty');
        		}

        	});
        	this.up('#inspectionInputPanel').selectedRecord.set('criticalQty',totalCritical);
        	this.up('#inspectionInputPanel').selectedRecord.set('majorQty',totalMajor);
        	this.up('#inspectionInputPanel').selectedRecord.set('minorQty',totalMinor);
        	this.up('#inspectionInputPanel').inspectionTableStore.sync();
        },this);
    },

    onSelectChange: function(selModel, selections){
    	this.down('#delete').setDisabled(selections.length === 0);
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
		Ext.Msg.show({
			title : 'Defect code',
			msg : 'Are you sure to delete selected row',
			icon : Ext.Msg.QUESTION,
			buttons : Ext.Msg.YESNO,
			scope: this,
			defaultFocus: 2,
			fn : function(buttonId) {
				if (buttonId != 'yes'){
					return;
				}
		        if (selection) {
		            this.store.remove(selection);
		        }

			},
			icon : Ext.MessageBox.QUESTION
		});
    },

    onAddClick: function(){
        var rec = new EAP.Model.QCInspectionLine({
        	inspectorId: this.up('#inspectionInputPanel').inspectionId
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
    }
});