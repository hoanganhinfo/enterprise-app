package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssyParameterDAO;
import tms.backend.domain.AssyParameter;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssyParameterHibernateDAO extends
		AbstractHibernateDAO<AssyParameter, Long> implements
		AssyParameterDAO {
	@Autowired
	public AssyParameterHibernateDAO(SessionFactory sessionFactory) {
		super(AssyParameter.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
