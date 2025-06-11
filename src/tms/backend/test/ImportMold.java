package tms.backend.test;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
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

import tms.backend.domain.InjMold;
import tms.backend.domain.InjRegrindRate;
import tms.backend.service.InjMoldService;
import tms.backend.service.InjRegrindRateService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:/tms/backend/conf/tms-service.xml")
@TransactionConfiguration
@Transactional
public class ImportMold {
	@Autowired
	private InjMoldService injMoldService;
	@Autowired
	private InjRegrindRateService injRegrindRateService;
	@Autowired
	private SessionFactory sessionFactory;

	@Test
	public void testImportMold() {
		System.out.println("*** testImportMold ***");
		Session session = SessionFactoryUtils.getSession(sessionFactory, true);
		FileInputStream fileInputStream;
		try {
			fileInputStream = new FileInputStream("D:/BOM.xls");

			HSSFWorkbook workbook = new HSSFWorkbook(fileInputStream);
			HSSFSheet worksheet = workbook.getSheet("Mold");
			// Iterate through the sheet rows and cells.
			// Store the retrieved data in an arrayList
			Transaction tx = session.beginTransaction();
			tx.begin();
			Iterator rows = worksheet.rowIterator();
			int i = 0;
			rows.next();
			while (rows.hasNext()) {
				HSSFRow row = (HSSFRow) rows.next();
				HSSFCell cellProjectName = row.getCell(0);
				InjMold injMold;
				if (cellProjectName != null
						&& StringUtils.isNotBlank(cellProjectName
								.getStringCellValue())) {
					injMold = new InjMold();
					injMold.setProjectName(cellProjectName.getStringCellValue()
							.trim());
					HSSFCell cellMoldCode = row.getCell(1);
					injMold.setMoldCode(cellMoldCode.getStringCellValue()
							.trim());
					HSSFCell cellProductCode = row.getCell(2);
					injMold.setProductCode(cellProductCode.getStringCellValue()
							.trim());
					HSSFCell cellProductName = row.getCell(3);
					injMold.setProductName(cellProductName.getStringCellValue()
							.trim());
					HSSFCell cellCavities = row.getCell(4);
					double cavities = cellCavities.getNumericCellValue();
					injMold.setCavity((int) cavities);
					HSSFCell cellColor = row.getCell(5);
					injMold.setColor(cellColor.getStringCellValue().trim());
					injMoldService.save(injMold);
					System.out.println(injMold.getProjectName() + " - "
							+ injMold.getMoldCode() + " - "
							+ injMold.getProductCode() + " - "
							+ injMold.getProductName() + " - "
							+ injMold.getColor() + " - " + injMold.getCavity());
				}

			}
			tx.commit();
			session.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	 @Test
	 public void testImportRegrindRate() {
	        System.out.println("*** testImportRegrindRate ***");
	        Session session = SessionFactoryUtils.getSession(sessionFactory, true);
	        FileInputStream fileInputStream;
	        String productCode = "";
			try {
				fileInputStream = new FileInputStream("D:/RegrindRate.xls");
			
			HSSFWorkbook workbook = new HSSFWorkbook(fileInputStream);
			HSSFSheet worksheet = workbook.getSheet("RegrindRate");
			// Iterate through the sheet rows and cells. 
            // Store the retrieved data in an arrayList
			Transaction tx =  session.beginTransaction();
			tx.begin();
			Iterator rows = worksheet.rowIterator();
            int i=0;
            rows.next();
            InjRegrindRate injRegrindRate;
            while (rows.hasNext()) {
                HSSFRow row = (HSSFRow) rows.next();
                HSSFCell cellProjectName = row.getCell(0);
                if (cellProjectName != null && StringUtils.isNotBlank(cellProjectName.getStringCellValue())){
                	injRegrindRate = new InjRegrindRate();
                	HSSFCell cellProductCode = row.getCell(1);
                	productCode = cellProductCode.getStringCellValue().trim();
                	injRegrindRate.setProductCode(cellProductCode.getStringCellValue().trim());
                	HSSFCell cellProductName = row.getCell(2);
                	injRegrindRate.setProductName(cellProductName.getStringCellValue().trim());
                	HSSFCell cellMaterialCode = row.getCell(3);
                	injRegrindRate.setVirginMaterialCode(cellMaterialCode.getStringCellValue().trim());
                	HSSFCell cellMaterialName = row.getCell(4);
                	injRegrindRate.setVirginMaterialName(cellMaterialName.getStringCellValue().trim());
                	HSSFCell cellMasterBatchCode = row.getCell(5);
                	injRegrindRate.setMasterbatchCode(cellMasterBatchCode.getStringCellValue().trim());
                	HSSFCell cellMasterBatchName = row.getCell(6);
                	injRegrindRate.setMasterbatchName(cellMasterBatchName.getStringCellValue().trim());
                	try{
                	HSSFCell cellColorrate = row.getCell(9);
                	injRegrindRate.setColorRate(cellColorrate.getNumericCellValue()*100);
                	}catch(Exception e){
                		System.out.println("Color rate "+ injRegrindRate.getProductCode());
                	}
                	try{
                	HSSFCell cellRegrindrate = row.getCell(10);
                	injRegrindRate.setRegrindRate(cellRegrindrate.getNumericCellValue()*100);
                	}catch(Exception e){
                		
                	}
                	try{
                	HSSFCell cellConstantScrap = row.getCell(11);
                	injRegrindRate.setConstantScrap(cellConstantScrap.getNumericCellValue()*100);
                	}catch(Exception e){
                		
                	}
                	try{
                	HSSFCell cellRunnerWeight = row.getCell(13);
                	injRegrindRate.setRunnerWeight(cellRunnerWeight.getNumericCellValue());
                	}catch(Exception e){
                		
                	}
                	try{
                	HSSFCell cellShotWeight = row.getCell(14);
                	injRegrindRate.setProductWeight(cellShotWeight.getNumericCellValue());
                	}catch(Exception e){
                		
                	}
                	System.out.println(String.format("%s - %s - %.2f - %.2f - %.2f - %.2f - %.2f", 
                			injRegrindRate.getProductCode(),
                			injRegrindRate.getMasterbatchCode(),
                			injRegrindRate.getColorRate(),
                			injRegrindRate.getRegrindRate(),
                			injRegrindRate.getConstantScrap(),
                			injRegrindRate.getRunnerWeight(),
                			injRegrindRate.getProductWeight()));
                	
                	try{
                	injRegrindRateService.save(injRegrindRate);
                	}catch(Exception e){
                		e.printStackTrace();
                	}
                	
                	
                	
                }
				
                
            }
            tx.commit();
            session.close();
			} catch (IOException e) {
				System.out.println(productCode);
				// TODO Auto-generated catch block
				e.printStackTrace();
			}


	        
	    } 
}
