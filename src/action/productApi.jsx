// api.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
});

export const userRegisterApi = async (userData) => {
  const response = await axiosClient.post("/users", userData);
  return response.data;
};

export const loginUserApi = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
};

export const loginProfileApi = async (accessToken) => {
  const response = await axiosClient.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const productListApi = async () => {
  const response = await axiosClient.get("/products");
  return response.data;
};

export const productCategoriApi = async () => {
  const response = await axiosClient.get("/categories");
  return response.data;
};

export const productViewiApi = async ({ id }) => {
  const response = await axiosClient.get(`/products/${id}`);
  return response.data;
};
