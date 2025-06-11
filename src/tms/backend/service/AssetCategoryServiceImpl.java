package tms.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssetCategoryDAO;
import tms.backend.domain.AssetCategory;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssetCategoryServiceImpl extends
		GenericBizImpl<AssetCategory, Long> implements AssetCategoryService {
	@Autowired
	private AssetCategoryDAO assetCategoryDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssetCategory, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assetCategoryDAO;
	}

	@Override
	public List<AssetCategory> getAll() {
		// TODO Auto-generated method stub
		return assetCategoryDAO.findAll();
	}

	@Override
	public List<AssetCategory> getByDepartment(String departmentId) {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();

		map.put("departmentId", departmentId);

		return (ArrayList<AssetCategory>) assetCategoryDAO.findByProperties(
				map, null, false, true, null, true);
	}

	public AssetCategoryDAO getAssetCategoryDAO() {
		return assetCategoryDAO;
	}

	public void setAssetCategoryDAO(AssetCategoryDAO assetCategoryDAO) {
		this.assetCategoryDAO = assetCategoryDAO;
	}

}
