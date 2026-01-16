import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://smartqueue-4635.onrender.com",
  // baseURL: "http://11.11.1.105:5000",
//   baseURL: "http://10.77.119.157:5000",

   
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
