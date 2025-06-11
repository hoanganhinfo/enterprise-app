package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.InjRegrindRateDAO;
import tms.backend.domain.InjRegrindRate;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class InjRegrindRateServiceImpl extends
		GenericBizImpl<InjRegrindRate, Long> implements InjRegrindRateService {
	@Autowired
	private InjRegrindRateDAO injRegrindRateDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<InjRegrindRate, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return injRegrindRateDAO;
	}

	@Override
	public List<InjRegrindRate> getAll() {
		// TODO Auto-generated method stub
		return injRegrindRateDAO.findAll();
	}

	



}
