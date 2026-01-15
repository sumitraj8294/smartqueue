import api from "./api";

export const createBooking = (data:any) =>
  api.post("/booking/create", data);

export const getMyBooking = async () => {
  const res = await api.get("/booking/mine");
  return res.data; // already single booking or null
};


// export const getAllBookings = async () => {
//   const res = await api.get("/booking/all");
//   return res.data;
// };

// export const cancelBooking = async (id: string) => {
//   const res = await api.delete(`/booking/cancel/${id}`);
//   return res;
// };



export const getAllBookings = async () =>
  api.get("/booking/admin/all").then(res => res.data);

export const startService = async (id: string) =>
  api.post(`/booking/admin/start/${id}`);

export const completeBooking = async (id: string) =>
  api.put(`/booking/admin/complete/${id}`);

export const cancelBooking = async (id: string) =>
  api.delete(`/booking/admin/cancel/${id}`);
