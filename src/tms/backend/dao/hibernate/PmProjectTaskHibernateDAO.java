package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.PmProjectTaskDAO;
import tms.backend.domain.PmProjectTask;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class PmProjectTaskHibernateDAO extends
		AbstractHibernateDAO<PmProjectTask, Long> implements
		PmProjectTaskDAO {
	@Autowired
	public PmProjectTaskHibernateDAO(SessionFactory sessionFactory) {
		super(PmProjectTask.class);
		super.setSessionFactory(sessionFactory);

	}


	
}
