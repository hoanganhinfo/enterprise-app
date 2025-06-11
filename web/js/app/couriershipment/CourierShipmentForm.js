Ext.Loader.setConfig({
    enabled: true
});
Ext.define('EAP.Form.CourierShipmentForm', {
    extend: 'Ext.window.Window',
    alias : 'widget.courierShipmentForm',
    requires: [
        //'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
    layout: {
	      type: 'table',
	      columns: 2,
	      tableAttrs: {
	         style: {
	          //  width: '100%'
	         }
	      }
	},
    title: 'Courier shipment',
    resizable: false,
    shipmentModel: null,
    shipmentStore : null,
    departmentStore: null,
    readOnly: false,
    //width: 600,
    initComponent: function(){
    	
    	this.bbar = ['->',
     	            { xtype: 'button', scope: this, text: 'Submit',handler: this.onSave,disabled: this.readOnly },
     	            { xtype: 'button', scope: this, text: 'Close',handler: this.onClose }
     	          ];
        this.items = [{
        	
        	    xtype:"combo",
        	    fieldLabel:"Shipment by",
        	    name:"combovalue",
        	    readOnly: this.readOnly,
        	    allowBlank: false,
        	    store:['Fedex','UPS','DHL','TNT','Sagawa','Viettel'],
        	    id : 'txtShipmentBy',
        	  },{
        	    xtype:"datefield",
        	    fieldLabel:"Date",
        	    readOnly: this.readOnly,
        	    name:"datevalue",
        	    format: 'd/m/Y',
        	    allowBlank: false,
        	    renderer: Ext.util.Format.dateRenderer('d/m/Y'),
        	    id : 'txtDocumentDate',
        	    labelAlign: 'right'
        	  },{
        	    xtype:"textfield",
        	    fieldLabel:"Sender",
        	    readOnly: this.readOnly,
        	    allowBlank: false,
        	    id: 'txtSender',
        	    width: 500	,
        	    colspan:2,
        	  },{
        	    xtype:"combo",
        	    fieldLabel:"Department",
        	    id: 'txtDepartment',
        	    readOnly: this.readOnly,
        	    displayField : 'orgName',
    	    	valueField : 'orgId',
    	    	editable: false,
    	    	allowBlank: false,
        	    store : this.departmentStore
        	  },{
        	    xtype:"combo",
        	    fieldLabel:"Payment by",
        	    store:['EWI','EWM','EWA'],
        	    readOnly: this.readOnly,
        	    allowBlank: false,
        	    name:"combovalue",
        	    id: 'txtPaymentBy',
        	    hiddenName:"combovalue",
        	    labelAlign: 'right'
        	  },{
        	    title:"Ship to",
        	    colspan:2,
        	    width:500,
        	    //height: 200,
        	    items:[{
        	        xtype:"combo",
        	        fieldLabel:"Company name",
        	        store: shipmentToDS,
        	        readOnly: this.readOnly,
        	        displayField : 'company',
        	        valueField : 'id',
        	        editable: true,
        	    	valueField : 'company',
        	        name:"textvalue",
        	        id :'txtCompanyAddress',
        	        width: 500,
        	        listeners: {
        	        	select( combo, records, eOpts ){
        	        		var rec = records[0];
        	        		console.log(rec.get('address'));
        	        		Ext.getCmp('txtAddress').setValue(rec.get('address'));
        	        		Ext.getCmp('txtContactName').setValue(rec.get('contactperson'));
        	        		
        	        	}
        	        }
        	      },{
        	        xtype:"textfield",
        	        fieldLabel:"Contact name",
        	        readOnly: this.readOnly,
        	        id :'txtContactName',
        	        name:"textvalue",
        	        width: 500,
        	      },{
        	        xtype:"textareafield",
        	        allowBlank: false,
        	        fieldLabel:"Address",
        	        grow: true,
        	        cls : 'text-address',
        	        fieldStyle: '80px !important',
        	        readOnly: this.readOnly,
        	       // rows : 7,
        	        id :'txtAddress',
        	        width: 500,
        	      }]
        	  },{
        	    xtype:"textfield",
        	    fieldLabel:"Your reference",
        	    readOnly: this.readOnly,
        	    id:"txtReference",
        	    width: 500,
        	    colspan:2,
        	  },{
        	        xtype: 'checkboxgroup',
        	        fieldLabel: 'Service type',
        	        readOnly: this.readOnly,
        	        name: 'ServiceType',
        	        id: 'ServiceType',
        	        // Arrange radio buttons into two columns, distributed vertically
        	        columns: 1,
        	        colspan:2,
        	        vertical: true,
        	        items: [
        	            { boxLabel: 'Economy (default)', id: 'Economy',width: 125, inputValue: 'Economy', checked: true,listeners: {
                            scope: this,
                            readOnly: this.readOnly,
                            change: function(chkbox,newVal,oldVal,eOpts) {
                            	if (chkbox.getValue()) {
                            		Ext.getCmp('Priority').setValue(false);
                                }
                               
                            }
                        }},
        	            { boxLabel: 'Priority (urgent case - requires BOD or Customer approval)',  width: 350,id: 'Priority', inputValue: 'Priority',listeners: {
                            scope: this,
                            readOnly: this.readOnly,
                            change: function(chkbox,newVal,oldVal,eOpts) {
                            	if (chkbox.getValue()) {
                            		Ext.getCmp('Economy').setValue(false);
                                }
                               
                            }
                        }}
        	        ]
        	    },{
                	
            	    xtype:"combo",
            	    fieldLabel:"How many package",
            	    readOnly: this.readOnly,
            	    allowBlank: false,
            	    store:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32'],
            	    id : 'txtPackage'
            	  },{
        	    xtype:"textfield",
        	    fieldLabel:"Weight (kg)",
        	    name:"textvalue",
        	    readOnly: this.readOnly,
        	    id: 'txtWeight',
        	    labelAlign: 'right'
        	  },{
        	    xtype:"fieldset",
        	    title:"Size (cm)",
        	    readOnly: this.readOnly,
        	    colspan:2,
        	    width: 500,
        	    padding: 5,
        	    items:[{
            	    xtype:"panel",
            	    preventHeader : true,
            	    border: 0,
            	    layout: {
            	        type: 'hbox',
            	        pack: 'start',
            	        align: 'align' 
            	      },
            	    items:[{
            	        xtype:"textfield",
            	        fieldLabel:"Length",
            	        readOnly: this.readOnly,
            	        name:"Length",
            	        width: 166,
            	        id :'txtLength',
            	        maxLength : 10,
            	        labelWidth: 50,
            	        labelAlign: 'right'
            	      },{
            	        xtype:"textfield",
            	        readOnly: this.readOnly,
            	        fieldLabel:"Width",
            	        maxLength : 10,
            	        id: 'txtWidth',
            	        name:"Width",
            	        width: 166,
            	        labelWidth: 50,
            	        labelAlign: 'right'
            	        
            	      },{
            	        xtype:"textfield",
            	        fieldLabel:"Height",
            	        readOnly: this.readOnly,
            	        id: 'txtHeight',
            	        maxLength : 10,
            	        name:"Height",
            	        width: 166,	
            	        labelWidth: 50,
            	        labelAlign: 'right'
            	      }]
            	  }]
        	  },{
      	        xtype: 'checkboxgroup',
    	        fieldLabel: 'Shipment purpose',
    	        readOnly: this.readOnly,
    	        name: 'ShipmentPurpose',
    	        // Arrange radio buttons into two columns, distributed vertically
    	        columns: 4,
    	        colspan:2,
    	        vertical: true,
    	        items: [
    	            { boxLabel: 'Commercial', id: 'Commercial',width: 90,readOnly: this.readOnly, inputValue: 'Commercial',},
    	            { boxLabel: 'Sample',  width: 90,id: 'Sample',readOnly: this.readOnly, inputValue: 'Sample' },
    	            { boxLabel: 'Document',  width: 90,id: 'Document',readOnly: this.readOnly, inputValue: 'Document' },
    	            { boxLabel: 'Other',  width: 90,id: 'Other', readOnly: this.readOnly,inputValue: 'Other' }
    	        ]
    	    },{
        	    xtype:"fieldset",
        	    title:"",
        	    border: 0,
        	    colspan:2,
        	    readOnly: this.readOnly,
        	    width: 500,
        	    padding: 5,
        	    items:[{
            	    xtype:"panel",
            	    preventHeader : true,
            	    border: 0,
            	    layout: {
            	        type: 'hbox',
            	        pack: 'start',
            	        align: 'align' 
            	      },
            	    items:[{
            	        xtype:"checkbox",
            	        boxLabel:"Customs",
            	        name:"Customs",
            	        id : 'txtCustoms',
            	        readOnly: this.readOnly,
            	        width: 80
            	        
            	      }]
            	  }]
        	  }
        	  ];
       
       
        this.callParent(arguments);
        
        if (this.shipmentModel != null){
        	Ext.getCmp('txtShipmentBy').setRawValue(this.shipmentModel.get('shipmentby'));
        	Ext.getCmp('txtDocumentDate').setValue(this.shipmentModel.get('document_date'));
        	Ext.getCmp('txtSender').setRawValue(this.shipmentModel.get('sender'));
        	Ext.getCmp('txtDepartment').setRawValue(this.shipmentModel.get('department'));
        	Ext.getCmp('txtPaymentBy').setRawValue(this.shipmentModel.get('paymentby'));
        	Ext.getCmp('txtCompanyAddress').setRawValue(this.shipmentModel.get('shipmentCompany'));
        	Ext.getCmp('txtContactName').setRawValue(this.shipmentModel.get('shipmentContact'));
        	Ext.getCmp('txtAddress').setRawValue(this.shipmentModel.get('shipmentAddress'));
        	Ext.getCmp('txtReference').setRawValue(this.shipmentModel.get('reference_note'));
        	console.log(this.shipmentModel.get('service_type'));
        	if (this.shipmentModel.get('service_type') == 'Economy'){
        		Ext.getCmp('Economy').setValue(true);
        		Ext.getCmp('Priority').setValue(false);
        	}else{
        		Ext.getCmp('Economy').setValue(false);
        		Ext.getCmp('Priority').setValue(true);
        	}
        	Ext.getCmp('txtPackage').setRawValue(this.shipmentModel.get('package_qty'));
        	Ext.getCmp('txtWeight').setRawValue(this.shipmentModel.get('weight'));
        	Ext.getCmp('txtLength').setRawValue(this.shipmentModel.get('length'));
        	Ext.getCmp('txtWidth').setRawValue(this.shipmentModel.get('width'));
        	Ext.getCmp('txtHeight').setRawValue(this.shipmentModel.get('height'));
        	var shipment_purpose = this.shipmentModel.get('shipment_purpose');
        	console.log(shipment_purpose);
        	var purposeList = shipment_purpose.split("#");
        	for(var i=0;i<purposeList.length;i++){
        		var purpose = purposeList[i];
        		console.log(purpose);
        		if (purpose == 'Commercial'){
        			Ext.getCmp('Commercial').setValue(true);
        		}
        		if (purpose == 'Sample'){
        			Ext.getCmp('Sample').setValue(true);
        		}
        		if (purpose == 'Document'){
        			Ext.getCmp('Document').setValue(true);
        		}
        		if (purpose == 'Other'){
        			Ext.getCmp('Other').setValue(true);
        		}
        	}
        	
        	//Ext.getCmp('txtInvoiced').setValue(this.shipmentModel.get('invoiced'));
        	//Ext.getCmp('txtPostedPS').setValue(this.shipmentModel.get('posted_PS'));
        	//Ext.getCmp('txtPostedPS').setValue(this.shipmentModel.get('PS_no'));
        	Ext.getCmp('txtCustoms').setValue(this.shipmentModel.get('customs'));
        }else{
        	Ext.getCmp('txtShipmentBy').setRawValue("FedEx");
        	Ext.getCmp('txtSender').setRawValue(userName);
        	Ext.getCmp('txtDocumentDate').setValue(new Date());
        	Ext.getCmp('txtDepartment').setRawValue(myOrgs);
        	
        }
       
    },
	onSave: function() {
	  var shipmentPurpose = "";
	  if (Ext.getCmp('Commercial').getValue()){
		  shipmentPurpose += '#Commercial';
	  }
	  if (Ext.getCmp('Sample').getValue()){
		  shipmentPurpose += '#Sample';
	  }
	  if (Ext.getCmp('Document').getValue()){
		  shipmentPurpose += '#Document';
	  }
	  if (Ext.getCmp('Other').getValue()){
		  shipmentPurpose += '#Other';
	  }
      
      if (this.shipmentModel == null){
    	  var rec = new EAP.Model.CourierShipmentModel({
    	    	id:null,
    	    	//emailTo: myOrgEmail,
    	    	status: 'Open', // Open
    	    	shipmentby : Ext.getCmp('txtShipmentBy').getRawValue(),
    	    	document_date : Ext.getCmp('txtDocumentDate').getRawValue(),
    	    	sender: Ext.getCmp('txtSender').getValue(),
    	    	department : Ext.getCmp('txtDepartment').getRawValue(),
    	    	paymentby: Ext.getCmp('txtPaymentBy').getRawValue(),
    	    	shipmentCompany : Ext.getCmp('txtCompanyAddress').getValue(),
    	    	shipmentContact : Ext.getCmp('txtContactName').getValue(),
    	    	shipmentAddress : Ext.getCmp('txtAddress').getValue(),
    	    	reference_note : Ext.getCmp('txtReference').getValue(),
    	    	service_type: Ext.getCmp('Economy').getValue()==true?"Economy":"Priority",
    	    	package_qty : Ext.getCmp('txtPackage').getValue(),
    	    	weight : Ext.getCmp('txtWeight').getValue(),
    	    	length : Ext.getCmp('txtLength').getValue(),
    	    	width : Ext.getCmp('txtWidth').getValue(),
    	    	height : Ext.getCmp('txtHeight').getValue(),
    	    	shipment_purpose: shipmentPurpose,
    	    	approver : '',
    	    	//PS_no : Ext.getCmp('txtPO').getValue(),
    	    	//invoiced : Ext.getCmp('txtInvoiced').getValue(),
    	    	//posted_PS : Ext.getCmp('txtPostedPS').getValue(),
    	    	customs: Ext.getCmp('txtCustoms').getValue(),
    	    	createdby: userName,
    	    	//creatorEmail: userEmail
    	    });
    	  this.shipmentStore.insert(0, rec);  
      }else{
    	  //grid.reconfigure(store)
    	  this.shipmentModel.beginEdit();
    	  this.shipmentModel.set('status','Open');
    	  this.shipmentModel.set('shipmentby',Ext.getCmp('txtShipmentBy').getRawValue());
    	  this.shipmentModel.set('document_date',Ext.getCmp('txtDocumentDate').getRawValue());
    	  this.shipmentModel.set('sender',Ext.getCmp('txtSender').getValue());
    	  this.shipmentModel.set('department',Ext.getCmp('txtDepartment').getRawValue());
    	  this.shipmentModel.set('paymentby',Ext.getCmp('txtPaymentBy').getValue());
    	  this.shipmentModel.set('shipmentCompany',Ext.getCmp('txtCompanyAddress').getValue());
    	  this.shipmentModel.set('shipmentContact',Ext.getCmp('txtContactName').getValue());
    	  this.shipmentModel.set('shipmentAddress',Ext.getCmp('txtAddress').getValue());
    	  this.shipmentModel.set('reference_note',Ext.getCmp('txtReference').getValue());
    	  this.shipmentModel.set('service_type',Ext.getCmp('Economy').getValue()==true?"Economy":"Priority");
    	  this.shipmentModel.set('package_qty',Ext.getCmp('txtPackage').getValue());
    	  this.shipmentModel.set('weight',Ext.getCmp('txtWeight').getValue());
    	  this.shipmentModel.set('length',Ext.getCmp('txtLength').getValue());
    	  this.shipmentModel.set('width',Ext.getCmp('txtWidth').getValue());
    	  this.shipmentModel.set('height',Ext.getCmp('txtHeight').getValue());
    	  this.shipmentModel.set('shipment_purpose',shipmentPurpose);
    	  
    	  //this.shipmentModel.set('PS_no',Ext.getCmp('txtPO').getValue());
    	  //this.shipmentModel.set('invoiced',Ext.getCmp('txtInvoiced').getValue());
    	  //this.shipmentModel.set('posted_PS',Ext.getCmp('txtPostedPS').getValue());
    	  this.shipmentModel.set('customs',Ext.getCmp('txtCustoms').getValue());
    	  this.shipmentModel.endEdit();
    	  this.shipmentStore.commitChanges();
    	  
    	  
    	  
      }
      
      
      this.close();
    
	},
	onClose: function(){
		//this.reloadFn();
		this.close();
//		Ext.getCmp("cbPriority").setValue(2);
//		Ext.getCmp("cbStatus").setValue(2);
	}
    
  
});