package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum TaskActionType {
	ALL(0, "All"),
	NEW(1,""),
	CHECKING(2,"Checking"),
	REPAIRING(3,"Reparing"),
	OUTSIDE(4,"Send to outside"),
	PURCHASE(5,"Waiting for spare part"),
	BROKEN(6,"Cannot repair");
	private int value;
	private String label;
	private static final Map<Integer, TaskActionType> typesByValue = new HashMap<Integer, TaskActionType>();
	static {
		for (TaskActionType type : TaskActionType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static TaskActionType forValue(int value) {
		return typesByValue.get(value);
	}

	private TaskActionType(int _value, String _label) {
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


	public static ArrayList<TaskActionType> getAllTaskActionList() {
		ArrayList<TaskActionType> data = new ArrayList<TaskActionType>();
		data.add(TaskActionType.ALL);
		data.add(TaskActionType.NEW);
		data.add(TaskActionType.CHECKING);
		data.add(TaskActionType.REPAIRING);
		data.add(TaskActionType.OUTSIDE);
		data.add(TaskActionType.PURCHASE);
		data.add(TaskActionType.BROKEN);
		return data;
	}
	public static ArrayList<TaskActionType> getTaskActionList() {
		ArrayList<TaskActionType> data = new ArrayList<TaskActionType>();
		data.add(TaskActionType.NEW);
		data.add(TaskActionType.CHECKING);
		data.add(TaskActionType.REPAIRING);
		data.add(TaskActionType.OUTSIDE);
		data.add(TaskActionType.PURCHASE);
		data.add(TaskActionType.BROKEN);
		return data;
	}
}
