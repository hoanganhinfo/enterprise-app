package tms.backend.test;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.hibernate.Criteria;
import org.hibernate.FlushMode;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.SessionFactoryUtils;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.context.ContextConfiguration;
import tms.backend.domain.AssyProductTest;
import tms.backend.domain.InjMold;
import tms.backend.domain.InjRegrindRate;
import tms.backend.service.AssyProductTestService;
import tms.backend.service.InjMoldService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:/tms/backend/conf/tms-service.xml")
@TransactionConfiguration
@Transactional
public class ImportAssyProduct {
	@Autowired
	private AssyProductTestService assyProductTestService;
	@Autowired
	private SessionFactory sessionFactory;

	@Test
	public void testImportPMD() {
		System.out.println("*** testImportPMD ***");
		Session session = SessionFactoryUtils.getSession(sessionFactory, true);
		FileInputStream fileInputStream;
		try {
			fileInputStream = new FileInputStream("D:/PMD.xls");

			HSSFWorkbook workbook = new HSSFWorkbook(fileInputStream);
			HSSFSheet worksheet = workbook.getSheet("Sheet1");
			// Iterate through the sheet rows and cells.
			// Store the retrieved data in an arrayList
			Transaction tx = session.beginTransaction();
			tx.begin();
			Iterator rows = worksheet.rowIterator();
			int i = 0;
			rows.next();
			while (rows.hasNext()) {
				HSSFRow row = (HSSFRow) rows.next();
				HSSFCell cellSerial = row.getCell(0);
				if (cellSerial != null
						&& StringUtils.isNotBlank(cellSerial
								.getStringCellValue())) {
					String serial = cellSerial.getStringCellValue().trim();
					Criterion cSerial = Restrictions.eq("serial", serial);
					List<AssyProductTest> list = assyProductTestService.getByCriteria(cSerial);
					if (list.size() > 0){
						AssyProductTest test = list.get(0);
						HSSFCell cellVacumm = row.getCell(1);
						double vacuum = cellVacumm.getNumericCellValue();
						HSSFCell cellLowSpeed = row.getCell(2);
						double lowSpeed = cellLowSpeed.getNumericCellValue();
						HSSFCell cellHighSpeed = row.getCell(3);
						double highSpeed = cellHighSpeed.getNumericCellValue();
						test.setParamData(String.format("9=%d;11=%d;12=%d;", (int)vacuum,(int)lowSpeed,(int)highSpeed));


					}

				}

			}
			tx.commit();
			session.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
