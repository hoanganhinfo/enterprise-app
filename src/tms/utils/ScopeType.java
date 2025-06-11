package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum ScopeType {
	ALL(0, "All"),
	COMPANY(1,"Company"),
	DEPARTMENT(2,"Department"),
	ASSIGNEE(3,"Assignee");
	private int value;
	private String label;
	private static final Map<Integer, ScopeType> typesByValue = new HashMap<Integer, ScopeType>();
	static {
		for (ScopeType type : ScopeType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static ScopeType forValue(int value) {
		return typesByValue.get(value);
	}

	private ScopeType(int _value, String _label) {
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

	public static ArrayList<ScopeType> getScopeTaskList() {
		ArrayList<ScopeType> data = new ArrayList<ScopeType>();
		data.add(ScopeType.COMPANY);
		data.add(ScopeType.DEPARTMENT);
		data.add(ScopeType.ASSIGNEE);
		return data;
	}
	public static ArrayList<ScopeType> getAllScopeTaskList() {
		ArrayList<ScopeType> data = new ArrayList<ScopeType>();
		data.add(ScopeType.ALL);
		data.add(ScopeType.COMPANY);
		data.add(ScopeType.DEPARTMENT);
		data.add(ScopeType.ASSIGNEE);
		return data;
	}

}
