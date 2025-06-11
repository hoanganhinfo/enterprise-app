package tms.backend.dao.hibernate;

import java.sql.SQLException;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssyProductTestBarcodeDAO;
import tms.backend.dao.AssyProductTestDAO;
import tms.backend.domain.AssyProductTest;
import tms.backend.domain.AssyProductTestBarcode;
import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: April 13, 2018 Time: 11:15:57 AM
 */
@Component
public class AssyProductTestBarcodeHibernateDAO extends
		AbstractHibernateDAO<AssyProductTestBarcode, Long> implements
		AssyProductTestBarcodeDAO {
	@Autowired
	public AssyProductTestBarcodeHibernateDAO(SessionFactory sessionFactory) {
		super(AssyProductTestBarcode.class);
		super.setSessionFactory(sessionFactory);

	}

	

	
}
