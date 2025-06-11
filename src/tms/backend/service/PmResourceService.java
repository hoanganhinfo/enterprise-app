package tms.backend.service;

import java.util.List;

import common.hibernate.GenericBiz;
import tms.backend.domain.PmResource;



/**
 * User: anhphan
 * Date: June 19, 2012
 * Time: 8:38:36 AM
 */
public interface PmResourceService extends GenericBiz<PmResource, Long> {
	public List<PmResource> getResourceByProject(String projectId);

}
