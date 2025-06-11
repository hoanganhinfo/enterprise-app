package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum DocumentType {
	ALL(0, "All"),
	OPEN(1,"Open"),
	SUBMITTED(2,"Submitted"),
	APPROVED(3,"Approved"),
	SHIPPED(4,"Shipped"),
	REJECTED(5,"Rejected");
	private int value;
	private String label;
	private static final Map<Integer, DocumentType> typesByValue = new HashMap<Integer, DocumentType>();
	static {
		for (DocumentType type : DocumentType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static DocumentType forValue(int value) {
		return typesByValue.get(value);
	}
	public static DocumentType fromString(String text) {
		    if (text != null) {
		      for (DocumentType  _enum: DocumentType.values()) {
		        if (text.equalsIgnoreCase(_enum.label)) {
		          return _enum;
		        }
		      }
		    }
		    return null;
		  }
	private DocumentType(int _value, String _label) {
		this.value = _value;
		this.label = _label;
	}

	public byte getValue() {
		return Byte.valueOf(String.valueOf(value));
	}

	public String getLabel() {
		return label;
	}

	@Override
	public String toString() {
		return label;
	}

	public static String[] labels() {
		String[] a = new String[7];
		// a[0] = SUNDAY.getLabel();
		// a[1] = MONDAY.getLabel();
		// a[2] = TUESDAY.getLabel();
		// a[3] = WEDNESDAY.getLabel();
		// a[4] = THURSDAY.getLabel();
		// a[5] = FRIDAY.getLabel();
		// a[6] = SATURDAY.getLabel();
		return a;
	}

	public static ArrayList<DocumentType> getDocumentList() {
		ArrayList<DocumentType> data = new ArrayList<DocumentType>();
		data.add(DocumentType.OPEN);
		data.add(DocumentType.SUBMITTED);
		data.add(DocumentType.APPROVED);
		data.add(DocumentType.SHIPPED);
		data.add(DocumentType.REJECTED);
		return data;
	}

	public static ArrayList<DocumentType> getAllScopeTaskList() {
		ArrayList<DocumentType> data = new ArrayList<DocumentType>();
		data.add(DocumentType.ALL);
		data.add(DocumentType.OPEN);
		data.add(DocumentType.SUBMITTED);
		data.add(DocumentType.APPROVED);
		data.add(DocumentType.SHIPPED);
		return data;
	}

}
