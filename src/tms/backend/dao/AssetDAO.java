package tms.backend.dao;

import java.util.List;


import common.hibernate.GenericDAO;
import tms.backend.domain.Asset;





/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
public interface AssetDAO extends GenericDAO<Asset, Long> {
	public List<Asset> getByDepartment(Long departmentId);
}
