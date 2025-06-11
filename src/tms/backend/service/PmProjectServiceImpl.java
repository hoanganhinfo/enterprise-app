package tms.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;
import tms.backend.dao.PmProjectDAO;
import tms.backend.domain.PmProject;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class PmProjectServiceImpl extends
		GenericBizImpl<PmProject, Long> implements PmProjectService {
	@Autowired
	private PmProjectDAO pmProjectDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<PmProject, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return pmProjectDAO;
	}

	@Override
	public List<PmProject> getAll() {
		// TODO Auto-generated method stub
		return pmProjectDAO.findAll();
	}

	@Override
	public List<PmProject> getByDepartment(String departmentId) {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();
		return pmProjectDAO.getByDepartment(Long.valueOf(departmentId));
	}



	

}
