function DateDiff(toDate, fromDate, diffType){
	return Date.DateDiff(diffType, fromDate, toDate, 2);
}

function DateAdd(calcDate, value, type){
	return Date.DateAdd(type, value, calcDate);
}

function BondInfo(){
	// default value
	this.IssueDate = new Date();	
	this.SettlementDate = new Date();
	this.Term = 15;
	this.ExpiryDate = function(){
		return DateAdd(this.IssueDate, this.Term, "y");
	}
	this.Coupon = 15; // %
	this.DealVolume = 0;
	this.Value = 0;
	this.Frequency = 1;
	this.Yield2Maturity = -1; //%
	this.Price = 10000; //yrs
	this.RedemptionRatio = 100; //%	
}

function BondCalculation(bondInfo){
	var bond = bondInfo;

	this.GetYield2Maturity = function(){
		var y = 100 * (((bond.Coupon/100)/bond.Frequency) * this.GetFaceValue() + (this.GetRedemption() - bond.Price)/(this.GetReturnTimes() - 1 + this.GetDSC()/this.GetTotalInterestDayOfCurrentDate()))/((this.GetRedemption() + 2 * bond.Price) /3);
		bond.Yield2Maturity = y;
		return y;
	}

	this.GetFaceValue = function(){
		return bond.Value/bond.DealVolume;
	}

	this.GetRedemption = function(){
		return this.GetFaceValue() * bond.RedemptionRatio/100;
	}

	this.GetUnpayableDuration = function(){
		var dateDiffNow = DateDiff(bond.SettlementDate, bond.IssueDate, 'm');
		return Math.round(dateDiffNow/(12/bond.Frequency) + 0.5) - 1;
	}
	
	this.GetNextCouponDate = function(){
		return DateAdd(bond.IssueDate, (12/bond.Frequency) * (this.GetUnpayableDuration() + 1), 'm')
	}

	this.GetPreviousCouponDate = function(){
		return DateAdd(this.GetNextCouponDate(), -12/bond.Frequency, 'm');
	}

	this.GetDSC = function(){
		return DateDiff(this.GetNextCouponDate(), bond.SettlementDate, 'd');
	}

	this.GetReturnTimes = function(){
		return bond.Term * bond.Frequency - this.GetUnpayableDuration();
	}

	this.GetAccruedInterestDays = function(){
		return DateDiff(bond.SettlementDate, this.GetPreviousCouponDate(), 'd');
	}
	this.GetTotalInterestDayOfCurrentDate = function(){
		return DateDiff(this.GetNextCouponDate(), this.GetPreviousCouponDate(), 'd');
	}
	this.GetTotalPrice = function(){
		var N = this.GetReturnTimes();
		var totalPriceAllTimes = 0;
		
		for(i = 1; i<=N; i++){
			var ta = this.GetFaceValue() * (bond.Coupon/100)/bond.Frequency;
			var tb = Math.pow((1 + (bond.Yield2Maturity/100)/bond.Frequency),((i - 1) + this.GetDSC()/this.GetTotalInterestDayOfCurrentDate()));
			var t = ta/tb;
			totalPriceAllTimes += t;
		}
		var redemptionPrice = this.GetRedemption()/(Math.pow((1 + (bond.Yield2Maturity/100)/bond.Frequency),((N - 1) + this.GetDSC()/this.GetTotalInterestDayOfCurrentDate())))
		return  redemptionPrice + totalPriceAllTimes;
	}

	this.GetPrincipal = function(){
		return this.GetCleanPrice() * bond.DealVolume;
	}

	this.GetAccruedInterest = function(){
		return (((bond.Coupon/100)/bond.Frequency) * this.GetFaceValue() * this.GetAccruedInterestDays())/ this.GetTotalInterestDayOfCurrentDate();
	}

	this.GetTotalAccuedInterest = function(){
		return this.GetAccruedInterest() * bond.DealVolume;
	}

	this.GetCleanPrice = function(){
		return this.GetTotalPrice() - this.GetAccruedInterest();
	}

	this.GetTotalValue = function(){
		return this.GetTotalPrice() * bond.DealVolume;
	}

	this.GetMaculayDuration = function(){
		var N = this.GetReturnTimes();
		var totalDurationAllTimes = 0;
		
		for(i = 1; i<=N; i++){
			var ta = this.GetFaceValue() * ((bond.Coupon/100)/bond.Frequency) * ((i - 1) + this.GetDSC()/this.GetTotalInterestDayOfCurrentDate());
			var tb = Math.pow((1 + (bond.Yield2Maturity/100)/bond.Frequency),((i - 1) + this.GetDSC()/this.GetTotalInterestDayOfCurrentDate()));
			var t = ta/tb;
			totalDurationAllTimes += t;
		}
		var redemptionDuration = (this.GetRedemption()* ((N - 1) + this.GetDSC()/this.GetTotalInterestDayOfCurrentDate()))/(Math.pow((1 + (bond.Yield2Maturity/100)/bond.Frequency),((N - 1) + this.GetDSC()/this.GetTotalInterestDayOfCurrentDate())));
		return  (redemptionDuration + totalDurationAllTimes)/this.GetTotalPrice();

	}

	this.GetModifiedMaculayDuration = function(){
		return this.GetMaculayDuration()/(1 + (bond.Yield2Maturity/100)/bond.Frequency);
	}
}

