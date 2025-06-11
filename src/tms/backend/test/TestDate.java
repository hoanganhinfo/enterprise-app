package tms.backend.test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import tms.utils.CalendarUtil;

public class TestDate {

	public static void main(String[] args) throws ParseException {
		// TODO Auto-generated method stub
		Date date = new CalendarUtil().stringToDate("a9/03/2014 5:3", new SimpleDateFormat("M/d/yyyy h:m"));
		
		System.out.println(date.toString()); // 2013-12-04
	}

}
