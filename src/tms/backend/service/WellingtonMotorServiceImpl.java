package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.WellingtonMotorDAO;
import tms.backend.dao.WellingtonTestDAO;
import tms.backend.domain.WellingtonMotor;
import tms.backend.domain.WellingtonTest;
import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class WellingtonMotorServiceImpl extends
		GenericBizImpl<WellingtonMotor, Long> implements WellingtonMotorService {
	@Autowired
	private WellingtonMotorDAO wellingtonMotorDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<WellingtonMotor, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return wellingtonMotorDAO;
	}

	@Override
	public List<WellingtonMotor> getAll() {
		// TODO Auto-generated method stub
		return wellingtonMotorDAO.findAll();
	}


}
