import axios from "axios";
import { LoginFormInputs, SignupFormInputs } from "../types";

export const login = async (formData: LoginFormInputs) => {
  try {
    const { email, password } = formData;
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const signup = async (formData: SignupFormInputs) => {
  try {
    const { names, lastNames, email, password } = formData;
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      names,
      lastNames,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
