package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import common.hibernate.AbstractHibernateDAO;
import tms.backend.dao.PmResourceDAO;
import tms.backend.domain.PmResource;



/**
 * User: anhphan Date: Oct 14, 2013 Time: 11:15:57 AM
 */
@Component
public class PmResourceHibernateDAO extends
		AbstractHibernateDAO<PmResource, Long> implements
		PmResourceDAO {
	@Autowired
	public PmResourceHibernateDAO(SessionFactory sessionFactory) {
		super(PmResource.class);
		super.setSessionFactory(sessionFactory);

	}
	
}
