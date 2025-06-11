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
import common.hibernate.AbstractHibernateDAO;
import tms.backend.dao.AssetDAO;
import tms.backend.dao.InjMoldDAO;
import tms.backend.domain.Asset;
import tms.backend.domain.InjMold;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class InjMoldHibernateDAO extends
		AbstractHibernateDAO<InjMold, Long> implements
		InjMoldDAO {
	@Autowired
	public InjMoldHibernateDAO(SessionFactory sessionFactory) {
		super(InjMold.class);
		super.setSessionFactory(sessionFactory);

	}



	
}
