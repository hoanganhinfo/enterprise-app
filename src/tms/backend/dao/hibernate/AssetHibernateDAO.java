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

import tms.backend.dao.AssetDAO;
import tms.backend.domain.Asset;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssetHibernateDAO extends
		AbstractHibernateDAO<Asset, Long> implements
		AssetDAO {
	@Autowired
	public AssetHibernateDAO(SessionFactory sessionFactory) {
		super(Asset.class);
		super.setSessionFactory(sessionFactory);

	}

	@Override
	public List<Asset> getByDepartment(final Long departmentId) {
		// TODO Auto-generated method stub
		return (List<Asset>) getHibernateTemplate().execute(
	            new HibernateCallback() {
	                public Object doInHibernate(Session session)
	                        throws HibernateException, SQLException {
	                    StringBuffer qryBuilder = new StringBuffer("From Asset a join a.category");
	                    qryBuilder.append(" where a.category.departmentId = :departmentId");
	                    qryBuilder.append(" ORDER BY a.category.id");
	                    Query q = session.createQuery(qryBuilder.toString());
	                    q.setParameter("departmentId", departmentId);
	                    return q.list();
	                }
	        });
	}

	
}
