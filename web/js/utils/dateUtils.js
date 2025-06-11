MyDateUtils = function(from,to,type) {
    var dateFrom = from;/*Must be type of Date*/
    var dateTo = to;/*Must be type of Date*/
    var returnType = type;
    var oneMinute = 60*1000;
    
    this.dateDiff = function() {
		var oneDayInMiliSeconds = oneMinute * 60 * 24;
		var oneMonthInMiliSeconds = oneDayInMiliSeconds * 30;
		var oneYearInMiliSeconds = oneMonthInMiliSeconds * 12;
		
		var miliSecondFrom = dateFrom.getTime();
		var miliSecondTo = dateTo.getTime();
		var miliSecondDiff = miliSecondTo - miliSecondFrom;
		
		var dividend = 0; 
		if(returnType == 'day') {
		    dividend = Math.abs(miliSecondDiff)/oneDayInMiliSeconds;
		}else if(returnType == 'month') {
		    dividend = Math.abs(miliSecondDiff)/oneMonthInMiliSeconds;
		}else {
		    dividend = Math.abs(miliSecondDiff)/oneYearInMiliSeconds;
		}
		return dividend;

    };
    
    this.parseDate = function(val,format) {
        return Date.parseDate(val,format);
    };
    
    this.setFromDate = function(val) {
    	dateFrom = val;
    };
    
    this.setToDate = function(val) {
    	dateTo = val;
    };
    
    this.setReturnType = function(val) {
    	returnType = val;
    };
    
    this.setAllParameters = function(from,to,type) {
    	dateFrom = from;
    	dateTo = to;
    	returnType = type;
    };
};