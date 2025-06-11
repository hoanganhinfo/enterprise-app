package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.QCInspectionDefectDAO;
import tms.backend.domain.QcInspectionDefect;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class QcInspectionDefectServiceImpl extends
		GenericBizImpl<QcInspectionDefect, Long> implements QcInspectionDefectService {
	@Autowired
	private QCInspectionDefectDAO qCInspectionDefectDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<QcInspectionDefect, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return qCInspectionDefectDAO;
	}

	@Override
	public List<QcInspectionDefect> getAll() {
		// TODO Auto-generated method stub
		return qCInspectionDefectDAO.findAll();
	}




}
