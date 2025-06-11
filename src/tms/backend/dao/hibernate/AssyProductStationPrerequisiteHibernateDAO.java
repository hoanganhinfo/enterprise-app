package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssyProductStationPrerequisiteDAO;
import tms.backend.domain.AssyProductStationPrerequisite;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Oct 09, 2014 Time: 11:15:57 AM
 */
@Component
public class AssyProductStationPrerequisiteHibernateDAO extends
		AbstractHibernateDAO<AssyProductStationPrerequisite, Long> implements
		AssyProductStationPrerequisiteDAO {
	@Autowired
	public AssyProductStationPrerequisiteHibernateDAO(SessionFactory sessionFactory) {
		super(AssyProductStationPrerequisite.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
