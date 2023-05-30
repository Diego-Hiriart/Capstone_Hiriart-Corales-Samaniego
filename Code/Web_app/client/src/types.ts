export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface TrainingGroupWithFencers extends TrainingGroup {
  fencer: Fencer[];
}

/**
 * Model User
 *
 */
export type User = {
  userID: number;
  email: string;
  password: string;
  names: string;
  lastNames: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  trainer?: Trainer;
  fencer?: Fencer;
};

/**
 * Model Administrator
 *
 */
export type Administrator = {
  administratorID: number;
  userID: number;
};

/**
 * Model Trainer
 *
 */
export type Trainer = {
  trainerID: number;
  userID: number;
  experience: string;
  weapon: string;
  pictureURL: string | null;
};

/**
 * Model Fencer
 *
 */
export type Fencer = {
  fencerID: number;
  userID: number | null;
  trainingGroupID: number | null;
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

/**
 * Model WeeklyReport
 *
 */
export type WeeklyReport = {
  weeklyReportID: number;
  fencerID: number;
  trainerID: number;
  date: Date;
  content: string;
};

/**
 * Model SingleFeedback
 *
 */
export type SingleFeedback = {
  singleFeedbackID: number;
  fencerID: number;
  trainerID: number;
  date: Date;
  content: string;
};

/**
 * Model TrainingGroup
 *
 */
export type TrainingGroup = {
  trainingGroupID: number;
  name: string;
  weapon: string;
};

/**
 * Model CycleGoal
 *
 */
export type CycleGoal = {
  cycleGoalID: number;
  trainerID: number;
  fencerID: number;
  mesoCycleID: number;
  content: string;
  date: Date;
};

/**
 * Model CycleFeedback
 *
 */
export type CycleFeedback = {
  cycleFeedbackID: number;
  trainerID: number;
  fencerID: number;
  mesoCycleID: number;
  content: string;
  date: Date;
};

/**
 * Model MesoCycle
 *
 */
export type MesoCycle = {
  mesoCycleID: number;
  trainingGroupID: number;
  trainerID: number;
  name: string;
  startDate: Date;
  endDate: Date;
  period: string;
  stage: string;
  physicalScore: number;
  technicalScore: number;
  tacticalScore: number;
};

/**
 * Model MicroCycle
 *
 */
export type MicroCycle = {
  microCycleID: number;
  mesoCycleID: number;
  startDate: Date;
  speed: number | null;
  coordination: number | null;
  resistance: number | null;
  strength: number | null;
  individualLessons: number | null;
  groupLessons: number | null;
  pairWork: number | null;
  individualWork: number | null;
  technicalBasedCombats: number | null;
  trainingTournament: number | null;
  freeCombat: number | null;
  tacticalIndividualLesson: number | null;
  competitionAnalysis: number | null;
};

/**
 * Model DailyPlan
 *
 */
export type DailyPlan = {
  dailyPlanID: number;
  microCycleID: number;
  date: Date;
  activityTypeID: number;
};

/**
 * Model ActivityType
 *
 */
export type ActivityType = {
  activityTypeID: number;
  name: string;
};

/**
 * Model DailyPlanActivity
 *
 */
export type DailyPlanActivity = {
  dailyPlanActivityID: number;
  dailyPlanID: number;
  activityID: number;
};

/**
 * Model Activity
 *
 */
export type Activity = {
  activityID: number;
  name: string;
  description: string;
  duration: Date;
  activityTypeID: number;
};

/**
 * Model MacroCycle
 *
 */
export type MacroCycle = {
  macroCycleID: number;
  fencerID: number;
  trainerID: number;
  date: Date;
  results: string;
  feedback: string;
};

/**
 * Model PhysicalTest
 *
 */
export type PhysicalTest = {
  physicalTestID: number;
  fencerID: number;
  trainerID: number;
  results: string;
  feedback: string;
};

/**
 * Model TrainingCombat
 *
 */
export type TrainingCombat = {
  trainingCombatID: number;
  fencer1ID: number;
  fencer2ID: number;
  fencer1Score: number;
  fencer2Score: number;
  dateTime: Date;
  winnerFencerID: number;
};

/**
 * Model Attendance
 *
 */
export type Attendance = {
  attendanceID: number;
  fencerID: number;
  date: Date;
  status: string;
};

/**
 * Model AITraining
 *
 */
export type AITraining = {
  AITraining: number;
  fencerID: number;
  date: Date;
  duration: Date;
  feedback: string;
  trainerID: number;
};

/**
 * Model RegistrationLink
 *
 */
export type RegistrationLink = {
  registrationLinkID: number;
  expirationDate: Date;
  valid: boolean;
  email: string;
};

/**
 * Model TrainingError
 *
 */
export type TrainingError = {
  trainingErrorID: number;
  AITrainingID: number;
  errorID: number;
  poseData: string;
};

/**
 * Model Error
 *
 */
export type Error = {
  errorID: number;
  name: string;
  description: string;
};
