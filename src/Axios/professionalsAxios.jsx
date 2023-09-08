import axios from "axios";
import { professionalsAPI } from "../Constants/api";
import { useSelector } from "react-redux";

const createProfessionalInstance = () => {
  const token = useSelector((store) => store.professional.Token);

  const proInstance = axios.create({
    baseURL: professionalsAPI,
  });

  proInstance.interceptors.request.use(
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
  return proInstance;
};

export default createProfessionalInstance;
