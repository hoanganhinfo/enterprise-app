package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum WorkflowActionType {
	ALL(0, "All"),
	DRAFT(1,"Draft"),
	SUBMIT(2,"Submit"),
	APPROVE(3,"Approve"),
	REJECT(4,"Reject");

	private int value;
	private String label;
	private static final Map<Integer, WorkflowActionType> typesByValue = new HashMap<Integer, WorkflowActionType>();
	static {
		for (WorkflowActionType type : WorkflowActionType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static WorkflowActionType forValue(int value) {
		return typesByValue.get(value);
	}

	private WorkflowActionType(int _value, String _label) {
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



}
