import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function Home() {
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SmartQueue</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(user)/book")}
        >
          <Text style={styles.cardTitle}>📅 Book a Slot</Text>
          <Text style={styles.cardDesc}>
            Reserve your place and get live ETA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(user)/myBooking")}
        >
          <Text style={styles.cardTitle}>⏱ My Booking</Text>
          <Text style={styles.cardDesc}>
            View status, ETA or cancel booking
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  /* HEADER */
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  logout: {
    color: "#fff",
    fontWeight: "600",
  },

  /* BODY */
  body: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: "#636e72",
  },
});
