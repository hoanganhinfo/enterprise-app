package tms.backend.dao;

import tms.backend.domain.AssetHistory;

import common.hibernate.GenericDAO;





/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
public interface AssetHistoryDAO extends GenericDAO<AssetHistory, Long> {
	public void deleteByAssetId(Long assetId);
}
