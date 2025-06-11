package tms.backend.service;

import java.util.List;


import java.util.Map;

import org.hibernate.criterion.Criterion;

import common.hibernate.GenericBiz;
import tms.backend.domain.AssetCategory;
import tms.backend.domain.AssetHistory;
import tms.backend.domain.Task;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface AssetHistoryService extends GenericBiz<AssetHistory, Long> {
	public List<AssetHistory> getByAsset(Long assetId);
	public AssetHistory getLastedHistory(Long assetId);
	public void deleteByAssetId(Long assetId);

}
