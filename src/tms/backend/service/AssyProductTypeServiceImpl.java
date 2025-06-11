package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssyProductTypeDAO;
import tms.backend.domain.AssyProductType;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssyProductTypeServiceImpl extends
		GenericBizImpl<AssyProductType, Long> implements AssyProductTypeService {
	@Autowired
	private AssyProductTypeDAO assyProductTypeDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssyProductType, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assyProductTypeDAO;
	}

	@Override
	public List<AssyProductType> getAll() {
		// TODO Auto-generated method stub
		return assyProductTypeDAO.findAll();
	}


}
