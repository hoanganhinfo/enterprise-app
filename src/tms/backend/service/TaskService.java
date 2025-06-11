package tms.backend.service;

import java.util.List;
import java.util.Map;

import org.hibernate.criterion.Criterion;

import common.hibernate.GenericBiz;
import tms.backend.domain.Task;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface TaskService extends GenericBiz<Task, Long> {
	public Task findByUser(long userId);
	public List<Task> getTaskByDepartment(Map map,String departmentId);
	public List<Task> getTaskByRequester(Map map,Integer userId);
	public List<Task> getTaskByCriteria(Criterion... criterion);
}
