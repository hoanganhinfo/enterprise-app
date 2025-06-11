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
import tms.backend.dao.PmResourceDAO;
import tms.backend.domain.PmResource;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class PmResourceServiceImpl extends
		GenericBizImpl<PmResource, Long> implements PmResourceService {
	@Autowired
	private PmResourceDAO pmResourceDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<PmResource, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return pmResourceDAO;
	}

	@Override
	public List<PmResource> getAll() {
		// TODO Auto-generated method stub
		return pmResourceDAO.findAll();
	}

	@Override
	public List<PmResource> getResourceByProject(String projectId) {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();

		map.put("projectId", projectId);

		return (ArrayList<PmResource>) pmResourceDAO.findByProperties(
				map, null, false, true, null, true);
	}
}
