import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import {
  getAllBookings,
  startService,
  completeBooking,
  cancelBooking,
} from "../../services/bookingService";
import { useCountdown } from "../../hooks/useCountdown";
import { COLORS } from "../../constants/colors";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    const res = await getAllBookings();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/auth/login");
  };

  const handleStart = (id: string) => {
    Alert.alert("Start Service", "Start serving this booking?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await startService(id);
          loadBookings();
        },
      },
    ]);
  };

  const handleComplete = (id: string) => {
    Alert.alert("Complete Service", "Mark service as completed?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await completeBooking(id);
          loadBookings();
        },
      },
    ]);
  };

  const handleCancel = (id: string) => {
    Alert.alert("Cancel Booking", "Cancel this booking?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await cancelBooking(id);
          loadBookings();
        },
      },
    ]);
  };

  const formatETA = (date?: string) =>
    date
      ? new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Not calculated";

  const activeService = data.find((b) => b.status === "IN_SERVICE");

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={loadBookings}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.slot}>{item.timeSlot}</Text>
            </View>

            <StatusBadge status={item.status} />

            <Text style={styles.meta}>📞 {item.phone}</Text>
            <Text style={styles.meta}>📧 {item.email}</Text>

            <Text style={styles.meta}>
              ⏰ ETA: <Text style={styles.eta}>{formatETA(item.etaTime)}</Text>
            </Text>

            {item.status === "IN_SERVICE" && (
              <NowServing startTime={item.serviceStartedAt} />
            )}

            <View style={styles.actions}>
              {item.status === "PENDING" && !activeService && (
                <>
                  <TouchableOpacity
                    style={styles.startBtn}
                    onPress={() => handleStart(item._id)}
                  >
                    <Text style={styles.btnText}>Start</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancel(item._id)}
                  >
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}

              {item.status === "IN_SERVICE" && (
                <TouchableOpacity
                  style={styles.completeBtn}
                  onPress={() => handleComplete(item._id)}
                >
                  <Text style={styles.btnText}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

function NowServing({ startTime }: { startTime: string }) {
  const { display } = useCountdown(startTime);

  return (
    <View style={styles.nowServing}>
      <Text style={styles.nowText}>NOW SERVING</Text>
      <Text style={styles.timer}>⏱ {display}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Text
      style={[
        styles.status,
        status === "IN_SERVICE" && styles.inService,
        status === "COMPLETED" && styles.completed,
      ]}
    >
      {status.replace("_", " ")}
    </Text>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  logout: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    margin: 14,
    padding: 16,
    borderRadius: 14,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 16, fontWeight: "700" },
  slot: { fontSize: 14, color: "#636e72" },

  meta: { fontSize: 13, color: "#636e72", marginTop: 4 },
  eta: { color: COLORS.PRIMARY, fontWeight: "700" },

  status: { marginTop: 6, fontSize: 12, fontWeight: "700" },
  inService: { color: "#d35400" },
  completed: { color: "#27ae60" },

  nowServing: {
    backgroundColor: "#ffeaa7",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  nowText: { color: "#d35400", fontWeight: "800" },
  timer: { fontSize: 16, fontWeight: "700", marginTop: 4 },

  actions: {
    flexDirection: "row",
    marginTop: 14,
    justifyContent: "space-between",
  },
  startBtn: {
    flex: 1,
    backgroundColor: "#f39c12",
    padding: 10,
    borderRadius: 8,
    marginRight: 6,
    alignItems: "center",
  },
  completeBtn: {
    flex: 1,
    backgroundColor: COLORS.SUCCESS,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.DANGER,
    padding: 10,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
