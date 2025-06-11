package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssetCategoryDAO;
import tms.backend.dao.AssetLocationDAO;
import tms.backend.domain.AssetCategory;
import tms.backend.domain.AssetLocation;
import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssetLocationHibernateDAO extends
		AbstractHibernateDAO<AssetLocation, Long> implements
		AssetLocationDAO {
	@Autowired
	public AssetLocationHibernateDAO(SessionFactory sessionFactory) {
		super(AssetLocation.class);
		super.setSessionFactory(sessionFactory);

	}


}
