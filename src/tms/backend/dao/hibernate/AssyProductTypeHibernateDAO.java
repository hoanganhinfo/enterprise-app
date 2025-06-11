package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssyProductTypeDAO;
import tms.backend.domain.AssyProductType;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssyProductTypeHibernateDAO extends
		AbstractHibernateDAO<AssyProductType, Long> implements
		AssyProductTypeDAO {
	@Autowired
	public AssyProductTypeHibernateDAO(SessionFactory sessionFactory) {
		super(AssyProductType.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
