function validateAOSmith(){
	var defects = "";
	var ventPressure = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].getValue());
	var tapPressure = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].getValue());
	var speed = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].getValue());
	var watt = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].getValue());
	var current = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].getValue());
	var vibration = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].getValue());	
	var blowerSerial = Ext.ComponentQuery.query('[name='+_instance+'_param_19]')[0].getValue();
	var hipot = Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].getValue();	
	var thermo = Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].getValue();
	var prerequisiteLabel = frmAction.prerequisiteLabel;
	var prerequisiteList = prerequisiteLabel.split(';');
	var myRe = /-{0,1}(\d+)(\.\d+)*/g;
//	var ventRange = myRe.exec(prerequisiteList[5]);
//	var tapRange = myRe.exec(prerequisiteList[6]);
	var ventRange = prerequisiteList[5].match(myRe);
	var tapRange = prerequisiteList[6].match(myRe);
	Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_19]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].clearInvalid();
	var isNumber = true;
	if (Ext.isNumber(vibration) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(tapPressure) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(ventPressure) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(speed) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(current) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(watt) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (isNumber == false){
		Ext.Message.show("Error",'Nhập giá trị sai',4000);
		return 'false';
	}
		
	if (vibration < 0){
		Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].markInvalid('Vibration >=0');
		Ext.Message.show("Error",'Vibration >=0',4000);
		return 'false';
	}
	Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].setValue(ventPressure);
	Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].setValue(tapPressure);
	Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].setValue(speed);
	Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].setValue(watt);
	Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].setValue(current);
	Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].setValue(vibration);
		
	if (blowerSerial.length != 35){
//		alert('Blower serial is not enough 35  character.Please check Blower serial again\n\nBlower serial không đủ 35 ký tự. Hãy nhập lại');
		Ext.ComponentQuery.query('[name='+_instance+'_param_19]')[0].markInvalid('Blower serial is not enough 35  character');
		Ext.Message.show("Error",'Blower serial is not enough 35  character. Please check Blower serial again<br/>Blower serial không đủ 35 ký tự. Hãy nhập lại',4000);
		return 'false';
	}
	if (frmAction.txtSerialNo.getRawValue().length != 11){
//		alert('Motor serial is not enough 11 characters.Please check motor serial again\n\nMotor serial không đủ 11 ký tự. Hãy nhập lại');
		frmAction.txtSerialNo.markInvalid('Motor serial is not enough 11 characters');
		Ext.Message.show("Error",'Motor serial is not enough 11 characters. Please check motor serial again<br/>Motor serial không đủ 11 ký tự. Hãy nhập lại',4000);
		return 'false';
	}
	
	if (ventPressure < parseFloat(ventRange[0])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].markInvalid('101');
		defects += "13;"; // code 101
	}
	if (ventPressure > parseFloat(ventRange[1])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].markInvalid('102');
		defects += "14;"; // code 102
	}
	if (tapPressure < parseFloat(tapRange[0])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].markInvalid('103');
		defects += "15;"; // code 103
	}
	if (tapPressure > parseFloat(tapRange[1])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].markInvalid('104');
		defects += "16;"; // code 104
	}
	 if (vibration  > 0.12){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_15]')[0].markInvalid('105');
		 defects += '17;'; // code 105
	 }
	 if (speed < 3300){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].markInvalid('106');
		 defects += '18;'; //106
	 }
	 if (speed > 3500){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].markInvalid('107');
		 defects += '19;'; // 107
	 }
	 if (current < 0.4){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].markInvalid('108');
		 defects += '20;'; // 108
	 }
	 if (current > 0.54){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].markInvalid('109');
		 defects += '21;'; // 109
	 }
	 if (watt < 47){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].markInvalid('110');
		 defects += '22;'; //110
	 }
	 if (watt > 56){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].markInvalid('111');
		 defects += '23;'; //111
	 }
	 if (hipot == 'NG'){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].markInvalid('113');
		 defects += '25;'; //113
	 }
	 if (thermo == 'NG'){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].markInvalid('112');
		 defects += '24;'; //112
	 }
	 return defects;
}
function validateAOSmithPDV(){
	var defects = "";
	var ventPressure = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].getValue());
	var tapPressure = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].getValue());
	var speed = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].getValue());
	var watt = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].getValue());
	var current = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].getValue());
	var intake = parseFloat(Ext.ComponentQuery.query('[name='+_instance+'_param_25]')[0].getValue());	
	var blowerSerial = Ext.ComponentQuery.query('[name='+_instance+'_param_19]')[0].getValue();
	var hipot = Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].getValue();	
	var thermo = Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].getValue();
	var prerequisiteLabel = frmAction.prerequisiteLabel;
	var prerequisiteList = prerequisiteLabel.split(';');
	var myRe = /-{0,1}(\d+)(\.\d+)*/g;
