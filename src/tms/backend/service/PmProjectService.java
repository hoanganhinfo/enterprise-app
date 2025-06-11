package tms.backend.service;

import java.util.List;
import java.util.Map;

import org.hibernate.criterion.Criterion;

import common.hibernate.GenericBiz;
import tms.backend.domain.Asset;
import tms.backend.domain.AssetCategory;
import tms.backend.domain.PmProject;
import tms.backend.domain.Task;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface PmProjectService extends GenericBiz<PmProject, Long> {
	List<PmProject> getByDepartment(String departmentId);
	List<PmProject> getByCriteria(Criterion... criterion);

}
