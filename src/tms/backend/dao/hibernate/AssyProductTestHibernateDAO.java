package tms.backend.dao.hibernate;

import java.sql.SQLException;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssyProductTestDAO;
import tms.backend.domain.AssyProductTest;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssyProductTestHibernateDAO extends
		AbstractHibernateDAO<AssyProductTest, Long> implements
		AssyProductTestDAO {
	@Autowired
	public AssyProductTestHibernateDAO(SessionFactory sessionFactory) {
		super(AssyProductTest.class);
		super.setSessionFactory(sessionFactory);

	}

	@Override
	public List<AssyProductTest> getTenLastedProductTest(final Long station,
			final String sessionId) {
		// TODO Auto-generated method stub
		Object list = getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Criteria crit = session.createCriteria(AssyProductTest.class);
				crit.add(Restrictions.eq("sessionId", sessionId));
				crit.add(Restrictions.eq("station", station));
				crit.addOrder(Order.desc("datetimetested"));
				crit.setFirstResult(0);
				crit.setMaxResults(10);
				return crit.list();
			}
		});
        return (List<AssyProductTest>) list;
	}

	@Override
	public AssyProductTest getLastedTest(final String serial,final  Long productModel) {
		// TODO Auto-generated method stub
		Object list = getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Criteria crit = session.createCriteria(AssyProductTest.class);
				crit.add(Restrictions.eq("serial", serial));
				crit.add(Restrictions.eq("productModel", productModel));
				crit.addOrder(Order.desc("datetimetested"));
				return crit.uniqueResult();
			}
		});
        return (AssyProductTest) list;
	}

	
}
