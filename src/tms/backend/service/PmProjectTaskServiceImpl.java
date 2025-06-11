package tms.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;
import tms.backend.dao.PmProjectTaskDAO;
import tms.backend.domain.PmProjectTask;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class PmProjectTaskServiceImpl extends
		GenericBizImpl<PmProjectTask, Long> implements PmProjectTaskService {
	@Autowired
	private PmProjectTaskDAO pmProjectTaskDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<PmProjectTask, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return pmProjectTaskDAO;
	}

	@Override
	public List<PmProjectTask> getAll() {
		// TODO Auto-generated method stub
		return pmProjectTaskDAO.findAll();
	}

	@Override
	public List<PmProjectTask> getByParentId(Long parentId) {
		// TODO Auto-generated method stub
	      Map map = new HashMap<String, String>();
	      map.put("parentTaskId", parentId);
	      return (ArrayList<PmProjectTask>) pmProjectTaskDAO.findByProperties(map, null, true, true, null, true);
	}


	

}
