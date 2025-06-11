package tms.backend.service;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;
import common.hibernate.GenericBizImpl;
import common.hibernate.GenericDAO;
import tms.backend.dao.TaskDAO;
import tms.backend.domain.Task;


/**
 * User: anhphan Date: June 19, 2012 Time: 8:38:03 AM
 */
@Service
public class TaskServiceImpl extends GenericBizImpl<Task, Long>
		implements TaskService,ApplicationContextAware {
	@Autowired
	private TaskDAO taskDAO;
	private static TaskService instance;

	private static ApplicationContext appContext;
    Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected GenericDAO<Task, Long> getGenericDAO() {
		// TODO Auto-generated method stub
		return taskDAO;
	}


	@Override
	public Task findByUser(long userId) {
		// TODO Auto-generated method stub
		return taskDAO.findEqualUnique("userid", Long.valueOf(userId));
	}


	public TaskDAO getTaskDAO() {
		return taskDAO;
	}


	public void setTaskDAO(TaskDAO taskDAO) {
		this.taskDAO = taskDAO;
	}


	@Override
	public List<Task> getAll() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public List<Task> getTaskByDepartment(Map map,String departmentId) {
		// TODO Auto-generated method stub
    //  Map map = new HashMap<String, String>();
      String[] orgs = departmentId.split(",");
      for(String org : orgs){
    	  map.put("department", org);  
      }
      
      return (ArrayList<Task>) taskDAO.findByProperties(map, null, false, true, null, true);
	}


	@Override
	public List<Task> getTaskByRequester(Map map,Integer userId) {
		// TODO Auto-generated method stub
//	      Map map = new HashMap<String, String>();
	      map.put("requesterId", userId);
	      return (ArrayList<Task>) taskDAO.findByProperties(map, null, true, true, null, true);
	}
	@Override
	public List<Task> getTaskByCriteria(Criterion... criterion) {
		// TODO Auto-generated method stub
		return taskDAO.getTaskByCriteria(criterion);
	}


	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		 System.out.println ("BeanAware.setApplicationContext (" + getClass ().getName()+")");
		Map beans = applicationContext.getBeansOfType (getClass ());
		instance = ((TaskService) beans.values (). iterator (). next ());

		this.appContext = applicationContext;
		
	}
	public static TaskService getInstance () {

			return instance;

	}

 }
