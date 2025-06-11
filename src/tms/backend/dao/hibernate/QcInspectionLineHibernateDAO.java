package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.QCInspectionLineDAO;
import tms.backend.domain.QcInspectionLine;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class QcInspectionLineHibernateDAO extends
		AbstractHibernateDAO<QcInspectionLine, Long> implements
		QCInspectionLineDAO {
	@Autowired
	public QcInspectionLineHibernateDAO(SessionFactory sessionFactory) {
		super(QcInspectionLine.class);
		super.setSessionFactory(sessionFactory);

	}



	
}
