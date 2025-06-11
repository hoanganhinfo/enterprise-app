package tms.backend.dao;

import tms.backend.domain.CourierShipment;
import common.hibernate.GenericDAO;





/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
public interface CourierShipmentDAO extends GenericDAO<CourierShipment, Long> {
	public void deleteByShipment(final Long shipmentId);
}
