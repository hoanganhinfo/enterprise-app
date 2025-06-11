package tms.backend.test;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;

import tms.backend.domain.WellingtonTest;
import tms.utils.DocumentType;



public class TestEnum {

	/**
	 * @param argst
	 */
	public static void main(String[] args) {
//		try {
		DocumentType e = DocumentType.fromString("Open");
		System.out.println(e.getLabel());
		return;
//		WellingtonTest w1 = new WellingtonTest();
//		w1.setMotorSerial("w1");
//		w1.setMotorType("ECR01");
//		w1.setDatetested(Calendar.getInstance().getTime());
//		Thread.sleep(2000);
//		
//		WellingtonTest w2 = new WellingtonTest();
//		w2.setMotorSerial("w1");
//		w2.setMotorType("ECR01");
//		w2.setDatetested(Calendar.getInstance().getTime());
//		Thread.sleep(2000);
//		
//		WellingtonTest w3 = new WellingtonTest();
//		w3.setMotorSerial("w1");
//		w3.setMotorType("ECR01");
//		w3.setDatetested(Calendar.getInstance().getTime());
//		ArrayList<WellingtonTest> list = new ArrayList<WellingtonTest>();
//		list.add(w1);
//		list.add(w2);
//		list.add(w3);
//		try{
//		Collections.sort(list, new Comparator<WellingtonTest>(){
//
//			@Override
//			public int compare(WellingtonTest o2,WellingtonTest o1) {
//				// TODO Auto-generated method stub
//				//long d1 =  o1.getDatetested().getTime();
//				//long d2 = o2.getDatetested().getTime();
//				//return  (int)(d1 - d2);
//				try{
//				if (o1.getDatetested() != null && o2.getDatetested() != null){
//					return o1.getDatetested().compareTo(o2.getDatetested());
//				}
//				if (o1.getDatetimepacked() != null && o2.getDatetimepacked() != null){
//					return o1.getDatetimepacked().compareTo(o2.getDatetimepacked());
//				}
//				}catch(Exception e){
//					return 	o1.getId().compareTo(o2.getId());
//				}
//				return 	o1.getId().compareTo(o2.getId());
//				
//			}
//	          
//	       });
//		for(WellingtonTest w : list){
//			System.out.println(w.getDatetested());
//		}
//		}catch(Exception e){
//			e.printStackTrace();
//		}		
//		} catch (InterruptedException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
	}

}