//	var ventRange = myRe.exec(prerequisiteList[5]);
//	var tapRange = myRe.exec(prerequisiteList[6]);
	var ventRange = prerequisiteList[5].match(myRe);
	var tapRange = prerequisiteList[6].match(myRe);
	Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_25]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_19]')[0].clearInvalid();
	Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].clearInvalid();
	var isNumber = true;
	if (Ext.isNumber(intake) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_25]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(tapPressure) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(ventPressure) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(speed) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(current) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (Ext.isNumber(watt) == false){
		Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].markInvalid('Giá trị phải là số');
		isNumber = false;
	}
	if (isNumber == false){
		Ext.Message.show("Error",'Nhập giá trị sai',4000);
		return 'false';
	}
		

	Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].setValue(ventPressure);
	Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].setValue(tapPressure);
	Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].setValue(speed);
	Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].setValue(watt);
	Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].setValue(current);
	Ext.ComponentQuery.query('[name='+_instance+'_param_25]')[0].setValue(intake);
		
	if (blowerSerial.length != 35){
//		alert('Blower serial is not enough 35  character.Please check Blower serial again\n\nBlower serial không đủ 35 ký tự. Hãy nhập lại');
		Ext.ComponentQuery.query('[name='+_instance+'_param_19]')[0].markInvalid('Blower serial is not enough 35  character');
		Ext.Message.show("Error",'Blower serial is not enough 35  character. Please check Blower serial again<br/>Blower serial không đủ 35 ký tự. Hãy nhập lại',4000);
		return 'false';
	}
	if (frmAction.txtSerialNo.getRawValue().length != 11){
//		alert('Motor serial is not enough 11 characters.Please check motor serial again\n\nMotor serial không đủ 11 ký tự. Hãy nhập lại');
		frmAction.txtSerialNo.markInvalid('Motor serial is not enough 11 characters');
		Ext.Message.show("Error",'Motor serial is not enough 11 characters. Please check motor serial again<br/>Motor serial không đủ 11 ký tự. Hãy nhập lại',4000);
		return 'false';
	}
	
	if (ventPressure < parseFloat(ventRange[0])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].markInvalid('101');
		defects += "13;"; // code 101
	}
	if (ventPressure > parseFloat(ventRange[1])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_13]')[0].markInvalid('102');
		defects += "14;"; // code 102
	}
	if (tapPressure < parseFloat(tapRange[0])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].markInvalid('103');
		defects += "15;"; // code 103
	}
	if (tapPressure > parseFloat(tapRange[1])){
		Ext.ComponentQuery.query('[name='+_instance+'_param_16]')[0].markInvalid('104');
		defects += "16;"; // code 104
	}

	 if (speed < 3300){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].markInvalid('106');
		 defects += '18;'; //106
	 }
	 if (speed > 3500){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_10]')[0].markInvalid('107');
		 defects += '19;'; // 107
	 }
	 if (current < 0.4){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].markInvalid('108');
		 defects += '20;'; // 108
	 }
	 if (current > 0.54){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_17]')[0].markInvalid('109');
		 defects += '21;'; // 109
	 }
	 if (watt < 47){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].markInvalid('110');
		 defects += '22;'; //110
	 }
	 if (watt > 56){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_14]')[0].markInvalid('111');
		 defects += '23;'; //111
	 }
	 if (hipot == 'NG'){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].markInvalid('113');
		 defects += '25;'; //113
	 }
	 if (thermo == 'NG'){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_20]')[0].markInvalid('112');
		 defects += '24;'; //112
	 }
	 return defects;
}
function validateWellington(){
	var defects = "";
	
	var hipot = Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].getValue();
	if (hipot == 'NG'){
		 Ext.ComponentQuery.query('[name='+_instance+'_param_18]')[0].markInvalid('113');
		 defects += '25;'; //113
	 }
	return defects;
}