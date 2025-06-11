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
import tms.backend.domain.Asset;
import tms.backend.domain.AssetCategory;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssetServiceImpl extends
		GenericBizImpl<Asset, Long> implements AssetService {
	@Autowired
	private AssetDAO assetDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<Asset, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assetDAO;
	}

	@Override
	public List<Asset> getAll() {
		// TODO Auto-generated method stub
		return assetDAO.findAll();
	}

	@Override
	public List<Asset> getByDepartment(String departmentId) {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();
		return assetDAO.getByDepartment(Long.valueOf(departmentId));
	}

	public AssetDAO getAssetDAO() {
		return assetDAO;
	}

	public void setAssetDAO(AssetDAO assetDAO) {
		this.assetDAO = assetDAO;
	}

	@Override
	public List<Asset> getByCategory(AssetCategory assetCategory) {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();

		map.put("category", assetCategory);

		return (ArrayList<Asset>) assetDAO.findByProperties(
				map, null, false, true, null, true);
	}



}
