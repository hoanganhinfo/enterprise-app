package tms.backend.dao.hibernate;

import java.sql.SQLException;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.stereotype.Component;

import tms.backend.dao.CourierShipmentDAO;
import tms.backend.domain.CourierShipment;
import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class CourierShipmentHibernateDAO extends
		AbstractHibernateDAO<CourierShipment, Long> implements
		CourierShipmentDAO {
	@Autowired
	public CourierShipmentHibernateDAO(SessionFactory sessionFactory) {
		super(CourierShipment.class);
		super.setSessionFactory(sessionFactory);

	}
	@Override
	public void deleteByShipment(final Long shipmentId) {
		// TODO Auto-generated method stub
		 getHibernateTemplate().execute(
	            new HibernateCallback() {
	                public Object doInHibernate(Session session)
	                        throws HibernateException, SQLException {
	                    StringBuffer qryBuilder = new StringBuffer("DELETE FROM CourierSample a ");
	                    qryBuilder.append(" where a.courierShipmentId = :courierShipmentId");
	                    Query q = session.createQuery(qryBuilder.toString());
	                    q.setParameter("courierShipmentId", shipmentId);
	                    return q.executeUpdate();

	                }
	        });
	}
	
}
