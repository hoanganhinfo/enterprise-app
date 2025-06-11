package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssyProductTestDAO;
import tms.backend.domain.AssyProductTest;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssyProductTestServiceImpl extends
		GenericBizImpl<AssyProductTest, Long> implements AssyProductTestService {
	@Autowired
	private AssyProductTestDAO assyProductTestDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssyProductTest, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assyProductTestDAO;
	}

	@Override
	public List<AssyProductTest> getAll() {
		// TODO Auto-generated method stub
		return assyProductTestDAO.findAll();
	}

	@Override
	public List<AssyProductTest> getTenLastedProductTest(Long station,
			String sessionId) {
		// TODO Auto-generated method stub
		return assyProductTestDAO.getTenLastedProductTest(station, sessionId);
	}

	@Override
	public AssyProductTest getLastedTest(String serial, Long productModel) {
		// TODO Auto-generated method stub
		return assyProductTestDAO.getLastedTest(serial, productModel);
	}



}
