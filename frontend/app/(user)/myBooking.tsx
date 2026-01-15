import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";

import { getMyBooking, cancelBooking } from "../../services/bookingService";
import { useCountdown } from "../../hooks/useCountdown";
import { COLORS } from "../../constants/colors";

export default function MyBooking() {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    setLoading(true);
    const b = await getMyBooking();
    setBooking(b);
    setLoading(false);
  };

  useEffect(() => {
    loadBooking();
  }, []);

  const cancel = async () => {
    Alert.alert("Cancel Booking", "Are you sure?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await cancelBooking(booking._id);
          router.replace("/(user)/home");
        },
      },
    ]);
  };

  /* ✅ HOOK MUST ALWAYS BE CALLED */
  const countdown = useCountdown(booking?.serviceStartedAt);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text>Loading booking...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text>No active booking</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{booking.name}</Text>

        <Text>📅 {booking.date}</Text>
        <Text>🕒 {booking.timeSlot}</Text>

        {/* ETA */}
        {booking.status === "PENDING" && booking.etaTime && (
          <Text style={styles.eta}>
            ETA:{" "}
            {new Date(booking.etaTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}

        {/* NOW SERVING */}
        {booking.status === "IN_SERVICE" && (
          <View style={styles.nowServing}>
            <Text style={styles.nowText}>NOW SERVING</Text>
            <Text style={styles.timer}>⏱ {countdown.display}</Text>
          </View>
        )}

        {/* CANCEL */}
        {booking.status === "PENDING" && (
          <TouchableOpacity style={styles.cancelBtn} onPress={cancel}>
            <Text style={styles.cancelText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 14,
  },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  eta: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    marginTop: 10,
  },

  nowServing: {
    backgroundColor: "#dff9fb",
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    alignItems: "center",
  },
  nowText: { fontWeight: "800", color: "#0984e3" },
  timer: { fontSize: 18, fontWeight: "700", marginTop: 4 },

  cancelBtn: {
    backgroundColor: COLORS.DANGER,
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  cancelText: { color: "#fff", textAlign: "center", fontWeight: "700" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
