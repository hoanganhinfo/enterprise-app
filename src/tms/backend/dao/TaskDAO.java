package tms.backend.dao;

import java.util.List;



import org.hibernate.criterion.Criterion;

import common.hibernate.GenericDAO;
import tms.backend.domain.Task;





/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
public interface TaskDAO extends GenericDAO<Task, Long> {
	public List<Task> getTaskByCriteria(Criterion... criterion);	
}
