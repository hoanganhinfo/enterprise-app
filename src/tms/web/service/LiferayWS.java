package tms.web.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SessionFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import com.liferay.portal.kernel.dao.orm.QueryUtil;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.model.User;
import com.liferay.portal.service.UserLocalServiceUtil;

import tms.backend.domain.AssetCategory;
import tms.backend.service.AssetCategoryService;
import tms.utils.StatusType;

@Controller
public class LiferayWS extends MultiActionController {
	@Autowired
	private AssetCategoryService assetCategoryService;

	@Autowired
	private SessionFactory sessionFactory;


	@RequestMapping("/getUsers")
	public void getUsers(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();
		// String myOrgs = request.getParameter("myOrgs");
		String departmentId = request.getParameter("departmentId");
		JSONObject jsonUser;
		try {
			List<User> userList = UserLocalServiceUtil.getUsers(0, UserLocalServiceUtil.getUsersCount());
			for(User user : userList){
				jsonUser= new JSONObject();
				jsonUser.put("id", user.getUserId());
				jsonUser.put("email", user.getEmailAddress());
				jsonUser.put("fullName", user.getFullName());
				jsonUser.put("screenName", user.getScreenName());
				array.add(jsonUser);
			}
			obj.put("UserList", array);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (SystemException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}


	@RequestMapping("/getStatusList")
	public void getStatusList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();

		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();

		try {
			List<StatusType> list = StatusType.getTaskStatusList();
			JSONObject jsonStatus;
			for (StatusType status : list) {
				jsonStatus = new JSONObject();
				jsonStatus.put("id", status.getValue());
				jsonStatus.put("taskname", status.getLabel());
				array.add(jsonStatus);
			}
			obj.put("statusList", array);
			obj.put("message", 0);
			obj.put("success", true);
		} catch (Exception e) {
			obj.put("message", -1);
			obj.put("success", false);
			e.printStackTrace();
		}
		out.print(obj);
		out.flush();
	}



}
