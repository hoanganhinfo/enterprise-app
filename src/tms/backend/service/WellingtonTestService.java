package tms.backend.service;

import java.util.List;

import tms.backend.domain.AssetCategory;
import tms.backend.domain.WellingtonTest;
import common.hibernate.GenericBiz;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface WellingtonTestService extends GenericBiz<WellingtonTest, Long> {
	public List<Object[]> getBatchNo(String batchNo,String motor, String shipmentNo,String customerOrder,String customerRef,String containerNo);
	public Integer updateShipmentByBatchNo(String batchNo,String motor,String shipmentNo,String customerOrder,String customerRef,String containerNo);
	public WellingtonTest getLastedBatchNo(String stationNo,String motorType);
	public WellingtonTest getLastedBatchNo(String stationNo);
}
