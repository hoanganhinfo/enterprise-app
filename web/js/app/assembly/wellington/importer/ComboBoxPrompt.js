Ext.define('EAP.Window.ComboBoxPrompt', {
        extend: 'Ext.window.MessageBox',
        comboBoxField: null,
        initComponent: function () {
                this.callParent();
                var index = this.promptContainer.items.indexOf(this.textField);
                this.promptContainer.remove(this.textField);  // remove standard prompt
                //this.textField = this._createComboBoxField();
                this.textField = this.comboBoxField;
                this.promptContainer.insert(index, this.textField);
        },

        _createComboBoxField: function () {
                //copy paste what is being done in the initComonent to create the combobox
                return Ext.create('Ext.form.field.ComboBox', {

                        id: this.id + '-combo',

                        typeAhead: true,
                        displayField: 'value',
                        valueField: 'id',
                        store: shipmentStore,
                        mode: 'local',  // local
                        triggerAction: 'all',
                        forceSelection: true,
                        editable: true,
                        autoSelect: false,
                        //hideTrigger: true,
                        minChars: 1,

                        enableKeyEvents: true,

                        listeners: {
                                change: function (obj, newValue, oldValue, eOpts) {
                                        //someStore.proxy.extraParams.keyword = newValue;
                                        //someStore.load();
                                }
                        }  // listeners





                });
        }
});