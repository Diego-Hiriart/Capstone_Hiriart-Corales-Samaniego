export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface SignupFormInputs {
  names: string;
  lastNames: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  userID: number;
  names: string;
  lastNames: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}