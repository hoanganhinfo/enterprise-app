package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssyProductStationPrerequisiteDAO;
import tms.backend.domain.AssyProductStationPrerequisite;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: Oct 09, 2014 Time: 8:38:03 AM
 */
@Service
public class AssyProductStationPrerequisiteServiceImpl extends
		GenericBizImpl<AssyProductStationPrerequisite, Long> implements AssyProductStationPrerequisiteService {
	@Autowired
	private AssyProductStationPrerequisiteDAO assyProductStationPrerequisiteDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssyProductStationPrerequisite, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assyProductStationPrerequisiteDAO;
	}

	@Override
	public List<AssyProductStationPrerequisite> getAll() {
		// TODO Auto-generated method stub
		return assyProductStationPrerequisiteDAO.findAll();
	}



}
