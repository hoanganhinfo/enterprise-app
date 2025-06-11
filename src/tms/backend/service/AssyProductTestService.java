package tms.backend.service;

import java.util.List;

import tms.backend.domain.AssyProductTest;
import common.hibernate.GenericBiz;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface AssyProductTestService extends GenericBiz<AssyProductTest, Long> {
	public List<AssyProductTest> getTenLastedProductTest(Long station,String sessionId);
	public AssyProductTest getLastedTest(String serial,Long productModel);
}
