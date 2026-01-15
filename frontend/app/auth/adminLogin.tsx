import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { adminLogin } from "../../services/authService";
import { router } from "expo-router";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      await adminLogin(email, password);
      router.replace("/(admin)/dashboard");
    } catch (e: any) {
      alert("Invalid admin credentials");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Admin Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity onPress={submit}><Text>Login</Text></TouchableOpacity>
    </View>
  );
}
