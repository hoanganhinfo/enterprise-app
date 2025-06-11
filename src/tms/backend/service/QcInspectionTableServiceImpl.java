package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.QCInspectionTableDAO;
import tms.backend.domain.QcInspectionTable;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class QcInspectionTableServiceImpl extends
		GenericBizImpl<QcInspectionTable, Long> implements QcInspectionTableService {
	@Autowired
	private QCInspectionTableDAO qCInspectionTableDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<QcInspectionTable, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return qCInspectionTableDAO;
	}

	@Override
	public List<QcInspectionTable> getAll() {
		// TODO Auto-generated method stub
		return qCInspectionTableDAO.findAll();
	}



}
