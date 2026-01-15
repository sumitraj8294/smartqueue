import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";


import { createBooking } from "../../services/bookingService";
import { SLOTS } from "../../constants/slots";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function Book() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    date: "",
    timeSlot: "",
  });

  /* ================= NEW STATES ================= */
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* ================= HELPERS ================= */

  const isPastSlot = (slot: string) => {
    if (!form.date) return false;

    const selectedDate = new Date(form.date);
    const now = new Date();

    // Not today → allow
    if (selectedDate.toDateString() !== now.toDateString()) return false;

    const start = slot.replace("–", "-").split("-")[0].trim();
    const formatted = start.includes(":")
      ? start
      : start.replace(/(AM|PM)/, ":00 $1");

    const slotStart = new Date(
      `${form.date} ${formatted}`
    );

    return now >= slotStart;
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.gender ||
      !form.date ||
      !form.timeSlot
    ) {
      return alert("Please fill all fields");
    }

    try {
      await createBooking(form);
      router.replace("/(user)/myBooking");
    } catch (e: any) {
      alert(e.response?.data?.message || "Booking failed");
    }
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book a Slot</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {/* NAME */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />

        {/* PHONE */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="10-digit phone number"
          keyboardType="number-pad"
          maxLength={10}
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
        />

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
        />

        {/* GENDER */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.row}>
          {["Male", "Female", "Other"].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.chip,
                form.gender === g && styles.chipActive,
              ]}
              onPress={() => setForm({ ...form, gender: g })}
            >
              <Text
                style={[
                  styles.chipText,
                  form.gender === g && styles.chipTextActive,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DATE PICKER */}
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>
            {form.date || "Select date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={today}
            mode="date"
            minimumDate={today}
            onChange={(e, selected) => {
              setShowDatePicker(false);
              if (selected) {
                const yyyy = selected.getFullYear();
                const mm = String(selected.getMonth() + 1).padStart(2, "0");
                const dd = String(selected.getDate()).padStart(2, "0");

                setForm({
                  ...form,
                  date: `${yyyy}-${mm}-${dd}`,
                  timeSlot: "",
                });
              }
            }}
          />
        )}

        {/* TIME SLOT */}
        <Text style={styles.label}>Select Time Slot</Text>
        <View style={styles.row}>
          {SLOTS.map((slot) => {
            const disabled = isPastSlot(slot);

            return (
              <TouchableOpacity
                key={slot}
                disabled={disabled}
                style={[
                  styles.slot,
                  form.timeSlot === slot && styles.slotActive,
                  disabled && styles.slotDisabled,
                ]}
                onPress={() =>
                  setForm({ ...form, timeSlot: slot })
                }
              >
                <Text
                  style={[
                    styles.slotText,
                    form.timeSlot === slot && styles.slotTextActive,
                    disabled && styles.slotTextDisabled,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  form: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    fontSize: 15,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  chip: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  chipText: {
    color: COLORS.PRIMARY,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#fff",
  },

  slot: {
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  slotActive: {
    backgroundColor: COLORS.SECONDARY,
  },
  slotDisabled: {
    opacity: 0.4,
  },
  slotText: {
    fontSize: 13,
    color: COLORS.SECONDARY,
    fontWeight: "600",
  },
  slotTextActive: {
    color: "#fff",
  },
  slotTextDisabled: {
    color: "#999",
  },

  button: {
    backgroundColor: COLORS.SUCCESS,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
