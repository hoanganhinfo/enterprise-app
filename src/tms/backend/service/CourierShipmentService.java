package tms.backend.service;

import tms.backend.domain.CourierShipment;
import common.hibernate.GenericBiz;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface CourierShipmentService extends GenericBiz<CourierShipment, Long> {
	public void deleteByShipment(final Long shipmentId);
}
