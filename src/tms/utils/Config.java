/**
 * User: ban
 * Date: Aug 19, 2008
 * Time: 2:37:05 PM
 */
package tms.utils;

import java.util.Properties;
import java.io.IOException;

public class Config extends Properties {

    private static Config ourInstance = new Config();

    public static Config getInstance() {
    	if (ourInstance == null){
    		ourInstance  = new Config();
    	}
        return ourInstance;
    }

    private Config() {
        super();
        try {
            super.load(getClass().getClassLoader().getResourceAsStream("config.properties"));
        } catch (IOException e) {
            System.out.println("ERROR: can not load config file"+e);
        }
    }
}
