package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.InjMixedMaterialJournalDAO;
import tms.backend.dao.InjRegrindRateDAO;
import tms.backend.dao.InjRegrindorderDAO;
import tms.backend.domain.InjMixedMaterialJournal;
import tms.backend.domain.InjRegrindRate;
import tms.backend.domain.InjRegrindorder;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class InjMixedMaterialJournalHibernateDAO extends
		AbstractHibernateDAO<InjMixedMaterialJournal, Long> implements
		InjMixedMaterialJournalDAO {
	@Autowired
	public InjMixedMaterialJournalHibernateDAO(SessionFactory sessionFactory) {
		super(InjMixedMaterialJournal.class);
		super.setSessionFactory(sessionFactory);

	}



	
}
