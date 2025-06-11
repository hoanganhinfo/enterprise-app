package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssyParameterDAO;
import tms.backend.dao.AssyProductModelDAO;
import tms.backend.domain.AssyParameter;
import tms.backend.domain.AssyProductModel;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssyParameterServiceImpl extends
		GenericBizImpl<AssyParameter, Long> implements AssyParameterService {
	@Autowired
	private AssyParameterDAO assyParameterDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssyParameter, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assyParameterDAO;
	}

	@Override
	public List<AssyParameter> getAll() {
		// TODO Auto-generated method stub
		return assyParameterDAO.findAll();
	}

	public AssyParameterDAO getAssyParameterDAO() {
		return assyParameterDAO;
	}

	public void setAssyParameterDAO(AssyParameterDAO assyParameterDAO) {
		this.assyParameterDAO = assyParameterDAO;
	}


}
