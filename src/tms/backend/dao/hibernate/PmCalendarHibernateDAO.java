package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.PmCalendarDAO;
import tms.backend.domain.PmCalendar;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class PmCalendarHibernateDAO extends
		AbstractHibernateDAO<PmCalendar, Long> implements
		PmCalendarDAO {
	@Autowired
	public PmCalendarHibernateDAO(SessionFactory sessionFactory) {
		super(PmCalendar.class);
		super.setSessionFactory(sessionFactory);

	}


	
}
