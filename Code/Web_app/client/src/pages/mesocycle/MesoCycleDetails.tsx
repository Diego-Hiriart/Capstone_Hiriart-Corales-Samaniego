import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/axios";
import { DailyPlanFull, MesoCycleFull, MicroCycle } from "../../types";
import { formatDate } from "../../utils/formatDate";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MesoCycleAddPlan from "./MesoCycleAddPlan";

const MesoCycleDetails = () => {
  const { id } = useParams();
  const [microCycles, setMicroCycles] = useState<MicroCycle[]>(null!);
  const [mesoCycle, setMesoCycle] = useState<MesoCycleFull>(null!);
  const [currentCycle, setCurrentCycle] = useState<MicroCycle>(null!);
  const [cyclePlans, setCyclePlans] = useState<DailyPlanFull[]>(null!);
  const [currentPlan, setCurrentPlan] = useState<DailyPlanFull>(null!);
  const [openAddActivity, setOpenAddActivity] = useState(false);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data } = await axios.get("/dashboard/meso_cycle/" + id);

      setMesoCycle(data.data);
      setMicroCycles(data.data.microCycle);
      setCurrentCycle(data.data.microCycle[0]);
      setCyclePlans(data.data.microCycle[0].dailyPlan);
    };

    fetchGroup();
  }, []);

  const nextCycle = () => {
    const i = index + 1;
    const newI = Math.max(0, Math.min(i, mesoCycle.microCycle.length - 1));
    setCurrentCycle(mesoCycle.microCycle[newI]);
    setCyclePlans(mesoCycle.microCycle[newI].dailyPlan);
    setIndex(newI);
  };

  const previousCycle = () => {
    const i = index - 1;
    const newI = Math.max(0, Math.min(i, mesoCycle.microCycle.length - 1));
    setCurrentCycle(mesoCycle.microCycle[newI]);
    setCyclePlans(mesoCycle.microCycle[newI].dailyPlan);
    setIndex(newI);
  };

  const handleOpenAddActivity = (dailyPlan: DailyPlanFull) => {
    setCurrentPlan(dailyPlan);
    setOpenAddActivity(true);
  };

  const handleCloseAddActivity = () => {
    setOpenAddActivity(false);
  };

  const hasSunday = (startDate: Date, endDate: Date) => {
    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      if (currentDate.getDay() === 0) {
        return true; // Sunday found
      }
    }

    return false; // No Sunday found
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box py={{ xs: 2, lg: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {currentCycle ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h1" alignSelf="start" sx={{ mb: 4 }}>
                  {formatDate(currentCycle.startDate)} -{" "}
                  {formatDate(currentCycle.endDate)}
                </Typography>
                <Button sx={{ padding: 0 }} onClick={previousCycle}>
                  <ArrowBackIosIcon />
                </Button>
                <Button onClick={nextCycle}>
                  <ArrowForwardIosIcon />
                </Button>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  sx={{
                    marginTop: "1rem",
                    "--Grid-borderWidth": "1px",
                    borderTop: "var(--Grid-borderWidth) solid",
                    borderLeft: "var(--Grid-borderWidth) solid",
                    borderColor: "divider",
                    "& > div": {
                      borderRight: "var(--Grid-borderWidth) solid",
                      borderBottom: "var(--Grid-borderWidth) solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  {currentCycle.dailyPlan
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    .map((item) => {
                      return new Date(item.date).getDay() === 0 ? undefined : (
                        <Grid
                          item
                          sx={{
                            textAlign: "center",
                          }}
                          xs={
                            12 /
                            (hasSunday(
                              new Date(currentCycle.startDate),
                              new Date(currentCycle.endDate)
                            )
                              ? cyclePlans.length - 1
                              : cyclePlans.length)
                          }
                        >
                          <Box>
                            <Typography
                              sx={{ fontWeight: "bold" }}
                              variant="h5"
                            >
                              {new Date(item.date)
                                .toLocaleDateString("es-mx", {
                                  weekday: "long",
                                })
                                .toUpperCase()}{" "}
                              {new Date(item.date).getDate()}
                            </Typography>
                            <Divider></Divider>
                          </Box>

                          <Typography sx={{ fontWeight: "bold" }}>
                            {item.activityType?.name}
                          </Typography>

                          <Button
                            sx={{ marginTop: "2rem" }}
                            variant="contained"
                            onClick={() => handleOpenAddActivity(item)}
                          >
                            +
                          </Button>
                        </Grid>
                      );
                    })}
                </Grid>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <MesoCycleAddPlan
        cycle={currentCycle}
        handleClose={handleCloseAddActivity}
        open={openAddActivity}
        dailyPlan={currentPlan}
      />
    </Container>
  );
};

export default MesoCycleDetails;
