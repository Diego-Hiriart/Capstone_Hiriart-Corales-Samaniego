import { Router } from 'express';

import academyConfig_routes from "./academyConfig_routes";
import activityType_routes from "./activityType_routes";
import activity_routes from "./activity_routes";
import admin_routes from "./admin_routes";
import ai_analysis_routes from './ai_analysis_routes';
import aiTraining_routes from "./aiTraining_routes";
import attendance_routes from "./attendance_routes";
import cycleFeedback_routes from "./cycleFeedback_routes";
import cycleGoal_routes from "./cycleGoal_routes";
import dailyPlanActivity_routes from "./dailyPlanActivity_routes";
import dailyPlan_routes from "./dailyPlan_routes";
import error_routes from "./error_routes";
import fencer_routes from "./fencer_routes";
import machineCombatData_routes from "./machineCombatData_routes";
import macroCycle_routes from "./macroCycle_routes";
import mesoCycle_routes from "./mesoCycle_routes";
import microCycle_routes from "./microCycle_routes";
import physicalTest_routes from "./physicalTest_routes";
import registrationLink_routes from "./registrationLink_routes";
import singleFeedback_routes from "./singleFeedback_routes";
import trainer_routes from "./trainer_routes";
import trainingCombat_routes from "./trainingCombat_routes";
import trainingError_routes from "./trainingError_routes";
import trainingGroup_routes from "./trainingGroup_routes";
import user_routes from "./users_routes";
import weeklyReport_routes from "./weeklyReport_routes";
import trainingExercise_routes from "./trainingExercise_routes";

const router = Router();

// ACTIVITY
router.use('/', activity_routes);
// ACTIVITY TYPE
router.use('/', activityType_routes);
// ADMIN
router.use('/', admin_routes);
// AI ANALYSIS
router.use('/', ai_analysis_routes);
// AI TRAINING
router.use('/', aiTraining_routes);
// ATTENDANCE
router.use("/", attendance_routes);
// CONFIG
router.use("/", academyConfig_routes);
// CYCLE FEEDBACK
router.use('/', cycleFeedback_routes);
// CYCLE GOAL
router.use('/', cycleGoal_routes);
// DAILY PLAN
router.use('/', dailyPlan_routes);
// DAILY PLAN ACTIVITY
router.use('/', dailyPlanActivity_routes);
// ERROR
router.use('/', error_routes);
// FENCER
router.use('/', fencer_routes);
// MACRO CYCLE
router.use('/', macroCycle_routes);
// MACHINE COMBAT DATA
router.use('/', machineCombatData_routes);
// MESO CYCLE
router.use('/', mesoCycle_routes);
// MICRO CYCLE
router.use('/', microCycle_routes);
// PHYSICAL TEST
router.use('/', physicalTest_routes);
// REGISTRATION LINK
router.use('/', registrationLink_routes);
// SINGLE FEEDBACK
router.use('/', singleFeedback_routes);
// TRAINER
router.use('/', trainer_routes);
// TRAINING COMBAT
router.use('/', trainingCombat_routes);
// TRAINING ERROR
router.use('/', trainingError_routes);
// TRAINING GROUP
router.use('/', trainingGroup_routes);
// USERS
router.use('/', user_routes);
// WEEKLY REPORT
router.use("/", weeklyReport_routes);
// TRAINING EXERCISE
router.use("/", trainingExercise_routes);

export default router;
