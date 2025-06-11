package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import common.hibernate.AbstractHibernateDAO;
import tms.backend.dao.PmProjectTypeDAO;
import tms.backend.domain.PmProjectType;



/**
 * User: anhphan Date: Oct 14, 2013 Time: 11:15:57 AM
 */
@Component
public class PmProjectTypeHibernateDAO extends
		AbstractHibernateDAO<PmProjectType, Long> implements
		PmProjectTypeDAO {
	@Autowired
	public PmProjectTypeHibernateDAO(SessionFactory sessionFactory) {
		super(PmProjectType.class);
		super.setSessionFactory(sessionFactory);

	}
	
}
