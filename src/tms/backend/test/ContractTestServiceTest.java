package tms.backend.test;


import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

/**
 * User: sangnv
 * Date: Oct 6, 2008
 * Time: 8:48:57 AM
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:/hms/backend/conf/tms-service.xml")
@TransactionConfiguration
@Transactional
public class ContractTestServiceTest{

//	@Autowired
//	private
//	ContractService contractService;
//    @Test
//    public void testSaveActivationTest() {
//    	if (contractService != null)
//    	{
//    		System.out.println("a");
//    		List<Contract> contractList = contractService.findByHotel(1);
//    		for(Contract contract : contractList){
//				System.out.println(contract.getId());
//				System.out.println(contract.getCode());
//				System.out.println(contract.getName());
//				System.out.println(contract.getDescription());
//				if (contract.getRoom() != null){
//				System.out.println(contract.getRoom().getId());
//				System.out.println(contract.getRoom().getName());
//				}
//				System.out.println(contract.getStatus().getLabel());
//    		}
//    	}
//    }
  }
