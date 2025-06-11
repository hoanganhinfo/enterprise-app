package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum PermissionType {
	READ(0,"Read"),
	EDIT(1,"Edit"),
	CREATE(2,"Create"),
	FULL(3, "Full");
	
	private int value;
	private String label;
	private static final Map<Integer, PermissionType> typesByValue = new HashMap<Integer, PermissionType>();
	static {
		for (PermissionType type : PermissionType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static PermissionType forValue(int value) {
		return typesByValue.get(value);
	}

	private PermissionType(int _value, String _label) {
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
	public static ArrayList<PermissionType> getPermissionList() {
		ArrayList<PermissionType> data = new ArrayList<PermissionType>();
		data.add(PermissionType.FULL);
		data.add(PermissionType.CREATE);
		data.add(PermissionType.EDIT);
		data.add(PermissionType.READ);
		return data;
	}

}
