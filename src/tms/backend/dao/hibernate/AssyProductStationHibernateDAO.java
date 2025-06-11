package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssyProductStationDAO;
import tms.backend.domain.AssyProductStation;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssyProductStationHibernateDAO extends
		AbstractHibernateDAO<AssyProductStation, Long> implements
		AssyProductStationDAO {
	@Autowired
	public AssyProductStationHibernateDAO(SessionFactory sessionFactory) {
		super(AssyProductStation.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
