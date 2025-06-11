package tms.backend.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;
import tms.backend.dao.AssyProductTestBarcodeDAO;
import tms.backend.domain.AssyProductTestBarcode;

/**
 * User: anhphan Date: April 13, 2018 Time: 8:38:03 AM
 */
@Service
public class AssyProductTestBarcodeServiceImpl extends
		GenericBizImpl<AssyProductTestBarcode, Long> implements AssyProductTestBarcodeService {
	@Autowired
	private AssyProductTestBarcodeDAO assyProductTestBarcodeDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<AssyProductTestBarcode, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return assyProductTestBarcodeDAO;
	}

	@Override
	public List<AssyProductTestBarcode> getAll() {
		// TODO Auto-generated method stub
		return assyProductTestBarcodeDAO.findAll();
	}


}
