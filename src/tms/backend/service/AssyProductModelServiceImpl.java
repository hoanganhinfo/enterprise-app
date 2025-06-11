package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssyProductModelDAO;
import tms.backend.domain.AssyProductModel;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssyProductModelServiceImpl extends
		GenericBizImpl<AssyProductModel, Long> implements AssyProductModelService {
	@Autowired
	private AssyProductModelDAO assyProductModelDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssyProductModel, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assyProductModelDAO;
	}

	@Override
	public List<AssyProductModel> getAll() {
		// TODO Auto-generated method stub
		return assyProductModelDAO.findAll();
	}

	public AssyProductModelDAO getAssyProductModelDAO() {
		return assyProductModelDAO;
	}

	public void setAssyProductModelDAO(AssyProductModelDAO assyProductModelDAO) {
		this.assyProductModelDAO = assyProductModelDAO;
	}


}
