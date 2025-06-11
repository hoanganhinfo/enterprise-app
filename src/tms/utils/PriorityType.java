package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum PriorityType {
	ALL(0, "All"),
	HIGH(1,"High"),
	MEDIUM(2,"Medium"),
	LOW(3,"Low"),
	CRITICAL(4,"Critical"),
	MAJOR(5,"Major"),
	MINOR(6,"Minor");
	private int value;
	private String label;
	private static final Map<Integer, PriorityType> typesByValue = new HashMap<Integer, PriorityType>();
	static {
		for (PriorityType type : PriorityType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static PriorityType forValue(int value) {
		return typesByValue.get(value);
	}

	private PriorityType(int _value, String _label) {
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

	public static ArrayList<PriorityType> getPriorityList() {
		ArrayList<PriorityType> data = new ArrayList<PriorityType>();
		data.add(PriorityType.HIGH);
		data.add(PriorityType.MEDIUM);
		data.add(PriorityType.LOW);
		return data;
	}
	public static ArrayList<PriorityType> getDefectLevelList() {
		ArrayList<PriorityType> data = new ArrayList<PriorityType>();
		data.add(PriorityType.CRITICAL);
		data.add(PriorityType.MAJOR);
		data.add(PriorityType.MINOR);
		return data;
	}	
	public static ArrayList<PriorityType> getAllPriorityList() {
		ArrayList<PriorityType> data = new ArrayList<PriorityType>();
		data.add(PriorityType.ALL);
		data.add(PriorityType.HIGH);
		data.add(PriorityType.MEDIUM);
		data.add(PriorityType.LOW);
		return data;
	}

}
