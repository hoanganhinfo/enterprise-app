package tms.backend.dao.hibernate;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.AssetPermissionDAO;
import tms.backend.domain.AssetPermission;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class AssetPermissionHibernateDAO extends
		AbstractHibernateDAO<AssetPermission, Long> implements
		AssetPermissionDAO {
	@Autowired
	public AssetPermissionHibernateDAO(SessionFactory sessionFactory) {
		super(AssetPermission.class);
		super.setSessionFactory(sessionFactory);

	}


}
