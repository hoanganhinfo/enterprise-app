package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.QCInspectionTableDAO;
import tms.backend.domain.QcInspectionTable;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class QcInspectionTableHibernateDAO extends
		AbstractHibernateDAO<QcInspectionTable, Long> implements
		QCInspectionTableDAO {
	@Autowired
	public QcInspectionTableHibernateDAO(SessionFactory sessionFactory) {
		super(QcInspectionTable.class);
		super.setSessionFactory(sessionFactory);

	}



	
}
