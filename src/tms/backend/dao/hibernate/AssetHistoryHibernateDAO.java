package tms.backend.dao.hibernate;

import java.sql.SQLException;


import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssetHistoryDAO;
import tms.backend.domain.AssetHistory;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssetHistoryHibernateDAO extends
		AbstractHibernateDAO<AssetHistory, Long> implements
		AssetHistoryDAO {
	@Autowired
	public AssetHistoryHibernateDAO(SessionFactory sessionFactory) {
		super(AssetHistory.class);
		super.setSessionFactory(sessionFactory);

	}

	@Override
	public void deleteByAssetId(final Long assetId) {
		// TODO Auto-generated method stub
		 getHibernateTemplate().execute(
	            new HibernateCallback() {
	                public Object doInHibernate(Session session)
	                        throws HibernateException, SQLException {
	                    StringBuffer qryBuilder = new StringBuffer("DELETE FROM AssetHistory a ");
	                    qryBuilder.append(" where a.assetId = :assetId");
	                    Query q = session.createQuery(qryBuilder.toString());
	                    q.setParameter("assetId", assetId);
	                    return q.executeUpdate();
	                }
	        });
	}

	
}
