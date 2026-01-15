import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = (data:any) =>
  api.post("/auth/register", data);

export const loginUser = async (phone:string, password:string) => {
  const res = await api.post("/auth/login", { phone, password });
  await AsyncStorage.setItem("token", res.data.token);
};

export const adminLogin = async (email:string, password:string) => {
  const res = await api.post("/auth/admin-login", { email, password });
  await AsyncStorage.setItem("token", res.data.token);
};
