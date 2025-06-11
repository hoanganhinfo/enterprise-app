package tms.backend.service;

import java.util.List;

import common.hibernate.GenericBiz;
import tms.backend.domain.PmProjectTask;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface PmProjectTaskService extends GenericBiz<PmProjectTask, Long> {
	public List<PmProjectTask> getByParentId(Long parentId);


}
