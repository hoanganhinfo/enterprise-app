package tms.utils;


import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtils;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import common.hibernate.Constants;


/**
 * User: ban
 * Date: Aug 5, 2008
 * Time: 11:33:38 AM
 */
public class HibernateUtils {
	enum PropertyType {STRING, DATE, BOOLEAN, NUMBER};

	private static final String alias = " A";
	private static final String aliasDot = " A.";
	private static final String like = " like ";
	public  static final String eq = " = ";
	public  static final String noteq = " != ";
	public  static final String notIn = " not in ";
	public  static final String less = " < ";
	public  static final String greater = " > ";
	public static final String in = " in ";
	private static final String and = " AND ";
	private static final String or = " OR ";
	private static final String from = " from ";
	private static final String where = " where ";
	private static final String fquote = " '";
	private static final String lquote = "'";
	private static final String percentQuote = "%'";
	private static org.apache.log4j.Logger log =null;

    private static final SessionFactory sessionFactory = null;
//    static {
//        try {
//        	BasicConfigurator.configure();
//        	log = Logger.getLogger("HibernateUtils");
//            // Create the SessionFactory
//            sessionFactory = new Configuration().configure().buildSessionFactory();
//        } catch (Throwable ex) {
//            // Make sure you log the exception, as it might be swallowed
//            log.error("Initial SessionFactory creation failed.", ex);
//            throw new ExceptionInInitializerError(ex);
//        }
//    }
	    public static Session session = null;
	
//	    public static Session currentSession() {
//	        Session s = (Session) session.get();
//	        // Open a new Session, if this Thread has none yet
//	        if (s == null) {
//	            s = sessionFactory.openSession();
//	            session.set(s);
//	        }
//	        return s;
//	    }
//	
//	    public static void closeSession() {
//	        Session s = (Session) session.get();
//	        if (s != null)
//	            s.close();
//	        session.set(null);
//	    }
	/**
	 * The method that create Criterion array from map of names and values.
	 * @param propertyNameValues map of property name and values
	 * @param includeNull if it's true the property with null value will be created
	 *        with Restrictions.isNull. Otherwise, it will be ignored.
	 * @return
	 */
	public static Criterion[] createCriterion(Map<String,String> propertyNameValues,
											  boolean includeNull) {
		if(propertyNameValues == null) {
			return null;
		}
		Criterion[] criterion = new Criterion[propertyNameValues.size()];
		String value;
		int i = 0;
		for(String key : propertyNameValues.keySet()) {
			value = propertyNameValues.get(key);
			if(value == null && includeNull) {
				criterion[i] = Restrictions.isNull(key);
			} else if (value != null) {
				criterion[i] = Restrictions.ilike(key, value + "%");
			}

			i++;
		}
		return criterion;
	}

	private static String getNoDotProperty(String property) {
		if(property.indexOf(Constants.ALPHABET_SEARCH_PREFIX) == 0) {
			property = property.substring(Constants.ALPHABET_SEARCH_PREFIX.length());
		}
		return property.replace('.','X');
	}
	private static String getListValue(List values) {
		StringBuffer buf = new StringBuffer(20);
		boolean isString = false;
		int i = 0;
		for(Object o : values) {
			if(i > 0) {
				buf.append(",");
			}
			if(o instanceof String) {
				buf.append("'");
				buf.append(o.toString());
				buf.append("'");
			} else {
				buf.append(o.toString());
			}
			i++;
		}
		return buf.toString();
	}
	/**
	 * Return correct HSQL value based on value type. Value type is first checked
	 * against PropertyType. If PropertyType is null it will use instanceof to find
	 * out value type
	 * value[0] is operator and value[1] is value
	 * @param additionalTypeInfo
	 * @param value
	 * @return HSQL value base the on the type
	 */
	private static String getNameCriteria(PropertyType additionalTypeInfo,
								String property,
								Object value[], boolean exactMatch, boolean ignoreCase) {
		if(value[1] instanceof List) {
			if(HibernateUtils.notIn.equals(value[0])) {
				return aliasDot + property + notIn + "(" + getListValue((List)(value[1])) + ")";
			} else {
				return aliasDot + property + in + "(" + getListValue((List)(value[1])) + ")";
			}
		}
		if((additionalTypeInfo != null && additionalTypeInfo == PropertyType.STRING)
				|| value[1] instanceof String) {
			if(exactMatch) {
				if(ignoreCase) {
					return "upper(" + aliasDot + property + ")" + value[0] + "upper(" + ":" + getNoDotProperty(property) + ")";
				} else {
					return aliasDot + property + value[0] + ":" + getNoDotProperty(property);
				}
			} else {
				if(HibernateUtils.notIn.equals(value[0])) {
					return aliasDot + property + notIn + "(:" + getNoDotProperty(property) + ")";
				} if ( HibernateUtils.in.equals(value[0]) ) {
					return aliasDot + property + value[0] + "(:" + getNoDotProperty(property) +")";
				} else if(property.indexOf(Constants.ALPHABET_SEARCH_PREFIX) == 0) {
					//this is alphabet search
					property = property.substring(Constants.ALPHABET_SEARCH_PREFIX.length());
					return "upper(" + aliasDot + property + ") like upper(:" + getNoDotProperty(property) + " ||'')";
				} else {
					return "upper(" + aliasDot + property + ") like upper(''|| :" + getNoDotProperty(property) + " ||'')";
				}
			}
		}

		return aliasDot + property + value[0] + ":" + getNoDotProperty(property);

	}

