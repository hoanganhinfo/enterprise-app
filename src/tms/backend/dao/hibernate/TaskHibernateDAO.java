package tms.backend.dao.hibernate;

import java.util.List;

import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tms.backend.dao.TaskDAO;
import tms.backend.domain.Task;

import common.hibernate.AbstractHibernateDAO;



/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
@Component
public class TaskHibernateDAO extends
		AbstractHibernateDAO<Task, Long> implements
		TaskDAO {
	@Autowired
	public TaskHibernateDAO(SessionFactory sessionFactory) {
		super(Task.class);
		super.setSessionFactory(sessionFactory);

	}
	@Override
	public List<Task> getTaskByCriteria(Criterion... criterion) {
		// TODO Auto-generated method stub
		return this.findByCriteria(criterion);
	}	
	
}
