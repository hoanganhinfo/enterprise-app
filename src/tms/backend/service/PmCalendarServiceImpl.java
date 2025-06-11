package tms.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;
import tms.backend.dao.PmCalendarDAO;
import tms.backend.domain.PmCalendar;

/**
 * User: anhphan Date: Dec 07, 2013 Time: 8:38:03 AM
 */
@Service
public class PmCalendarServiceImpl extends
		GenericBizImpl<PmCalendar, Long> implements PmCalendarService {
	@Autowired
	private PmCalendarDAO pmCalendarDAO;
	Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<PmCalendar, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return pmCalendarDAO;
	}

	@Override
	public List<PmCalendar> getAll() {
		// TODO Auto-generated method stub
		return pmCalendarDAO.findAll();
	}


	@Override
	public List<PmCalendar> getByProjectId(Long projectId) {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();

		map.put("projectId", projectId);

		return (ArrayList<PmCalendar>) pmCalendarDAO.findByProperties(
				map, null, false, true, null, true);
	}

	@Override
	public PmCalendar getMaincalendarByProjectId(Long projectId) {
		// TODO Auto-generated method stub
		Map map = new HashMap<String, String>();

		map.put("projectId", projectId);
		map.put("calendarWeekday", Byte.parseByte("-1"));
		
		ArrayList<PmCalendar> list =  (ArrayList<PmCalendar>) pmCalendarDAO.findByProperties(
				map, null, true, true, null, true);
		if (list != null && list.size() > 0) return list.get(0);
		return null;
	}

	

}
