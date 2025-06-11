package tms.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssetCategoryDAO;
import tms.backend.dao.AssetLocationDAO;
import tms.backend.domain.AssetCategory;
import tms.backend.domain.AssetLocation;
import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssetLocationServiceImpl extends
		GenericBizImpl<AssetLocation, Long> implements AssetLocationService {
	@Autowired
	private AssetLocationDAO assetLocationDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssetLocation, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assetLocationDAO;
	}

	@Override
	public List<AssetLocation> getAll() {
		// TODO Auto-generated method stub
		return assetLocationDAO.findAll();
	}

	/**
	 * @return the assetLocationDAO
	 */
	public AssetLocationDAO getAssetLocationDAO() {
		return assetLocationDAO;
	}

	/**
	 * @param assetLocationDAO the assetLocationDAO to set
	 */
	public void setAssetLocationDAO(AssetLocationDAO assetLocationDAO) {
		this.assetLocationDAO = assetLocationDAO;
	}




}
