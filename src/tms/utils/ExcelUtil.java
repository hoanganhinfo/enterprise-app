package tms.utils;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public class ExcelUtil {
	public static HSSFCellStyle getNumericCellStyle(HSSFWorkbook wb) {
		HSSFCellStyle cellStyle = wb.createCellStyle();
		HSSFDataFormat df = wb.createDataFormat();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
		cellStyle.setDataFormat(df.getFormat("#,##0.00"));
		return cellStyle;
	}

	public static HSSFCellStyle getTextCellStyle(HSSFWorkbook wb) {
		HSSFCellStyle cellStyle = wb.createCellStyle();
		HSSFDataFormat df = wb.createDataFormat();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
		cellStyle.setDataFormat(df.getFormat("@"));
		return cellStyle;
	}
}
