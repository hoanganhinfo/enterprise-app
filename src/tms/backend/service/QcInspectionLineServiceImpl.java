package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tms.backend.dao.QCInspectionLineDAO;
import tms.backend.domain.QcInspectionLine;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;

/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class QcInspectionLineServiceImpl extends
		GenericBizImpl<QcInspectionLine, Long> implements QcInspectionLineService {
	@Autowired
	private QCInspectionLineDAO qCInspectionLineDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<QcInspectionLine, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return qCInspectionLineDAO;
	}

	@Override
	public List<QcInspectionLine> getAll() {
		// TODO Auto-generated method stub
		return qCInspectionLineDAO.findAll();
	}



}
