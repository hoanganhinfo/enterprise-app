package tms.backend.service;

import java.util.List;


import common.hibernate.GenericBiz;
import tms.backend.domain.PmProjectType;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface PmProjectTypeService extends GenericBiz<PmProjectType, Long> {
	public List<PmProjectType> getActiveProjectTypes();


}
