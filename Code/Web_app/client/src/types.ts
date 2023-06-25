export interface MachineCombatData {
  machineName: string;
  leftScore: number;
  rightScore: number;
  dateTime: Date;
  leftPriority: boolean;
  rightPriority: boolean;
}

import { Pose } from "@tensorflow-models/pose-detection";

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

export interface TrainingGroupFull extends TrainingGroup {
  fencer: Fencer[];
  mesoCycle: MesoCycle[];
}

export interface DailyPlanFull extends DailyPlan {
  activityType: ActivityType;
}

export interface TrainingCombatFull extends TrainingCombat {
  fencer1: Fencer & {
    user: User | null;
  };
  fencer2: Fencer & {
    user: User | null;
  };
  winnerFencer: Fencer & { user: User | null };
}

// export type DailyPlanFull = DailyPlan & {
//   activityType:
//     | (ActivityType & {
//         activity: Activity[];
//       })
//     | null;
// };

export type MesoCycleFull = MesoCycle & {
  microCycle: (MicroCycle & {
    dailyPlan: (DailyPlanFull & {
      activityType:
        | (ActivityType & {
            activity: Activity[];
          })
        | null;
    })[];
  })[];
};

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
  user: User;
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
  school: string;
  laterality: string;
  phone: string;
  insurance: string;
  inscriptionDate: Date;
  startDate: Date;
  occupation: string;
  schedule: string;
  legalGuardian: string;
  legalGuardianPhone: string;
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
  trainer: Trainer;
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
  endDate: Date;
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
  dailyPlan: DailyPlanFull[];
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
  AITrainingID: number;
  fencerID: number;
  date: Date;
  duration: Date;
  feedback: string;
  trainerID: number;
  exercise: string;
  trainingError: TrainingError[];
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
  error: Error;
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

export type DetectedPose = Pose[]

export type Move = DetectedPose[]

export type PoseAnalisisData = {
  incorrectMove: Move;
  correctMove: Move;
  title: string;
  description: string;
}