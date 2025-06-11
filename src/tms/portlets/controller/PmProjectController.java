package tms.portlets.controller;

import java.util.HashMap;
import java.util.List;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.ArrayUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.mvc.Controller;

import tms.backend.service.AssetService;

import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.User;
import com.liferay.portal.service.ClassNameLocalServiceUtil;
import com.liferay.portal.service.OrganizationLocalServiceUtil;
import com.liferay.portal.theme.ThemeDisplay;
import com.liferay.portlet.expando.model.ExpandoColumn;
import com.liferay.portlet.expando.model.ExpandoTable;
import com.liferay.portlet.expando.model.ExpandoValue;
import com.liferay.portlet.expando.service.ExpandoColumnLocalServiceUtil;
import com.liferay.portlet.expando.service.ExpandoTableLocalServiceUtil;
import com.liferay.portlet.expando.service.ExpandoValueLocalServiceUtil;

@org.springframework.stereotype.Controller
public class PmProjectController implements Controller, InitializingBean {
	@Autowired
	private AssetService assetService;

	public void afterPropertiesSet() throws Exception {

	}

	@RequestMapping("view")
	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) throws Exception {
		HttpServletRequest httpRequest = com.liferay.portal.util.PortalUtil
				.getOriginalServletRequest(com.liferay.portal.util.PortalUtil
						.getHttpServletRequest(request));
		// return new
		// ModelAndView("bondresearch/bondAdministration","bondCode",bondCode
		// !=null ? bondCode : "");
		System.out.println("load asset");
		ThemeDisplay themeDisplay = (ThemeDisplay) request
				.getAttribute(WebKeys.THEME_DISPLAY);
		
		User user = themeDisplay.getUser();
		// get list of organization
		List<Organization> organizations = OrganizationLocalServiceUtil
				.getOrganizations(user.getCompanyId(), 12404);
		List<Organization> myOrg = user.getOrganizations();
		String orgs="";
		for(Organization org : myOrg){
			orgs+=org.getOrganizationId() + ",";
		}
		System.out.println(organizations.size());
		JSONArray aDepartment = new JSONArray();

		
		JSONObject jsonOrg;
		jsonOrg = new JSONObject();
		long orgClassNameId = ClassNameLocalServiceUtil.getClassNameId(Organization.class.getName());
		ExpandoTable table = ExpandoTableLocalServiceUtil.getDefaultTable(user.getCompanyId(), orgClassNameId );
		ExpandoColumn column = ExpandoColumnLocalServiceUtil.getColumn(table.getTableId(), "Asset-admin");
		
		for (Organization org : organizations) {
			jsonOrg = new JSONObject();
			jsonOrg.put("orgId", org.getOrganizationId());
			jsonOrg.put("orgName", org.getName());
			ExpandoValue customValue =  ExpandoValueLocalServiceUtil.getValue(table.getTableId(), column.getColumnId(), org.getOrganizationId());
			if (customValue != null){
				jsonOrg.put("assetAdmin", customValue.getString().toLowerCase());
				String assetAdmin[] =  customValue.getString().toLowerCase().split(";");
				if (ArrayUtils.contains(assetAdmin, user.getEmailAddress().toLowerCase())){
					jsonOrg.put("isAdmin", true);
				}else{
					jsonOrg.put("isAdmin", false);
				}
			}else{
				jsonOrg.put("assetAdmin", "");
				jsonOrg.put("isAdmin", false);
			}
			aDepartment.add(jsonOrg);
		}

		HashMap map = new HashMap<String, String>();
		map.put("companyId", user.getCompanyId());
		map.put("userId", user.getUserId());
		map.put("userName", user.getScreenName());
		map.put("userEmail", user.getEmailAddress().toLowerCase());
		System.out.println("aDepartment: "+aDepartment);
		map.put("orgJsonData", aDepartment); 

		return new ModelAndView("app/PmProject", "param", map);
		
	}

	public void handleActionRequest(ActionRequest request,
			ActionResponse response) throws Exception {
	}



}
