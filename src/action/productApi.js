import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
});

export const userRegisterApi = async (userData) => {
  const response = await axiosClient.post("/users", userData);
  return response.data;
};
export const userUpdateApi = async (id, userData) => {
  const response = await axiosClient.put(`/users/${id}`, userData);
  return response.data;
};

export const userProfileGetApi = async (id, accessToken) => {
  const response = await axiosClient.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
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
export const productListUpdateApi = async (productData, accessToken) => {
  const response = await axiosClient.post("/products", productData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const productDeleteApi = async (productId) => {
  const response = await axiosClient.delete(`/products/${productId}`);
  return response.data;
};

export const productCategoriApi = async () => {
  const response = await axiosClient.get("/categories");
  return response.data;
};

export const productCategoriUpdateApi = async (formData) => {
  const response = await axiosClient.post("/categories", formData);
  return response.data;
};

export const productCategoriDeleteApi = async (categoriestId) => {
  const response = await axiosClient.delete(`/categories/${categoriestId}`);
  return response.data;
};

export const productViewiApi = async ({ id }) => {
  const response = await axiosClient.get(`/products/${id}`);
  return response.data;
};

export const productUpdateApi = async ({
  showUpdateProductId,
  payload,
  accessToken,
}) => {
  const response = await axiosClient.put(
    `/products/${showUpdateProductId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const uploadImageApi = async (formData) => {
  const res = await axiosClient.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const categorytUpdateApi = async ({
  categoryToUpdate,
  payload,
  accessToken,
}) => {
  const response = await axiosClient.put(
    `/categories/${categoryToUpdate}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
