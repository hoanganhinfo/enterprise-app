package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.CourierSampleDAO;
import tms.backend.domain.CourierSample;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class CourierSampleHbernateDAO extends
		AbstractHibernateDAO<CourierSample, Long> implements
		CourierSampleDAO {
	@Autowired
	public CourierSampleHbernateDAO(SessionFactory sessionFactory) {
		super(CourierSample.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
