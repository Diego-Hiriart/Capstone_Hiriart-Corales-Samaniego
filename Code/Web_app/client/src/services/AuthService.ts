import axios from "./axios";
import { LoginFormInputs, SignupFormInputs } from "../types";

export const login = async (formData: LoginFormInputs) => {
  try {
    const { email, password } = formData;
    const response = await axios.post("/auth/login", {
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
    const response = await axios.post("/auth/signup", {
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
