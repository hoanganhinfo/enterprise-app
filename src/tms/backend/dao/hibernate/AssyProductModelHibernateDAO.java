package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssyProductModelDAO;
import tms.backend.domain.AssyProductModel;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssyProductModelHibernateDAO extends
		AbstractHibernateDAO<AssyProductModel, Long> implements
		AssyProductModelDAO {
	@Autowired
	public AssyProductModelHibernateDAO(SessionFactory sessionFactory) {
		super(AssyProductModel.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
