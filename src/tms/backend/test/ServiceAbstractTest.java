package tms.backend.test;

import junit.framework.TestCase;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
		"classpath:/hms/backend/conf/hms-service.xml" })
		
public abstract class ServiceAbstractTest extends TestCase {
	@Autowired
	protected ApplicationContext ctx;
   

}