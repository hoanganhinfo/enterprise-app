package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.AssyProductDefectDAO;
import tms.backend.domain.AssyProductDefect;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class AssyProductDefectServiceImpl extends
		GenericBizImpl<AssyProductDefect, Long> implements AssyProductDefectService {
	@Autowired
	private AssyProductDefectDAO assyProductDefectDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssyProductDefect, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assyProductDefectDAO;
	}

	@Override
	public List<AssyProductDefect> getAll() {
		// TODO Auto-generated method stub
		return assyProductDefectDAO.findAll();
	}

	public AssyProductDefectDAO getAssyProductDefectDAO() {
		return assyProductDefectDAO;
	}

	public void setAssyProductDefectDAO(AssyProductDefectDAO assyProductDefectDAO) {
		this.assyProductDefectDAO = assyProductDefectDAO;
	}




}
