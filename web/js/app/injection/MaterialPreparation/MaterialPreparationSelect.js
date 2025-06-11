var GET_MOLD_LIST = '/enterprise-app/service/getMoldList';
var GET_MOLD_LIST_BY_COLOR = '/enterprise-app/service/getMoldListByColor';
var moldJson = null;
Ext.define('Inj.Panel.MaterialPreparationSelect', {
	extend : 'Ext.form.Panel',
	required : [ 'Ext.data.*', 'Ext.state.*', 'Ext.grid.*',
			'Ext.form.ComboBox', 'Ext.form.FieldSet',
			'Ext.tip.QuickTipManager', 'Ext.toolbar.TextItem' ],
	moldCodeList : null,
	moldColorList : null,
	_grid1 : null,
	width : 'auto',
	height : 'auto',
	border : 0,
	layout : {
		type : 'hbox',
		align : 'stretch',
		pack : 'start'
	},
	initComponent : function() {
		this.items = [ this.initData() ], this.moldCodeList.on('select',
				function(combo, records, eOpts) {

					this.moldColorList.getStore().load({
						params : {
							moldCode : records[0].get('moldCode')
						}
					});
					_moldNumber_select = records[0].get('moldCode');
					this.reset();

				}, this);

		this.moldColorList.on('select', function(combo, records, eOpts) {
			Ext.getCmp('idgrid').getStore().load({
				params : {
					moldCode : records[0].get('moldCode'),
					color : records[0].get('color')
				}
			});
			_color_select = records[0].get('color');
			this.reset();

		}, this);

		this.callParent(arguments);
	},
	initData : function() {
		var _moldCodeListData = new Ext.data.JsonStore({
			autoLoad : true,
			fields : [ 'moldCode' ],
			proxy : {
				type : 'ajax',
				url : GET_MOLD_LIST,
				extraParams : {
					screentype : '3'
				},
				reader : {
					type : 'json',
					root : 'InjMoldList',
					idProperty : 'moldCode'
				}
			},
			listeners : {
				load : function(store, records, successful, eOpts) {
					if (this.moldCodeList.getStore().getTotalCount() > 0) {
						// this.moldCodeList.select(this.moldCodeList.getStore().getAt(0));
						this.moldCodeList.select(store.getAt(0));
						this.moldCodeList.fireEvent('select',
								this.moldCodeList, records);
					}
				},
				scope : this
			}
		});

		this.moldCodeList = new Ext.form.ComboBox({
			id : 'cboMoldNumber',
			inputId : 'cbMoldNumber',
			store : _moldCodeListData,
			labelAlign : 'right',
			fieldLabel : 'Mold Number',
			displayField : 'moldCode',
			valueField : 'moldCode',
			typeAhead : true,
			editable : false,
			width : 280,
			allowBlank : false,
			msgTarget : 'side',
			maxWidth : 280,
			// hideTrigger:true,
			triggerAction : 'all',
			queryMode : 'remote',
			minChars : 1,
			scope : this

		});

		var _moldColorListData = new Ext.data.JsonStore({
			// autoLoad : true,
			// autoSync: true,
			fields : [ 'moldCode', 'color' ],
			proxy : {
				type : 'ajax',
				url : GET_MOLD_LIST_BY_COLOR,
				reader : {
					type : 'json',
					root : 'InjMoldList',
					idProperty : 'color' // id
				}
			},
			listeners : {
				load : function(store, records, successful, operation, eOpts) {

					// this.moldColorList.reset();
					// this.moldColorList.getView().getSelectionModel().deselectAll();
					// alert('1');
					if (store.getTotalCount() > 0) {// alert('2');
						this.moldColorList.select(store.getAt(0));
						this.moldColorList.fireEvent('select',
								this.moldColorList, records);

					} else {
						/*
						 * Ext.Msg.show({ title:'Save Changes 1?', msg: 'is null
						 * roiiiiiiiiiii 11 ', buttons: Ext.Msg.YESNOCANCEL,
						 * icon: Ext.Msg.QUESTION });
						 */
					}

				},
				scope : this
			}
		});

		this.moldColorList = new Ext.form.ComboBox({
			id : 'cboColor',
			inputId : 'cbColorinput',
			store : _moldColorListData,
			labelAlign : 'right',
			fieldLabel : 'Color',
			displayField : 'color',
			valueField : 'color',
			typeAhead : true,
			loadingText : 'Searching...',
			labelWidth : 70,
			width : 220,
			editable : false,
			msgTarget : 'side',
			maxWidth : 220,
			// hideTrigger:true,
			queryMode : 'local',
			minChars : 1
		});

		/*
		 * this.moldColorList = new Ext.form.ComboBox({ id : 'cboColor',
		 * inputId: 'cbColor', store : _moldColorListData, labelAlign: 'right',
		 * fieldLabel: 'Color', displayField : 'color', valueField : 'color', //
		 * typeAhead : true, // editable: false, width: 280, // allowBlank:
		 * false, // msgTarget: 'side', maxWidth: 280//, // hideTrigger:true, //
		 * triggerAction : 'all', // queryMode : 'remote', // minChars : 1
		 * 
		 * });
		 */

		var _panel_c1 = Ext.create('Ext.panel.Panel', {
			layout : {
				type : 'hbox',
				align : 'stretch'
			},// ,pack: 'center' },
			border : false,
			margin : '10,0,30,0',
			items : [ this.moldCodeList, this.moldColorList ]
		});
		return _panel_c1;
	},
	reset : function() {
		_product_weight = 0.0;
		_runner_weight = 0.0;
		_regrind_rate = 0.0;
		_color_rate = 0.0;
		_constant_scrap = 0.0;
		_total_material_weight = 0.0;

		Ext.getCmp('id_new_resin_code').setRawValue('');
		Ext.getCmp('id_new_resin_name').setRawValue('');

		Ext.getCmp('id_regrind_resin_code').setRawValue('');
		Ext.getCmp('id_regrind_resin_name').setRawValue('');

		Ext.getCmp('id_masterbatch_code').setRawValue('');
		Ext.getCmp('id_masterbatch_name').setRawValue('');
		Ext.getCmp('id_mixed_material_internal_code').setRawValue('');
		Ext.getCmp('id_mixed_material_weight_available').setRawValue('');
		// ----
		Ext.getCmp('id_total_new_resin_weight').setRawValue('');
		Ext.getCmp('id_total_regrind_resin_weight').setRawValue('');
		Ext.getCmp('id_total_masterbatch_weight').setRawValue('');
		Ext.getCmp('real_cavity_number').setRawValue('');

		Ext.getCmp('id_parts_quantity_prepared').setRawValue('');
		Ext.getCmp('id_parts_quantity_planned').setRawValue('');
		Ext.getCmp('id_mixed_material_weight_used').setRawValue('');

		Ext.getCmp('id_real_new_material_weight').setRawValue('');
		Ext.getCmp('id_real_regrind_weight').setRawValue('');
		Ext.getCmp('id_real_masterbatch_weight').setRawValue('');

		Ext.getCmp('id_regrind_shortage').setRawValue(false);
		Ext.getCmp('id_start_production').setRawValue(false);

		Ext.getCmp('id_real_new_material_weight').setDisabled(true);
		Ext.getCmp('id_real_regrind_weight').setDisabled(true);
		Ext.getCmp('id_real_masterbatch_weight').setDisabled(true);
		Ext.getCmp('id_mixed_material_weight_used').setDisabled(true);
		Ext.getCmp('real_cavity_number').setDisabled(true);
		Ext.getCmp('id_parts_quantity_planned').setDisabled(true);

		Ext.getCmp('id_start_production').setDisabled(true);
		Ext.getCmp('id_regrind_shortage').setDisabled(true);

		//Ext.getCmp('id_regrind_resin_20kg').setRawValue('');
		//Ext.getCmp('id_masterbatch_20kg').setRawValue('');
		Ext.getCmp('frmInput').setTitle(' ')
	}

});
