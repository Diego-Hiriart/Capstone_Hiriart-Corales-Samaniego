export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface SignupForm {
  names: string;
  lastNames: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
}

export interface User {
  userID: number;
  names: string;
  lastNames: string;
  email: string;
  roles: string[];
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Trainer {
  trainerID: number;
  userID: number;
  experience: string;
  weapon: string;
  pictureURL: string;
  user: User;
}