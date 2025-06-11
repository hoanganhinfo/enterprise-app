package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.WellingtonTestDAO;
import tms.backend.domain.WellingtonTest;
import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class WellingtonTestServiceImpl extends
		GenericBizImpl<WellingtonTest, Long> implements WellingtonTestService {
	@Autowired
	private WellingtonTestDAO wellingtonTestDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<WellingtonTest, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return wellingtonTestDAO;
	}

	@Override
	public List<WellingtonTest> getAll() {
		// TODO Auto-generated method stub
		return wellingtonTestDAO.findAll();
	}

	@Override
	public List<Object[]> getBatchNo(String batchNo,String motor, String shipmentNo,String customerOrder,String customerRef,String containerNo) {
		// TODO Auto-generated method stub
		return wellingtonTestDAO.getBatchNo(batchNo,motor,shipmentNo,customerOrder,customerRef,containerNo);
	}

	@Override
	public Integer updateShipmentByBatchNo(String batchNo, String motor, String shipmentNo,String customerOrder,String customerRef,String containerNo) {
		// TODO Auto-generated method stub
		return wellingtonTestDAO.updateShipmentByBatchNo(batchNo,motor,shipmentNo,customerOrder,customerRef,containerNo);
	}

	@Override
	public WellingtonTest getLastedBatchNo(String stationNo, String motorType) {
		// TODO Auto-generated method stub
		return wellingtonTestDAO.getLastedBatchNo(stationNo, motorType);
	}
	@Override
	public WellingtonTest getLastedBatchNo(String stationNo) {
		// TODO Auto-generated method stub
		return wellingtonTestDAO.getLastedBatchNo(stationNo);
	}


}
