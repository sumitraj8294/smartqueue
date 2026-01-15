import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { loginUser, adminLogin } from "../../services/authService";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      if (isAdmin) {
        await adminLogin(email, password);
        router.replace("/(admin)/dashboard");
      } else {
        await loginUser(phone, password);
        router.replace("/(user)/home");
      }
    } catch (e: any) {
      alert(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isAdmin ? "Admin Login" : "User Login"}
      </Text>

      {!isAdmin && (
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
        />
      )}

      {isAdmin && (
        <TextInput
          style={styles.input}
          placeholder="Admin Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {!isAdmin && (
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.link}>
            Not registered? <Text style={styles.linkBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.divider} />

      <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)}>
        <Text style={styles.adminToggle}>
          {isAdmin ? "Login as User" : "Login as Admin"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: COLORS.PRIMARY,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#636e72",
  },
  linkBold: {
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 25,
  },
  adminToggle: {
    textAlign: "center",
    color: COLORS.DANGER,
    fontWeight: "600",
  },
});
