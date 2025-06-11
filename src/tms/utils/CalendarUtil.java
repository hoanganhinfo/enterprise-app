package tms.utils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * User: ban
 * Date: Sep 19, 2008
 * Time: 5:02:49 PM
 */
public class CalendarUtil {
    public static int getYear(Timestamp timestamp) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date(timestamp.getTime()));
        return cal.get(Calendar.YEAR);
    }

    public static int getYear(java.sql.Date timestamp) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date(timestamp.getTime()));
        return cal.get(Calendar.YEAR);
    }

    public static int getCurrentYear() {
        return Calendar.getInstance().get(Calendar.YEAR);
    }

    public static int getCurrentMonth() {
        return Calendar.getInstance().get(Calendar.MONTH) + 1;
    }

    public static int getCurrentDate() {
        return Calendar.getInstance().get(Calendar.DATE);
    }

    public static java.sql.Date getDateForYear(int year) {
        Calendar cal = Calendar.getInstance();
        cal.set(year,0,1,0,0,0);
        return new java.sql.Date(cal.getTimeInMillis());
    }
	/**
	 * @author quanhm
	 * @param d
	 * @return Timestamp value of given date
	 */
	public static Timestamp toTimesStamp(Date d) {
		return new Timestamp(d.getTime());
	}
	/**
	 * @param strDate
	 * @return Date of a given string
	 * @throws ParseException 
	 */
	public static Date stringToDate(String strDate) throws ParseException {
		Date d = null;
			d = ResourceUtil.dateFormat.parse(strDate);
		return d;
	}
	/**
	 * @param strDate
	 * @param pattern
	 *            pattern of the given strDate
	 * @return Date of a given string
	 * @throws ParseException 
	 */
	public static Date stringToDate(String strDate, DateFormat df) throws ParseException {
		Date d = null;
		
		try {
			d = df.parse(strDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return d;
	}

	public static java.sql.Date stringToSqlDate(String strDate, String pattern) {
		DateFormat df = new SimpleDateFormat(pattern);
		try {
			Date d = df.parse(strDate);
			return new java.sql.Date(d.getTime());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static java.sql.Date stringToSqlDateOld(String strDate, String pattern) throws ParseException {
		Calendar cal = Calendar.getInstance();
		Date date = stringToDate(strDate);
		cal.setTime(date);
		return new java.sql.Date(cal.getTimeInMillis());
	}

	public static String dateToString(java.sql.Timestamp date) {
//		String DDMMYY = "dd/MM/yyyy";
//		return new SimpleDateFormat(DDMMYY).format(date);
		return ResourceUtil.dateFormat.format(date);
	}

	public static String dateToString(Date d) {
		if (d != null){
//		String DDMMYY = "dd/MM/yyyy";
		return ResourceUtil.dateFormat.format(d);
		}else{
			return "";
		}
		
	}
	public static String dateToString(Date d,String pattern) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
		if (d != null){
//		String DDMMYY = "dd/MM/yyyy";
		return dateFormat.format(d);
		}else{
			return "";
		}
		
	} 
	public static String dateToString(Date d,DateFormat dateFormat) {
		if (d != null){
//		String DDMMYY = "dd/MM/yyyy";
		return dateFormat.format(d);
		}else{
			return "";
		}
		
	}
	public static Date startOfDay(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		
		return new Date(cal.getTimeInMillis());
	}

	public static Date endOfDay(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		//cal.set(Calendar.DAY_OF_MONTH, cal.get(Calendar.DAY_OF_MONTH) + 1);

		return new Date(cal.getTimeInMillis());
	} 	
}
