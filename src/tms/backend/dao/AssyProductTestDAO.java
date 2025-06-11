package tms.backend.dao;

import java.util.List;

import tms.backend.domain.AssyProductTest;

import common.hibernate.GenericDAO;





/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
public interface AssyProductTestDAO extends GenericDAO<AssyProductTest, Long> {
	public List<AssyProductTest> getTenLastedProductTest(Long station,String sessionId);
	public AssyProductTest getLastedTest(String serial,Long productModel);
}
