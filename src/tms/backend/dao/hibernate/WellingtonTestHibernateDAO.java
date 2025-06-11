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

import tms.backend.dao.WellingtonTestDAO;
import tms.backend.domain.Asset;
import tms.backend.domain.WellingtonTest;
import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class WellingtonTestHibernateDAO extends
		AbstractHibernateDAO<WellingtonTest, Long> implements
		WellingtonTestDAO {
	@Autowired
	public WellingtonTestHibernateDAO(SessionFactory sessionFactory) {
		super(WellingtonTest.class);
		super.setSessionFactory(sessionFactory);

	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> getBatchNo(final String batchNo,final String motor,final String shipmentNo,final String customerOrder,final String customerRef,final String containerNo) {
		// TODO Auto-generated method stub
		return (List<Object[]>) getHibernateTemplate().execute(
	            new HibernateCallback() {
	                public Object doInHibernate(Session session)
	                        throws HibernateException, SQLException {
	                    StringBuffer qryBuilder = new StringBuffer("select batchno,motor_type,shipmentNo,customer_order,customer_ref,container_no,count(batchno) From wellington_test w ");
	                    qryBuilder.append(" where w.batchno like :batchNo and w.motor_type like :motor and w.shipmentNo like :shipmentNo ");
	                    qryBuilder.append(" and w.customer_order like :customerOrder and w.customer_ref like :customerRef and w.container_no like :containerNo");
	                    qryBuilder.append(" group by w.batchno,w.motor_type ");
	                    qryBuilder.append("  ORDER BY substring(w.batchno,-6,6) DESC,substr(w.batchno,1,2) ");
	                    Query q = session.createSQLQuery(qryBuilder.toString());
	                    q.setParameter("batchNo", batchNo+"%");
	                    q.setParameter("motor", motor+"%");
	                    q.setParameter("shipmentNo", shipmentNo+"%");
	                    q.setParameter("customerOrder", customerOrder+"%");
	                    q.setParameter("customerRef", customerRef+"%");
	                    q.setParameter("containerNo", containerNo+"%");
	                    return q.list();
	                }
	        });
	}

	@Override
	public Integer updateShipmentByBatchNo(final String batchNo,final String motor,final String shipmentNo,final String customerOrder,final String customerRef,final String containerNo) {
		// TODO Auto-generated method stub
		return (Integer)getHibernateTemplate().execute(
	            new HibernateCallback() {
	                public Object doInHibernate(Session session)
	                        throws HibernateException, SQLException {
	                    StringBuffer qryBuilder = new StringBuffer("UPDATE  wellington_test w");
	                    qryBuilder.append(" SET w.shipmentNo=:shipmentNo, ");
	                    qryBuilder.append(" w.customer_order=:customerOrder, ");
	                    qryBuilder.append(" w.customer_ref=:customerRef, ");
	                    qryBuilder.append(" w.container_no=:containerNo ");
	                    qryBuilder.append(" WHERE w.batchno=:batchNo AND w.motor_type=:motor ");
	                    Query q = session.createSQLQuery(qryBuilder.toString());
	                    q.setParameter("batchNo", batchNo);
	                    q.setParameter("motor", motor);
	                    q.setParameter("shipmentNo", shipmentNo);
	                    q.setParameter("customerOrder", customerOrder);
	                    q.setParameter("customerRef", customerRef);
	                    q.setParameter("containerNo", containerNo);
	                    return q.executeUpdate();
	                
	                }
	        });
	}

	@Override
	public WellingtonTest getLastedBatchNo(final String stationNo, final String motorType) {
		// TODO Auto-generated method stub
		return (WellingtonTest) getHibernateTemplate().execute(
	            new HibernateCallback() {
	                public Object doInHibernate(Session session)
	                        throws HibernateException, SQLException {
	                    StringBuffer qryBuilder = new StringBuffer("FROM WellingtonTest w");
	                    qryBuilder.append(" WHERE w.motorType = :motorType  AND w.batchno LIKE :stationNo AND w.batchno IS NOT NULL ");
	                    qryBuilder.append(" ORDER BY substring(w.batchno,-6,6) desc,CAST(substring(w.batchno,2,locate('-',w.batchno) - 2)  AS int) DESC,w.sequence DESC ");
	                    qryBuilder.append(" LIMIT 1 ");
	                    Query q = session.createQuery(qryBuilder.toString());
	                    q.setParameter("motorType", motorType);
	                    q.setParameter("stationNo", stationNo+"%");
	                    q.setMaxResults(1);
	                    
	                    return q.uniqueResult();
	                }
	        });
	}
	@Override
	public WellingtonTest getLastedBatchNo(final String stationNo) {
		// TODO Auto-generated method stub
		return (WellingtonTest) getHibernateTemplate().execute(
	            new HibernateCallback() {
	                public Object doInHibernate(Session session)
	                        throws HibernateException, SQLException {
	                    StringBuffer qryBuilder = new StringBuffer("FROM WellingtonTest w");
	                    qryBuilder.append(" WHERE w.batchno LIKE :stationNo  AND w.batchno IS NOT NULL ");
	                    qryBuilder.append(" ORDER BY substring(w.batchno,-6,6) desc,CAST(substring(w.batchno,2,locate('-',w.batchno) - 2)  AS int) DESC,w.sequence DESC ");
	                    qryBuilder.append(" LIMIT 1 ");
	                    Query q = session.createQuery(qryBuilder.toString());
	                    q.setParameter("stationNo", stationNo+"%");
	                    q.setMaxResults(1);
	                    
	                    return q.uniqueResult();
	                }
	        });
	}


	
}
