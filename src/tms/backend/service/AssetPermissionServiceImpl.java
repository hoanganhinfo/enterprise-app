package tms.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;
import tms.backend.dao.AssetDAO;
import tms.backend.dao.AssetPermissionDAO;
import tms.backend.domain.Asset;
import tms.backend.domain.AssetCategory;
import tms.backend.domain.AssetPermission;

/**
 * User: anhphan Date: March 15, 2016 Time: 8:38:03 AM
 */
@Service
public class AssetPermissionServiceImpl extends
		GenericBizImpl<AssetPermission, Long> implements AssetPermissionService {
	@Autowired
	private AssetPermissionDAO assetPermissionDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssetPermission, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assetPermissionDAO;
	}

	@Override
	public List<AssetPermission> getAll() {
		// TODO Auto-generated method stub
		return assetPermissionDAO.findAll();
	}

}
