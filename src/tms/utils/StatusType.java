package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum StatusType {
	ALL(0, "All"),
	OPEN(1,"Open"),
	COMPLETED(2,"Completed"),
	ONHOLD(3,"On-hold"),
	CLOSE(4,"Closed"),
	AVAILABLE(5,"Available"),
	HAND_OVER(6,"Hand over"),
	LOAN(7,"Loan"),
	REPAIRING(8,"Repairing"),
	RETURN(9,"Return"),
	DISPLOSE(10,"Dispose"),
	CANCELLED(11,"Cancelled"),
	PRODUCTION(12,"Production"),
	TENTATIVE(13,"Tentative"),
	ON_SCHEDULE(14,"On schedule"),
	LATE(15,"Late"),
	APPROVED(16,"Approved"),
	PASSED(17,"Passed"),
	FAILED(18,"Failed")	,
	ACCEPTED(19,"Accepted"),
	DELETED(20,"Deleted"),
	REJECTED(21,"Rejected"),
	DRAFT(22,"Draft"),
	SUBMMITTED(23,"Submitted"),
	NOTE(24,"Note"),
	PROCESSING(25,"Processing");
	private int value;
	private String label;
	private static final Map<Integer, StatusType> typesByValue = new HashMap<Integer, StatusType>();
	static {
		for (StatusType type : StatusType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static StatusType forValue(int value) {
		return typesByValue.get(value);
	}

	private StatusType(int _value, String _label) {
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

	public static ArrayList<StatusType> getTaskStatusList() {
		ArrayList<StatusType> data = new ArrayList<StatusType>();
		data.add(StatusType.OPEN);
		data.add(StatusType.PROCESSING);
		data.add(StatusType.ON_SCHEDULE);
		data.add(StatusType.COMPLETED);
		data.add(StatusType.ONHOLD);
		data.add(StatusType.CANCELLED);
		data.add(StatusType.CLOSE);
		return data;
	}
	public static ArrayList<StatusType> getAllTaskStatusList() {
		ArrayList<StatusType> data = new ArrayList<StatusType>();
		data.add(StatusType.ALL);
		data.add(StatusType.OPEN);
		data.add(StatusType.PROCESSING);
		data.add(StatusType.ON_SCHEDULE);
		data.add(StatusType.COMPLETED);
		data.add(StatusType.ONHOLD);
		data.add(StatusType.CANCELLED);
		data.add(StatusType.CLOSE);
		return data;
	}
//	public static ArrayList<StatusType> getAllTaskStatusList() {
//		ArrayList<StatusType> data = new ArrayList<StatusType>();
//		data.add(StatusType.ALL);
//		data.add(StatusType.OPEN);
//		data.add(StatusType.COMPLETED);
//		data.add(StatusType.ONHOLD);
//		data.add(StatusType.CLOSE);
//		return data;
//	}
	public static ArrayList<StatusType> getAllProjectStatusList() {
		ArrayList<StatusType> data = new ArrayList<StatusType>();
		data.add(StatusType.ALL);
		data.add(StatusType.TENTATIVE);
		data.add(StatusType.OPEN);
		data.add(StatusType.ONHOLD);
		data.add(StatusType.CANCELLED);
		data.add(StatusType.PRODUCTION);
		data.add(StatusType.CLOSE);
		return data;
	}
	public static ArrayList<StatusType> getAllProductTest() {
		ArrayList<StatusType> data = new ArrayList<StatusType>();
		data.add(StatusType.ALL);
		data.add(StatusType.PASSED);
		data.add(StatusType.FAILED);
		return data;
	}
	public static ArrayList<StatusType> getAllQCInspector() {
		ArrayList<StatusType> data = new ArrayList<StatusType>();
		data.add(StatusType.ALL);
		data.add(StatusType.PASSED);
		data.add(StatusType.FAILED);
		data.add(StatusType.ACCEPTED);
		return data;
	}
}
