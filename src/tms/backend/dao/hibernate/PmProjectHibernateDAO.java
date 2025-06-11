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

import tms.backend.dao.PmProjectDAO;
import tms.backend.domain.PmProject;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Oct 14, 2013 Time: 11:15:57 AM
 */
@Component
public class PmProjectHibernateDAO extends
		AbstractHibernateDAO<PmProject, Long> implements
		PmProjectDAO {
	@Autowired
	public PmProjectHibernateDAO(SessionFactory sessionFactory) {
		super(PmProject.class);
		super.setSessionFactory(sessionFactory);

	}

	@Override
	public List<PmProject> getByDepartment(final Long departmentId) {
		// TODO Auto-generated method stub
		return (List<PmProject>) getHibernateTemplate().execute(
	            new HibernateCallback() {
	                public Object doInHibernate(Session session)
	                        throws HibernateException, SQLException {
	                    StringBuffer qryBuilder = new StringBuffer("From PmProject a");
	                    qryBuilder.append(" where a.departmentId = :departmentId");
	                    qryBuilder.append(" ORDER BY a.category.id");
	                    Query q = session.createQuery(qryBuilder.toString());
	                    q.setParameter("departmentId", departmentId);
	                    return q.list();
	                }
	        });
	}

	
}
