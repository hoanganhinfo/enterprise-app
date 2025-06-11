package tms.backend.dao;

import java.util.List;

import tms.backend.domain.PmProject;

import common.hibernate.GenericDAO;





/**
 * User: anhphan Date: Nov 6, 2012 Time: 11:15:57 AM
 */
public interface PmProjectDAO extends GenericDAO<PmProject, Long> {
	public List<PmProject> getByDepartment(Long departmentId);
}
