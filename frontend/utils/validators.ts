export const isValidPhone = (p:string) => /^\d{10}$/.test(p);
export const isValidEmail = (e:string) => /\S+@\S+\.\S+/.test(e);