	private static String getNameCriteria(String property, Object[] value,
			Map<String, PropertyType> additionalTypeInfo, boolean exactMatch, boolean ignoreCase) {
		if(additionalTypeInfo != null &&
				additionalTypeInfo.get(property) != null) {
			return getNameCriteria(additionalTypeInfo.get(property), property, value, exactMatch, ignoreCase);
		}

		return getNameCriteria(null, property, value, exactMatch, ignoreCase);

	}

	/**
	 * Build named query based on instance of Class and map of properties and values
	 * Type of values can be specified in additionalTypeInfo for nested properties
	 * If type is not specified in the map it will use instanceof to determine the type
	 * for the property.
	 * @param clazz
	 * @param propertyNameValues
	 * @param additionalTypeInfo
	 * @return
	 */
	public static Object[] buildNameQuery(Class clazz, Map<String,Object> propertyNameValues,
							Map<String, PropertyType> additionalTypeInfo, String orderBy,
							boolean andSearch, boolean exactMatch, String selectFromClause,
							boolean ignoreCase) {

		Object[] value;
		Object temp;
		StringBuffer buffer = new StringBuffer(100);
		if(selectFromClause == null) {
			buffer.append(from + clazz.getName() + alias);
		} else {
			buffer.append(selectFromClause);
		}
		if(propertyNameValues.size() > 0) {
			buffer.append(where);
			int i = 0;
			StringBuffer paramNames = new StringBuffer();
			java.util.ArrayList<Object> values = new java.util.ArrayList<Object>();

			for(String property: propertyNameValues.keySet()) {
				temp = propertyNameValues.get(property);
				if(temp instanceof Object[]) {
					value = (Object[])temp;
				} else {
					value = new Object[2];
					value[0] = eq;
					value[1] = temp;
				}
				if(i > 0) {
					if(andSearch) {
						buffer.append(and);
					} else {
						buffer.append(or);
					}
				}
				String str = getNameCriteria(property, value, additionalTypeInfo, exactMatch, ignoreCase);
				buffer.append(str);
				if(str.indexOf(":") > 0) {
					if(i > 0) {
						paramNames.append(",");
					}
					paramNames.append(getNoDotProperty(property));
					values.add(value[1]);
					i++;
				}
			}
			if(orderBy != null && !"".equals(orderBy)) {
				buffer.append(" order by A.");
				buffer.append(orderBy);
			}
			if(values.size() > 0) {
				return new Object[] {buffer.toString(), paramNames.toString().split("[,]"), values.toArray() };
			} else {
				return new Object[] {buffer.toString()};
			}
		}
		if(orderBy != null && !"".equals(orderBy)) {
			buffer.append(" order by A.");
			buffer.append(orderBy);
		}
		return new Object[] {buffer.toString()};
	}

	public static void populateProperty(String[] properties,
							Object persistentBean) throws Exception {
		Object o = null;
		for(int i = 0 ; i < properties.length; i++) {
    		if(properties[i].indexOf(PropertyUtils.NESTED_DELIM) > 0) {
    			String[] p = (properties[i]).split("[" + PropertyUtils.NESTED_DELIM + "]");
    			Object temp = persistentBean;
    			//try to populate not null property
    			for(int j = 0; j < p.length; j++) {
    				o = PropertyUtils.getProperty(temp, p[j]);
    				if( o == null ) {
    					break;
    				}
    				temp = o;
    			}
    		} else {
    			o = PropertyUtils.getProperty(persistentBean, properties[i]);
    		}

    		if(o != null && ( o instanceof Collection || o instanceof List )) {
    			Collection c = (Collection)o;
    			for(Object temp: c){
    				//do nothing, just populate lazy
    			}
    		}
    	}
	}
}

