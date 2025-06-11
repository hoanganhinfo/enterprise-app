package tms.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public enum TransType {
	ALL(0, "All"),
	INCOMING(1,"Incoming"),
	INJECTION(2,"Injection"),
	SMT(3,"SMT"),
	OUTGOING(4,"Outgoing"),
	HAND_OVER(6,"Hand over"),
	RETURN(9,"Return"),
	DISPLOSE(10,"Dispose");
	private int value;
	private String label;
	private static final Map<Integer, TransType> typesByValue = new HashMap<Integer, TransType>();
	static {
		for (TransType type : TransType.values()) {
			typesByValue.put(type.value, type);
		}
	}

	public static TransType forValue(int value) {
		return typesByValue.get(value);
	}

	private TransType(int _value, String _label) {
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

	public static ArrayList<TransType> getQCTransType() {
		ArrayList<TransType> data = new ArrayList<TransType>();
		data.add(TransType.INCOMING);
		data.add(TransType.OUTGOING);
		data.add(TransType.INJECTION);
		data.add(TransType.SMT);
		return data;
	}
	public static ArrayList<TransType> getAllQCTransType() {
		ArrayList<TransType> data = new ArrayList<TransType>();
		data.add(TransType.ALL);
		data.add(TransType.INCOMING);
		data.add(TransType.INJECTION);
		data.add(TransType.SMT);
		data.add(TransType.OUTGOING);
		return data;
	}

}
