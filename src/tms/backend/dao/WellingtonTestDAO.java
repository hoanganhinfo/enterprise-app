package tms.backend.dao;

import java.util.List;

import tms.backend.domain.WellingtonTest;
import common.hibernate.GenericDAO;





/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
public interface WellingtonTestDAO extends GenericDAO<WellingtonTest, Long> {
	public List<Object[]> getBatchNo(String batchNo,String motor, String shipmentNo,String customerOrder,String customerRef,String containerNo);
	public Integer updateShipmentByBatchNo(String batchNo,String motor,String shipmentNo,String customerOrder,String customerRef,String containerNo);
	public WellingtonTest getLastedBatchNo(String stationNo,String motorType);
	public WellingtonTest getLastedBatchNo(String stationNo);
}
