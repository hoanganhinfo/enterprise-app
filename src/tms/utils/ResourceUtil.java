package tms.utils;

import java.io.IOException;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.Properties;
import java.util.ResourceBundle;
import java.util.TimeZone;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ResourceUtil {
	private static Logger logger = Logger.getLogger(ResourceUtil.class.getSimpleName());
	private static Locale currentLocale;
	private static ResourceBundle messageBundle;
	private static Properties configProperties;
	private static ApplicationContext ctx = null;
	public static NumberFormat nf = NumberFormat.getInstance(Locale.US);
	// Internal organization in Liferay
	public static int INTERNAL_ORGANIZATION = 24352;


	public static String OFFICE_GROUP = "Office";
	public static SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
	public static SimpleDateFormat dateFormat_YYYYMMDD = new SimpleDateFormat("yyyy-MM-dd");
	public static SimpleDateFormat dateTimeFormat = new SimpleDateFormat("dd/MM/yyyy hh:mm a");
	//2013-01-30T00:00:00
	public static SimpleDateFormat isoDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
	public static void loadMessageProperties(){
		messageBundle = ResourceBundle.getBundle("message",currentLocale);
	}
	public static void loadConfigProperties(String configName){
		configProperties = new Properties();
        try {
        	configProperties.load(ClassLoader.getSystemResourceAsStream(configName));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	public static void loadLogConfig(){
		Properties logProperty = new Properties();
		try {
			logProperty.load(ClassLoader.getSystemResourceAsStream("log4j.properties"));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		PropertyConfigurator.configure(logProperty);

	}
	public static void loadSystemResource(){
		loadLogConfig();
		logger.info("load System Resource");
		currentLocale = new Locale("vn");
		loadConfigProperties("transman.properties");
		loadMessageProperties();
		//load spring resourece
        String[] paths = {"classpath:applicationContext.xml"};
        ctx = new ClassPathXmlApplicationContext(paths);
        ResourceUtil.isoDateFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));

	}
        public static ApplicationContext getApplicationContext(){
            return ctx;
        }
	public static void main(String[] args){
		loadSystemResource();
		System.out.println(getConfigProperties("server"));
		System.out.println(getMessageProperties("login"));


	}
	public static String getConfigProperties(String key) {
		return configProperties.getProperty(key);
	}
	public static String getMessageProperties(String key) {
		String message = "";
		try{
			message = messageBundle.getString(key);
		}catch(MissingResourceException mse){
			message = "";
		}
		return message;
	}
}
