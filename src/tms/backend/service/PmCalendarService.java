package tms.backend.service;

import java.util.List;

import common.hibernate.GenericBiz;
import tms.backend.domain.PmCalendar;



/**
 * User: anhphan
 * Date: Dec 07, 2013
 * Time: 8:38:36 AM
 */
public interface PmCalendarService extends GenericBiz<PmCalendar, Long> {
	public List<PmCalendar> getByProjectId(Long projectId);
	public PmCalendar getMaincalendarByProjectId(Long projectId);


}
