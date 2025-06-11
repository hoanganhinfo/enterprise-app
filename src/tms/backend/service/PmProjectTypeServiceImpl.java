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
import tms.backend.dao.PmProjectTypeDAO;
import tms.backend.domain.Asset;
import tms.backend.domain.PmProjectType;
import tms.utils.StatusType;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class PmProjectTypeServiceImpl extends
		GenericBizImpl<PmProjectType, Long> implements PmProjectTypeService {
	@Autowired
	private PmProjectTypeDAO pmProjectTypeDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<PmProjectType, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return pmProjectTypeDAO;
	}

	@Override
	public List<PmProjectType> getAll() {
		// TODO Auto-generated method stub
		return pmProjectTypeDAO.findAll();
	}

	@Override
	public List<PmProjectType> getActiveProjectTypes() {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();

		map.put("status", StatusType.OPEN.getValue());

		return (ArrayList<PmProjectType>) pmProjectTypeDAO.findByProperties(
				map, null, false, true, null, true);
	}


	

}
