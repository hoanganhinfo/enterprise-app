package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssyProductDefectDAO;
import tms.backend.domain.AssyProductDefect;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssyProductDefectHibernateDAO extends
		AbstractHibernateDAO<AssyProductDefect, Long> implements
		AssyProductDefectDAO {
	@Autowired
	public AssyProductDefectHibernateDAO(SessionFactory sessionFactory) {
		super(AssyProductDefect.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
