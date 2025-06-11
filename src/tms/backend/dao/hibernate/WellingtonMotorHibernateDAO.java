package tms.backend.dao.hibernate;

import java.sql.SQLException;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.stereotype.Component;

import tms.backend.dao.WellingtonMotorDAO;
import tms.backend.dao.WellingtonTestDAO;
import tms.backend.domain.WellingtonMotor;
import tms.backend.domain.WellingtonTest;
import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 30, 2015 Time: 11:15:57 AM
 */
@Component
public class WellingtonMotorHibernateDAO extends
		AbstractHibernateDAO<WellingtonMotor, Long> implements
		WellingtonMotorDAO {
	@Autowired
	public WellingtonMotorHibernateDAO(SessionFactory sessionFactory) {
		super(WellingtonMotor.class);
		super.setSessionFactory(sessionFactory);

	}

}
