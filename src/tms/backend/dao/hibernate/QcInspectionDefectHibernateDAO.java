package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.QCInspectionDefectDAO;
import tms.backend.domain.QcInspectionDefect;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class QcInspectionDefectHibernateDAO extends
		AbstractHibernateDAO<QcInspectionDefect, Long> implements
		QCInspectionDefectDAO {
	@Autowired
	public QcInspectionDefectHibernateDAO(SessionFactory sessionFactory) {
		super(QcInspectionDefect.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
