package tms.backend.service;

import java.util.List;



import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.CourierShipmentDAO;
import tms.backend.domain.CourierShipment;
import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class CourierShipmentServiceImpl extends
		GenericBizImpl<CourierShipment, Long> implements CourierShipmentService {
	@Autowired
	private CourierShipmentDAO courierShipmentDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<CourierShipment, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return courierShipmentDAO;
	}

	@Override
	public List<CourierShipment> getAll() {
		// TODO Auto-generated method stub
		return courierShipmentDAO.findAll();
	}

	@Override
	public void deleteByShipment(Long shipmentId) {
		// TODO Auto-generated method stub
		courierShipmentDAO.deleteByShipment(shipmentId);
	}




}
