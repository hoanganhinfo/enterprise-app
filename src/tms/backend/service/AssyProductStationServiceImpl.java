package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssyProductStationDAO;
import tms.backend.domain.AssyProductStation;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssyProductStationServiceImpl extends
		GenericBizImpl<AssyProductStation, Long> implements AssyProductStationService {
	@Autowired
	private AssyProductStationDAO assyProductStationDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssyProductStation, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assyProductStationDAO;
	}

	@Override
	public List<AssyProductStation> getAll() {
		// TODO Auto-generated method stub
		return assyProductStationDAO.findAll();
	}

	public AssyProductStationDAO getAssyProductStationDAO() {
		return assyProductStationDAO;
	}

	public void setAssyProductStationDAO(AssyProductStationDAO assyProductStationDAO) {
		this.assyProductStationDAO = assyProductStationDAO;
	}




}
