package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.InjMoldDAO;
import tms.backend.domain.InjMold;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class InjMoldServiceImpl extends
		GenericBizImpl<InjMold, Long> implements InjMoldService {
	@Autowired
	private InjMoldDAO injMoldDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<InjMold, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return injMoldDAO;
	}

	@Override
	public List<InjMold> getAll() {
		// TODO Auto-generated method stub
		return injMoldDAO.findAll();
	}

	



}
