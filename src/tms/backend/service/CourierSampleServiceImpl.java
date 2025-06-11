package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.CourierSampleDAO;
import tms.backend.domain.CourierSample;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class CourierSampleServiceImpl extends
		GenericBizImpl<CourierSample, Long> implements CourierSampleService {
	@Autowired
	private CourierSampleDAO courierSampleDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<CourierSample, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return courierSampleDAO;
	}

	@Override
	public List<CourierSample> getAll() {
		// TODO Auto-generated method stub
		return courierSampleDAO.findAll();
	}




}
