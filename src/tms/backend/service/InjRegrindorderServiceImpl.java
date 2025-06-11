package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.InjRegrindorderDAO;
import tms.backend.domain.InjRegrindorder;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class InjRegrindorderServiceImpl extends
		GenericBizImpl<InjRegrindorder, Long> implements InjRegrindorderService {
	@Autowired
	private InjRegrindorderDAO injRegrindorderDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<InjRegrindorder, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return injRegrindorderDAO;
	}

	@Override
	public List<InjRegrindorder> getAll() {
		// TODO Auto-generated method stub
		return injRegrindorderDAO.findAll();
	}

	



}
