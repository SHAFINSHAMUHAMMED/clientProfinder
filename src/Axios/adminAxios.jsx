import axios from "axios";
import { adminAPI } from "../Constants/api";
import { useSelector } from "react-redux";

const createAdminInstance = () => {
  const token = useSelector((store) => store.admin.Token);

  const adminInstance = axios.create({
    baseURL: adminAPI,
  });

  adminInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return adminInstance;
};
export default createAdminInstance;
