package tms.backend.service;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssetHistoryDAO;
import tms.backend.domain.AssetHistory;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssetHistoryServiceImpl extends
		GenericBizImpl<AssetHistory, Long> implements AssetHistoryService {
	@Autowired
	private AssetHistoryDAO assetHistoryDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssetHistory, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assetHistoryDAO;
	}

	@Override
	public List<AssetHistory> getAll() {
		// TODO Auto-generated method stub
		return assetHistoryDAO.findAll();
	}

//	@Override
//	public List<AssetCategory> getByDepartment(String departmentId) {
//		// TODO Auto-generated method stub
//		Map map = new HashMap<String, String>();
//
//		map.put("departmentId", departmentId);
//
//		return (ArrayList<AssetCategory>) assetCategoryDAO.findByProperties(
//				map, null, false, true, null, true);
//	}

	public AssetHistoryDAO getAssetHistoryDAO() {
		return assetHistoryDAO;
	}

	public void setAssetHistoryDAO(AssetHistoryDAO assetHistoryDAO) {
		this.assetHistoryDAO = assetHistoryDAO;
	}

	@Override
	public List<AssetHistory> getByAsset(Long assetId) {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();

		map.put("assetId", assetId);

		return (ArrayList<AssetHistory>) assetHistoryDAO.findByProperties(
				map, null, false, true, null, true);
	}

	@Override
	public AssetHistory getLastedHistory(Long assetId) {
		// TODO Auto-generated method stub
		System.out.println("assetId:" + assetId);
		Map map = new HashMap<String, String>();
		map.put("assetId", assetId);

		List<AssetHistory> list = (ArrayList<AssetHistory>) assetHistoryDAO.findByProperties(
				map, "transDate DESC", false, true, null, true);
		System.out.println("size:" + list.size());
		if (list != null & list.size() > 0){
		return list.get(0);
		}
		return null;
		
	}

	@Override
	public void deleteByAssetId(Long assetId) {
		// TODO Auto-generated method stub
		assetHistoryDAO.deleteByAssetId(assetId);
	}



}
