package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum TaskRequestType {
	BLANK(0, ""),
	URGENT(1,"Urgent"),
	SAFETY(2,"Safety"),
	CORRECTIVE(3,"Corrective"),
	PREVENTIVE(4,"Preventive"),
	MAINTENANCE(5,"Maintenance"),
	IMPROVEMENT(6,"Improvement");
	private int value;
	private String label;
	private static final Map<Integer, TaskRequestType> typesByValue = new HashMap<Integer, TaskRequestType>();
	static {
		for (TaskRequestType type : TaskRequestType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static TaskRequestType forValue(int value) {
		return typesByValue.get(value);
	}

	private TaskRequestType(int _value, String _label) {
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


	public static ArrayList<TaskRequestType> getAllTaskRequestList() {
		ArrayList<TaskRequestType> data = new ArrayList<TaskRequestType>();
		data.add(TaskRequestType.BLANK);
		data.add(TaskRequestType.URGENT);
		data.add(TaskRequestType.SAFETY);
		data.add(TaskRequestType.CORRECTIVE);
		data.add(TaskRequestType.PREVENTIVE);
		data.add(TaskRequestType.MAINTENANCE);
		data.add(TaskRequestType.IMPROVEMENT);
		return data;
	}
	public static ArrayList<TaskRequestType> getTaskRequestList() {
		ArrayList<TaskRequestType> data = new ArrayList<TaskRequestType>();
		data.add(TaskRequestType.URGENT);
		data.add(TaskRequestType.SAFETY);
		data.add(TaskRequestType.CORRECTIVE);
		data.add(TaskRequestType.PREVENTIVE);
		data.add(TaskRequestType.MAINTENANCE);
		data.add(TaskRequestType.IMPROVEMENT);
		return data;
	}
}
