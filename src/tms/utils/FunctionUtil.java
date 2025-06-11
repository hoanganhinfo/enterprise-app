package tms.utils;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.StringTokenizer;

public class FunctionUtil {
	/**
	 * Convert String into array based on delimiter
	 * 
	 * @param st
	 * @param c
	 * @return
	 */
	public static ArrayList<Integer> convertStringToIntArray(String st, String c) {
		ArrayList<Integer> aList = new ArrayList<Integer>();
		StringTokenizer token = new StringTokenizer(st, c);
		while (token.hasMoreTokens()) {
			aList.add(Integer.valueOf(token.nextElement().toString()));
		}
		return aList;
	}

	public static ArrayList<Long> convertStringToLongArray(String st, String c) {
		ArrayList<Long> aList = new ArrayList<Long>();
		StringTokenizer token = new StringTokenizer(st, c);
		while (token.hasMoreTokens()) {
			aList.add(Long.valueOf(token.nextElement().toString()));
		}
		return aList;
	}

	public static ArrayList<Long> convertArrayToList(String[] array) {
		ArrayList<Long> list = new ArrayList<Long>();
		if (array == null)
			return list;
		for (int i = 0; i < array.length; i++) {
			list.add(new Long(array[i]));
		}
		return list;
	}

	public static String convertValue(Object value) {
		return value == null ? "" : String.valueOf(value);
	}
	public static double roundDouble(double num,int decimalPlace){
		BigDecimal bd = new BigDecimal(num);
	    bd = bd.setScale(decimalPlace,BigDecimal.ROUND_UP);
	    return bd.doubleValue();
	}

	/**
	 * @author hienht
	 * @param path
	 * @return String
	 */
	public static String getHttpUrlFromFullPath(String path) {
//		if(path.indexOf("\\") >= 0) {
//			path = path.replace('\\', '/');
//		}
//		if(path.indexOf(BondConstant.CHART_DATA_PATTERN ) > 0) {
//			path = path.substring(path.indexOf(BondConstant.CHART_DATA_PATTERN ) );
//		}
		return "";
	}
}
