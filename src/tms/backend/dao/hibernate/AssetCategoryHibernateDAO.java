package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssetCategoryDAO;
import tms.backend.domain.AssetCategory;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssetCategoryHibernateDAO extends
		AbstractHibernateDAO<AssetCategory, Long> implements
		AssetCategoryDAO {
	@Autowired
	public AssetCategoryHibernateDAO(SessionFactory sessionFactory) {
		super(AssetCategory.class);
		super.setSessionFactory(sessionFactory);

	}

	
}
