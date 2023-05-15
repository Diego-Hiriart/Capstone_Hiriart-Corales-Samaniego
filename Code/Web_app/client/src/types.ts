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

export type Fencer = {
  fencerID: number;
  userID: number | null;
  trainingGroupID: number;
  idNumber: string;
  emergencyPhone: string;
  birthDate: Date;
  bloodType: string;
  sex: string;
  laterality: string;
  phone: string;
  insurance: string;
  inscriptionDate: Date;
  startDate: Date;
  occupation: string;
  schedule: string;
  legalGuardian: string;
  leadSource: string;
  inscriptionReason: string;
  height: number;
  weight: number;
  physicalActivity: string;
  medicalFamily: string;
  medicalPersonal: string;
  personalMedicalDetails: string;
  weapon: string;
  pictureURL: string;
  guestName: string | null;
  user: User;
};
