import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { CycleGoal } from "../../../types";
import AddGoalDialog from "./AddGoalDialog";
import dayjs from "dayjs";
import axios from "../../../services/axios";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";

const FencerGoals = () => {
  const { user } = useAuth();
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<CycleGoal | null>(null);
  const [goals, setGoals] = useState<CycleGoal[]>();
  const { id } = useParams();
  const { showError } = useAlert();

  const handleGoalDialogOpen = (goal: CycleGoal) => {
    setShowGoalDialog(true);
    setSelectedGoal(goal);
  };

  const handleAddGoalDialogOpen = () => {
    setShowAddGoalDialog(true);
  };

  const handleClose = () => {
    setShowAddGoalDialog(false);
    setShowGoalDialog(false);
  };

  const fetchGoals = useCallback(async () => {
    const fencerId = id ? id : user?.fencer?.fencerID;
    const url = `/dashboard/fencer/cyclegoal_routes/${fencerId}`;
    const { data } = await axios.get(url);
    setGoals(data.data);
  }, [id]);

  useEffect(() => {
    fetchGoals().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar los objetivos");
    });
  }, [fetchGoals]);

  //To save a goal we need a trainerID, so only trainers are able to create goals
  const isTrainer = user?.roles.includes("trainer");

  return (
    <Container component="main" maxWidth="sm">
      <Box my={{ xs: 3, sm: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ flexGrow: 1 }} variant="h1">
            Objetivos
          </Typography>
          {isTrainer && (
            <Button variant="contained" onClick={handleAddGoalDialogOpen}>
              Crear nuevo
            </Button>
          )}
        </Box>
        <List>
          {goals?.map((goal) => (
            <ListItem
              key={goal.cycleGoalID}
              alignItems="flex-start"
              divider
              disablePadding
            >
              <ListItemButton
                sx={{ px: 1 }}
                onClick={() => handleGoalDialogOpen(goal)}
              >
                <ListItemText
                  primary={
                    goal.mesoCycle.name +
                    " ( " +
                    dayjs(goal.mesoCycle.startDate).format("DD MMM YYYY") +
                    " - " +
                    dayjs(goal.mesoCycle.endDate).format("DD MMM YYYY") +
                    " )"
                  }
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {goal.content}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: add pagination */}
      </Box>
      {showAddGoalDialog && (
        <AddGoalDialog
          open={showAddGoalDialog}
          handleClose={handleClose}
          fetchGoals={fetchGoals}
        />
      )}
      {/* <GoalDialog
        open={showGoalDialog}
        handleClose={handleClose}
        goal={selectedGoal}
      /> */}
    </Container>
  );
};

export default FencerGoals;
