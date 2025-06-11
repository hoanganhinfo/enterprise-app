package tms.utils;



import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.text.SimpleDateFormat;

import org.apache.commons.lang3.StringUtils;

/**

 * User: lhban
 * Date: May 8, 2007
 * Time: 5:59:57 PM

 */
public class CommonUtil {

    /**
    * Helper function to convert the configuration string to an ArrayList.
     * @return list
     * @param str -
     */
    private static ArrayList stringToArrayList(String str) {

        ArrayList<String> tmp=new ArrayList<String>();
        if(StringUtils.isNotEmpty(str)) {
            String[] strArr=str.split("\\,");
            for (String aStrArr : strArr) {
                tmp.add(aStrArr.toLowerCase());
            }
        }
        return tmp;
    }
    /*
     *  get fileName without extension
     */
    public static String getNameWithoutExtension(String fileName) {
        return (fileName.indexOf(".") > 0) ? fileName.substring(0, fileName.lastIndexOf(".")) : fileName;
    }

    /*
    * get extension of file
    */
    public static String getExtension(String fileName) {
        return (fileName.indexOf(".") < fileName.length()) ? fileName.substring(fileName.lastIndexOf(".")+1) : "";
    }

    @SuppressWarnings({"deprecation"})
    public static String timeToString(Timestamp time) {
            if (time == null) return "";
            int y = time.getYear() + 1900;
            int m = time.getMonth() + 1;
            int d = time.getDate();
            String mm = (m < 10) ? "0" + m : "" + m;
            String dd = (d < 10) ? "0" + d : "" + d;
            String yyyy = "" + y;
            return dd + "/" + mm + "/" + yyyy;
        }
        @SuppressWarnings({"deprecation"})
    public static Timestamp  stringToTime(String sTime) {
            if (sTime == null) return null;
            String mdy[] = sTime.split("/");
            if (mdy.length != 3) {
                return null;
            }
            int d = Integer.parseInt(mdy[0]);
            int m = Integer.parseInt(mdy[1]) - 1;            
            int y = Integer.parseInt(mdy[2]) - 1900;
            Timestamp time = new Timestamp(0);
            time.setHours(0);
            time.setMonth(m);
            time.setDate(d);
            time.setYear(y);
            return time;
        }
    public static String doubleToString(double d, int ext) {
        String s = "" + d;
        int index = (s.indexOf('.') + ext < s.length()) ? s.indexOf('.') + ext + 1 : s.length();
        return s.substring(0,index);
    }


   public static String longToString(long l) {
        String ss = "" + l;
        int len = ss.length();
        StringBuffer s = new StringBuffer();
        for (int i = 0; i < len; i++) {
            if (i > 0 && (len -i)%3 == 0) {
                s.append(",");
            }
            s.append(ss.charAt(i));
        }
        return s.toString();
    }

    public static String getYYYYMMDD() {
        Calendar c = Calendar.getInstance();
        int y = c.get(Calendar.YEAR);
        int m = c.get(Calendar.MONTH) + 1;
        int d = c.get(Calendar.DATE);
        StringBuffer sb = new StringBuffer();
        sb.append(y);
         if (m < 10) {
             sb.append(0).append(m);
         } else {
             sb.append(m);
         }
         if (d < 10) {
             sb.append(0).append(d);
         } else {
             sb.append(d);
         }
         return sb.toString();
    }

    /**
     * Check if dateStr greater than current date or not 
     * @param dateStr - format dd/mm/yyyy
     * @return true: dateStr is valid, false; not valid
     */
    public static String isValidDate (String dateStr) {
        Timestamp t = stringToTime(dateStr);
       // Timestamp currentTime = new Timestamp( new Date().getTime() );
      //  if (t.after(currentTime)) {
            return t.toString();
//        }
//        else {
//            return "";
//        }
    }
   

    /**
     * get YYYYMMDD from dd/mm/yyyy
     * @param dateStr: dd/mm/yyyy
     * @return YYYYMMDD
     */
    public static String getYYYYMMDD(String dateStr) {
        String dmy[] = dateStr.split("/");
        if (dmy.length != 3) {
            return null;
        }
        StringBuffer yyyymmdd = new StringBuffer();
        yyyymmdd.append(dmy[2]).append(dmy[1]).append(dmy[0]);
        return yyyymmdd.toString();
    }

    public static boolean isNotNull(Object... objs) {
		if(objs != null ) {
	        for (Object obj : objs) {
	            if (obj == null) {
	                return false;
	            }
	        }
		} else {
			return false;
		}
        return true;
    }

	/**
	 * @author hienht
	 * @param dateStr
	 * @return GregorianCalendar
	 */
	public static String getYMDFromDate(Date date) {
		try {
			if(date != null && date.toString().length() > 0) {
				return new SimpleDateFormat("yyyy/MM/dd").format(date);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		return "";
	}
}
